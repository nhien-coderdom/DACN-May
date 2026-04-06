export interface Product {
  id: number
  name: string
  price: number
  description?: string
  categoryId: number
  imageUrl?: string
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
