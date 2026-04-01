# Categories Feature - Step by Step Guide

##  STEP 1: Tạo Folder Structure - CHI TIẾT

### 🎯 Mục đích
```
src/features/Categories/
├── components/
├── hooks/
├── services/
└── types/
```

### 💡 Cách 1: Dùng Terminal PowerShell (NHANH NHẤT)

**Bước 1:** Mở Terminal (Ctrl + `)

**Bước 2:** Di chuyển vào folder
```powershell
cd MAY-admin
```

**Bước 3:** Chạy command
```powershell
mkdir src\features\Categories\{components,hooks,services,types}
```

**Xong!** 

---

### 🖱️ Cách 2: Tạo Thủ Công

**Bước 1:** Trong Explorer bên trái
- Click chuột phải vào `src`
- Chọn "New Folder"
- Đặt tên: `features`

**Bước 2:** Click chuột phải vào `features`
- Chọn "New Folder"
- Đặt tên: `Categories`

**Bước 3:** Click chuột phải vào `Categories`, tạo 4 folder:
1. `components`
2. `hooks`
3. `services`
4. `types`

**Kết quả cuối cùng:**
```
src/
└── features/
    └── Categories/
        ├── components/
        ├── hooks/
        ├── services/
        └── types/
```

---

##  STEP 2: Tạo Types File

### File 1: `src/features/Categories/types/category.types.ts`

**Cách tạo:**
1. Click chuột phải vào folder `types`
2. Chọn "New File"
3. Đặt tên: `category.types.ts`
4. Copy code dưới vào:

```typescript
export interface Category {
  id: number
  name: string
  slug: string
  order: number
  parentId?: number | null
  children?: Category[]
  createdAt: string
  updatedAt: string
  isDeleted: boolean
}

export interface CreateCategoryDTO {
  name: string
  parentId?: number | null
}

export interface UpdateCategoryDTO {
  name?: string
  parentId?: number | null
  order?: number
}

export interface ReorderCategoryDTO {
  id: number
  order: number
}
```

---

### File 2: `src/features/Categories/types/index.ts`

**Cách tạo:**
1. Click chuột phải vào folder `types`
2. Chọn "New File"
3. Đặt tên: `index.ts`
4. Copy code dưới vào:

```typescript
export * from './category.types'
```

---

##  STEP 3: Tạo Service File

### File 1: `src/features/Categories/services/categories.service.ts`

**Cách tạo:**
1. Click chuột phải vào folder `services`
2. Chọn "New File"
3. Đặt tên: `categories.service.ts`
4. Copy code dưới vào:

```typescript
import axiosClient from '@/utils/axios'
import { Category, CreateCategoryDTO, UpdateCategoryDTO } from '../types'

export const categoriesService = {
  async getAll() {
    const { data } = await axiosClient.get('/categories')
    return data
  },

  async getById(id: number) {
    const { data } = await axiosClient.get(`/categories/${id}`)
    return data
  },

  async create(payload: CreateCategoryDTO) {
    const { data } = await axiosClient.post('/categories', payload)
    return data
  },

  async update(id: number, payload: UpdateCategoryDTO) {
    const { data } = await axiosClient.patch(`/categories/${id}`, payload)
    return data
  },

  async delete(id: number) {
    const { data } = await axiosClient.delete(`/categories/${id}`)
    return data
  },

  async reorder(payload: Array<{ id: number; order: number }>) {
    const { data } = await axiosClient.post('/categories/reorder', {
      items: payload
    })
    return data
  }
}
```

---

### File 2: `src/features/Categories/services/index.ts`

**Cách tạo:**
1. Click chuột phải vào folder `services`
2. Chọn "New File"
3. Đặt tên: `index.ts`
4. Copy code dưới vào:

```typescript
export * from './categories.service'
```

---

##  STEP 4: Tạo Hooks File

### File: `src/features/Categories/hooks/useCategories.ts`

**Cách tạo:**
1. Click chuột phải vào folder `hooks`
2. Chọn "New File"
3. Đặt tên: `useCategories.ts`
4. Copy code dưới vào:

```typescript
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { categoriesService } from '../services'
import { CreateCategoryDTO, UpdateCategoryDTO } from '../types'

const CATEGORIES_KEY = ['categories']

export function useCategories() {
  return useQuery({
    queryKey: CATEGORIES_KEY,
    queryFn: () => categoriesService.getAll(),
    staleTime: 5 * 60 * 1000
  })
}

export function useCategoryById(id: number) {
  return useQuery({
    queryKey: [...CATEGORIES_KEY, id],
    queryFn: () => categoriesService.getById(id),
    enabled: !!id
  })
}

export function useCreateCategory() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: CreateCategoryDTO) => categoriesService.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CATEGORIES_KEY })
    }
  })
}

