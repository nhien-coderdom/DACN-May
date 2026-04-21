import axios from 'axios'
import type { User } from '../../contexts/AuthContext'

const API_URL = import.meta.env.VITE_API_URL

export const getProfile = async (token: string): Promise<User> => {
  if (!token) {
    throw new Error('No authentication token available');
  }
  
  try {
    const response = await axios.get(`${API_URL}/auth/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    console.log('✅ Profile fetched:', response.data);
    return response.data
  } catch (error: any) {
    console.error('❌ Fetch profile error:', {
      status: error.response?.status,
      message: error.response?.data?.message || error.message,
      data: error.response?.data,
    });
    throw error;
  }
}

export const updateProfile = async (token: string, data: { name?: string; phone?: string; address?: string }): Promise<User> => {
  if (!token) {
    throw new Error('No authentication token available');
  }

  try {
    console.log('📝 Sending profile update:', data);
    const response = await axios.patch(`${API_URL}/auth/profile`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })
    console.log('✅ Profile updated successfully:', response.data);
    return response.data
  } catch (error: any) {
    console.error('❌ Update profile error:', {
      status: error.response?.status,
      message: error.response?.data?.message || error.message,
      data: error.response?.data,
      requestData: data,
    });
    throw error;
  }
}
