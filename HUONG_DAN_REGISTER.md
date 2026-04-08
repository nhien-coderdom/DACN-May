# 📚 Hướng Dẫn Xây Dựng Register Page - MAY Project

## 🎯 Mục tiêu
Tạo Register page trong **MAY (Customer App)** theo structure của **Categories (MAY-admin)**

## 📁 Structure mục tiêu
```
MAY/src/auth/
├── types/
│   ├── auth.types.ts       → Định nghĩa types/interfaces
│   └── index.ts            → Export types
├── services/
│   ├── auth.service.ts     → Gọi API backend
│   └── index.ts            → Export services
├── hooks/
│   ├── useRegister.ts      → React Query hook
│   └── index.ts            → Export hooks
└── components/
    ├── RegisterForm.tsx    → Component form
    └── index.ts            → Export components
```

---

## 📝 Step 1: Types (auth.types.ts)

**File:** `MAY/src/auth/types/auth.types.ts`

**Nội dung:** Define all types theo **User schema** trong Prisma:

```typescript
// Schema từ Prisma:
// - email: string (unique)
// - password: string
// - name: string?
// - phone: string (unique)
// - address: string?
// - role: UserRole (default: CUSTOMER)
// - createdAt: DateTime
// - updatedAt: DateTime

export interface User {
  id: number
  email: string
  name: string
  phone: string
  address?: string
  role: string
  createdAt: string
  updatedAt: string
}

// DTO khi đăng ký
export interface RegisterDTO {
  email: string
  password: string
  name: string
  phone: string
  address?: string
}

// Response từ backend
export interface AuthResponse {
  user: User
  access_token: string
  refresh_token: string
}
```

**Export:** `MAY/src/auth/types/index.ts`
```typescript
export * from './auth.types'
```

---

## 🔌 Step 2: Services (auth.service.ts)

**File:** `MAY/src/auth/services/auth.service.ts`

**Nội dung:** Gọi API backend (tương tự CategoryService)

```typescript
import axios from 'axios'
import type { RegisterDTO, AuthResponse } from '../types'

// API endpoint
const API_URL = 'http://localhost:3000/auth'

// Register - POST /auth/register
export const register = async (data: RegisterDTO): Promise<AuthResponse> => {
  const response = await axios.post<AuthResponse>(`${API_URL}/register`, data)
  return response.data
}
```

**Export:** `MAY/src/auth/services/index.ts`
```typescript
export * as authService from './auth.service'
```

---

## ⚡ Step 3: Hooks (useRegister.ts)

**File:** `MAY/src/auth/hooks/useRegister.ts`

**Nội dung:** React Query mutation (tương tự useCreateCategory)

```typescript
import { useMutation } from '@tanstack/react-query'
import * as authService from '../services/auth.service'
import type { RegisterDTO } from '../types'

export const useRegister = () => {
  return useMutation({
    mutationFn: (data: RegisterDTO) => authService.register(data),
    
    // Thành công → lưu tokens vào localStorage
    onSuccess: (data) => {
      localStorage.setItem('access_token', data.access_token)
      localStorage.setItem('refresh_token', data.refresh_token)
    },
    
    // Lỗi → show error message
    onError: (error: any) => {
      const message = 
        error.response?.data?.message || 
        'Đăng ký không thành công'
      console.error('Register error:', message)
    },
  })
}
```

**Export:** `MAY/src/auth/hooks/index.ts`
```typescript
export { useRegister } from './useRegister'
```

---

## 🎨 Step 4: Component (RegisterForm.tsx)

**File:** `MAY/src/auth/components/RegisterForm.tsx`

**Nội dung:** Pure form component (tương tự CategoryForm)

