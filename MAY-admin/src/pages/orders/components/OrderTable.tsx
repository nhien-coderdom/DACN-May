import { useState, useMemo } from 'react'
import { useOrders } from '../hooks/orders'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { getStatusColor, formatDate, formatPrice } from '../utils/index'
import { OrderDetailModal } from './OrderDetailModal'

export function OrderTable() {
  const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const { data: orders, isLoading, error } = useOrders()

  // Memoized filtered data - Search by order ID, customer name, phone, or status
  const filteredOrders = useMemo(() => {
    if (!orders) return []
    
    const searchLower = searchTerm.toLowerCase()
    
    return orders.filter(order => {
      // Search in order ID, customer name, phone, or status
      return (
        order.id.toString().includes(searchLower) ||
        (order.user?.name && order.user.name.toLowerCase().includes(searchLower)) ||
        order.phone.toLowerCase().includes(searchLower) ||
        order.status.toLowerCase().includes(searchLower)
      )
    })
  }, [orders, searchTerm])

  if (isLoading) {
    return <div className="p-6 text-center">Loading orders...</div>
  }

  if (error) {
    return <div className="p-6 text-red-500">Error loading orders</div>
  }

  if (!orders || orders.length === 0) {
    return <div className="p-6 text-center text-gray-500">No orders found</div>
  }

  return (
    <div>
      {/* Search Bar */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search by order ID, customer name, phone, or status..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {searchTerm && (
          <p className="text-sm text-gray-600 mt-2">
            Found {filteredOrders.length} result{filteredOrders.length !== 1 ? 's' : ''} for "{searchTerm}"
          </p>
        )}
      </div>

      <Card className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-100 border-b">
              <tr>
              <th className="px-4 py-3 text-left text-sm font-semibold">Order ID</th>
              <th className="px-4 py-3 text-left text-sm font-semibold">Customer</th>
              <th className="px-4 py-3 text-left text-sm font-semibold">Phone</th>
              <th className="px-4 py-3 text-left text-sm font-semibold">Total</th>
              <th className="px-4 py-3 text-left text-sm font-semibold">Status</th>
              <th className="px-4 py-3 text-left text-sm font-semibold">Date</th>
              <th className="px-4 py-3 text-center text-sm font-semibold">Actions</th>
            </tr>
            </thead>
            <tbody>
            {filteredOrders.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-gray-500">
                  {searchTerm ? `No orders found matching "${searchTerm}"` : 'No orders yet'}
                </td>
              </tr>
            ) : (
              filteredOrders.map((order) => (
              <tr key={order.id} className="border-b hover:bg-gray-50 transition">
                <td className="px-4 py-3">
                  <span className="font-semibold text-blue-600">#{order.id}</span>
                </td>
                <td className="px-4 py-3">
                  <div>
                    <p className="font-medium">{order.user?.name || 'N/A'}</p>
                    <p className="text-xs text-gray-500">{order.user?.phone}</p>
                  </div>
                </td>
                <td className="px-4 py-3 text-sm">{order.phone}</td>
                <td className="px-4 py-3 font-semibold text-green-600">
                  {formatPrice(order.total)}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                      order.status
                    )}`}
                  >
                    {order.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-sm text-gray-600">
                  {formatDate(order.createdAt)}
                </td>
                <td className="px-4 py-3 text-center">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSelectedOrderId(order.id)
                      setIsModalOpen(true)
                    }}
                  >
                    View
                  </Button>
                </td>
              </tr>
              ))
            )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Order Detail Modal */}
      <OrderDetailModal
        orderId={selectedOrderId}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          setSelectedOrderId(null)
        }}
      />
    </div>
  )
}
