import axiosClient from '@/utils/axios'
import type {   Topping, CreateToppingDTO,UpdateToppingDTO } from '../types'

// get
export const getToppings = async (): Promise<Topping[]> => {
    const response = await axiosClient.get<Topping[]>('/toppings')
    return response.data
}

// get by id
export const getToppingById = async (id: number): Promise<Topping> => {
  const res = await axiosClient.get(`/toppings/${id}`)
  return res.data
}

// create
export const createTopping = async (data: CreateToppingDTO): Promise<Topping> => {
    const response = await axiosClient.post<Topping>('/toppings', data)
    return response.data
}

// update
export const updateTopping = async (id: number, data: UpdateToppingDTO): Promise<Topping> => {
    const response = await axiosClient.patch<Topping>(`/toppings/${id}`, data)
    return response.data
}   

// delete
export const deleteTopping = async (id: number): Promise<void> => {
    await axiosClient.delete(`/toppings/${id}`)
}