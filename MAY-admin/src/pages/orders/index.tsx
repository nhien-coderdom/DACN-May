import { OrderTable } from './components'

export default function OrdersPage() {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Danh Sách Đơn Hàng</h1>
        <p className="text-gray-600 mt-1">Quản lý tất cả các đơn hàng trong hệ thống</p>
      </div>

      <OrderTable />
    </div>
  )
}