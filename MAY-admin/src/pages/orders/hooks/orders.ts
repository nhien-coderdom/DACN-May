import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import * as OderService from '../services'
import type { AdminOrder, OrderLog } from '../types/orders.types'


// get all
export const useOrders = () => {
  return useQuery<AdminOrder[]>({
    queryKey: ['orders'],
    queryFn: OderService.getOrders,
  })
}

// get by id
export const useOrder = (id: number) => {
  return useQuery<AdminOrder>({
    queryKey: ['order', id],
    queryFn: () => OderService.getOrderById(id),
    enabled: !!id,
  })
}