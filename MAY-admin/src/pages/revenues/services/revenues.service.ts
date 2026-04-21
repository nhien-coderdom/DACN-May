import axiosClient from '@/utils/axios'

export const getRevenue = async (range: string = '7days', startDate?: string, endDate?: string) => {
  try {
    let url = `/revenues?range=${range}`
    if (startDate && endDate) {
      url += `&startDate=${startDate}&endDate=${endDate}`
    }
    
    console.group(' REVENUE API CALL')
    console.log(' URL:', url)
    console.log(' Range:', range)
    if (startDate && endDate) {
      console.log('  Custom Date:', { startDate, endDate })
    }
    console.groupEnd()
    
    const response = await axiosClient.get(url)
    
    console.group('  REVENUE DATA RESPONSE')
    console.log(' Total Revenue:', response.data.totalRevenue)
    console.log('  Daily Breakdown:')
    response.data.chart?.forEach((item: any, index: number) => {
      console.log(`  Day ${index + 1}: ${item.date} → ${item.total.toLocaleString('vi-VN')} VND`)
    })
    console.table(response.data.chart)
    console.log('  Full Response:', response.data)
    console.groupEnd()
    
    return response.data
  } catch (error) {
    console.error('Failed to fetch revenue data:', error)
    throw error
  }
}