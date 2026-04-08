import { useMutation } from '@tanstack/react-query'
import * as authService from '../services/auth.service'
import type { RegisterDTO, RegisterResponse } from '../types'

export const useRegister = () => {
  return useMutation({
    mutationFn: (data: RegisterDTO) => authService.register(data),

    // Thành công -> user đã được tạo, redirect sẽ được xử lý ở page component
    onSuccess: (data: RegisterResponse) => {
      console.log('Đăng ký thành công:', data.email)
    },

    // Lỗi sẽ được xử lý ở page component thông qua onError callback
  })
}