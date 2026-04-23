import { useState, useMemo } from 'react'
// call hooks
import { useCategories, useDeleteCategory, useCreateCategory, useUpdateCategory, useToggleActiveCategory } from '../hook' 
import { CategoryForm } from './CategoryForm'
import type { Category, CreateCategoryDTO, UpdateCategoryDTO } from '../types'

export const CategoriesList = () => {
  const { data, isLoading } = useCategories()
  const { mutate: deleteCategory } = useDeleteCategory()
  const { mutate: createCategory } = useCreateCategory()
  const { mutate: toggleActive } = useToggleActiveCategory()

  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<Category | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const updateMutation = useUpdateCategory(editing?.id ?? 0)
  const { mutate: updateCategory } = updateMutation

  // Memoized filtered data
  const filteredData = useMemo(() => {
    if (!data) return []
    
    const searchLower = searchTerm.toLowerCase()
    
    return data.filter(cat => {
      // Search in name or slug
      return (
        cat.name.toLowerCase().includes(searchLower) ||
        cat.slug.toLowerCase().includes(searchLower)
      )
    })
  }, [data, searchTerm])

  if (isLoading) return <p>Đang tải...</p>

  const handleDelete = (id: number) => {
    if (confirm('Xóa danh mục này?')) {
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
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Danh mục</h1>
        <button
          onClick={handleCreate}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          + Thêm danh mục
        </button>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Tìm kiếm theo tên hoặc slug..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {searchTerm && (
          <p className="text-sm text-gray-600 mt-2">
            Tìm thấy {filteredData.length} kết quả cho "{searchTerm}"
          </p>
        )}
      </div>

      {/* Table */}
      <div className="overflow-x-auto border rounded-lg">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-100 border-b">
              <th className="px-6 py-3 text-left text-sm font-semibold">#</th>
              <th className="px-6 py-3 text-left text-sm font-semibold">Tên</th>
              <th className="px-6 py-3 text-left text-sm font-semibold">Slug</th>
              <th className="px-6 py-3 text-center text-sm font-semibold">Hành Động</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                  {searchTerm ? `No categories found matching "${searchTerm}"` : 'No categories yet'}
                </td>
              </tr>
            ) : (
              filteredData.map((cat, index) => (
                <tr key={cat.id} className="border-b hover:bg-gray-50 transition">
                  <td className="px-6 py-4 text-sm text-gray-700">{index + 1}</td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{cat.name}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{cat.slug}</td>
                  <td className="px-6 py-4 text-sm text-center">
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                      cat.isActive 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {cat.isActive ? '📺 Đang bán' : '🚫 Đã ẩn'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm flex gap-2 justify-center flex-wrap">
                    <button
                      onClick={() => toggleActive(cat.id)}
                      className={`text-white px-3 py-1 rounded text-xs ${
                        cat.isActive 
                          ? 'bg-orange-500 hover:bg-orange-600' 
                          : 'bg-green-500 hover:bg-green-600'
                      }`}
                    >
                      {cat.isActive ? '🔓 Ẩn' : '🔓 Hiện'}
                    </button>
                    <button
                      onClick={() => handleEdit(cat)}
                      className="bg-blue-500 text-white px-3 py-1 rounded text-xs hover:bg-blue-600"
                    >
                      Chỉnh sửa
                    </button>
                    <button
                      onClick={() => handleDelete(cat.id)}
                      className="bg-red-500 text-white px-3 py-1 rounded text-xs hover:bg-red-600"
                    >
                      Xóa
                    </button>
                  </td>
                </tr>
              ))
            )}
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