export function useUpdateCategory() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: UpdateCategoryDTO }) =>
      categoriesService.update(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CATEGORIES_KEY })
    }
  })
}

export function useDeleteCategory() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => categoriesService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CATEGORIES_KEY })
    }
  })
}
```

---

### File: `src/features/Categories/hooks/index.ts`

**Cách tạo:**
1. Click chuột phải vào folder `hooks`
2. Chọn "New File"
3. Đặt tên: `index.ts`
4. Copy code dưới vào:

```typescript
export * from './useCategories'
```

---

##  STEP 5: Tạo Components

### File 1: `src/features/Categories/components/CategoriesList.tsx`

**Cách tạo:**
1. Click chuột phải vào folder `components`
2. Chọn "New File"
3. Đặt tên: `CategoriesList.tsx`
4. Copy code dưới vào:

```typescript
import { useState } from 'react'
import { useCategories } from '../hooks'
import CategoryForm from './CategoryForm'
import CategoryTree from './CategoryTree'
import { Category } from '../types'

export default function CategoriesList() {
  const { data: categories = [], isLoading, error } = useCategories()
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null)

  if (isLoading) return <div className="p-4">Loading categories...</div>
  if (error) return <div className="p-4 text-red-500">Error loading categories</div>

  const handleEdit = (category: Category) => {
    setSelectedCategory(category)
    setIsFormOpen(true)
  }

  const handleCloseForm = () => {
    setSelectedCategory(null)
    setIsFormOpen(false)
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Categories</h1>
        <button
          onClick={() => setIsFormOpen(true)}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
        >
          + Add Category
        </button>
      </div>

      {isFormOpen && (
        <CategoryForm 
          category={selectedCategory} 
          onClose={handleCloseForm} 
        />
      )}

      <div className="bg-white rounded shadow p-6">
        {categories.length === 0 ? (
          <p className="text-gray-500">No categories yet</p>
        ) : (
          <CategoryTree categories={categories} onEdit={handleEdit} />
        )}
      </div>
    </div>
  )
}
```

---

### File 2: `src/features/Categories/components/CategoryForm.tsx`

**Cách tạo:**
1. Click chuột phải vào folder `components`
2. Chọn "New File"
3. Đặt tên: `CategoryForm.tsx`
4. Copy code dưới vào:

```typescript
import { useState } from 'react'
import { useCreateCategory, useUpdateCategory } from '../hooks'
import { Category } from '../types'

interface CategoryFormProps {
  category?: Category | null
  onClose: () => void
}

