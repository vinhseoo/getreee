import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import '@/styles/globals.css'
import { AuthInitializer } from '@/components/layout/AuthInitializer'

const inter = Inter({ subsets: ['latin', 'vietnamese'] })

export const metadata: Metadata = {
  title: { default: 'Gà Tre Catalog', template: '%s | Gà Tre Catalog' },
  description: 'Danh mục gà tre thuần chủng — mọi giá cả thương lượng trực tiếp.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi">
      <body className={`${inter.className} bg-surface-muted text-text-primary antialiased`}>
        <AuthInitializer />
        {children}
      </body>
    </html>
  )
}