import { useEffect, useState } from 'react'
import { getRevenue } from '../services/revenues.service'
import type { RevenueData } from '../types'

export function useRevenue(range = '7days', startDate?: string, endDate?: string) {
  const [data, setData] = useState<RevenueData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchRevenue = async () => {
      try {
        setIsLoading(true)
        setError(null)
        const result = await getRevenue(range, startDate, endDate)
        setData(result)
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to fetch revenue data'
        setError(errorMessage)
        setData(null)
      } finally {
        setIsLoading(false)
      }
    }

    fetchRevenue()
  }, [range, startDate, endDate])

  return { data, isLoading, error }
}