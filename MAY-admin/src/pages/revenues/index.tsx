import React, { useState } from 'react'
import { useRevenue, useOrderStats } from './hooks'
import { RevenueStats, RevenueChart, RevenueFilter, OrderStatsPie, OrderStatsCards } from './components'
import { Card } from '@/components/ui/card'
import { exportRevenueToExcel, exportOrdersToExcel } from './utils/excel-export'
type DateRange = '7days' | '30days' | '90days' | '1year' | 'custom'
type TabType = 'revenue' | 'orders'

const RevenuesPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('revenue')
  
  // Revenue state
  const [revenueRange, setRevenueRange] = useState<DateRange>('7days')
  const [revenueStartDate, setRevenueStartDate] = useState<string>('')
  const [revenueEndDate, setRevenueEndDate] = useState<string>('')

  // Orders state
  const [ordersRange, setOrdersRange] = useState<DateRange>('7days')
  const [ordersStartDate, setOrdersStartDate] = useState<string>('')
  const [ordersEndDate, setOrdersEndDate] = useState<string>('')

  const { data, isLoading, error } = useRevenue(
    revenueRange, 
    revenueRange === 'custom' ? revenueStartDate : undefined,
    revenueRange === 'custom' ? revenueEndDate : undefined
  )

  const { data: orderStatsData, isLoading: orderStatsLoading, error: orderStatsError } = useOrderStats(
    ordersRange,
    ordersRange === 'custom' ? ordersStartDate : undefined,
    ordersRange === 'custom' ? ordersEndDate : undefined
  )

  const handleRevenueCustomDateChange = (startDate: string, endDate: string) => {
    setRevenueStartDate(startDate)
    setRevenueEndDate(endDate)
  }

  const handleOrdersCustomDateChange = (startDate: string, endDate: string) => {
    setOrdersStartDate(startDate)
    setOrdersEndDate(endDate)
  }

  const getRevenueDisplayRange = () => {
    if (revenueRange === 'custom' && revenueStartDate && revenueEndDate) {
      return `${revenueStartDate} to ${revenueEndDate}`
    }
    return revenueRange
  }

  const getPieChartData = () => {
    if (!orderStatsData) return []
    
    const total = orderStatsData.total
    const colors = [
      '#10b981', // green - completed
      '#ef4444', // red - cancelled  
      '#f59e0b', // amber - pending
    ]

    // Calculate percentages based on summary values instead of adding status percentages
    const completedPercentage = total > 0 ? Math.round((orderStatsData.summary.completed / total) * 100) : 0
    const cancelledPercentage = total > 0 ? Math.round((orderStatsData.summary.cancelled / total) * 100) : 0
    const pendingPercentage = total > 0 ? Math.round((orderStatsData.summary.pending / total) * 100) : 0

    return [
      {
        label: 'Hoàn thành',
        value: orderStatsData.summary.completed,
        percentage: completedPercentage,
        color: colors[0],
      },
      {
        label: 'Đã hủy',
        value: orderStatsData.summary.cancelled,
        percentage: cancelledPercentage,
        color: colors[1],
      },
      {
        label: 'Chờ xử lý',
        value: orderStatsData.summary.pending,
        percentage: pendingPercentage,
        color: colors[2],
      },
    ]
  }

  const tabClasses = (tab: TabType) => `
    px-4 py-2 font-medium rounded-t-lg transition-all
    ${activeTab === tab
      ? 'bg-blue-600 text-white'
      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
    }
  `

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Thống kê doanh thu</h1>
          <p className="text-gray-600 mt-2">Theo dõi doanh số bán hàng và hiệu suất đơn hàng</p>
        </div>
        {/* Tạo nút export Excel  */}
        {/* Sẽ call function exportRevenueToExcel hoặc exportOrderStatsToExcel */}
        <button
          onClick={() => {
            if (activeTab === 'revenue') {
              // Lấy dateRange (7days, 30days, 90days, 1year, custom)
              exportRevenueToExcel(data?.chart || [], revenueRange)
            } else {
              exportOrdersToExcel(orderStatsData)
            }
          }}
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
        >
           Xuất Excel
        </button>
      </div>

      {/* Tabs Navigation */}
      <div className="mb-6 flex gap-2">
        <button
          onClick={() => setActiveTab('revenue')}
          className={tabClasses('revenue')}
        >
          Doanh Thu
        </button>
        <button
          onClick={() => setActiveTab('orders')}
          className={tabClasses('orders')}
        >
          Tỷ Lệ Đơn Hàng
        </button>
      </div>

      {/* Revenue Tab */}
      {activeTab === 'revenue' && (
        <div id="revenue-report" className="space-y-6">
          {/* Filter Section */}
          <div className="mb-6">
            <RevenueFilter 
              selectedRange={revenueRange} 
              onRangeChange={setRevenueRange}
              onCustomDateChange={handleRevenueCustomDateChange}
              disabled={isLoading}
            />
          </div>

          {/* Loading State */}
          {isLoading && (
            <Card className="p-12">
              <div className="text-center">
                <div className="inline-block">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                </div>
                <p className="text-gray-600 mt-4">Loading revenue data...</p>
              </div>
            </Card>
          )}

          {/* Content */}
          {!isLoading && data && (
            <>
              {/* Revenue Stats */}
              <RevenueStats 
                totalRevenue={data.totalRevenue}
                range={getRevenueDisplayRange()}
              />

              {/* Revenue Chart */}
              <div className="mt-8">
                <RevenueChart 
                  data={data.chart}
                  range={getRevenueDisplayRange()}
                />
              </div>
            </>
          )}

          {/* Error State */}
          {!isLoading && error && (
            <Card className="p-12">
              <div className="text-center text-red-600">
                <p className="text-lg font-semibold">Failed to load revenue data</p>
                <p className="text-sm mt-2">{error}</p>
                <p className="text-xs mt-4 text-gray-500">Please check if the API server is running</p>
              </div>
            </Card>
          )}

          {/* No Data State */}
          {!isLoading && !error && !data && (
            <Card className="p-12">
              <div className="text-center text-gray-500">
                <p className="text-lg font-semibold">No data available</p>
                <p className="text-sm mt-2">No revenue data found for this period</p>
              </div>
            </Card>
          )}
        </div>
      )}

      {/* Orders Tab */}
      {activeTab === 'orders' && (
        <div id="orders-report" className="space-y-6">
          {/* Filter Section */}
          <div className="mb-6">
            <RevenueFilter 
              selectedRange={ordersRange} 
              onRangeChange={setOrdersRange}
              onCustomDateChange={handleOrdersCustomDateChange}
              disabled={orderStatsLoading}
            />
          </div>

          {/* Loading State */}
          {orderStatsLoading && (
            <Card className="p-12">
              <div className="text-center">
                <div className="inline-block">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                </div>
                <p className="text-gray-600 mt-4">Loading order statistics...</p>
              </div>
            </Card>
          )}

          {/* Content */}
          {!orderStatsLoading && orderStatsData && (
            <>
              {/* Order Stats Cards */}
              <div className="mt-8">
                <OrderStatsCards data={orderStatsData} />
              </div>

              {/* Order Stats Pie Chart */}
              <div className="mt-8">
                <OrderStatsPie data={getPieChartData()} />
              </div>
            </>
          )}

          {/* Error State */}
          {!orderStatsLoading && orderStatsError && (
            <Card className="p-12">
              <div className="text-center text-red-600">
                <p className="text-lg font-semibold">Failed to load order statistics</p>
                <p className="text-sm mt-2">{orderStatsError}</p>
                <p className="text-xs mt-4 text-gray-500">Please check if the API server is running</p>
              </div>
            </Card>
          )}

          {/* No Data State */}
          {!orderStatsLoading && !orderStatsError && !orderStatsData && (
            <Card className="p-12">
              <div className="text-center text-gray-500">
                <p className="text-lg font-semibold">No data available</p>
                <p className="text-sm mt-2">No order data found for this period</p>
              </div>
            </Card>
          )}
        </div>
      )}
    </div>
  )
}

export default RevenuesPage
