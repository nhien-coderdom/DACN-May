import { useState } from 'react'
// call hooks
import { useCategories, useDeleteCategory, useCreateCategory, useUpdateCategory } from '../hook' 
import { CategoryForm } from './CategoryForm'
import type { Category, CreateCategoryDTO, UpdateCategoryDTO } from '../types'

export const CategoriesList = () => {
  const { data, isLoading } = useCategories()
  const { mutate: deleteCategory } = useDeleteCategory()
  const { mutate: createCategory } = useCreateCategory()

  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<Category | null>(null)
  const updateMutation = useUpdateCategory(editing?.id ?? 0)
  const { mutate: updateCategory } = updateMutation

  if (isLoading) return <p>Loading...</p>

  const handleDelete = (id: number) => {
    if (confirm('Delete this category?')) {
      deleteCategory(id)
    }
  }

  const handleEdit = (cat: Category) => {
    setEditing(cat)
    setOpen(true)
  }

  const handleCreate = () => {
    setEditing(null)
    setOpen(true)
  }

  const handleSubmit = (data: CreateCategoryDTO | UpdateCategoryDTO) => {
    if (editing) {
      updateCategory(data as UpdateCategoryDTO)
    } else {
      createCategory(data as CreateCategoryDTO)
    }
    setOpen(false)
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between mb-6">
        <h1 className="text-2xl font-bold">Categories</h1>
        <button
          onClick={handleCreate}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          + Add Category
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto border rounded-lg">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-100 border-b">
              <th className="px-6 py-3 text-left text-sm font-semibold">#</th>
              <th className="px-6 py-3 text-left text-sm font-semibold">Name</th>
              <th className="px-6 py-3 text-left text-sm font-semibold">Slug</th>
              <th className="px-6 py-3 text-center text-sm font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {data?.map((cat, index) => (
              <tr key={cat.id} className="border-b hover:bg-gray-50 transition">
                <td className="px-6 py-4 text-sm text-gray-700">{index + 1}</td>
                <td className="px-6 py-4 text-sm font-medium text-gray-900">{cat.name}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{cat.slug}</td>
                <td className="px-6 py-4 text-sm flex gap-2 justify-center">
                  <button
                    onClick={() => handleEdit(cat)}
                    className="bg-blue-500 text-white px-3 py-1 rounded text-xs hover:bg-blue-600"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(cat.id)}
                    className="bg-red-500 text-white px-3 py-1 rounded text-xs hover:bg-red-600"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {open && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center">
          <div className="bg-white p-6 rounded w-96">
            <CategoryForm
              initialData={editing}
              onSubmit={handleSubmit}
              onClose={() => setOpen(false)}
            />
          </div>
        </div>
      )}
    </div>
  )
}