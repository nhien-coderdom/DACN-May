import React from 'react'
import { Card } from '@/components/ui/card'

interface OrderStatsData {
  stats: {
    PENDING: number
    CONFIRMED: number
    SHIPPING: number
    COMPLETED: number
    CANCELLED: number
  }
  total: number
  summary: {
    completed: number
    cancelled: number
    pending: number
  }
}

interface OrderStatsCardsProps {
  data: OrderStatsData
}

export const OrderStatsCards: React.FC<OrderStatsCardsProps> = ({ data }) => {
  const cards = [
    {
      title: 'Completed',
      value: data.summary.completed,
      total: data.total,
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
      textColor: 'text-green-700',
      icon: '✓',
    },
    {
      title: 'Cancelled',
      value: data.summary.cancelled,
      total: data.total,
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200',
      textColor: 'text-red-700',
      icon: '✕',
    },
    {
      title: 'Pending',
      value: data.summary.pending,
      total: data.total,
      bgColor: 'bg-yellow-50',
      borderColor: 'border-yellow-200',
      textColor: 'text-yellow-700',
      icon: '⏱',
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      {cards.map((card, idx) => {
        const percentage = data.total > 0 ? Math.round((card.value / card.total) * 100) : 0
        return (
          <Card key={idx} className={`p-6 border ${card.borderColor} ${card.bgColor}`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">{card.title}</p>
                <p className={`text-3xl font-bold ${card.textColor}`}>{card.value}</p>
                <p className="text-xs text-gray-500 mt-1">{percentage}% of total</p>
              </div>
              <div className={`text-5xl ${card.textColor} opacity-20`}>{card.icon}</div>
            </div>
          </Card>
        )
      })}
    </div>
  )
}
