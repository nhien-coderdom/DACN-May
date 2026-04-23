import axiosClient from '@/utils/axios'
import type { User, CreateUserDTO, UpdateUserDTO, UpdateUserRoleDTO } from '../types'

//get all active users
export const getUsers = async (): Promise<User[]> => {
  const response = await axiosClient.get<User[]>('/users')
  return response.data
}

// get by id
export const getUserById = async (id: number): Promise<User> => {
  const res = await axiosClient.get(`/users/${id}`)
  return res.data
}

// create
export const createUser = async (data: CreateUserDTO): Promise<User> => {
  const response = await axiosClient.post<User>('/users', data)
  return response.data
}

// update
export const updateUser = async (id: number, data: UpdateUserDTO): Promise<User> => {
  const response = await axiosClient.patch<User>(`/users/${id}`, data)
  return response.data
}

// delete
export const deleteUser = async (id: number): Promise<void> => {
  await axiosClient.delete(`/users/${id}`)
}

// update role
export const updateUserRole = async (id: number, data: UpdateUserRoleDTO): Promise<User> => {
  const response = await axiosClient.patch<User>(`/users/${id}/role`, data)
  return response.data
}

// deactivate account
export const deactivateUser = async (id: number): Promise<User> => {
  const response = await axiosClient.patch<User>(`/users/${id}/deactivate`)
  return response.data
}

// activate account
export const activateUser = async (id: number): Promise<User> => {
  const response = await axiosClient.patch<User>(`/users/${id}/activate`)
  return response.data
}