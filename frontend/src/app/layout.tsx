import type { Metadata } from 'next'
import '@/styles/globals.css'
import { AuthInitializer } from '@/components/layout/AuthInitializer'
import { ToastContainer } from '@/components/ui/Toast'

export const metadata: Metadata = {
  title: { default: 'Gà Tre Catalog', template: '%s | Gà Tre Catalog' },
  description: 'Danh mục gà tre thuần chủng — mọi giá cả thương lượng trực tiếp.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi">
      <body className={`font-sans bg-surface-muted text-text-primary antialiased`}>
        <AuthInitializer />
        <ToastContainer />
        {children}
      </body>
    </html>
  )
}