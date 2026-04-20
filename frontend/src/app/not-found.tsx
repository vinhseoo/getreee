import Link from 'next/link'

export default function NotFoundPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 px-4 text-center">
      <p className="text-6xl font-bold text-primary">404</p>
      <div className="space-y-1">
        <h1 className="text-xl font-semibold text-text-primary">Không tìm thấy trang</h1>
        <p className="text-sm text-text-muted">
          Trang bạn đang tìm kiếm không tồn tại hoặc đã bị xoá.
        </p>
      </div>
      <Link
        href="/"
        className="rounded-btn bg-primary px-5 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90"
      >
        Về trang chủ
      </Link>
    </div>
  )
}
