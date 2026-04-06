import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service.js'
import { OrderStatus } from '@prisma/client'

@Injectable()
export class OrderStatsService {
  constructor(private prisma: PrismaService) {}

  async getOrderStats(range: string = '7days', startDate?: string, endDate?: string) {
    const now = new Date()
    let fromDate = new Date()
    let toDate = new Date()

    // Helper function to parse date string safely in local timezone
    const parseDateString = (dateStr: string): Date => {
      const [year, month, day] = dateStr.split('-').map(Number)
      return new Date(year, month - 1, day, 0, 0, 0, 0)
    }

    if (startDate && endDate) {
      fromDate = parseDateString(startDate)
      toDate = parseDateString(endDate)
    } else {
      if (range === '7days') {
        fromDate.setDate(now.getDate() - 7)
      } else if (range === '30days') {
        fromDate.setDate(now.getDate() - 30)
      } else if (range === '90days') {
        fromDate.setDate(now.getDate() - 90)
      } else if (range === '1year') {
        fromDate.setFullYear(now.getFullYear() - 1)
      } else {
        fromDate.setDate(now.getDate() - 7)
      }
      toDate = new Date(now)
    }

    fromDate.setHours(0, 0, 0, 0)
    toDate.setHours(23, 59, 59, 999)

    // Get counts for each status
    const statuses: OrderStatus[] = ['PENDING', 'CONFIRMED', 'SHIPPING', 'COMPLETED', 'CANCELLED']
    const stats: Record<string, number> = {}

    for (const status of statuses) {
      const count = await this.prisma.order.count({
        where: {
          status,
          createdAt: {
            gte: fromDate,
            lte: toDate,
          },
        },
      })
      stats[status] = count
    }

    const total = Object.values(stats).reduce((a, b) => a + b, 0)

    // Calculate percentages
    const percentages: Record<string, number> = {}
    for (const status of statuses) {
      percentages[status] = total > 0 ? Math.round((stats[status] / total) * 100) : 0
    }

    return {
      stats,
      percentages,
      total,
      summary: {
        completed: stats['COMPLETED'],
        cancelled: stats['CANCELLED'],
        pending: stats['PENDING'] + stats['CONFIRMED'] + stats['SHIPPING'],
      },
    }
  }
}
