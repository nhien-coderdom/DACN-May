import React, { useMemo } from 'react'
import { Card } from '@/components/ui/card'
import { Calendar } from 'lucide-react'

interface ChartData {
  date: string
  total: number
}

interface RevenueChartProps {
  data: ChartData[]
  range?: string
}

export const RevenueChart: React.FC<RevenueChartProps> = ({ data }) => {
  const chartMetrics = useMemo(() => {
    if (!data || data.length === 0) {
      return { min: 0, max: 1, range: 1, width: 800, height: 300, padding: 60 }
    }

    const values = data.map(d => d.total)
    const minValue = Math.min(...values)
    const maxValue = Math.max(...values)
    const rangValue = maxValue - minValue || 1

    const chartWidth = 800
    const chartHeight = 300
    const padding = 60

    return {
      min: minValue,
      max: maxValue,
      range: rangValue,
      width: chartWidth,
      height: chartHeight,
      padding,
    }
  }, [data])

  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value)
  }

  const formatDate = (dateStr: string): string => {
    const date = new Date(dateStr)
    return `${date.getDate()}/${date.getMonth() + 1}`
  }

  const points = data.map((d, i) => {
    const x = (chartMetrics.padding + (i / Math.max(data.length - 1, 1)) * (chartMetrics.width - chartMetrics.padding * 2))
    const y = chartMetrics.height - chartMetrics.padding + chartMetrics.padding - (((d.total - chartMetrics.min) / chartMetrics.range) * (chartMetrics.height - chartMetrics.padding * 1.5))
    return { x, y, ...d }
  })

  const pathD = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ')

  return (
    <Card className="p-6">
      <div className="flex items-center gap-2 mb-6">
        <Calendar size={20} className="text-blue-600" />
        <h2 className="text-lg font-semibold text-gray-900">Revenue Trend</h2>
      </div>

      {data && data.length > 0 ? (
        <div className="overflow-x-auto">
          <svg 
            width={chartMetrics.width} 
            height={chartMetrics.height}
            className="min-w-full"
          >
            {/* Grid lines */}
            {[0, 0.25, 0.5, 0.75, 1].map((ratio, i) => (
              <line
                key={`grid-${i}`}
                x1={chartMetrics.padding}
                y1={chartMetrics.height - chartMetrics.padding + chartMetrics.padding - ratio * (chartMetrics.height - chartMetrics.padding * 1.5)}
                x2={chartMetrics.width - chartMetrics.padding}
                y2={chartMetrics.height - chartMetrics.padding + chartMetrics.padding - ratio * (chartMetrics.height - chartMetrics.padding * 1.5)}
                stroke="#e5e7eb"
                strokeDasharray="5,5"
              />
            ))}

            {/* Y-axis */}
            <line
              x1={chartMetrics.padding}
              y1={chartMetrics.padding}
              x2={chartMetrics.padding}
              y2={chartMetrics.height - chartMetrics.padding}
              stroke="#374151"
              strokeWidth="2"
            />

            {/* X-axis */}
            <line
              x1={chartMetrics.padding}
              y1={chartMetrics.height - chartMetrics.padding}
              x2={chartMetrics.width - chartMetrics.padding}
              y2={chartMetrics.height - chartMetrics.padding}
              stroke="#374151"
              strokeWidth="2"
            />

            {/* Y-axis labels and grid */}
            {[0, 0.25, 0.5, 0.75, 1].map((ratio, i) => {
              const value = chartMetrics.min + ratio * chartMetrics.range
              const y = chartMetrics.height - chartMetrics.padding + chartMetrics.padding - ratio * (chartMetrics.height - chartMetrics.padding * 1.5)
              return (
                <g key={`y-label-${i}`}>
                  <text
                    x={chartMetrics.padding - 10}
                    y={y + 5}
                    textAnchor="end"
                    className="text-xs fill-gray-600"
                  >
                    {formatCurrency(value)}
                  </text>
                </g>
              )
            })}

            {/* X-axis labels */}
            {points.map((p, i) => (
              <g key={`x-label-${i}`}>
                <text
                  x={p.x}
                  y={chartMetrics.height - chartMetrics.padding + 25}
                  textAnchor="middle"
                  className="text-xs fill-gray-600"
                >
                  {formatDate(p.date)}
                </text>
              </g>
            ))}

            {/* Line chart */}
            <path
              d={pathD}
              fill="none"
              stroke="#2563eb"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Data points */}
            {points.map((p, i) => (
              <g key={`point-${i}`}>
                <circle
                  cx={p.x}
                  cy={p.y}
                  r="5"
                  fill="#2563eb"
                  className="hover:r-7 transition-all cursor-pointer"
                />
                <title>{`${formatDate(p.date)}: ${formatCurrency(p.total)}`}</title>
              </g>
            ))}
          </svg>
        </div>
      ) : (
        <div className="text-center py-12 text-gray-500">
          <p>No revenue data available for this period</p>
        </div>
      )}

      {/* Summary stats */}
      <div className="grid grid-cols-3 gap-4 mt-8 pt-6 border-t">
        <div>
          <p className="text-xs text-gray-600 font-medium">Total Days</p>
          <p className="text-lg font-bold text-gray-900">{data?.length || 0}</p>
        </div>
        <div>
          <p className="text-xs text-gray-600 font-medium">Average Daily</p>
          <p className="text-lg font-bold text-gray-900">
            {data && data.length > 0
              ? formatCurrency(data.reduce((sum, d) => sum + d.total, 0) / data.length)
              : '₫0'}
          </p>
        </div>
        <div>
          <p className="text-xs text-gray-600 font-medium">Peak Day</p>
          <p className="text-lg font-bold text-gray-900">
            {data && data.length > 0
              ? formatCurrency(Math.max(...data.map(d => d.total)))
              : '₫0'}
          </p>
        </div>
      </div>
    </Card>
  )
}
