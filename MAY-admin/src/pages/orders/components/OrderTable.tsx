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
    return <div className="p-6 text-center">Đang tải đơn hàng...</div>
  }

  if (error) {
    return <div className="p-6 text-red-500">Lỗi khi tải đơn hàng</div>
  }

  if (!orders || orders.length === 0) {
    return <div className="p-6 text-center text-gray-500">Không tìm thấy đơn hàng</div>
  }

  return (
    <div>
      {/* Search Bar */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Tìm kiếm theo ID đơn hàng, tên khách hàng, số điện thoại hoặc trạng thái..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {searchTerm && (
          <p className="text-sm text-gray-600 mt-2">
            Tìm thấy {filteredOrders.length} kết quả cho "{searchTerm}"
          </p>
        )}
      </div>

      <Card className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-100 border-b">
              <tr>
              <th className="px-4 py-3 text-left text-sm font-semibold">Mã Đơn</th>
              <th className="px-4 py-3 text-left text-sm font-semibold">Khách Hàng</th>
              <th className="px-4 py-3 text-left text-sm font-semibold">Điện Thoại</th>
              <th className="px-4 py-3 text-left text-sm font-semibold">Tổng Cộng</th>
              <th className="px-4 py-3 text-left text-sm font-semibold">Trạng Thái</th>
              <th className="px-4 py-3 text-left text-sm font-semibold">Ngày</th>
              <th className="px-4 py-3 text-center text-sm font-semibold">Hành Động</th>
            </tr>
            </thead>
            <tbody>
            {filteredOrders.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-gray-500">
                  {searchTerm ? `Không tìm thấy đơn hàng nào phù hợp với "${searchTerm}"` : 'Chưa có đơn hàng nào'}
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
                    Xem chi tiết
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
