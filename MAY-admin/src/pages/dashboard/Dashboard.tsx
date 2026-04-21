'use client';

import {
  ShoppingCart,
  DollarSign,
  Users,
  Package,
  AlertCircle,
} from 'lucide-react';
import { StatCard, SimpleChart, DataTable } from './components';
import { useDashboard } from './hook';

export default function Dashboard() {
  // STT Fetch dashboard data
  const {
    stats,
    revenueData,
    ordersData,
    topProducts,
    topCustomers,
    recentOrders,
    recentUsers,
    loading,
    error,
  } = useDashboard();

  if (error) {
    return (
      <div className="p-6 bg-red-50 rounded-lg text-red-700 flex items-center gap-2">
        <AlertCircle size={20} />
        <span>{error}</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* STT Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Bảng Điều Khiển</h1>
        <p className="text-gray-500 mt-1">
          Chào mừng trở lại! Đây là tổng quan kinh doanh của bạn.
        </p>
      </div>

      {/* STT SECTION 1: QUICK STATS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Tổng Đơn Hàng"
          value={stats?.totalOrders ?? '-'}
          icon={<ShoppingCart size={24} />}
          color="blue"
          loading={loading}
        />
        <StatCard
          title="Tổng Doanh Thu"
          value={
            stats
              ? `${(stats.totalRevenue).toLocaleString('vi-VN')} ₫`
              : '-'
          }
          icon={<DollarSign size={24} />}
          color="green"
          loading={loading}
        />
        <StatCard
          title="Tổng Khách Hàng"
          value={stats?.totalUsers ?? '-'}
          icon={<Users size={24} />}
          color="purple"
          loading={loading}
        />
        <StatCard
          title="Tổng Sản Phẩm"
          value={stats?.totalProducts ?? '-'}
          icon={<Package size={24} />}
          color="orange"
          loading={loading}
        />
      </div>

      {/* STT SECTION 2: CHARTS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SimpleChart
          title="Doanh Thu - 30 Ngày Gần Đây"
          data={revenueData.map((item) => ({
            label: new Date(item.date).toLocaleDateString('vi-VN', {
              month: 'short',
              day: 'numeric',
            }),
            value: item.revenue,
          }))}
          height={300}
        />
        <SimpleChart
          title="Đơn Hàng - 30 Ngày Gần Đây"
          data={ordersData.map((item) => ({
            label: new Date(item.date).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
            }),
            value: item.count,
          }))}
          height={300}
        />
      </div>

      {/* STT SECTION 3: TOP DATA */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <DataTable
          title="Top 10 Sản Phẩm Bán Chạy Nhất"
          columns={[
            { key: 'name', label: 'Sản Phẩm' },
            { key: 'quantity', label: 'Số Lượng' },
            { key: 'revenue', label: 'Doanh Thu' },
          ]}
          data={topProducts.map((p) => ({
            name: p.name,
            quantity: p.quantity,
            revenue: `${(p.revenue).toLocaleString('vi-VN')} ₫`,
          }))}
          loading={loading}
        />
        <DataTable
          title="Top 10 Khách Hàng"
          columns={[
            { key: 'name', label: 'Tên' },
            { key: 'email', label: 'Email' },
            { key: 'totalSpent', label: 'Tổng Chi Tiêu' },
          ]}
          data={topCustomers.map((c) => ({
            name: c.name,
            email: c.email,
            totalSpent: `${(c.totalSpent).toLocaleString('vi-VN')} ₫`,
          }))}
          loading={loading}
        />
      </div>

      {/* STT SECTION 4: RECENT DATA */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <DataTable
          title="Đơn Hàng Gần Đây"
          columns={[
            { key: 'id', label: 'ID' },
            { key: 'user.name', label: 'Khách Hàng' },
            { key: 'total', label: 'Tổng Cộng' },
            { key: 'status', label: 'Trạng Thái' },
          ]}
          data={recentOrders.map((o) => ({
            id: o.id,
            'user.name': o.user.name,
            total: `${(o.total).toLocaleString('vi-VN')} ₫`,
            status: o.status,
            createdAt: o.createdAt,
          }))}
          loading={loading}
        />
        <DataTable
          title="Người Dùng Mới"
          columns={[
            { key: 'name', label: 'Tên' },
            { key: 'email', label: 'Email' },
            { key: 'phone', label: 'Số Điện Thoại' },
            { key: 'createdAt', label: 'Ngày Đăng Ký' },
          ]}
          data={recentUsers.map((u) => ({
            name: u.name,
            email: u.email,
            phone: u.phone,
            createdAt: u.createdAt,
          }))}
          loading={loading}
        />
      </div>
    </div>
  );
}