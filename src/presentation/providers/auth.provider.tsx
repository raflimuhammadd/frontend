'use client'

import { ReactNode, useEffect, useState } from 'react'
import { useAuthStore } from '@/shared/stores/auth.store'
import { useRouter } from 'next/navigation'

export default function AuthProvider({ children }: { children: ReactNode }) {
  const [mounted, setMounted] = useState(false)
  const { isAuthenticated } = useAuthStore()
  const router = useRouter()

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  return <>{children}</>
}
