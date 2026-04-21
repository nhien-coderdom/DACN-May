import { useState, useMemo } from 'react'
import { useToppings, useDeleteTopping, useCreateTopping, useUpdateTopping } from '../hook'
import { ToppingForm } from './ToppingForm'
import type { Topping, CreateToppingDTO, UpdateToppingDTO } from '../types'

export const ToppingsList = () => {
  //  FETCH DỮ LIỆU TOPPINGS
  const { data, isLoading } = useToppings()
  const { mutate: deleteTopping } = useDeleteTopping()
  const { mutate: createTopping } = useCreateTopping()

  //  STATE QUẢN LÝ MODAL & FORM
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<Topping | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  
  // SETUP UPDATE MUTATION
  // Nếu đang edit, lấy id từ topping đang sửa, nếu không thì 0
  const updateMutation = useUpdateTopping(editing?.id ?? 0)
  const { mutate: updateTopping } = updateMutation

  // Memoized filtered data - Search by name
  const filteredData = useMemo(() => {
    if (!data) return []
    
    const searchLower = searchTerm.toLowerCase()
    
    return data.filter(topping => {
      // Search in name
      return topping.name.toLowerCase().includes(searchLower)
    })
  }, [data, searchTerm])

  //  XỬ LÝ LOADING STATE
  if (isLoading) return <p>Đang tải...</p>

  //  HÀM DELETE - Xóa topping
  const handleDelete = (id: number) => {
    if (confirm('Xóa topping này?')) {
      deleteTopping(id)
    }
  }

  //  HÀM EDIT - Mở modal để edit
  const handleEdit = (topping: Topping) => {
    setEditing(topping)
    setOpen(true)
  }

  //  HÀM CREATE - Mở modal để tạo mới (reset form)
  const handleCreate = () => {
    setEditing(null)
    setOpen(true)
  }

  //  HÀM SUBMIT - Xử lý submit form (create hoặc update)
  const handleSubmit = (data: CreateToppingDTO | UpdateToppingDTO) => {
    if (editing) {
      // Nếu đang edit → gọi update
      updateTopping(data as UpdateToppingDTO)
    } else {
      // Nếu tạo mới → gọi create
      createTopping(data as CreateToppingDTO)
    }
    // Đóng modal sau khi submit
    setOpen(false)
  }

  return (
    <div className="p-6">
      {/* =================== HEADER =================== */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Topping</h1>
        <button
          onClick={handleCreate}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          + Thêm Topping
        </button>
      </div>

      {/* =================== SEARCH BAR =================== */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Tìm kiếm theo tên..."
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

      {/* =================== BẢNG TOPPINGS =================== */}
      <div className="overflow-x-auto border rounded-lg">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-100 border-b">
              <th className="px-6 py-3 text-left text-sm font-semibold">#</th>
              <th className="px-6 py-3 text-left text-sm font-semibold">Tên</th>
              <th className="px-6 py-3 text-left text-sm font-semibold">Giá</th>
              <th className="px-6 py-3 text-center text-sm font-semibold">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {/* Render mỗi topping từ filteredData array */}
            {filteredData.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                  {searchTerm ? `Không tìm thấy topping nào phù hợp với "${searchTerm}"` : 'Chưa có topping nào'}
                </td>
              </tr>
            ) : (
              filteredData.map((topping, index) => (
                <tr key={topping.id} className="border-b hover:bg-gray-50 transition">
                  {/* Cột #: index (bắt đầu từ 1) */}
                  <td className="px-6 py-4 text-sm text-gray-700">{index + 1}</td>
                  
                  {/* Cột Name: tên topping */}
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{topping.name}</td>
                  
                  {/* Cột Price: giá */}
                  <td className="px-6 py-4 text-sm text-gray-600">${topping.price}</td>
                  
                  {/* Cột Actions: 2 nút Edit và Delete */}
                  <td className="px-6 py-4 text-sm flex gap-2 justify-center">
                    {/* Nút Edit */}
                    <button
                      onClick={() => handleEdit(topping)}
                      className="bg-blue-500 text-white px-3 py-1 rounded text-xs hover:bg-blue-600"
                    >
                      Chỉnh sửa
                    </button>
                    
                    {/* Nút Delete */}
                    <button
                      onClick={() => handleDelete(topping.id)}
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

      {/* =================== MODAL (CREATE/EDIT) =================== */}
      {open && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center">
          <div className="bg-white p-6 rounded w-96">
            <ToppingForm
              initialData={editing}  // Nếu null = create, nếu có data = edit
              onSubmit={handleSubmit}  // Callback khi submit form
              onClose={() => setOpen(false)}  // Callback khi đóng modal
            />
          </div>
        </div>
      )}
    </div>
  )
}
