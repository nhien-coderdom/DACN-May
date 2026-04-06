import { useOrder } from '../hooks/orders'
import { formatDate, formatPrice, getStatusColor, getStatusLabel, getStatusIcon } from '../utils/index'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { X, Loader2 } from 'lucide-react'

interface OrderDetailModalProps {
  orderId: number | null
  isOpen: boolean
  onClose: () => void
}

export function OrderDetailModal({ orderId, isOpen, onClose }: OrderDetailModalProps) {
  const { data: order, isLoading, error } = useOrder(orderId ?? 0)

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">Order #{orderId}</h2>
            <p className="text-blue-100 mt-1">Order Details</p>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-2 hover:bg-blue-500 transition"
          >
            <X size={24} />
          </button>
        </div>

        {/* Loading state */}
        {isLoading && (
          <div className="p-8 flex items-center justify-center">
            <Loader2 className="animate-spin mr-2" size={24} />
            <span>Loading order details...</span>
          </div>
        )}

        {/* Error state */}
        {error && (
          <div className="p-6 bg-red-50 text-red-700 border border-red-200 rounded-lg m-4">
            Error loading order details
          </div>
        )}

        {/* Content */}
        {order && !isLoading && (
          <div className="p-6 space-y-6">
            {/* Order Info */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Order ID</p>
                <p className="text-lg font-semibold text-blue-600">#{order.id}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Created Date</p>
                <p className="text-lg font-semibold">{formatDate(order.createdAt)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Status</p>
                <div className="mt-1">
                  <span
                    className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-semibold ${getStatusColor(order.status)}`}
                  >
                    <span>{getStatusIcon(order.status)}</span>
                    {getStatusLabel(order.status)}
                  </span>
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Amount</p>
                <p className="text-lg font-bold text-green-600">{formatPrice(order.total)}</p>
              </div>
            </div>

            {/* Customer Info */}
            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold mb-4">Customer Information</h3>
              <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg">
                <div>
                  <p className="text-sm text-gray-600">Customer Name</p>
                  <p className="font-semibold">{order.user?.name || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Email</p>
                  <p className="font-semibold">{order.user?.email || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Phone Number</p>
                  <p className="font-semibold">{order.phone}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Role</p>
                  <p className="font-semibold">{order.user?.role || 'N/A'}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-sm text-gray-600">Delivery Address</p>
                  <p className="font-semibold">{order.address || 'N/A'}</p>
                </div>
              </div>
            </div>

            {/* Order Items */}
            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold mb-4">Products in Order</h3>
              <div className="space-y-3">
                {order.items && order.items.length > 0 ? (
                  order.items.map((item) => (
                    <div key={item.id} className="border rounded-lg p-4 bg-gray-50">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <p className="font-semibold">{item.productName}</p>
                          <p className="text-sm text-gray-600">ID: {item.productId}</p>
                        </div>
                        <p className="font-semibold text-blue-600">x{item.quantity}</p>
                      </div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-gray-600">Base Price:</span>
                        <span>{formatPrice(item.basePrice)}</span>
                      </div>
                      {item.toppings && item.toppings.length > 0 && (
                        <div className="border-t pt-2">
                          <p className="text-sm font-semibold mb-1">Toppings:</p>
                          <div className="space-y-1">
                            {item.toppings.map((topping: any, idx: number) => {
                              console.log('Topping data:', topping, typeof topping)
                              // Handle different topping formats
                              const toppingName = typeof topping === 'string' ? topping : (topping?.name || topping?.toppingName || '')
                              const toppingPrice = typeof topping === 'object' ? (topping?.price || topping?.toppingPrice || 0) : 0
                              
                              return (
                                <div key={idx} className="flex justify-between text-sm text-gray-600">
                                  <span>• {toppingName}</span>
                                  <span>{toppingPrice > 0 ? `+${formatPrice(toppingPrice)}` : ''}</span>
                                </div>
                              )
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 text-center py-4">No products</p>
                )}
              </div>
            </div>

            {/* Payment Info */}
            {order.payments && order.payments.length > 0 && (
              <div className="border-t pt-6">
                <h3 className="text-lg font-semibold mb-4">Payment Information</h3>
                <div className="space-y-3">
                  {order.payments.map((payment) => (
                    <div key={payment.id} className="border rounded-lg p-4 bg-gray-50">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-gray-600">Method</p>
                          <p className="font-semibold">{payment.method}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Status</p>
                          <p
                            className={`font-semibold ${
                              payment.status === 'SUCCESS'
                                ? 'text-green-600'
                                : payment.status === 'FAILED'
                                  ? 'text-red-600'
                                  : 'text-yellow-600'
                            }`}
                          >
                            {payment.status}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Amount</p>
                          <p className="font-semibold">{formatPrice(payment.amount)}</p>
                        </div>
                        {payment.transactionId && (
                          <div>
                            <p className="text-sm text-gray-600">Transaction ID</p>
                            <p className="font-semibold text-xs">{payment.transactionId}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Points Info */}
            {(order.earnedPoint !== undefined || order.usedPoint !== undefined) && (
              <div className="border-t pt-6">
                <h3 className="text-lg font-semibold mb-4">Reward Points</h3>
                <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg">
                  {order.earnedPoint !== undefined && (
                    <div>
                      <p className="text-sm text-gray-600">Points Earned</p>
                      <p className="text-lg font-semibold text-green-600">+{order.earnedPoint}</p>
                    </div>
                  )}
                  {order.usedPoint !== undefined && (
                    <div>
                      <p className="text-sm text-gray-600">Points Used</p>
                      <p className="text-lg font-semibold text-red-600">-{order.usedPoint}</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Order Logs */}
            {order.logs && order.logs.length > 0 && (
              <div className="border-t pt-6">
                <h3 className="text-lg font-semibold mb-4">Order History</h3>
                <div className="space-y-2">
                  {order.logs.map((log) => (
                    <div key={log.id} className="flex items-start gap-4 border-l-4 border-blue-500 pl-4 py-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-1 rounded text-xs font-semibold ${getStatusColor(log.status)}`}>
                            {getStatusLabel(log.status)}
                          </span>
                          <span className="text-sm text-gray-600">{formatDate(log.createdAt)}</span>
                        </div>
                        {log.updatedBy && (
                          <p className="text-sm text-gray-600 mt-1">
                            Updated by: <span className="font-semibold">{log.updatedBy.name || 'N/A'}</span>
                          </p>
                        )}
                        {log.note && <p className="text-sm text-gray-700 mt-1">Note: {log.note}</p>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Footer */}
        <div className="sticky bottom-0 bg-gray-50 border-t p-4 flex justify-end gap-3">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>
      </Card>
    </div>
  )
}
