export type Role = 'USER' | 'ADMIN'
export type AuthProvider = 'GOOGLE' | 'LOCAL'

export interface UserProfile {
  id: number
  name: string
  email: string
  avatarUrl: string | null
  role: Role
  provider: AuthProvider
}

export interface AdminUser {
  id: number
  name: string
  email: string
  avatarUrl: string | null
  role: Role
  provider: AuthProvider
  active: boolean
  createdAt: string
}