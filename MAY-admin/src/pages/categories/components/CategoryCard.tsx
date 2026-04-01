import React from 'react'
import type { Category } from '../types/category.types'

interface CategoryCardProps {
  category: Category
  onEdit: () => void
  onDelete: () => void
}

export const CategoryCard: React.FC<CategoryCardProps> = ({ category, onEdit, onDelete }) => {
  return (
    <div className="border rounded p-4 flex justify-between items-center hover:shadow-lg transition">
      <div>
        <h3 className="font-semibold text-lg">{category.name}</h3>
        <p className="text-gray-600 text-sm">Slug: {category.slug}</p>
      </div>
      <div className="flex gap-2">
        <button
          onClick={onEdit}
          className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600"
        >
          Sửa
        </button>
        <button
          onClick={onDelete}
          className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600"
        >
          Xóa
        </button>
      </div>
    </div>
  )
}
