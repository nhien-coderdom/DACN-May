import React, { useState } from 'react'
import { Card } from '@/components/ui/card'
import { AlertCircle } from 'lucide-react'

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
  const [dateError, setDateError] = useState<string>('')

  // Lấy ngày hôm nay (local timezone)
  const today = new Date().toLocaleDateString('en-CA')

  const ranges: { value: Exclude<DateRange, 'custom'>; label: string; description: string }[] = [
    { value: '7days', label: '7 Days', description: 'Last week' },
    { value: '30days', label: '30 Days', description: 'Last month' },
    { value: '90days', label: '90 Days', description: 'Last quarter' },
    { value: '1year', label: '1 Year', description: 'Last year' },
  ]

  const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setCustomStartDate(value)
    validateDates(value, customEndDate)
  }

  const handleEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setCustomEndDate(value)
    validateDates(customStartDate, value)
  }

  const validateDates = (startDate: string, endDate: string) => {
    setDateError('')

    if (!startDate || !endDate) return

    // Chặn ngày tương lai
    if (startDate > today) {
      setDateError('  Start date cannot be in the future')
      return
    }

    if (endDate > today) {
      setDateError('  End date cannot be in the future. Today is ' + today)
      return
    }

    // Kiểm tra start < end
    if (new Date(startDate) > new Date(endDate)) {
      setDateError('  Start date must be before end date')
      return
    }
  }

  const handleCustomDateApply = () => {
    validateDates(customStartDate, customEndDate)

    if (!customStartDate || !customEndDate || dateError) {
      return
    }

    onCustomDateChange?.(customStartDate, customEndDate)
    onRangeChange('custom')
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

        {/* Error Message */}
        {dateError && (
          <div className="mb-3 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
            <AlertCircle size={18} className="text-red-600 flex-shrink-0 mt-0.5" />
            <span className="text-sm text-red-700">{dateError}</span>
          </div>
        )}

        {/* Today Info */}
        <div className="mb-3 p-2 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-xs text-blue-700"> Today: {today}</p>
        </div>

        <div className="flex flex-wrap gap-3 items-end">
          <div className="flex flex-col">
            <label className="text-xs font-medium text-gray-600 mb-1">From</label>
            <input
              type="date"
              value={customStartDate}
              onChange={handleStartDateChange}
              disabled={disabled}
              max={today}
              className={`px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 ${
                dateError && (customStartDate > today)
                  ? 'border-red-400 focus:ring-red-500'
                  : 'border-gray-300 focus:ring-blue-500'
              }`}
            />
            {customStartDate && customStartDate > today && (
              <span className="text-xs text-red-600 mt-1">Future date not allowed</span>
            )}
          </div>

          <div className="flex flex-col">
            <label className="text-xs font-medium text-gray-600 mb-1">To</label>
            <input
              type="date"
              value={customEndDate}
              onChange={handleEndDateChange}
              disabled={disabled}
              max={today}
              className={`px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 ${
                dateError && customEndDate > today
                  ? 'border-red-400 focus:ring-red-500'
                  : 'border-gray-300 focus:ring-blue-500'
              }`}
            />
            {customEndDate && customEndDate > today && (
              <span className="text-xs text-red-600 mt-1">Future date not allowed</span>
            )}
          </div>

          <button
            onClick={handleCustomDateApply}
            disabled={disabled || !customStartDate || !customEndDate || !!dateError}
            className={`px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 ${
              selectedRange === 'custom' && customStartDate && customEndDate && !dateError
                ? 'bg-green-600 text-white hover:bg-green-700'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            } ${(!customStartDate || !customEndDate || disabled || dateError) ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
          >
            Apply
          </button>
        </div>
      </div>
    </Card>
  )
}

