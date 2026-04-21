import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service.js'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc.js'
import tz from 'dayjs/plugin/timezone.js'

dayjs.extend(utc)
dayjs.extend(tz)

@Injectable()
export class RevenuesService {
  constructor(private prisma: PrismaService) {}

  async getRevenue(range: string = '7days', startDate?: string, endDate?: string) {
    let fromDateUTC: Date
    let toDateUTC: Date
    let startDateStr: string
    let endDateStr: string

    if (startDate && endDate) {
      // Custom date range - parse as VN dates and convert to UTC
      startDateStr = startDate // Already in YYYY-MM-DD format
      endDateStr = endDate
      
      const startDayjs = dayjs.tz(startDate, 'YYYY-MM-DD', 'Asia/Ho_Chi_Minh')
      const endDayjs = dayjs.tz(endDate, 'YYYY-MM-DD', 'Asia/Ho_Chi_Minh')
      
      fromDateUTC = startDayjs.startOf('day').utc().toDate()
      toDateUTC = endDayjs.endOf('day').utc().toDate()
    } else {
      // Preset range - calculate based on VN timezone
      const nowVN = dayjs().tz('Asia/Ho_Chi_Minh')
      
      let daysAgo = 6 // Default 7 days
      if (range === '7days') daysAgo = 6
      else if (range === '30days') daysAgo = 29
      else if (range === '90days') daysAgo = 89
      else if (range === '1year') daysAgo = 364
      
      // Calculate date range strings in VN timezone
      const fromDateVN = nowVN.subtract(daysAgo, 'day').startOf('day')
      startDateStr = fromDateVN.format('YYYY-MM-DD')
      endDateStr = nowVN.format('YYYY-MM-DD')
      
      // Calculate from date in VN timezone, convert to UTC
      fromDateUTC = fromDateVN.utc().toDate()
      toDateUTC = nowVN.endOf('day').utc().toDate()
    }

    //  1. Total revenue from completed orders
    const totalRevenueResult = await this.prisma.order.aggregate({
      _sum: { total: true },
      where: {
        status: 'COMPLETED',
        isDeleted: false,
        createdAt: {
          gte: fromDateUTC,
          lte: toDateUTC,
        },
      },
    })

    const totalRevenue = totalRevenueResult._sum.total || 0

    //  2. Get orders to group by date
    const orders = await this.prisma.order.findMany({
      where: {
        status: 'COMPLETED',
        isDeleted: false,
        createdAt: {
          gte: fromDateUTC,
          lte: toDateUTC,
        },
      },
      select: {
        total: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: 'asc',
      },
    })

    //  3. Helper function to get VN date in YYYY-MM-DD format
    const getLocalDateString = (utcDate: Date): string => {
      const vnDate = dayjs.utc(utcDate).tz('Asia/Ho_Chi_Minh').format('YYYY-MM-DD')
      console.log('  UTC→VN:', {
        utcDate: utcDate.toISOString(),
        vnDateTime: dayjs.utc(utcDate).tz('Asia/Ho_Chi_Minh').format('YYYY-MM-DD HH:mm:ss'),
        vnDate,
      })
      return vnDate
    }

    //  3. Group by date
    const map: Record<string, number> = {}

    orders.forEach((order) => {
      const date = getLocalDateString(order.createdAt)

      if (!map[date]) {
        map[date] = 0
      }
      map[date] += order.total
    })

    console.log('  DEBUG:', {
      startDateStr,
      endDateStr,
      ordersCount: orders.length,
      map,
    })

    // Generate all dates in range (fill gaps)
    //   FIX 1: Loop using date strings to avoid timezone conversion issues
    const allDates: Record<string, number> = {}
    let currentDateStr = startDateStr
    const endDateOnly = endDateStr

    while (currentDateStr <= endDateOnly) {
      allDates[currentDateStr] = map[currentDateStr] || 0
      
      // Increment date by 1 day using dayjs
      const currentDay = dayjs(currentDateStr, 'YYYY-MM-DD')
      const nextDay = currentDay.add(1, 'day')
      currentDateStr = nextDay.format('YYYY-MM-DD')
    }

    //   FIX 2: Sort dates to ensure correct order (Object.entries doesn't guarantee order)
    const chart = Object.entries(allDates)
      .sort(([dateA], [dateB]) => dateA.localeCompare(dateB))
      .map(([date, total]) => ({
        date,
        total,
      }))

    return {
      totalRevenue,
      chart,
    }
  }
}
