export interface Category {
  id: number
  name: string
  slug: string
  order: number

  parentId?: number | null

  createdAt: string
  updatedAt: string
  deletedAt?: string | null

  children?: Category[]
}

// CREATE
export interface CreateCategoryDTO {
  name: string
  slug: string
  parentId?: number | null
  order?: number
}

// UPDATE
export interface UpdateCategoryDTO {
  name?: string
  slug?: string
  parentId?: number | null
  order?: number
}

// REORDER
export interface ReorderCategoryDTO {
  id: number
  order: number
}