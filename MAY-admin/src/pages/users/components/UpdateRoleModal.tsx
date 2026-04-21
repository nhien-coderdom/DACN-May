import React, { useState, useMemo } from 'react'
import type { User, UpdateUserRoleDTO, UserRole } from '../types'

interface UpdateRoleModalProps {
  user: User
  onSubmit: (data: UpdateUserRoleDTO) => void
  onClose: () => void
}

export const UpdateRoleModal: React.FC<UpdateRoleModalProps> = ({ user, onSubmit, onClose }) => {
  const [selectedRole, setSelectedRole] = useState<UserRole>(user.role)

  // Rule validation
  const canChangeToRole = (fromRole: UserRole, toRole: UserRole): { allowed: boolean; reason?: string } => {
    // Không thay đổi role
    if (fromRole === toRole) {
      return { allowed: false, reason: 'Chọn một vai trò khác' }
    }

    // CUSTOMER không được nâng lên STAFF hoặc ADMIN
    if (fromRole === 'CUSTOMER' && (toRole === 'STAFF' || toRole === 'ADMIN')) {
      return { allowed: false, reason: 'Khách hàng không thể được thăng chức lên staff/admin (rủi ro bảo mật)' }
    }

    // STAFF/ADMIN không được downgrade về CUSTOMER
    if ((fromRole === 'STAFF' || fromRole === 'ADMIN') && toRole === 'CUSTOMER') {
      return { allowed: false, reason: 'Staff và admin không thể bị hạ cấp xuống customer' }
    }

    // STAFF → ADMIN: cho phép
    if (fromRole === 'STAFF' && toRole === 'ADMIN') {
      return { allowed: true }
    }

    // ADMIN → STAFF: cho phép (backend sẽ check nếu còn ≥1 admin)
    if (fromRole === 'ADMIN' && toRole === 'STAFF') {
      return { allowed: true, reason: 'Hạ cấp admin xuống staff được phép nếu còn ít nhất 1 admin hoạt động' }
    }

    return { allowed: true }
  }

  const roleValidation = useMemo(() => canChangeToRole(user.role, selectedRole), [user.role, selectedRole])
  const isRoleChangeAllowed = roleValidation.allowed

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!isRoleChangeAllowed) {
      alert(roleValidation.reason || 'Thay đổi vai trò này không được phép')
      return
    }

    onSubmit({ role: selectedRole })
  }

  const getDisabledRoles = (): UserRole[] => {
    const disabled: UserRole[] = [user.role] // Luôn disable role hiện tại

    if (user.role === 'CUSTOMER') {
      // CUSTOMER không được nâng quyền lên STAFF/ADMIN
      disabled.push('STAFF', 'ADMIN')
    }

    if (user.role === 'STAFF' || user.role === 'ADMIN') {
      // STAFF/ADMIN không được downgrade về CUSTOMER
      disabled.push('CUSTOMER')
    }

    return disabled
  }

  const disabledRoles = getDisabledRoles()

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <h2 className="text-xl font-bold mb-4">Thay đổi Vai trò Người dùng</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <p className="text-sm text-gray-600 mb-2">Tên người dùng: <span className="font-semibold">{user.name}</span></p>
            <p className="text-sm text-gray-600 mb-4">Vai trò hiện tại: <span className="font-semibold">{user.role}</span></p>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Vai trò mới *</label>
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value as UserRole)}
              className="w-full border rounded px-3 py-2"
            >
              <option value="CUSTOMER" disabled={disabledRoles.includes('CUSTOMER')}>
                {disabledRoles.includes('CUSTOMER') ? '  CUSTOMER' : 'CUSTOMER'}
              </option>
              <option value="STAFF" disabled={disabledRoles.includes('STAFF')}>
                {disabledRoles.includes('STAFF') ? '  STAFF' : 'STAFF'}
              </option>
              <option value="ADMIN" disabled={disabledRoles.includes('ADMIN')}>
                {disabledRoles.includes('ADMIN') ? '  ADMIN' : 'ADMIN'}
              </option>
            </select>
          </div>

          {/* Role change rules info */}
          <div className="bg-blue-50 border border-blue-200 rounded p-3 text-xs">
            <p className="font-semibold text-blue-900 mb-2">Các quy tắc thay đổi vai trò:</p>
            <ul className="text-blue-800 space-y-1">
              <li>  STAFF → ADMIN (luôn được phép)</li>
              <li>  ADMIN → STAFF (nếu còn ≥1 admin hoạt động)</li>
              <li>  CUSTOMER → STAFF (rủi ro bảo mật)</li>
              <li>  CUSTOMER → ADMIN (rủi ro bảo mật)</li>
            </ul>
          </div>

          {/* Show status based on selection */}
          {selectedRole !== user.role && (
            <div className={`border rounded p-3 text-sm ${isRoleChangeAllowed ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
              {isRoleChangeAllowed ? (
                <p className="text-green-800">
                  ✓ {user.role} → {selectedRole} được phép{roleValidation.reason && ` (${roleValidation.reason})`}
                </p>
              ) : (
                <p className="text-red-800">
                  ✗ {user.role} → {selectedRole} không được phép: {roleValidation.reason}
                </p>
              )}
            </div>
          )}

          <div className="flex justify-end gap-2 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded hover:bg-gray-50"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={!isRoleChangeAllowed}
              className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Thay đổi Vai trò
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
