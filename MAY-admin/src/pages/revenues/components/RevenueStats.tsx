import React from 'react'
import { Card } from '@/components/ui/card'
import { TrendingUp } from 'lucide-react'

interface RevenueStatsProps {
  totalRevenue: number
  range: string
}

export const RevenueStats: React.FC<RevenueStatsProps> = ({ totalRevenue, range }) => {
  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value)
  }

  const getRangeLabel = (r: string): string => {
    const labels: Record<string, string> = {
      '7days': '7 ngày qua',
      '30days': '30 ngày qua',
      '90days': '90 ngày qua',
      '1year': '1 năm qua',
    }
    return labels[r] || r
  }

  return (
    <Card className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
      <div className="flex items-center gap-4">
        <div className="p-4 bg-blue-600 rounded-lg">
          <TrendingUp className="text-white" size={32} />
        </div>
        <div className="flex-1">
          <p className="text-gray-600 text-sm font-medium">Tổng Doanh Thu</p>
          <p className="text-gray-600 text-xs mt-1">{getRangeLabel(range)}</p>
        </div>
        <div className="text-right">
          <p className="text-3xl font-bold text-blue-600">{formatCurrency(totalRevenue)}</p>
          <p className="text-xs text-gray-500 mt-1">VND</p>
        </div>
      </div>
    </Card>
  )
}
