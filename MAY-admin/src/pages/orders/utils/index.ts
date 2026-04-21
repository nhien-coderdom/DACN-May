import type { OrderStatus } from '../types/orders.types'

/**
 * Get Tailwind CSS classes for order status
 */
export function getStatusColor(status: OrderStatus): string {
  const colors: Record<OrderStatus, string> = {
    PENDING: 'bg-yellow-100 text-yellow-800',
    CONFIRMED: 'bg-blue-100 text-blue-800',
    SHIPPING: 'bg-purple-100 text-purple-800',
    COMPLETED: 'bg-green-100 text-green-800',
    CANCELLED: 'bg-red-100 text-red-800',
  }
  return colors[status] || 'bg-gray-100 text-gray-800'
}

/**
 * Get status label (Vietnamese)
 */
export function getStatusLabel(status: OrderStatus): string {
  const labels: Record<OrderStatus, string> = {
    PENDING: 'Chờ xác nhận',
    CONFIRMED: 'Đã xác nhận',
    SHIPPING: 'Đang giao',
    COMPLETED: 'Hoàn thành',
    CANCELLED: 'Đã hủy',
  }
  return labels[status] || status
}

/**
 * Format date to Vietnamese format
 * @param date ISO string date
 * @returns formatted date (DD/MM/YYYY HH:mm)
 */
export function formatDate(date: string): string {
  const d = new Date(date)
  const day = String(d.getDate()).padStart(2, '0')
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const year = d.getFullYear()
  const hours = String(d.getHours()).padStart(2, '0')
  const minutes = String(d.getMinutes()).padStart(2, '0')
  return `${day}/${month}/${year} ${hours}:${minutes}`
}

/**
 * Format price to VND currency
 * @param price price in VND
 * @returns formatted price string
 */
export function formatPrice(price: number): string {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(price)
}

/**
 * Get order status icon/badge
 */
export function getStatusIcon(status: OrderStatus): string {
  const icons: Record<OrderStatus, string> = {
    PENDING: ' ',
    CONFIRMED: '✓',
    SHIPPING: '🚚',
    COMPLETED: '✓✓',
    CANCELLED: '✗',
  }
  return icons[status] || '•'
}
