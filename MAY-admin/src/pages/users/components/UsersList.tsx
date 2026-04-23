import React from 'react'
import type { User } from '../types'
import { Card } from '@/components/ui/card'

interface UsersListProps {
  users: User[]
  isLoading?: boolean
  onView: (userId: number) => void
  onEdit: (userId: number) => void
  onDelete: (userId: number) => void
  onUpdateRole: (userId: number) => void
  onDeactivate: (userId: number) => void
  onActivate: (userId: number) => void
}

export const UsersList: React.FC<UsersListProps> = ({
  users,
  isLoading = false,
  onView,
  onEdit,
  onDelete,
  onUpdateRole,
  onDeactivate,
  onActivate,
}) => {
  if (isLoading) {
    return <div className="text-center py-8">Đang tải...</div>
  }

  if (!users || users.length === 0) {
    return <div className="text-center py-8 text-gray-500">Không tìm thấy người dùng</div>
  }

  const getRoleColor = (role: string) => {
    const colors: Record<string, string> = {
      ADMIN: 'bg-red-100 text-red-800',
      STAFF: 'bg-blue-100 text-blue-800',
      CUSTOMER: 'bg-green-100 text-green-800',
    }
    return colors[role] || 'bg-gray-100 text-gray-800'
  }

  return (
    <Card className="p-0">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-100 border-b">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-semibold">ID</th>
              <th className="px-4 py-3 text-left text-sm font-semibold">Email</th>
              <th className="px-4 py-3 text-left text-sm font-semibold">Tên</th>
              <th className="px-4 py-3 text-left text-sm font-semibold">Số điện thoại</th>
              <th className="px-4 py-3 text-left text-sm font-semibold">Vai trò</th>
              <th className="px-4 py-3 text-left text-sm font-semibold">Đơn hàng</th>
              <th className="px-4 py-3 text-left text-sm font-semibold">Chi tiêu</th>
              <th className="px-4 py-3 text-left text-sm font-semibold">Điểm trung thành</th>
              <th className="px-4 py-3 text-left text-sm font-semibold">Trạng thái</th>
              <th className="px-4 py-3 text-left text-sm font-semibold">Ngày tạo</th>
              <th className="px-4 py-3 text-left text-sm font-semibold">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="border-b hover:bg-gray-50 transition">
                <td className="px-4 py-3 text-sm text-gray-500">#{user.id}</td>
                <td className="px-4 py-3 text-sm">{user.email}</td>
                <td className="px-4 py-3">{user.name || 'N/A'}</td>
                <td className="px-4 py-3 text-sm">{user.phone}</td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getRoleColor(
                      user.role
                    )}`}
                  >
                    {user.role}
                  </span>
                </td>
                <td className="px-4 py-3 text-sm">{user.totalOrders}</td>
                <td className="px-4 py-3 text-sm font-semibold text-green-600">${user.totalSpent.toLocaleString()}</td>
                <td className="px-4 py-3 text-sm font-semibold text-blue-600">{user.loyaltyPoint}</td>
                <td className="px-4 py-3 text-sm">
                  {user.isDeleted ? (
                    <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-800">
                      ❌ Bị xóa
                    </span>
                  ) : (
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                      user.isActive 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {user.isActive ? '✓ Hoạt động' : '✕ Bị khóa'}
                    </span>
                  )}
                </td>
                <td className="px-4 py-3 text-xs text-gray-600">{new Date(user.createdAt).toLocaleDateString('vi-VN')}</td>
                <td className="px-4 py-3">
                  <div className="flex gap-1 flex-nowrap overflow-x-auto">
                    <button
                      onClick={() => onView(user.id)}
                      className="bg-green-500 hover:bg-green-600 text-white px-2 py-1 rounded text-xs whitespace-nowrap flex-shrink-0"
                      title="Xem chi tiết người dùng"
                    >
                      Xem
                    </button>
                    <button
                      onClick={() => onEdit(user.id)}
                      className="bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded text-xs whitespace-nowrap flex-shrink-0"
                    >
                      Sửa
                    </button>
                    <button
                      onClick={() => onUpdateRole(user.id)}
                      disabled={user.role === 'CUSTOMER'}
                      title={user.role === 'CUSTOMER' ? 'Khách hàng không thể thay đổi vai trò' : ''}
                      className="bg-purple-500 hover:bg-purple-600 text-white px-2 py-1 rounded text-xs disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap flex-shrink-0"
                    >
                      Vai trò
                    </button>
                    {user.isActive ? (
                      <button
                        onClick={() => onDeactivate(user.id)}
                        className="bg-orange-500 hover:bg-orange-600 text-white px-2 py-1 rounded text-xs whitespace-nowrap flex-shrink-0"
                        title="Khóa tài khoản"
                      >
                        🔒 Khóa
                      </button>
                    ) : (
                      <button
                        onClick={() => onActivate(user.id)}
                        className="bg-green-600 hover:bg-green-700 text-white px-2 py-1 rounded text-xs whitespace-nowrap flex-shrink-0"
                        title="Kích hoạt tài khoản"
                      >
                        🔓 Mở
                      </button>
                    )}
                    <button
                      onClick={() => onDelete(user.id)}
                      className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded text-xs whitespace-nowrap flex-shrink-0"
                      title="Xóa người dùng này"
                    >
                      Xóa
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  )
}
