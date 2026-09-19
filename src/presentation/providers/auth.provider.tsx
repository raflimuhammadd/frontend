'use client'

import { useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useAuthStore } from '@/shared/stores/auth.store'

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const { isAuthenticated, user } = useAuthStore()

  useEffect(() => {
    const publicRoutes = ['/login', '/register']
    const isPublicRoute = publicRoutes.includes(pathname)

    if (!isAuthenticated && !isPublicRoute) {
      router.push('/login')
    }

    if (isAuthenticated && isPublicRoute) {
      router.push('/projects')
    }
  }, [isAuthenticated, pathname, router])

  return <>{children}</>
}
