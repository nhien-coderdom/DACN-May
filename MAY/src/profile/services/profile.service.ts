import axios from 'axios'
import type { User } from '../../contexts/AuthContext'

const API_URL = import.meta.env.VITE_API_URL

export const getProfile = async (token: string): Promise<User> => {
  const response = await axios.get(`${API_URL}/auth/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
  return response.data
}

export const updateProfile = async (token: string, data: { name?: string; phone?: string; address?: string }): Promise<User> => {
  const response = await axios.patch(`${API_URL}/auth/profile`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
  return response.data
}
