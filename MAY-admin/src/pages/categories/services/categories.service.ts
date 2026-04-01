//file chứa hàm gọi API backend để quản lý categories
import axiosClient from '@/utils/axios'
import type { Category, CreateCategoryDTO, UpdateCategoryDTO } from '../types'

// ui (FE - may-admin) - service (Axios) - api (BE) -> prisma -> database

// get
export const getCategories = async (): Promise<Category[]> => {
    const response = await axiosClient.get<Category[]>('/categories')
    return response.data
}

// get by id
export const getCategoryById = async (id: number): Promise<Category> => {
  const res = await axiosClient.get(`/categories/${id}`)
  return res.data
}

// create
export const createCategory = async (data: CreateCategoryDTO): Promise<Category> => {
    const response = await axiosClient.post<Category>('/categories', data)
    return response.data
}

// update
export const updateCategory = async (id: number, data: UpdateCategoryDTO): Promise<Category> => {
    const response = await axiosClient.patch<Category>(`/categories/${id}`, data)
    return response.data
}

// delete
export const deleteCategory = async (id: number): Promise<void> => {
    await axiosClient.delete(`/categories/${id}`)
}