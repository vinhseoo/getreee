export type Role = 'USER' | 'ADMIN'

export interface UserProfile {
  id: number
  name: string
  email: string
  avatarUrl: string | null
  role: Role
}