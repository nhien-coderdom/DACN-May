import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc.js';
import tz from 'dayjs/plugin/timezone.js';

dayjs.extend(utc);
dayjs.extend(tz);

@Injectable()
export class DashboardService {
  constructor(private readonly prisma: PrismaService) {}

  // STT STATS - Thống kê nhanh
  async getQuickStats() {
    const [totalOrders, totalRevenue, totalUsers, totalProducts] =
      await Promise.all([
        this.prisma.order.count({
          where: { isDeleted: false },
        }),
        this.prisma.order.aggregate({
          where: {
            isDeleted: false,
            status: 'COMPLETED',
          },
          _sum: {
            total: true,
          },
        }),
        this.prisma.user.count({
          where: {
            isDeleted: false,
            role: 'CUSTOMER',
          },
        }),
        this.prisma.product.count({
          where: { isDeleted: false },
        }),
      ]);

    return {
      totalOrders,
      totalRevenue: totalRevenue._sum?.total || 0,
      totalUsers,
      totalProducts,
    };
  }

  // STT REVENUE CHART - Doanh thu theo ngày
  async getRevenueByDate(days: number = 30) {
    const nowVN = dayjs().tz('Asia/Ho_Chi_Minh');
    const startDate = nowVN.subtract(days - 1, 'day').startOf('day').utc().toDate();
    const endDate = nowVN.endOf('day').utc().toDate();

    const orders = await this.prisma.order.findMany({
      where: {
        isDeleted: false,
        status: 'COMPLETED',
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
      },
      select: {
        createdAt: true,
        total: true,
      },
    });

    const revenueByDay: Record<string, number> = {};

    orders.forEach((order) => {
      const date = dayjs(order.createdAt)
        .tz('Asia/Ho_Chi_Minh')
        .format('YYYY-MM-DD');

      revenueByDay[date] = (revenueByDay[date] || 0) + order.total;
    });

    return Object.entries(revenueByDay).map(([date, revenue]) => ({
      date,
      revenue,
    }));
  }

  // STT ORDERS CHART - Đơn hàng theo ngày
  async getOrdersByDate(days: number = 30) {
    const nowVN = dayjs().tz('Asia/Ho_Chi_Minh');
    const startDate = nowVN.subtract(days - 1, 'day').startOf('day').utc().toDate();
    const endDate = nowVN.endOf('day').utc().toDate();

    const orders = await this.prisma.order.findMany({
      where: {
        isDeleted: false,
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
      },
      select: {
        createdAt: true,
      },
    });

    const ordersByDay: Record<string, number> = {};

    orders.forEach((order) => {
      const date = dayjs(order.createdAt)
        .tz('Asia/Ho_Chi_Minh')
        .format('YYYY-MM-DD');

      ordersByDay[date] = (ordersByDay[date] || 0) + 1;
    });

    return Object.entries(ordersByDay).map(([date, count]) => ({
      date,
      count,
    }));
  }

  // STT TOP PRODUCTS - Sản phẩm bán chạy nhất
  async getTopProducts(limit: number = 10) {
    const topProducts = await this.prisma.orderItem.groupBy({
      by: ['productId'],
      where: {
        order: {
          isDeleted: false,
          status: 'COMPLETED',
        },
      },
      _sum: {
        quantity: true,
      },
      orderBy: {
        _sum: {
          quantity: 'desc',
        },
      },
      take: limit,
    });

    const results = await Promise.all(
      topProducts.map(async (item) => {
        const product = await this.prisma.product.findUnique({
          where: { id: item.productId },
        });

        // Tính revenue đúng: SUM(basePrice * quantity)
        const revenueData = await this.prisma.orderItem.aggregate({
          where: {
            productId: item.productId,
            order: {
              isDeleted: false,
              status: 'COMPLETED',
            },
          },
          _sum: {
            basePrice: true,
          },
        });

        // Lấy tất cả orderItems để tính tổng basePrice * quantity
        const orderItems = await this.prisma.orderItem.findMany({
          where: {
            productId: item.productId,
            order: {
              isDeleted: false,
              status: 'COMPLETED',
            },
          },
          select: {
            basePrice: true,
            quantity: true,
          },
        });

        const revenue = orderItems.reduce(
          (sum, oi) => sum + oi.basePrice * oi.quantity,
          0,
        );

        return {
          productId: item.productId,
          name: product?.name,
          quantity: item._sum.quantity || 0,
          revenue,
        };
      }),
    );

    return results;
  }

  // STT TOP CUSTOMERS - Khách hàng chi tiêu nhiều nhất
  async getTopCustomers(limit: number = 10) {
    const topCustomers = await this.prisma.order.groupBy({
      by: ['userId'],
      where: {
        isDeleted: false,
        status: 'COMPLETED',
      },
      _sum: {
        total: true,
      },
      _count: true,
      orderBy: {
        _sum: {
          total: 'desc',
        },
      },
      take: limit,
    });

    const results = await Promise.all(
      topCustomers.map(async (item) => {
        const user = await this.prisma.user.findUnique({
          where: { id: item.userId },
        });
        return {
          userId: item.userId,
          name: user?.name,
          email: user?.email,
          totalSpent: item._sum.total || 0,
          orderCount: item._count,
        };
      }),
    );

    return results;
  }

  //  RECENT ORDERS - Đơn hàng mới nhất
  async getRecentOrders(limit: number = 10) {
    return this.prisma.order.findMany({
      where: { isDeleted: false },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: limit,
    });
  }

  //  RECENT USERS - Người dùng mới đăng ký
  async getRecentUsers(limit: number = 10) {
    return this.prisma.user.findMany({
      where: {
        isDeleted: false,
        role: 'CUSTOMER',
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: limit,
    });
  }
}
