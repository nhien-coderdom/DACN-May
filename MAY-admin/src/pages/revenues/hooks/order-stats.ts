import { useEffect, useState } from 'react'
import { getOrderStats } from '../services/order-stats.service'

export interface OrderStatsData {
  stats: {
    PENDING: number
    CONFIRMED: number
    SHIPPING: number
    COMPLETED: number
    CANCELLED: number
  }
  percentages: {
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

export function useOrderStats(range: string = '7days', startDate?: string, endDate?: string) {
  const [data, setData] = useState<OrderStatsData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setIsLoading(true)
        setError(null)
        const result = await getOrderStats(range, startDate, endDate)
        setData(result)
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to fetch order stats'
        setError(errorMessage)
        setData(null)
      } finally {
        setIsLoading(false)
      }
    }

    fetchStats()
  }, [range, startDate, endDate])

  return { data, isLoading, error }
}
