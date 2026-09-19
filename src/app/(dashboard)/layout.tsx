import { ReactNode } from 'react'
import { redirect } from 'next/navigation'

export async function ProtectedLayout({ children }: { children: ReactNode }) {
  // Client-side auth check happens in AuthProvider
  // This layout wraps protected routes
  return <>{children}</>
}
