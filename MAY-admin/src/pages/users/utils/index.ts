import type { UserRole } from '../types'

/**
 * Get badge color based on user role
 */
export const getRoleBadgeColor = (role: UserRole): string => {
  switch (role) {
    case 'ADMIN':
      return 'bg-red-100 text-red-800'
    case 'STAFF':
      return 'bg-blue-100 text-blue-800'
    case 'CUSTOMER':
      return 'bg-gray-100 text-gray-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

/**
 * Get role description
 */
export const getRoleDescription = (role: UserRole): string => {
  switch (role) {
    case 'ADMIN':
      return 'Admin - Full access to system'
    case 'STAFF':
      return 'Staff - Can manage orders and users'
    case 'CUSTOMER':
      return 'Customer - Can place orders'
    default:
      return 'Unknown role'
  }
}

/**
 * Format currency
 */
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(amount)
}

/**
 * Format date
 */
export const formatDate = (dateString: string): string => {
  const date = new Date(dateString)
  return date.toLocaleDateString('vi-VN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}
