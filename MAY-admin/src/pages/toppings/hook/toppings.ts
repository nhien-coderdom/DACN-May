import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import * as Toppings from '../services'
import type { Topping, CreateToppingDTO,UpdateToppingDTO  } from '../types/toppings.types'

// get all
export const useToppings = () => {
   return useQuery<Topping[]>({
    queryKey: ['toppings'],
    queryFn: Toppings.getToppings,
   })
}

// get by id
export const useTopping = (id: number) => {
  return useQuery<Topping>({
    queryKey: ['topping', id],
    queryFn: () => Toppings.getToppingById(id),
    enabled: !!id,
  })
}


// create 
export const useCreateTopping = () => {
    const queryClient = useQueryClient()

    return useMutation ({
        mutationFn: (data: CreateToppingDTO) => Toppings.createTopping(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['toppings'] })
        }
    })
}

// delete
export const useDeleteTopping = () => {
    const queryClient = useQueryClient()

    return useMutation ({
        mutationFn: (id : number) => Toppings.deleteTopping(id),
        onSuccess:() => {
            queryClient.invalidateQueries({ queryKey: ['toppings'] })
        },
        onError: (error: any) => {
            const message = error.response?.data?.message || error.message || 'Failed to delete category'
            alert(message)
        }
    })
}

// update
export const useUpdateTopping = (id: number) => {
    const queryClient = useQueryClient()   
    return useMutation ({
        mutationFn: (data: UpdateToppingDTO) => Toppings.updateTopping(id, data),
        onSuccess: () => {
            // reload list
            queryClient.invalidateQueries({ queryKey: ['toppings'] })
            // reload detail
            queryClient.invalidateQueries({ queryKey: ['topping', id] })   

        },
        onError: (error: any) => {
            const message = error.response?.data?.message || error.message || 'Failed to update category'
            alert(message)
        }
    })  
}