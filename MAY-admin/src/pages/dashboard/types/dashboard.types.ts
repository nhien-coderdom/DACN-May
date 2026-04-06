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
  total: number;
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
