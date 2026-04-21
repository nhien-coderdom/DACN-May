import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { OrderStatus } from '@prisma/client';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc.js';
import tz from 'dayjs/plugin/timezone.js';

dayjs.extend(utc);
dayjs.extend(tz);

@Injectable()
export class OrderStatsService {
  constructor(private prisma: PrismaService) {}

  async getOrderStats(
    range: string = '7days',
    startDate?: string,
    endDate?: string,
  ) {
    let fromDateUTC: Date;
    let toDateUTC: Date;

    if (startDate && endDate) {
      // Custom date range - parse as VN dates and convert to UTC
      const startDayjs = dayjs.tz(startDate, 'YYYY-MM-DD', 'Asia/Ho_Chi_Minh');
      const endDayjs = dayjs.tz(endDate, 'YYYY-MM-DD', 'Asia/Ho_Chi_Minh');
      
      fromDateUTC = startDayjs.startOf('day').utc().toDate();
      toDateUTC = endDayjs.endOf('day').utc().toDate();
    } else {
      // Preset range - calculate based on VN timezone
      const nowVN = dayjs().tz('Asia/Ho_Chi_Minh');

      let daysAgo = 6; // Default 7 days
      if (range === '7days') daysAgo = 6;
      else if (range === '30days') daysAgo = 29;
      else if (range === '90days') daysAgo = 89;
      else if (range === '1year') daysAgo = 364;

      // Calculate from date in VN timezone, convert to UTC
      fromDateUTC = nowVN.subtract(daysAgo, 'day').startOf('day').utc().toDate();
      toDateUTC = nowVN.endOf('day').utc().toDate();
    }

    // Get counts for each status
    const statuses: OrderStatus[] = [
      'PENDING',
      'CONFIRMED',
      'SHIPPING',
      'COMPLETED',
      'CANCELLED',
    ];
    const stats: Record<string, number> = {};

    for (const status of statuses) {
      const count = await this.prisma.order.count({
        where: {
          status,
          createdAt: {
            gte: fromDateUTC,
            lte: toDateUTC,
          },
        },
      });
      stats[status] = count;
    }

    const total = Object.values(stats).reduce((a, b) => a + b, 0);

    // Calculate percentages
    const percentages: Record<string, number> = {};
    for (const status of statuses) {
      percentages[status] =
        total > 0 ? Math.round((stats[status] / total) * 100) : 0;
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
    };
  }
}
