import axiosClient from '@/utils/axios'

export const getRevenue = async (range: string = '7days', startDate?: string, endDate?: string) => {
  try {
    let url = `/revenues?range=${range}`
    if (startDate && endDate) {
      url += `&startDate=${startDate}&endDate=${endDate}`
    }
    const response = await axiosClient.get(url)
    return response.data
  } catch (error) {
    console.error('Failed to fetch revenue data:', error)
    throw error
  }
}