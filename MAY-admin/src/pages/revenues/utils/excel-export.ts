import * as XLSX from 'xlsx'
import { saveAs } from 'file-saver'


const exportToExcel = (data: any[], fileName: string) => {
  if (!data || data.length === 0) {
    console.warn('No data to export')
    return
  }

  const workbook = XLSX.utils.book_new() // Convert JSON data to a worksheet
  const worksheet = XLSX.utils.json_to_sheet(data) // Append the worksheet to the workbook and trigger the download
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1') // Generate a binary string representation of the workbook and create a Blob from it, then trigger the download using FileSaver
  
  const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' })

  const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
  saveAs(blob, `${fileName}.xlsx`)
}

export const exportRevenueToExcel = (revenueData: any[], dateRange: string) => {
  const formattedData = revenueData.map(item => ({
    Date: item.date,
    Revenue: item.total
  }))
   const fileName= `Revenues_${dateRange}`
  exportToExcel(formattedData, fileName)
}


export const exportOrdersToExcel = (ordersData: any) => {
   let formattedData: any[] = []

    if (Array.isArray(ordersData)) {
        // CASE 1: Danh sách đơn hàng theo ngày
        formattedData = ordersData.map(item => ({
            Date: item.date,
            Orders: item.orders,
            Completed: item.completed,
            Cancelled: item.cancelled
        }))
    }
    else if ( ordersData && typeof ordersData === 'object') {
        // CASE 2: Thống kê đơn hàng theo trạng thái
    
        formattedData = [
            {
                Status: 'Completed',
                Orders: ordersData.stats?.COMPLETED || 0,
                Percentage: `${ordersData.percentages?.COMPLETED || 0}%`
            },
            {
                Status: 'Shipping',
                Orders: ordersData.stats?.SHIPPING || 0,
                Percentage: `${ordersData.percentages?.SHIPPING || 0}%`
            },
            {
                Status: 'Pending',
                Orders: ordersData.stats?.PENDING || 0,
                Percentage: `${ordersData.percentages?.PENDING || 0}%`
            },
            {
                Status: 'Cancelled',
                Orders: ordersData.stats?.CANCELLED || 0,
                Percentage: `${ordersData.percentages?.CANCELLED || 0}%`
            }
        ]
    }
    
    if (formattedData.length === 0) {
        console.warn('No orders data to export')
        return
    }
    
    const fileName = `Orders_${new Date().toISOString().split('T')[0]}`
    exportToExcel(formattedData, fileName)
}
