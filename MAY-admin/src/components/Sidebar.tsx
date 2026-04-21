import { Link, useLocation } from 'react-router-dom'
import { LayoutDashboard, Tag, Coffee, ShoppingCart, Users, Package, TrendingUp } from 'lucide-react'

interface NavItem {
  label: string
  path: string
  icon: React.ReactNode
  status?: 'active' | 'soon'
}

const navItems: NavItem[] = [
  {
    label: 'Bảng điều khiển',
    path: '/admin',
    icon: <LayoutDashboard size={20} />,
    status: 'active',
  },
  {
    label: 'Danh mục',
    path: '/admin/categories',
    icon: <Tag size={20} />,
    status: 'active',
  },
  {
    label: 'Topping',
    path: '/admin/toppings',
    icon: <Coffee size={20} />,
    status: 'active',
  },
  {
    label: 'Sản phẩm',
    path: '/admin/products',
    icon: <Package size={20} />,
    status: 'active',
  },
  {
    label: 'Đơn hàng',
    path: '/admin/orders',
    icon: <ShoppingCart size={20} />,
    status: 'active',
  },
  {
    label: 'Doanh thu',
    path: '/admin/revenues',
    icon: <TrendingUp size={20} />,
    status: 'active',
  },
  {
    label: 'Người dùng',
    path: '/admin/users',
    icon: <Users size={20} />,
    status: 'active',
  },

]

export default function Sidebar() {
  const location = useLocation()

  return (
    <aside className="w-64 border-r border-gray-200 bg-white h-screen sticky top-0">
      {/* Logo */}
      <div className="p-4 border-b border-gray-200">
        <h1 className="text-2xl font-bold text-primary">MAY </h1>
      </div>

      {/* Navigation */}
      <nav className="p-4 space-y-2">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path
          const isDisabled = item.status === 'soon'

          return isDisabled ? (
            <div
              key={item.path}
              className="flex items-center gap-3 px-4 py-2 rounded-lg text-gray-400 cursor-not-allowed opacity-50"
            >
              {item.icon}
              <span className="flex-1">{item.label}</span>
              <span className="text-xs bg-gray-100 px-2 py-1 rounded">Sắp Tới</span>
            </div>
          ) : (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-colors ${
                isActive
                  ? 'bg-blue-100 text-blue-600 font-semibold'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              {item.icon}
              <span className="flex-1">{item.label}</span>
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}
