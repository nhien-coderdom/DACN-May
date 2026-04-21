import { useMutation, useQueryClient } from '@tanstack/react-query'
import * as profileService from '../services'

export const useUpdateProfile = (token: string | null) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: { name?: string; phone?: string; address?: string }) => {
      if (!token) throw new Error('No token');
      return profileService.profileService.updateProfile(token, data)
    },
    onSuccess: (updatedUser) => {
      // Invalidate and refetch profile queries
      queryClient.invalidateQueries({ queryKey: ['profile'] })
      
      // Optionally set the updated user directly to cache
      if (updatedUser) {
        queryClient.setQueryData(['profile', token], updatedUser)
      }
    },
    onError: (error) => {
      console.error('Profile update failed:', error)
    },
  })
}
