'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/useAuthStore'

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8080'

export default function LocalLoginForm() {
  const router = useRouter()
  const setAuth = useAuthStore(s => s.setAuth)

  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [error, setError]       = useState<string | null>(null)
  const [loading, setLoading]   = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      // 1. Login → get access token
      const loginRes = await fetch(`${API_BASE}/api/auth/login`, {
        method:      'POST',
        headers:     { 'Content-Type': 'application/json' },
        credentials: 'include',
        body:        JSON.stringify({ email: email.trim(), password }),
      })

      const loginBody = await loginRes.json()

      if (!loginRes.ok) {
        setError(loginBody.message ?? 'Đăng nhập thất bại. Vui lòng thử lại.')
        return
      }

      const accessToken: string = loginBody.data.accessToken

      // 2. Fetch user profile
      const meRes = await fetch(`${API_BASE}/api/auth/me`, {
        headers:     { Authorization: `Bearer ${accessToken}` },
        credentials: 'include',
      })

      const meBody = await meRes.json()

      if (!meRes.ok) {
        setError('Không thể tải thông tin tài khoản. Vui lòng thử lại.')
        return
      }

      setAuth(accessToken, meBody.data)
      router.replace('/dashboard/chat')
    } catch {
      setError('Không thể kết nối đến máy chủ. Vui lòng thử lại.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3 text-left">
      <div>
        <label htmlFor="email" className="block text-xs font-medium text-text-secondary mb-1">
          Email
        </label>
        <input
          id="email"
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="you@example.com"
          className="w-full rounded-input border border-surface-border bg-surface px-3 py-2 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>

      <div>
        <label htmlFor="password" className="block text-xs font-medium text-text-secondary mb-1">
          Mật khẩu
        </label>
        <input
          id="password"
          type="password"
          autoComplete="current-password"
          required
          value={password}
          onChange={e => setPassword(e.target.value)}
          placeholder="••••••••"
          className="w-full rounded-input border border-surface-border bg-surface px-3 py-2 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>

      {error && (
        <p className="text-xs text-danger">{error}</p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="btn-secondary w-full disabled:opacity-60"
      >
        {loading ? 'Đang đăng nhập…' : 'Đăng nhập'}
      </button>
    </form>
  )
}
