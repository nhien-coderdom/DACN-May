import axiosClient from '../../../utils/axios';
import type {
  DashboardStats,
  RevenueChartData,
  OrderChartData,
  TopProduct,
  TopCustomer,
  RecentOrder,
  RecentUser,
} from '../types';

const dashboardService = {
  // Thống kê nhanh
  getStats: async (): Promise<DashboardStats> => {
    const response = await axiosClient.get('/dashboard/stats');
    return response.data;
  },

  // Doanh thu theo ngày
  getRevenue: async (days: number = 30): Promise<RevenueChartData[]> => {
    const response = await axiosClient.get('/dashboard/revenue', {
      params: { days },
    });
    return response.data;
  },

  // Đơn hàng theo ngày
  getOrdersChart: async (days: number = 30): Promise<OrderChartData[]> => {
    const response = await axiosClient.get('/dashboard/orders-chart', {
      params: { days },
    });
    return response.data;
  },

  // Top sản phẩm
  getTopProducts: async (limit: number = 10): Promise<TopProduct[]> => {
    const response = await axiosClient.get('/dashboard/top-products', {
      params: { limit },
    });
    return response.data;
  },

  // Top khách hàng
  getTopCustomers: async (limit: number = 10): Promise<TopCustomer[]> => {
    const response = await axiosClient.get('/dashboard/top-customers', {
      params: { limit },
    });
    return response.data;
  },

  // Đơn hàng mới
  getRecentOrders: async (limit: number = 10): Promise<RecentOrder[]> => {
    const response = await axiosClient.get('/dashboard/recent-orders', {
      params: { limit },
    });
    return response.data;
  },

  // Người dùng mới
  getRecentUsers: async (limit: number = 10): Promise<RecentUser[]> => {
    const response = await axiosClient.get('/dashboard/recent-users', {
      params: { limit },
    });
    return response.data;
  },
};

export default dashboardService;
