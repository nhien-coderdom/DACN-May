import { useMutation } from '@tanstack/react-query'
import * as authService from '../services/index.js'
import { useAuthStore } from '../stores'
import type { LoginDTO, LoginResponse } from '../types/index.js'

export const useLogin = () => {
  const { login } = useAuthStore()

  return useMutation<LoginResponse, Error, LoginDTO>({
    mutationFn: (data: LoginDTO) => authService.login(data),
    onSuccess: (response: LoginResponse) => {
      const { user, access_token } = response
      // Save token to localStorage
      localStorage.setItem('token', access_token)
      // Update auth store
      login(user, access_token)
    },
    onError: (error: Error) => {
      const message = error.message || 'Login failed'
      alert(message)
    },
  })
}
