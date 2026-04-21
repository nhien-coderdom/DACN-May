import React, { useState, useEffect } from 'react'
import type { User, CreateUserDTO, UpdateUserDTO } from '../types'

interface UserFormProps {
  initialData: User | null
  onSubmit: (data: CreateUserDTO | UpdateUserDTO) => void
  onClose: () => void
}

export const UserForm: React.FC<UserFormProps> = ({ initialData, onSubmit, onClose }) => {
  const [formData, setFormData] = useState({
    email: initialData?.email || '',
    name: initialData?.name || '',
    phone: initialData?.phone || '',
    address: initialData?.address || '',
    password: '',
    role: 'STAFF',
  })

  useEffect(() => {
    if (initialData) {
      setFormData({
        email: initialData.email,
        name: initialData.name,
        phone: initialData.phone,
        address: initialData.address || '',
        password: '',
        role: 'STAFF',
      })
    }
  }, [initialData])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (initialData) {
      // Update - exclude email and password
      const updateData: UpdateUserDTO = {
        name: formData.name,
        phone: formData.phone,
        address: formData.address,
      }
      onSubmit(updateData)
    } else {
      const createData: CreateUserDTO = {
        email: formData.email,
        name: formData.name,
        phone: formData.phone,
        password: formData.password,
        role: (formData.role as any) || 'STAFF',
      }
      onSubmit(createData)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-xl font-bold mb-4">
        {initialData ? 'Chỉnh sửa Người dùng' : 'Tạo Người dùng Mới'}
      </h2>

      <div>
        <label className="block text-sm font-medium mb-1">Email *</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
          disabled={!!initialData}
          className="w-full border rounded px-3 py-2 disabled:bg-gray-100"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Tên *</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          className="w-full border rounded px-3 py-2"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Số điện thoại *</label>
        <input
          type="text"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          placeholder="0912345678"
          required
          className="w-full border rounded px-3 py-2"
        />
        <p className="text-xs text-gray-500 mt-1">
          {initialData 
            ? '9-10 chữ số (có hoặc không có số 0 ở đầu)' 
            : 'Chính xác 10 chữ số - PHẢI BẮT ĐẦU BẰNG 0 (ví dụ: 0912345678)'}
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Địa chỉ</label>
        <textarea
          name="address"
          value={formData.address}
          onChange={handleChange}
          rows={2}
          className="w-full border rounded px-3 py-2"
        />
      </div>

      {!initialData && (
        <>
          <div>
            <label className="block text-sm font-medium mb-1">Vai trò</label>
            <select
              name="role"
              value={formData.role}
              onChange={(e) => setFormData((prev) => ({ ...prev, role: e.target.value }))}
              className="w-full border rounded px-3 py-2"
            >
              <option value="STAFF">STAFF</option>
              <option value="ADMIN">ADMIN</option>
            </select>
          </div>
        </>
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
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          {initialData ? 'Cập nhật' : 'Tạo mới'}
        </button>
      </div>
    </form>
  )
}
