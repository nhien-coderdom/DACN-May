import { OrderTable } from './components'

export default function OrdersPage() {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Order List</h1>
        <p className="text-gray-600 mt-1">Manage all orders in the system</p>
      </div>

      <OrderTable />
    </div>
  )
}