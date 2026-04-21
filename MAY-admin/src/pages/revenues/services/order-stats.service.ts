import axiosClient from '@/utils/axios'

export const getOrderStats = async (range: string = '7days', startDate?: string, endDate?: string) => {
  try {
    let url = '/revenues/order-stats'
    const params = new URLSearchParams()
    
    if (startDate && endDate) {
      params.append('startDate', startDate)
      params.append('endDate', endDate)
    }
    params.append('range', range)
    
    const queryString = params.toString()
    if (queryString) {
      url += `?${queryString}`
    }
    
    console.group('  ORDER STATS API CALL')
    console.log(' URL:', url)
    console.log(' Range:', range)
    if (startDate && endDate) {
      console.log('  Custom Date:', { startDate, endDate })
    }
    console.groupEnd()
    
    const response = await axiosClient.get(url)
    
    console.group(' ORDER STATS DATA RESPONSE')
    console.log('  Total Orders:', response.data.total)
    console.log('  Completed:', response.data.summary?.completed || 0)
    console.log('  Cancelled:', response.data.summary?.cancelled || 0)
    console.log('  Pending:', response.data.summary?.pending || 0)
    console.log(' Order Stats by Status:')
    console.table(response.data.stats)
    console.log(' Percentages:')
    console.table(response.data.percentages)
    console.log('  Full Response:', response.data)
    console.groupEnd()
    
    return response.data
  } catch (error) {
    console.error('Failed to fetch order stats:', error)
    throw error
  }
}
