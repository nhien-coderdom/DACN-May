import React, { useState, useMemo } from 'react'
import { UsersList } from './components'
import { UserForm } from './components/UserForm'
import { UpdateRoleModal } from './components/UpdateRoleModal'
import { UserDetailModal } from './components/UserDetailModal'
import {
  useUsers,
  useCreateUser,
  useUpdateUser,
  useDeleteUser,
  useUpdateUserRole,
  useDeactivateUser,
  useActivateUser,
} from './hooks'
import type { UpdateUserRoleDTO, CreateUserDTO, UpdateUserDTO, User } from './types'

const Users: React.FC = () => {
  // Active users
  const { data: users = [], isLoading } = useUsers()

  // Mutations
  const createUserMutation = useCreateUser()
  const updateUserMutation = useUpdateUser()
  const deleteUserMutation = useDeleteUser()
  const updateUserRoleMutation = useUpdateUserRole()
  const deactivateUserMutation = useDeactivateUser()
  const activateUserMutation = useActivateUser()

  // Modal states
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [roleModalUser, setRoleModalUser] = useState<User | null>(null)
  const [detailModalUser, setDetailModalUser] = useState<User | null>(null)
  const [searchTerm, setSearchTerm] = useState('')

  // Memoized filtered data - Search by email, name, or phone
  const filteredUsers = useMemo(() => {
    if (!users) return []
    
    const searchLower = searchTerm.toLowerCase()
    
    return users.filter(user => {
      // Search in email, name, or phone
      return (
        user.email.toLowerCase().includes(searchLower) ||
        (user.name && user.name.toLowerCase().includes(searchLower)) ||
        user.phone.toLowerCase().includes(searchLower)
      )
    })
  }, [users, searchTerm])

  const handleCreate = (data: CreateUserDTO) => {
    createUserMutation.mutate(data)
    setShowCreateForm(false)
  }

  const handleUpdate = (userId: number, data: UpdateUserDTO) => {
    if (userId === 0) {
      // Create
      handleCreate(data as any)
    } else {
      // Update
      updateUserMutation.mutate({ id: userId, data })
      setEditingUser(null)
    }
  }

  const handleDelete = (userId: number) => {
    if (confirm('Bạn có chắc chắn muốn xóa người dùng này?')) {
      deleteUserMutation.mutate(userId)
    }
  }

  const handleUpdateRole = (userId: number, data: UpdateUserRoleDTO) => {
    updateUserRoleMutation.mutate({ id: userId, data })
    setRoleModalUser(null)
  }

  const handleDeactivateUser = (userId: number) => {
    if (confirm('Bạn có chắc chắn muốn khóa tài khoản này?')) {
      deactivateUserMutation.mutate(userId)
    }
  }

  const handleActivateUser = (userId: number) => {
    if (confirm('Bạn có chắc chắn muốn kích hoạt tài khoản này?')) {
      activateUserMutation.mutate(userId)
    }
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Quản Lý Người Dùng</h1>
        <button
          onClick={() => {
            setEditingUser(null)
            setShowCreateForm(true)
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 font-medium"
        >
          + Tạo Người Dùng
        </button>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Tìm kiếm theo email, tên hoặc số điện thoại..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {searchTerm && (
          <p className="text-sm text-gray-600 mt-2">
            Tìm thấy {filteredUsers.length} kết quả cho "{searchTerm}"
          </p>
        )}
      </div>

      {/* Create/Edit Form Modal */}
      {(showCreateForm || editingUser) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <UserForm
              initialData={editingUser}
              onSubmit={(data) => {
                const userId = editingUser?.id || 0
                handleUpdate(userId, data)
              }}
              onClose={() => {
                setShowCreateForm(false)
                setEditingUser(null)
              }}
            />
          </div>
        </div>
      )}

      {/* Update Role Modal */}
      {roleModalUser && (
        <UpdateRoleModal
          user={roleModalUser}
          onSubmit={(data) => {
            handleUpdateRole(roleModalUser.id, data)
          }}
          onClose={() => setRoleModalUser(null)}
        />
      )}

      {/* User Detail Modal */}
      <UserDetailModal
        user={detailModalUser}
        isOpen={!!detailModalUser}
        onClose={() => setDetailModalUser(null)}
      />

      {/* Users List Table */}
      <UsersList
        users={filteredUsers}
        onView={(userId) => {
          const user = filteredUsers.find((u) => u.id === userId)
          if (user) {
            setDetailModalUser(user)
          }
        }}
        onEdit={(userId) => {
          const user = filteredUsers.find((u) => u.id === userId)
          if (userId === 0) {
            setShowCreateForm(true)
          } else if (user) {
            setEditingUser(user)
          }
        }}
        onDelete={handleDelete}
        onUpdateRole={(userId) => {
          const user = filteredUsers.find((u) => u.id === userId)
          if (user) {
            setRoleModalUser(user)
          }
        }}
        onDeactivate={handleDeactivateUser}
        onActivate={handleActivateUser}
        isLoading={isLoading}
      />
    </div>
  )
}

export default Users
