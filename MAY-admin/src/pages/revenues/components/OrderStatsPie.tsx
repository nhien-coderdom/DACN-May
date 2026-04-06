import React from 'react'
import { Card } from '@/components/ui/card'

interface PieChartProps {
  data: {
    label: string
    value: number
    percentage: number
    color: string
  }[]
}

export const OrderStatsPie: React.FC<PieChartProps> = ({ data }) => {
  // Calculate SVG pie chart
  const canvasSize = 300
  const radius = 100

  let currentAngle = -90 // Start from top
  const slices = data.map((item, index) => {
    const sliceAngle = (item.percentage / 100) * 360
    const startAngle = currentAngle
    const endAngle = currentAngle + sliceAngle

    const startRad = (startAngle * Math.PI) / 180
    const endRad = (endAngle * Math.PI) / 180

    const x1 = 150 + radius * Math.cos(startRad)
    const y1 = 150 + radius * Math.sin(startRad)
    const x2 = 150 + radius * Math.cos(endRad)
    const y2 = 150 + radius * Math.sin(endRad)

    const largeArc = sliceAngle > 180 ? 1 : 0

    const path = `M 150 150 L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2} Z`

    currentAngle = endAngle

    return { path, color: item.color, label: item.label, percentage: item.percentage }
  })

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">Order Status Distribution</h3>
      <div className="flex gap-8">
        {/* Pie Chart */}
        <div className="flex-shrink-0">
          <svg width={canvasSize} height={canvasSize} viewBox="0 0 300 300">
            {slices.map((slice, idx) => (
              <path key={idx} d={slice.path} fill={slice.color} stroke="white" strokeWidth={2} />
            ))}
          </svg>
        </div>

        {/* Legend */}
        <div className="flex flex-col gap-3">
          {data.map((item, idx) => (
            <div key={idx} className="flex items-center gap-2">
              <div className="w-4 h-4 rounded" style={{ backgroundColor: item.color }} />
              <span className="text-sm">{item.label}</span>
              <span className="text-sm font-semibold ml-auto">{item.percentage}%</span>
              <span className="text-xs text-gray-500">({item.value})</span>
            </div>
          ))}
        </div>
      </div>
    </Card>
  )
}
