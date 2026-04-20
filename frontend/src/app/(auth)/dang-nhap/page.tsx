import type { Metadata } from 'next'
import Link from 'next/link'
import LocalLoginForm from '@/components/auth/LocalLoginForm'

export const metadata: Metadata = { title: 'Đăng nhập' }

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8080'

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-surface-muted px-4">
      <div className="w-full max-w-sm rounded-card border border-surface-border bg-surface p-8 shadow-card text-center">
        <Link href="/" className="mb-2 block text-2xl font-bold text-primary">
          Gà Tre Catalog
        </Link>
        <p className="mb-6 text-xs text-text-muted">Nền tảng thương lượng gà tre thuần chủng</p>

        {/* Email / Password — LOCAL accounts */}
        <LocalLoginForm />

        {/* Divider */}
        <div className="my-5 flex items-center gap-3">
          <div className="flex-1 border-t border-surface-border" />
          <span className="text-xs text-text-muted">hoặc</span>
          <div className="flex-1 border-t border-surface-border" />
        </div>

        {/* Google OAuth */}
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

        <p className="mt-6 text-xs text-text-muted">
          Bằng cách tiếp tục, bạn đồng ý với{' '}
          <Link href="/" className="underline hover:text-primary">điều khoản sử dụng</Link>
          {' '}của chúng tôi.
        </p>
      </div>
    </div>
  )
}
