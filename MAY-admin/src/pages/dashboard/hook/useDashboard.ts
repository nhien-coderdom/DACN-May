import { useEffect, useState } from 'react';
import dashboardService from '../services';
import type {
  DashboardStats,
  RevenueChartData,
  OrderChartData,
  TopProduct,
  TopCustomer,
  RecentOrder,
  RecentUser,
} from '../types';

export interface DashboardData {
  stats: DashboardStats | null;
  revenueData: RevenueChartData[];
  ordersData: OrderChartData[];
  topProducts: TopProduct[];
  topCustomers: TopCustomer[];
  recentOrders: RecentOrder[];
  recentUsers: RecentUser[];
  loading: boolean;
  error: string | null;
}

export function useDashboard(): DashboardData {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [revenueData, setRevenueData] = useState<RevenueChartData[]>([]);
  const [ordersData, setOrdersData] = useState<OrderChartData[]>([]);
  const [topProducts, setTopProducts] = useState<TopProduct[]>([]);
  const [topCustomers, setTopCustomers] = useState<TopCustomer[]>([]);
  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([]);
  const [recentUsers, setRecentUsers] = useState<RecentUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Lấy tất cả data song song
        const [
          statsData,
          revData,
          ordersChartData,
          topProdsData,
          topCustData,
          recOrdersData,
          recUsersData,
        ] = await Promise.all([
          dashboardService.getStats(),
          dashboardService.getRevenue(30),
          dashboardService.getOrdersChart(30),
          dashboardService.getTopProducts(10),
          dashboardService.getTopCustomers(10),
          dashboardService.getRecentOrders(10),
          dashboardService.getRecentUsers(10),
        ]);

        setStats(statsData);
        setRevenueData(revData);
        setOrdersData(ordersChartData);
        setTopProducts(topProdsData);
        setTopCustomers(topCustData);
        setRecentOrders(recOrdersData);
        setRecentUsers(recUsersData);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError(
          err instanceof Error
            ? err.message
            : 'Lỗi khi tải dữ liệu dashboard'
        );
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  return {
    stats,
    revenueData,
    ordersData,
    topProducts,
    topCustomers,
    recentOrders,
    recentUsers,
    loading,
    error,
  };
}
