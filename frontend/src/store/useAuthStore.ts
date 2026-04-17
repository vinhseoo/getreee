import { create } from 'zustand'
import { UserProfile } from '@/types/user'

interface AuthState {
  accessToken: string | null
  user: UserProfile | null
  /** True after the initial silent refresh attempt completes (success or failure). */
  initialized: boolean
  setAuth: (token: string, user: UserProfile) => void
  clearAuth: () => void
  setInitialized: () => void
}

/**
 * In-memory only — no localStorage.
 * Token is re-issued on page reload via the HttpOnly refresh cookie (AuthInitializer).
 */
export const useAuthStore = create<AuthState>((set) => ({
  accessToken: null,
  user: null,
  initialized: false,
  setAuth: (accessToken, user) => set({ accessToken, user }),
  clearAuth: () => set({ accessToken: null, user: null }),
  setInitialized: () => set({ initialized: true }),
}))