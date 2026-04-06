import React from 'react'
import type { User } from '../types'
import { getRoleBadgeColor } from '../utils'

interface UserRowProps {
  user: User
  onEdit: () => void
  onDelete: () => void
  onChangeRole: () => void
}

export const UserRow: React.FC<UserRowProps> = ({ user, onEdit, onDelete, onChangeRole }) => {
  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'ADMIN':
        return 'bg-red-100 text-red-800'
      case 'STAFF':
        return 'bg-blue-100 text-blue-800'
      case 'CUSTOMER':
        return 'bg-gray-100 text-gray-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <tr className="border-b hover:bg-gray-50">
      <td className="px-4 py-3 text-sm">{user.id}</td>
      <td className="px-4 py-3 text-sm">{user.email}</td>
      <td className="px-4 py-3 text-sm font-medium">{user.name}</td>
      <td className="px-4 py-3 text-sm">{user.phone}</td>
      <td className="px-4 py-3 text-sm">
        <span className={`px-2 py-1 rounded text-xs font-semibold ${getRoleBadgeColor(user.role)}`}>
          {user.role}
        </span>
      </td>
      <td className="px-4 py-3 text-sm text-center">{user.totalOrders}</td>
      <td className="px-4 py-3 text-sm">
        <span className={`px-2 py-1 rounded text-xs ${user.isDeleted ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
          {user.isDeleted ? 'Deleted' : 'Active'}
        </span>
      </td>
      <td className="px-4 py-3 text-sm space-x-2">
        <button
          onClick={onEdit}
          className="bg-blue-500 text-white px-2 py-1 rounded text-xs hover:bg-blue-600"
        >
          Edit Info
        </button>
        <button
          onClick={onChangeRole}
          disabled={user.isDeleted || user.role === 'CUSTOMER'}
          className="bg-purple-500 text-white px-2 py-1 rounded text-xs hover:bg-purple-600 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Change Role
        </button>
        <button
          onClick={onDelete}
          disabled={user.isDeleted}
          className="bg-red-500 text-white px-2 py-1 rounded text-xs hover:bg-red-600 disabled:opacity-50"
        >
          {user.isDeleted ? 'Restore' : 'Delete'}
        </button>
      </td>
    </tr>
  )
}
