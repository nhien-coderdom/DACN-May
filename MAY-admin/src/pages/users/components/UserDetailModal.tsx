import React from 'react'
import { Card } from '@/components/ui/card'
import { X } from 'lucide-react'
import type { User } from '../types'

interface UserDetailModalProps {
  user: User | null
  isOpen: boolean
  onClose: () => void
}

export const UserDetailModal: React.FC<UserDetailModalProps> = ({ user, isOpen, onClose }) => {
  if (!isOpen || !user) return null

  const getRoleBadgeStyle = (role: string) => {
    const styles: Record<string, string> = {
      ADMIN: 'bg-red-500',
      STAFF: 'bg-blue-500',
      CUSTOMER: 'bg-green-500',
    }
    return styles[role] || 'bg-gray-500'
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">Chi Tiết Người Dùng</h2>
            <p className="text-blue-100 mt-1">ID: {user.id}</p>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-2 hover:bg-blue-500 transition"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Basic Info */}
          <div className="grid grid-cols-2 gap-6">
            <div>
              <p className="text-sm text-gray-600 mb-1">Email</p>
              <p className="text-lg font-semibold">{user.email}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Tên</p>
              <p className="text-lg font-semibold">{user.name || 'N/A'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Số điện thoại</p>
              <p className="text-lg font-semibold">{user.phone}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Vai trò</p>
              <span className={`inline-block px-3 py-1.5 rounded-full text-xs font-semibold text-white ${getRoleBadgeStyle(user.role)}`}>
                {user.role}
              </span>
            </div>
          </div>

          {/* Address Info */}
          {user.address && (
            <div className="border-t pt-6">
              <p className="text-sm text-gray-600 mb-1">Địa chỉ</p>
              <p className="text-lg font-semibold">{user.address}</p>
            </div>
          )}

          {/* Order Stats */}
          {!['ADMIN', 'STAFF'].includes(user.role) && (
            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold mb-4">Thống Kê Đơn Hàng</h3>
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600">Số đơn hàng</p>
                  <p className="text-3xl font-bold text-blue-600">{user.totalOrders}</p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600">Tổng chi tiêu</p>
                  <p className="text-3xl font-bold text-green-600">${user.totalSpent.toLocaleString()}</p>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600">Điểm thưởng</p>
                  <p className="text-3xl font-bold text-purple-600">{user.loyaltyPoint}</p>
                </div>
              </div>
            </div>
          )}

          {/* Dates Info */}
          <div className="border-t pt-6">
            <h3 className="text-lg font-semibold mb-4">Thông Tin Thời Gian</h3>
            <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg">
              <div>
                <p className="text-sm text-gray-600">Ngày tạo</p>
                <p className="font-semibold">{new Date(user.createdAt).toLocaleString('vi-VN')}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Lần cập nhật cuối</p>
                <p className="font-semibold">{new Date(user.updatedAt).toLocaleString('vi-VN')}</p>
              </div>
              {user.deletedAt && (
                <div className="col-span-2">
                  <p className="text-sm text-gray-600">Ngày xóa</p>
                  <p className="font-semibold text-red-600">{new Date(user.deletedAt).toLocaleString('vi-VN')}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-gray-50 border-t p-4 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded font-medium transition"
          >
            Đóng
          </button>
        </div>
      </Card>
    </div>
  )
}
