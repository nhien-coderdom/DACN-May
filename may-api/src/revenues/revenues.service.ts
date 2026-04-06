import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service.js'

@Injectable()
export class RevenuesService {
  constructor(private prisma: PrismaService) {}

  async getRevenue(range: string = '7days', startDate?: string, endDate?: string) {
    const now = new Date()
    let fromDate = new Date()
    let toDate = new Date()

    // Helper function to parse date string safely in local timezone
    const parseDateString = (dateStr: string): Date => {
      const [year, month, day] = dateStr.split('-').map(Number)
      return new Date(year, month - 1, day, 0, 0, 0, 0)
    }

    // Calculate date range based on custom dates or preset range
    if (startDate && endDate) {
      // Custom date range
      fromDate = parseDateString(startDate)
      toDate = parseDateString(endDate)
    } else {
      // Preset range
      if (range === '7days') {
        fromDate.setDate(now.getDate() - 7)
      } else if (range === '30days') {
        fromDate.setDate(now.getDate() - 30)
      } else if (range === '90days') {
        fromDate.setDate(now.getDate() - 90)
      } else if (range === '1year') {
        fromDate.setFullYear(now.getFullYear() - 1)
      } else {
        // Default: 7 days
        fromDate.setDate(now.getDate() - 7)
      }
      toDate = new Date(now)
    }

    // Ensure fromDate is at start of day
    fromDate.setHours(0, 0, 0, 0)
    // Ensure toDate is at end of day
    toDate.setHours(23, 59, 59, 999)

    //  1. Total revenue from completed orders
    const totalRevenueResult = await this.prisma.order.aggregate({
      _sum: { total: true },
      where: {
        status: 'COMPLETED',
        isDeleted: false,
        createdAt: {
          gte: fromDate,
          lte: toDate,
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
          gte: fromDate,
          lte: toDate,
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

    //  3. Helper function to get local date in YYYY-MM-DD format
    const getLocalDateString = (date: Date): string => {
      const year = date.getFullYear()
      const month = String(date.getMonth() + 1).padStart(2, '0')
      const day = String(date.getDate()).padStart(2, '0')
      return `${year}-${month}-${day}`
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

    // Generate all dates in range (fill gaps)
    const allDates: Record<string, number> = {}
    const currentDate = new Date(fromDate)

    while (currentDate <= now) {
      const dateStr = getLocalDateString(currentDate)
      allDates[dateStr] = map[dateStr] || 0
      currentDate.setDate(currentDate.getDate() + 1)
    }

    const chart = Object.entries(allDates).map(([date, total]) => ({
      date,
      total,
    }))

    return {
      totalRevenue,
      chart,
    }
  }
}
