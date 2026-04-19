export type Role = 'USER' | 'ADMIN'

export interface UserProfile {
  id: number
  name: string
  email: string
  avatarUrl: string | null
  role: Role
}

export interface AdminUser {
  id: number
  name: string
  email: string
  avatarUrl: string | null
  role: Role
  provider: 'GOOGLE' | 'LOCAL'
  active: boolean
  createdAt: string
}