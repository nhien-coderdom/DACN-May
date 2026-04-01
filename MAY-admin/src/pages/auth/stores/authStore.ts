import { create } from 'zustand'

export interface AuthUser {
  id: number
  email: string
  name?: string
  role: 'ADMIN' | 'STAFF' | 'CUSTOMER'
}

interface AuthState {
  user: AuthUser | null
  token: string | null
  login: (user: AuthUser, token: string) => void
  logout: () => void
  initializeAuth: () => void
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,

  login: (user, token) => {
    localStorage.setItem('token', token)
    set({ user, token })
  },

  logout: () => {
    localStorage.removeItem('token')
    set({ user: null, token: null })
  },

  initializeAuth: () => {
    const token = localStorage.getItem('token')
    if (token) {
      // In real app, verify token with backend
      set({ token })
    }
  },
}))