export default function CategoryForm({ category, onClose }: CategoryFormProps) {
  const [formData, setFormData] = useState({
    name: category?.name || '',
    parentId: category?.parentId || undefined
  })
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const createMutation = useCreateCategory()
  const updateMutation = useUpdateCategory()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!formData.name.trim()) {
      setError('Category name is required')
      return
    }

    setIsLoading(true)

    try {
      if (category) {
        await updateMutation.mutateAsync({
          id: category.id,
          payload: { name: formData.name, parentId: formData.parentId }
        })
      } else {
        await createMutation.mutateAsync(formData)
      }
      onClose()
    } catch (err: any) {
      setError(err.response?.data?.message || 'Something went wrong')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded shadow-lg max-w-md w-full">
        <h2 className="text-xl font-bold mb-4">
          {category ? 'Edit Category' : 'Add New Category'}
        </h2>

        {error && <div className="bg-red-100 text-red-600 p-3 rounded mb-4">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Category Name</label>
            <input
              type="text"
              placeholder="Enter category name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex gap-2">
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded disabled:bg-gray-400"
            >
              {isLoading ? 'Saving...' : category ? 'Update' : 'Create'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-300 hover:bg-gray-400 text-black px-4 py-2 rounded"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
```

---

### File 3: `src/features/Categories/components/CategoryTree.tsx`

**Cách tạo:**
1. Click chuột phải vào folder `components`
2. Chọn "New File"
3. Đặt tên: `CategoryTree.tsx`
4. Copy code dưới vào:

```typescript
import { useDeleteCategory } from '../hooks'
import { Category } from '../types'

interface CategoryTreeProps {
  categories: Category[]
  onEdit: (category: Category) => void
}

export default function CategoryTree({ categories, onEdit }: CategoryTreeProps) {
  const deleteMutation = useDeleteCategory()

  const handleDelete = (id: number, name: string) => {
    if (window.confirm(`Delete category "${name}"? This action cannot be undone.`)) {
      deleteMutation.mutate(id)
    }
  }

  const renderCategory = (category: Category, depth = 0) => {
    const paddingLeft = depth * 20

    return (
      <div key={category.id} style={{ paddingLeft: `${paddingLeft}px` }} className="border-l-2 border-gray-200">
        <div className="flex justify-between items-center py-3 px-3 hover:bg-gray-50 rounded">
          <div className="flex items-center gap-2 flex-1">
            <span className="font-medium">{category.name}</span>
            <span className="text-xs bg-gray-200 px-2 py-1 rounded">#{category.id}</span>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => onEdit(category)}
              className="text-blue-500 hover:text-blue-700 hover:underline text-sm font-medium"
            >
              Edit
            </button>
            <button
              onClick={() => handleDelete(category.id, category.name)}
              className="text-red-500 hover:text-red-700 hover:underline text-sm font-medium"
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? 'Deleting...' : 'Delete'}
            </button>
          </div>
        </div>

        {category.children && category.children.length > 0 && (
          <div>
            {category.children.map((child) => renderCategory(child, depth + 1))}
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="space-y-1">
      {categories
        .filter((cat) => !cat.parentId)
        .map((cat) => renderCategory(cat))}
    </div>
  )
}
```

---

### File 4: `src/features/Categories/components/index.ts`

**Cách tạo:**
1. Click chuột phải vào folder `components`
2. Chọn "New File"
3. Đặt tên: `index.ts`
4. Copy code dưới vào:

```typescript
export { default as CategoriesList } from './CategoriesList'
export { default as CategoryForm } from './CategoryForm'
export { default as CategoryTree } from './CategoryTree'
```

---

##  STEP 6: Tạo Feature Index & Page

### File: `src/features/Categories/index.ts`

**Cách tạo:**
1. Click chuột phải vào folder `Categories`
2. Chọn "New File"
3. Đặt tên: `index.ts`
4. Copy code dưới vào:

```typescript
export * from './hooks'
export * from './services'
export * from './types'
export { CategoriesList } from './components'
```

---

### File: `src/pages/categories/index.ts`

**Cách tạo:**
1. Click chuột phải vào folder `pages`
2. Chọn "New Folder", đặt tên: `categories`
3. Click chuột phải vào `categories`
4. Chọn "New File"
5. Đặt tên: `index.ts`
6. Copy code dưới vào:

```typescript
import { CategoriesList } from '@/features/Categories'

export default function CategoriesPage() {
  return <CategoriesList />
}
```

---

##  STEP 7: Add Route

### Edit: `src/routes/AppRoutes.tsx`

**Tìm dòng import đầu tiên:**
```typescript
import Login from "@/pages/auth/Login"
import Dashboard from "@/pages/dashboard/Dashboard"
```

**Thêm dòng này sau Dashboard:**
```typescript
import CategoriesPage from "@/pages/categories"
```

---

**Tìm phần route:**
```typescript
<Route index element={<Dashboard />} />

{/* future pages */}
```

**Thêm dòng này sau line `<Route index element={<Dashboard />} />`:**
```typescript
<Route path="categories" element={<CategoriesPage />} />
```

**Kết quả cuối cùng:**
```typescript
<Route index element={<Dashboard />} />
<Route path="categories" element={<CategoriesPage />} />

{/* future pages */}
```

---

## 🎉 Done!

Bây giờ vào: `http://localhost:5173/categories`

Bạn sẽ thấy Categories feature! 🚀
