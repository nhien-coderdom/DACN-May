import axios from 'axios'
import type { RegisterDTO, RegisterResponse, AuthResponse, User } from '../types'
import { data } from 'react-router-dom'


const API_URL = import.meta.env.VITE_API_URL 

// register - post
export const register = async (data: RegisterDTO): Promise<RegisterResponse> => {
    const response = await axios.post(`${API_URL}/auth/register`, data)
    return response.data
}

// login - post
export const login = async (email: string, password: string): Promise<AuthResponse> => {
    const response = await axios.post(`${API_URL}/auth/login`, { email, password })
    return response.data
}