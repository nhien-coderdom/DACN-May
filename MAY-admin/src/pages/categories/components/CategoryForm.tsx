import React, { useState, useEffect } from 'react'
import type { Category, CreateCategoryDTO, UpdateCategoryDTO } from '../types/category.types'

interface CategoryFormProps {
  initialData: Category | null
  onSubmit: (data: CreateCategoryDTO | UpdateCategoryDTO) => void
  onClose: () => void
}

export const CategoryForm: React.FC<CategoryFormProps> = ({ initialData, onSubmit, onClose }) => {
  const [formData, setFormData] = useState<{ name: string; slug: string; parentId?: number | null }>({
    name: '',
    slug: '',
    parentId: null,
  })

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name,
        slug: initialData.slug,
        parentId: initialData.parentId || null,
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
    onSubmit(formData)
    setFormData({ name: '', slug: '', parentId: null })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-xl font-bold mb-4">
        {initialData ? 'Edit Category' : 'Create New Category'}
      </h2>

      <div>
        <label className="block text-sm font-medium mb-1">Category Name</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Enter category name"
          className="w-full border rounded px-3 py-2"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Slug</label>
        <input
          type="text"
          name="slug"
          value={formData.slug}
          onChange={handleChange}
          placeholder="Enter slug"
          className="w-full border rounded px-3 py-2"
          required
        />
      </div>

      <div className="flex gap-2 justify-end">
        <button
          type="button"
          onClick={onClose}
          className="bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-400"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        >
          {initialData ? 'Update' : 'Create'}
        </button>
      </div>
    </form>
  )
}
