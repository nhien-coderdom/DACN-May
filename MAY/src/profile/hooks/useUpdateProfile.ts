import { useMutation, useQueryClient } from '@tanstack/react-query'
import * as profileService from '../services'

export const useUpdateProfile = (token: string | null) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: { name?: string; phone?: string; address?: string }) => {
      if (!token) throw new Error('No token');
      return profileService.profileService.updateProfile(token, data)
    },
    onSuccess: () => {
      // Refresh profile data sau khi update
      queryClient.invalidateQueries({ queryKey: ['profile'] })
    },
  })
}
