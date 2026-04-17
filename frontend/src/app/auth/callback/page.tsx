import { Suspense } from 'react'
import { Spinner } from '@/components/ui/Spinner'
import { AuthCallbackHandler } from './AuthCallbackHandler'

export default function AuthCallbackPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center">
        <Spinner className="h-8 w-8 text-primary" />
      </div>
    }>
      <AuthCallbackHandler />
    </Suspense>
  )
}