```typescript
import React, { useState } from 'react'
import { FiUser, FiMail, FiLock, FiEye, FiEyeOff, FiPhone, FiMapPin } from 'react-icons/fi'
import type { RegisterDTO } from '../types'

interface RegisterFormProps {
  onSubmit: (data: RegisterDTO) => void
  onClose: () => void
  isLoading?: boolean
}

export const RegisterForm: React.FC<RegisterFormProps> = ({
  onSubmit,
  onClose,
  isLoading = false,
}) => {
  // State
  const [formData, setFormData] = useState<RegisterDTO>({
    email: '',
    password: '',
    name: '',
    phone: '',
    address: '',
  })

  const [showPassword, setShowPassword] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  // Validation
  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.name) newErrors.name = 'Vui lòng nhập họ tên'
    if (!formData.email) newErrors.email = 'Vui lòng nhập email'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email không hợp lệ'
    }
    
    if (!formData.phone) newErrors.phone = 'Vui lòng nhập số điện thoại'
    if (!/^0\d{9}$/.test(formData.phone)) {
      newErrors.phone = 'SĐT phải 10 số, bắt đầu từ 0'
    }
    
    if (!formData.password) newErrors.password = 'Vui lòng nhập mật khẩu'
    if (formData.password.length < 6) {
      newErrors.password = 'Mật khẩu tối thiểu 6 ký tự'
    }
    if (!/^(?=.*[A-Z])(?=.*\d).+$/.test(formData.password)) {
      newErrors.password = 'Mật khẩu phải có chữ hoa + số'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Handlers
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))

    // Clear error khi user nhập
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validateForm()) {
      onSubmit(formData)
    }
  }

  // UI
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-2xl font-bold mb-6">Đăng ký tài khoản</h2>

      {/* Name Field */}
      <div>
        <label className="block text-sm font-semibold mb-2">Họ tên</label>
        <div className="relative">
          <FiUser className="absolute left-3 top-3 text-gray-400" />
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Nguyễn Văn A"
            className={`w-full border rounded px-10 py-2 ${
              errors.name ? 'border-red-400' : 'border-gray-300'
            }`}
          />
        </div>
        {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
      </div>

      {/* Email Field */}
      <div>
        <label className="block text-sm font-semibold mb-2">Email</label>
        <div className="relative">
          <FiMail className="absolute left-3 top-3 text-gray-400" />
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="your@email.com"
            className={`w-full border rounded px-10 py-2 ${
              errors.email ? 'border-red-400' : 'border-gray-300'
            }`}
          />
        </div>
        {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
      </div>

      {/* Phone Field */}
      <div>
        <label className="block text-sm font-semibold mb-2">Số điện thoại</label>
        <div className="relative">
          <FiPhone className="absolute left-3 top-3 text-gray-400" />
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="0123456789"
            maxLength={10}
            className={`w-full border rounded px-10 py-2 ${
              errors.phone ? 'border-red-400' : 'border-gray-300'
            }`}
          />
        </div>
        {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
      </div>

      {/* Password Field */}
      <div>
        <label className="block text-sm font-semibold mb-2">Mật khẩu</label>
        <div className="relative">
          <FiLock className="absolute left-3 top-3 text-gray-400" />
          <input
            type={showPassword ? 'text' : 'password'}
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="••••••••"
            className={`w-full border rounded px-10 py-2 ${
              errors.password ? 'border-red-400' : 'border-gray-300'
            }`}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-3 text-gray-400"
          >
            {showPassword ? <FiEyeOff /> : <FiEye />}
          </button>
        </div>
        {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
      </div>

      {/* Address Field (optional) */}
      <div>
        <label className="block text-sm font-semibold mb-2">Địa chỉ (tuỳ chọn)</label>
        <div className="relative">
          <FiMapPin className="absolute left-3 top-3 text-gray-400" />
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleChange}
            placeholder="123 Đường ABC, TP.HCM"
            className="w-full border border-gray-300 rounded px-10 py-2"
          />
        </div>
      </div>

      {/* Buttons */}
      <div className="flex gap-2 justify-end pt-4">
        <button
          type="button"
          onClick={onClose}
          className="bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-400 disabled:opacity-50"
          disabled={isLoading}
        >
          Hủy
        </button>
        <button
          type="submit"
          className="bg-orange-400 text-white px-4 py-2 rounded hover:bg-orange-500 disabled:opacity-50"
          disabled={isLoading}
        >
          {isLoading ? 'Đang xử lý...' : 'Đăng ký'}
        </button>
      </div>
    </form>
  )
}
```

**Export:** `MAY/src/auth/components/index.ts`
```typescript
export { RegisterForm } from './RegisterForm'
```

---

## 📄 Step 5: Update Register.tsx Page

**File:** `MAY/src/pages/Register.tsx`

**Thay toàn bộ nội dung cũ:**

```typescript
import { useNavigate } from 'react-router-dom'
import { RegisterForm } from '../auth/components'
import { useRegister } from '../auth/hooks'
import type { RegisterDTO } from '../auth/types'

function Register() {
  const navigate = useNavigate()
  const { mutate: register, isPending } = useRegister()

  const handleSubmit = (data: RegisterDTO) => {
    register(data, {
      onSuccess: () => {
        // Redirect to home sau 1s
        setTimeout(() => navigate('/'), 1000)
      },
    })
  }

  const handleClose = () => {
    navigate('/')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-neutral-50 via-white to-orange-50 px-4 py-8">
      <div className="w-full max-w-md">
        <div className="rounded-3xl bg-white shadow-lg border border-neutral-200 p-8">
          <RegisterForm
            onSubmit={handleSubmit}
            onClose={handleClose}
            isLoading={isPending}
          />
        </div>
      </div>
    </div>
  )
}

export default Register
```

---

## ✅ Checklist

- [ ] Tạo `MAY/src/auth/types/auth.types.ts`
- [ ] Tạo `MAY/src/auth/types/index.ts`
- [ ] Tạo `MAY/src/auth/services/auth.service.ts`
- [ ] Tạo `MAY/src/auth/services/index.ts`
- [ ] Tạo `MAY/src/auth/hooks/useRegister.ts`
- [ ] Tạo `MAY/src/auth/hooks/index.ts`
- [ ] Tạo `MAY/src/auth/components/RegisterForm.tsx`
- [ ] Tạo `MAY/src/auth/components/index.ts` 
- [ ] Update `MAY/src/pages/Register.tsx`
- [ ] Test đăng ký 🚀

---

## 🎓 Key Concepts

| File | Vai trò | So sánh |
|------|--------|--------|
| **types/** | Define interfaces | CategoryType |
| **services/** | API calls | categoryService |
| **hooks/** | React Query logic | useCreateCategory |
| **components/** | Pure UI component | CategoryForm |
| **pages/Register.tsx** | Integrate & navigate | CategoriesPage |

**Logic flow:**
```
RegisterForm (UI) 
  ↓ onSubmit
  → Register.tsx (page)
    ↓ useRegister()
    → useRegister hook
      ↓ register() 
      → authService.register()
        ↓ axios.post()
        → Backend API
```

---

## 💡 Tips

- **registerForm**: pure component, ko phụ thuộc API
- **useRegister**: chỉ giải quyết async logic, ko UI
- **Register.tsx**: orchestrator - nối hook + component + navigate
- Test từng layer riêng biệt!

Good luck! 🎉
