'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/presentation/components/ui/Button'
import { Input } from '@/presentation/components/ui/Input'
import { Card, CardContent, CardHeader } from '@/presentation/components/ui/Card'
import { useAuthStore } from '@/shared/stores/auth.store'

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
})

type LoginFormData = z.infer<typeof loginSchema>

export function LoginForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const { setAuth } = useAuthStore()
  const router = useRouter()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true)
    setError('')

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/login`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        }
      )

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Login failed')
      }

      setAuth(result.data.token, result.data.user)
      router.push('/projects')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="w-full max-w-md bg-background-card border border-border-light p-8">
      {/* Logo */}
      <div className="mb-6 text-center">
        <div className="w-16 h-16 mx-auto border-2 border-brand-red text-brand-red flex items-center justify-center mb-4">
          <span className="text-[32px] font-bold font-heading">N</span>
        </div>
        <h1 className="text-[24px] font-bold tracking-tight font-heading text-text-primary">nodewave</h1>
        <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-text-secondary mt-1">
          control room
        </p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-4 rounded-md bg-status-blocked/10 border border-status-blocked/30 p-3 text-[12px] text-status-blocked font-mono">
          {error}
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          label="Email"
          type="email"
          placeholder="pm@nodewave.com"
          error={errors.email?.message}
          required
          {...register('email')}
        />
        <Input
          label="Password"
          type="password"
          placeholder="••••••••"
          error={errors.password?.message}
          required
          {...register('password')}
        />
        <Button 
          type="submit" 
          className="w-full" 
          isLoading={isLoading}
          variant="primary"
        >
          Sign In
        </Button>
      </form>

      {/* Registration Link */}
      <div className="mt-4 text-center text-[11px] text-text-secondary">
        Don't have an account?{' '}
        <Link href="/register" className="text-brand-primary hover:underline font-semibold">
          Register
        </Link>
      </div>
    </div>
  )
}
