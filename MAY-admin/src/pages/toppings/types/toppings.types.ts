export interface Topping {
  id: number
  name: string
  price: number
  isActive: boolean
}

export interface CreateToppingDTO {
  name: string
  price: number
}

export interface UpdateToppingDTO {
  name?: string
  price?: number
}

export interface ReorderToppingDTO {
  id: number
  order: number
}