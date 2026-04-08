import { useState, useEffect } from 'react'
import { useProductCategories } from '../hook'
import type { Product, CreateProductDTO, UpdateProductDTO } from '../types'
import CloudinaryUpload from './CloudinaryUpload'

interface ProductFormProps {
  initialData?: Product | null
  onSubmit: (data: CreateProductDTO | UpdateProductDTO) => void
  onClose: () => void
}

export const ProductForm = ({ initialData, onSubmit, onClose }: ProductFormProps) => {
  // 🎣 FETCH CATEGORIES
  const { data: categories, isLoading: isCategoriesLoading } = useProductCategories()

  // 1️⃣ STATE LƯU FORM DATA
  const [formData, setFormData] = useState<CreateProductDTO>({
    name: '',
    price: 0,
    description: '',
    categoryId: 0,
    imageUrl: '',
  })

  // 2️⃣ EFFECT: KHI initialData THAY ĐỔI → CẬP NHẬT FORM
  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name,
        price: initialData.price,
        description: initialData.description || '',
        categoryId: initialData.categoryId,
        imageUrl: initialData.imageUrl || '',
      })
    } else {
      // Nếu categories được load và có dữ liệu, set categoryId thành category đầu tiên
      // Nếu không, đợi categories load xong
      setFormData({
        name: '',
        price: 0,
        description: '',
        categoryId: categories && categories.length > 0 ? categories[0].id : 0,
        imageUrl: '',
      })
    }
  }, [initialData])

  // 2️⃣ UPDATE categoryId khi categories được load (chỉ khi tạo mới)
  useEffect(() => {
    if (!initialData && categories && categories.length > 0 && formData.categoryId === 0) {
      setFormData(prev => ({
        ...prev,
        categoryId: categories[0].id,
      }))
    }
  }, [categories, initialData])

  // 3️⃣ XỬ LÝ THAY ĐỔI INPUT
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    
    if (name === 'categoryId' || name === 'price') {
      const numValue = value ? parseFloat(value) : 0
      setFormData(prev => ({
        ...prev,
        [name]: numValue,
      }))
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value,
      }))
    }
  }

  // 4️⃣ XỬ LÝ SUBMIT FORM
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  return (
    <form onSubmit={handleSubmit}>
      {/* =================== TIÊU ĐỀ =================== */}
      <h2 className="text-xl font-bold mb-4">
        {initialData ? 'Edit Product' : 'Add Product'}
      </h2>

      {/* =================== FIELD: NAME =================== */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">
          Name <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="ex: Iced Coffee"
        />
      </div>

      {/* =================== FIELD: PRICE =================== */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">
          Price <span className="text-red-500">*</span>
        </label>
        <input
          type="number"
          name="price"
          value={formData.price}
          onChange={handleChange}
          required
          step="0.01"
          min="0"
          className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="0.00"
        />
      </div>

      {/* =================== FIELD: CATEGORY ID =================== */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">
          Category <span className="text-red-500">*</span>
        </label>
        
        {isCategoriesLoading ? (
          <div className="w-full px-3 py-2 border rounded bg-gray-100 text-gray-500">
            Loading categories...
          </div>
        ) : !categories || categories.length === 0 ? (
          <div className="w-full px-3 py-2 border rounded bg-red-50 text-red-500">
            No categories available
          </div>
        ) : (
          <select
            name="categoryId"
            value={formData.categoryId}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
          >
            <option value="">-- Select Category --</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.id} - {cat.name}
              </option>
            ))}
          </select>
        )}
      </div>

      {/* =================== FIELD: DESCRIPTION =================== */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">Description</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Product description..."
          rows={3}
        />
      </div>

      {/* =================== FIELD: IMAGE URL =================== */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">Image URL</label>
        <CloudinaryUpload 
          onUpload={(url) => setFormData(prev => ({ ...prev, imageUrl: url }))}
      />

      {formData.imageUrl && (
        <div>
          <img 
            src={formData.imageUrl}
            className="mt-4 h-40 w-full object-cover rounded border"
          />
        </div>
      )}
      </div>

      {/* =================== BUTTONS =================== */}
      <div className="flex gap-3 justify-end">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400 transition"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isCategoriesLoading || !formData.categoryId || formData.categoryId === 0}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {initialData ? 'Update' : 'Create'}
        </button>
      </div>
    </form>
  )
}
