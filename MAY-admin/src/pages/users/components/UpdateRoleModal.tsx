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
      return { allowed: false, reason: 'Select a different role' }
    }

    // CUSTOMER không được nâng lên STAFF hoặc ADMIN
    if (fromRole === 'CUSTOMER' && (toRole === 'STAFF' || toRole === 'ADMIN')) {
      return { allowed: false, reason: 'Customers cannot be promoted to staff/admin (security risk)' }
    }

    // STAFF/ADMIN không được downgrade về CUSTOMER
    if ((fromRole === 'STAFF' || fromRole === 'ADMIN') && toRole === 'CUSTOMER') {
      return { allowed: false, reason: 'Staff and admin cannot be downgraded to customer' }
    }

    // STAFF → ADMIN: cho phép
    if (fromRole === 'STAFF' && toRole === 'ADMIN') {
      return { allowed: true }
    }

    // ADMIN → STAFF: cho phép (backend sẽ check nếu còn ≥1 admin)
    if (fromRole === 'ADMIN' && toRole === 'STAFF') {
      return { allowed: true, reason: 'Demoting admin to staff is allowed if at least 1 active admin remains' }
    }

    return { allowed: true }
  }

  const roleValidation = useMemo(() => canChangeToRole(user.role, selectedRole), [user.role, selectedRole])
  const isRoleChangeAllowed = roleValidation.allowed

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!isRoleChangeAllowed) {
      alert(roleValidation.reason || 'This role change is not allowed')
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
        <h2 className="text-xl font-bold mb-4">Change User Role</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <p className="text-sm text-gray-600 mb-2">User: <span className="font-semibold">{user.name}</span></p>
            <p className="text-sm text-gray-600 mb-4">Current Role: <span className="font-semibold">{user.role}</span></p>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">New Role *</label>
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value as UserRole)}
              className="w-full border rounded px-3 py-2"
            >
              <option value="CUSTOMER" disabled={disabledRoles.includes('CUSTOMER')}>
                {disabledRoles.includes('CUSTOMER') ? '❌ CUSTOMER' : 'CUSTOMER'}
              </option>
              <option value="STAFF" disabled={disabledRoles.includes('STAFF')}>
                {disabledRoles.includes('STAFF') ? '❌ STAFF' : 'STAFF'}
              </option>
              <option value="ADMIN" disabled={disabledRoles.includes('ADMIN')}>
                {disabledRoles.includes('ADMIN') ? '❌ ADMIN' : 'ADMIN'}
              </option>
            </select>
          </div>

          {/* Role change rules info */}
          <div className="bg-blue-50 border border-blue-200 rounded p-3 text-xs">
            <p className="font-semibold text-blue-900 mb-2">STT Role Change Rules:</p>
            <ul className="text-blue-800 space-y-1">
              <li>✅ STAFF → ADMIN (always allowed)</li>
              <li>✅ ADMIN → STAFF (if ≥1 admin remains)</li>
              <li>❌ CUSTOMER → STAFF (security risk)</li>
              <li>❌ CUSTOMER → ADMIN (security risk)</li>
            </ul>
          </div>

          {/* Show status based on selection */}
          {selectedRole !== user.role && (
            <div className={`border rounded p-3 text-sm ${isRoleChangeAllowed ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
              {isRoleChangeAllowed ? (
                <p className="text-green-800">
                  ✓ {user.role} → {selectedRole} is allowed{roleValidation.reason && ` (${roleValidation.reason})`}
                </p>
              ) : (
                <p className="text-red-800">
                  ✗ {user.role} → {selectedRole} is NOT allowed: {roleValidation.reason}
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
              Cancel
            </button>
            <button
              type="submit"
              disabled={!isRoleChangeAllowed}
              className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Change Role
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
