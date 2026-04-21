import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import * as usersService from '../services'
import type { User, CreateUserDTO, UpdateUserDTO, UpdateUserRoleDTO } from '../types'

// get all
export const useUsers = () => {
   return useQuery<User[]>({
    queryKey: ['users'],
    queryFn: usersService.getUsers,
   })
}

// get by id
export const useUser = (id: number) => {
  return useQuery<User>({
    queryKey: ['users', id],
    queryFn: () => usersService.getUserById(id),
    enabled: !!id,
  })
}

// create
export const useCreateUser = () => {
    const queryClient = useQueryClient()
    return useMutation ({
        mutationFn: (data: CreateUserDTO) => usersService.createUser(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['users'] })
            alert('  User created successfully!')
        },
        onError: (error: any) => {
            const message = error.response?.data?.message || error.message || 'Failed to create user'
            alert(`  Error: ${message}`)
        }
    })
}

// update
export const useUpdateUser = () => {
    const queryClient = useQueryClient()
    return useMutation ({
      mutationFn: (payload: { id: number; data: UpdateUserDTO }) =>
        usersService.updateUser(payload.id, payload.data),
      onSuccess: (_, { id }) => {
        queryClient.invalidateQueries({ queryKey: ['users'] })
        queryClient.invalidateQueries({ queryKey: ['users', id] })
        alert('  User updated successfully!')
      },
      onError: (error: any) => {
        const message = error.response?.data?.message || error.message || 'Failed to update user'
        alert(`  Error: ${message}`)
        }
    })
}

// delete
export const useDeleteUser = () => {
    const queryClient = useQueryClient()
    return useMutation ({
        mutationFn: (id: number) => usersService.deleteUser(id),
        onSuccess: () => { 
            queryClient.invalidateQueries({ queryKey: ['users'] })
            alert('  User deleted successfully!')
        },
        onError: (error: any) => {
            const message = error.response?.data?.message || error.message || 'Failed to delete user'
            alert(`  Error: ${message}`)
        }
    })
}

// update role
export const useUpdateUserRole = () => {
    const queryClient = useQueryClient()
    return useMutation ({
        mutationFn: (payload: { id: number; data: UpdateUserRoleDTO }) =>
          usersService.updateUserRole(payload.id, payload.data),
        onSuccess: (_, { id }) => {
            queryClient.invalidateQueries({ queryKey: ['users'] })
            queryClient.invalidateQueries({ queryKey: ['users', id] })
            alert('  User role updated successfully!')
        },
        onError: (error: any) => {
            const message = error.response?.data?.message || error.message || 'Failed to update user role'
            alert(`  Error: ${message}`)
        }
    })
}
    