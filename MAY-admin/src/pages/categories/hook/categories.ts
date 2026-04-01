import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import * as categoryService from '../services'
import type { Category, CreateCategoryDTO, UpdateCategoryDTO } from '../types/category.types'

// get all
export const useCategories = () => {
   return useQuery<Category[]>({
    queryKey: ['categories'],
    queryFn: categoryService.getCategories,
   })
}

// get by id
export const useCategory = (id: number) => {
  return useQuery<Category>({
    queryKey: ['category', id], 
    queryFn: () => categoryService.getCategoryById(id),
    enabled: !!id,
  })
}   

// create
export const useCreateCategory = () => {
    const queryClient = useQueryClient()

    return useMutation ({
        mutationFn: (data: CreateCategoryDTO) => categoryService.createCategory(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['categories'] })
        }
    })
}


// update
export const useUpdateCategory = (id: number) => {
    const queryClient = useQueryClient()

    return useMutation ({
      mutationFn: (data: UpdateCategoryDTO) => categoryService.updateCategory(id, data),
      onSuccess: () => {
        // reload list
        queryClient.invalidateQueries({ queryKey: ['categories'] })
        // reload detail
        queryClient.invalidateQueries({ queryKey: ['category', id] })   
      },
      onError: (error: any) => {
        const message = error.response?.data?.message || error.message || 'Failed to update category'
        alert(message)
      }
    })
}

export const useDeleteCategory = () => {
    const queryClient = useQueryClient()
    return useMutation ({
        mutationFn: (id: number) => categoryService.deleteCategory(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['categories'] })
        },
        onError: (error: any) => {
            const message = error.response?.data?.message || error.message || 'Failed to delete category'
            alert(message)
        }
    })
}