export interface Product {
  id: number
  name: string
  price: number
  description?: string
  categoryId: number
  imageUrl?: string
  isActive: boolean
  isDeleted: boolean
  createdAt: string
  updatedAt: string
}

export interface CreateProductDTO {
  name: string
  price: number
  description?: string
  categoryId: number
  imageUrl?: string
}

export interface UpdateProductDTO {
  name?: string
  price?: number
  description?: string
  categoryId?: number
  imageUrl?: string
}
