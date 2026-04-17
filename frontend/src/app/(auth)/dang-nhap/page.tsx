import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = { title: 'Đăng nhập' }

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8080'

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-surface-muted px-4">
      <div className="w-full max-w-sm rounded-card border border-surface-border bg-surface p-8 shadow-card text-center">
        <Link href="/" className="mb-6 block text-2xl font-bold text-primary">
          Gà Tre Catalog
        </Link>

        <p className="mb-8 text-sm text-text-muted">
          Đăng nhập để liên hệ thương lượng giá với người bán.
        </p>

        <a
          href={`${API_BASE}/oauth2/authorization/google`}
          className="btn-primary flex items-center justify-center gap-3 w-full"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
            alt="Google"
            className="h-5 w-5"
          />
          Đăng nhập với Google
        </a>
      </div>
    </div>
  )
}