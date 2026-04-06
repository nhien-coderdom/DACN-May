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
    
    const response = await axiosClient.get(url)
    return response.data
  } catch (error) {
    console.error('Failed to fetch order stats:', error)
    throw error
  }
}
