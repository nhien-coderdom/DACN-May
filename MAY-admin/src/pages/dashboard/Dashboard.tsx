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
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 mt-1">
          Welcome back! Here's your business overview.
        </p>
      </div>

      {/* STT SECTION 1: QUICK STATS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Orders"
          value={stats?.totalOrders ?? '-'}
          icon={<ShoppingCart size={24} />}
          color="blue"
          loading={loading}
        />
        <StatCard
          title="Total Revenue"
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
          title="Total Customers"
          value={stats?.totalUsers ?? '-'}
          icon={<Users size={24} />}
          color="purple"
          loading={loading}
        />
        <StatCard
          title="Total Products"
          value={stats?.totalProducts ?? '-'}
          icon={<Package size={24} />}
          color="orange"
          loading={loading}
        />
      </div>

      {/* STT SECTION 2: CHARTS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SimpleChart
          title="STT Revenue - Last 30 Days"
          data={revenueData.map((item) => ({
            label: new Date(item.date).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
            }),
            value: item.revenue,
          }))}
          height={300}
        />
        <SimpleChart
          title="STT Orders - Last 30 Days"
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
          title="STT Top 10 Best-Selling Products"
          columns={[
            { key: 'name', label: 'Product' },
            { key: 'quantity', label: 'Quantity' },
            { key: 'revenue', label: 'Revenue' },
          ]}
          data={topProducts.map((p) => ({
            name: p.name,
            quantity: p.quantity,
            revenue: `${(p.revenue).toLocaleString('vi-VN')} ₫`,
          }))}
          loading={loading}
        />
        <DataTable
          title="STT Top 10 Customers"
          columns={[
            { key: 'name', label: 'Name' },
            { key: 'email', label: 'Email' },
            { key: 'totalSpent', label: 'Total Spent' },
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
          title="STT Recent Orders"
          columns={[
            { key: 'id', label: 'ID' },
            { key: 'user.name', label: 'Customer' },
            { key: 'total', label: 'Total' },
            { key: 'status', label: 'Status' },
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
          title="STT New Users"
          columns={[
            { key: 'name', label: 'Name' },
            { key: 'email', label: 'Email' },
            { key: 'phone', label: 'Phone' },
            { key: 'createdAt', label: 'Registration Date' },
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