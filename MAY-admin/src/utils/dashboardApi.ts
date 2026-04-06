// API endpoints cho dashboard
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export interface DashboardStats {
  totalOrders: number;
  totalRevenue: number;
  totalUsers: number;
  totalProducts: number;
}

export interface RevenueChartData {
  date: string;
  revenue: number;
}

export interface OrderChartData {
  date: string;
  count: number;
}

export interface TopProduct {
  productId: number;
  name: string;
  quantity: number;
  revenue: number;
}

export interface TopCustomer {
  userId: number;
  name: string;
  email: string;
  totalSpent: number;
  orderCount: number;
}

export interface RecentOrder {
  id: number;
  totalPrice: number;
  status: string;
  createdAt: string;
  user: {
    id: number;
    name: string;
    email: string;
  };
}

export interface RecentUser {
  id: number;
  name: string;
  email: string;
  phone: string;
  createdAt: string;
}

const dashboardApi = {
  // Thống kê nhanh
  getStats: async (): Promise<DashboardStats> => {
    const response = await axios.get(`${API_URL}/dashboard/stats`);
    return response.data;
  },

  // Doanh thu theo ngày
  getRevenue: async (days: number = 30): Promise<RevenueChartData[]> => {
    const response = await axios.get(`${API_URL}/dashboard/revenue`, {
      params: { days },
    });
    return response.data;
  },

  // Đơn hàng theo ngày
  getOrdersChart: async (days: number = 30): Promise<OrderChartData[]> => {
    const response = await axios.get(`${API_URL}/dashboard/orders-chart`, {
      params: { days },
    });
    return response.data;
  },

  // Top sản phẩm
  getTopProducts: async (limit: number = 10): Promise<TopProduct[]> => {
    const response = await axios.get(`${API_URL}/dashboard/top-products`, {
      params: { limit },
    });
    return response.data;
  },

  // Top khách hàng
  getTopCustomers: async (limit: number = 10): Promise<TopCustomer[]> => {
    const response = await axios.get(`${API_URL}/dashboard/top-customers`, {
      params: { limit },
    });
    return response.data;
  },

  // Đơn hàng mới
  getRecentOrders: async (limit: number = 10): Promise<RecentOrder[]> => {
    const response = await axios.get(`${API_URL}/dashboard/recent-orders`, {
      params: { limit },
    });
    return response.data;
  },

  // Người dùng mới
  getRecentUsers: async (limit: number = 10): Promise<RecentUser[]> => {
    const response = await axios.get(`${API_URL}/dashboard/recent-users`, {
      params: { limit },
    });
    return response.data;
  },
};

export default dashboardApi;
