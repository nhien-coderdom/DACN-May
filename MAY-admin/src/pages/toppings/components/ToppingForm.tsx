import { useState, useEffect } from 'react'
import type { Topping, CreateToppingDTO, UpdateToppingDTO } from '../types'

interface ToppingFormProps {
  initialData?: Topping | null       // Dữ liệu cũ (nếu edit)
  onSubmit: (data: CreateToppingDTO | UpdateToppingDTO) => void  // Callback submit
  onClose: () => void                // Callback đóng modal
}

export const ToppingForm = ({ initialData, onSubmit, onClose }: ToppingFormProps) => {
  //  STATE LƯU FORM DATA
  const [formData, setFormData] = useState<CreateToppingDTO>({
    name: '',
    price: 0,
  })

  //  EFFECT: KHI initialData THAY ĐỔI → CẬP NHẬT FORM
  // Nếu bạn nhấn "Edit topping X" → initialData sẽ cập nhật → useEffect sẽ điền form
  useEffect(() => {
    if (initialData) {
      // Mode EDIT: Điền sẵn dữ liệu cũ vào form
      setFormData({
        name: initialData.name,
        price: initialData.price,
      })
    } else {
      // Mode CREATE: Reset form trống
      setFormData({
        name: '',
        price: 0,
      })
    }
  }, [initialData])

  //  XỬ LÝ THAY ĐỔI INPUT
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      // Nếu là field "price" → convert sang number, còn lại → keep string
      [name]: name === 'price' ? parseFloat(value) : value,
    }))
  }

  //  XỬ LÝ SUBMIT FORM
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()  // Ngăn reload trang
    onSubmit(formData)  // Gọi callback submit từ parent (ToppingsList)
  }

  return (
    <form onSubmit={handleSubmit}>
      {/* =================== TIÊU ĐỀ =================== */}
      <h2 className="text-xl font-bold mb-4">
        {initialData ? 'Edit Topping' : 'Add Topping'}
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
          placeholder="ex: Extra milk, Brown sugar, ..."
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

      {/* =================== BUTTONS: CANCEL & SUBMIT =================== */}
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
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
        >
          {initialData ? 'Update' : 'Create'}
        </button>
      </div>
    </form>
  )
}
