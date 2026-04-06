import React, { useState } from 'react'
import { Card } from '@/components/ui/card'

type DateRange = '7days' | '30days' | '90days' | '1year' | 'custom'

interface RevenueFilterProps {
  selectedRange: DateRange
  onRangeChange: (range: DateRange) => void
  onCustomDateChange?: (startDate: string, endDate: string) => void
  disabled?: boolean
}

export const RevenueFilter: React.FC<RevenueFilterProps> = ({
  selectedRange,
  onRangeChange,
  onCustomDateChange,
  disabled = false,
}) => {
  const [customStartDate, setCustomStartDate] = useState('')
  const [customEndDate, setCustomEndDate] = useState('')

  const ranges: { value: Exclude<DateRange, 'custom'>; label: string; description: string }[] = [
    { value: '7days', label: '7 Days', description: 'Last week' },
    { value: '30days', label: '30 Days', description: 'Last month' },
    { value: '90days', label: '90 Days', description: 'Last quarter' },
    { value: '1year', label: '1 Year', description: 'Last year' },
  ]

  const handleCustomDateApply = () => {
    if (customStartDate && customEndDate) {
      if (new Date(customStartDate) > new Date(customEndDate)) {
        alert('Start date must be before end date')
        return
      }
      onCustomDateChange?.(customStartDate, customEndDate)
      onRangeChange('custom')
    }
  }

  return (
    <Card className="p-4 space-y-4">
      {/* Preset Ranges */}
      <div className="flex flex-wrap gap-3">
        {ranges.map((range) => (
          <button
            key={range.value}
            onClick={() => onRangeChange(range.value)}
            disabled={disabled}
            className={`px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
              selectedRange === range.value
                ? 'bg-blue-600 text-white shadow-lg'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
          >
            <div className="flex flex-col items-start">
              <span className="text-sm">{range.label}</span>
              <span className="text-xs opacity-75">{range.description}</span>
            </div>
          </button>
        ))}
      </div>

      {/* Custom Date Range */}
      <div className="pt-2 border-t">
        <p className="text-sm font-medium text-gray-700 mb-3">Custom Date Range</p>
        <div className="flex flex-wrap gap-3 items-end">
          <div className="flex flex-col">
            <label className="text-xs font-medium text-gray-600 mb-1">From</label>
            <input
              type="date"
              value={customStartDate}
              onChange={(e) => setCustomStartDate(e.target.value)}
              disabled={disabled}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex flex-col">
            <label className="text-xs font-medium text-gray-600 mb-1">To</label>
            <input
              type="date"
              value={customEndDate}
              onChange={(e) => setCustomEndDate(e.target.value)}
              disabled={disabled}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            onClick={handleCustomDateApply}
            disabled={disabled || !customStartDate || !customEndDate}
            className={`px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 ${
              selectedRange === 'custom' && customStartDate && customEndDate
                ? 'bg-green-600 text-white'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            } ${(!customStartDate || !customEndDate || disabled) ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
          >
            Apply
          </button>
        </div>
      </div>
    </Card>
  )
}
