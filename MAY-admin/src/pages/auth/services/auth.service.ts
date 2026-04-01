import axiosClient from '@/utils/axios'
import type { LoginDTO, LoginResponse } from '../types'

export const login = async (data: LoginDTO): Promise<LoginResponse> => {
  const response = await axiosClient.post<LoginResponse>('/auth/login', data)
  return response.data
}
