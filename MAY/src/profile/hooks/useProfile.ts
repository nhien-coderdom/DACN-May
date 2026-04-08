import { useQuery } from '@tanstack/react-query'
import * as profileService from '../services'

export const useProfile = (token: string | null) => {
  return useQuery({
    queryKey: ['profile', token],
    queryFn: () => {
      if (!token) throw new Error('No token');
      return profileService.profileService.getProfile(token)
    },
    enabled: !!token,
  })
}
