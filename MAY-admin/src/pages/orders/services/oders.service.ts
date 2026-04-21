import axiosClient from '@/utils/axios'

import type { AdminOrder } from '../types/orders.types'



export const getOrders = async (): Promise<AdminOrder[]> => {
  const response = await axiosClient.get<AdminOrder[]>('/orders')
  return response.data
}

export const getOrderById = async (id: number): Promise<AdminOrder> => {
  const res = await axiosClient.get(`/orders/${id}`)
  return res.data
}