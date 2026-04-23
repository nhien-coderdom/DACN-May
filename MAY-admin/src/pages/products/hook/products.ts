import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import * as productService from '../services'
import type { Product, CreateProductDTO, UpdateProductDTO } from '../types'

// get all
export const useProducts = () => {
  return useQuery<Product[]>({
    queryKey: ['products'],
    queryFn: productService.getProducts,
  })
}

// get by id
export const useProduct = (id: number) => {
  return useQuery<Product>({
    queryKey: ['product', id],
    queryFn: () => productService.getProductById(id),
    enabled: !!id,
  })
}

// create
export const useCreateProduct = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateProductDTO) => productService.createProduct(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] })
    },
  })
}

// update
export const useUpdateProduct = (id: number) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: UpdateProductDTO) => productService.updateProduct(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] })
      queryClient.invalidateQueries({ queryKey: ['product', id] })
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || error.message || 'Failed to update product'
      alert(message)
    },
  })
}

// delete
export const useDeleteProduct = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number) => productService.deleteProduct(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] })
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || error.message || 'Failed to delete product'
      alert(message)
    },
  })
}

// toggle active
export const useToggleActiveProduct = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number) => productService.toggleActiveProduct(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] })
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || error.message || 'Failed to toggle product status'
      alert(message)
    },
  })
}
