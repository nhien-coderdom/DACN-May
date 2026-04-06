import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';

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
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const revenues = await this.prisma.order.groupBy({
      by: ['createdAt'],
      where: {
        isDeleted: false,
        status: 'COMPLETED',
        createdAt: {
          gte: startDate,
        },
      },
      _sum: {
        total: true,
      },
      orderBy: {
        createdAt: 'asc',
      },
    });

    // Helper function to get local date in YYYY-MM-DD format
    const getLocalDateString = (date: Date): string => {
      const year = date.getFullYear()
      const month = String(date.getMonth() + 1).padStart(2, '0')
      const day = String(date.getDate()).padStart(2, '0')
      return `${year}-${month}-${day}`
    }

    // Nhóm theo ngày
    const revenueByDay: { [key: string]: number } = {};
    revenues.forEach((item) => {
      const date = getLocalDateString(item.createdAt);
      revenueByDay[date] = (revenueByDay[date] || 0) + (item._sum.total || 0);
    });

    return Object.entries(revenueByDay).map(([date, revenue]) => ({
      date,
      revenue,
    }));
  }

  // STT ORDERS CHART - Đơn hàng theo ngày
  async getOrdersByDate(days: number = 30) {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const orders = await this.prisma.order.groupBy({
      by: ['createdAt'],
      where: {
        isDeleted: false,
        createdAt: {
          gte: startDate,
        },
      },
      _count: true,
      orderBy: {
        createdAt: 'asc',
      },
    });

    // Helper function to get local date in YYYY-MM-DD format
    const getLocalDateString = (date: Date): string => {
      const year = date.getFullYear()
      const month = String(date.getMonth() + 1).padStart(2, '0')
      const day = String(date.getDate()).padStart(2, '0')
      return `${year}-${month}-${day}`
    }

    // Nhóm theo ngày
    const ordersByDay: { [key: string]: number } = {};
    orders.forEach((item) => {
      const date = getLocalDateString(item.createdAt);
      ordersByDay[date] = (ordersByDay[date] || 0) + item._count;
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
        basePrice: true,
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
        return {
          productId: item.productId,
          name: product?.name,
          quantity: item._sum.quantity || 0,
          revenue: (item._sum.basePrice || 0) * (item._sum.quantity || 0),
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
