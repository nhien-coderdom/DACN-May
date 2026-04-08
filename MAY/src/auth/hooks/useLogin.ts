import { useMutation } from '@tanstack/react-query'
import * as authService from '../services/auth.service'
import type { AuthResponse } from '../types'

export const useLogin = () => {
  return useMutation({
    mutationFn: async (data: { email: string; password: string }) => {
      const response = await authService.login(data.email, data.password);
      return response as AuthResponse;
    },

    onSuccess: (data: AuthResponse) => {
      // Save tokens to localStorage
      localStorage.setItem('access_token', data.access_token);
      localStorage.setItem('refresh_token', data.refresh_token);
    },

    onError: (error: any) => {
      console.error('Login error:', error);
    },
  });
};
