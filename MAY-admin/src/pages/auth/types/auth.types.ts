export interface AuthUser {
  id: number
  email: string
  name?: string
  role: 'ADMIN' | 'STAFF' | 'CUSTOMER'
}

export interface LoginDTO {
  email: string
  password: string
}

export interface LoginResponse {
  user: AuthUser
  access_token: string
}
