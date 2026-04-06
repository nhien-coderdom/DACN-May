import { useQuery } from '@tanstack/react-query'
import axiosClient from '@/utils/axios'

export interface Category {
  id: number
  name: string
  slug: string
}

// get all categories for dropdown
export const useProductCategories = () => {
  return useQuery<Category[]>({
    queryKey: ['product-categories'],
    queryFn: async () => {
      const response = await axiosClient.get<Category[]>('/categories')
      return response.data
    },
  })
}
