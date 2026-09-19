'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { AuthLayout } from './AuthLayout'
import { useAuthStore } from '@/shared/stores/auth.store'
import { Input } from '@/presentation/components/ui/Input'

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

  const [showPassword, setShowPassword] = useState(false)

  return (
    <AuthLayout
      variant="login"
      title="Welcome back."
      subtitle="Sign in to continue to your delivery workspace."
    >
      {/* Error Message */}
      {error && (
        <div className="mb-6 rounded-md bg-status-blocked/10 border border-status-blocked/30 p-3 text-[12px] text-status-blocked font-mono">
          {error}
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Email Input */}
        <Input
          id="email"
          type="email"
          label="Email address"
          placeholder="you@company.com"
          autoComplete="email"
          error={errors.email?.message}
          {...register('email')}
        />

        {/* Password Input */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label htmlFor="password" className="block font-mono text-[10px] uppercase tracking-wide-15 font-semibold text-text-primary">
              Password
            </label>
            <a href="#forgot-password" className="font-mono text-[10px] uppercase tracking-[.1em] text-brand-red hover:underline">
              Forgot password?
            </a>
          </div>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="current-password"
              placeholder="Enter your password"
              className={`w-full h-12 pl-4 pr-12 border bg-background-card text-[13px] placeholder:text-text-tertiary transition-all focus:outline-none focus:border-brand-red focus:shadow-focus-red ${
                errors.password ? 'border-brand-red' : 'border-border-light'
              }`}
              {...register('password')}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-0 top-0 h-12 w-12 text-text-secondary hover:text-brand-red"
              aria-label="Show password"
            >
              <span className="inline-block" data-icon={showPassword ? 'lucide:eye-off' : 'lucide:eye'} data-inline="false" style={{ fontSize: '17px' }} />
            </button>
          </div>
          {errors.password && (
            <p className="text-brand-red text-[10px] font-mono mt-1">{errors.password.message}</p>
          )}
        </div>

        {/* Remember Device */}
        <label className="flex items-center gap-3 cursor-pointer">
          <input type="checkbox" className="w-4 h-4 accent-brand-red" />
          <span className="font-mono text-[10px] uppercase tracking-[.1em] text-text-secondary">
            Remember this device
          </span>
        </label>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full h-12 bg-text-primary text-white font-mono text-[10px] uppercase tracking-wide-16 font-semibold shadow-red hover:shadow-red-hover hover:translate-x-[2px] hover:translate-y-[2px] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading && (
            <svg className="w-4 h-4 animate-spin inline mr-2" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
          )}
          Sign in to workspace
          <span className="inline-block ml-2 align-middle" data-icon="lucide:arrow-right" data-inline="false" style={{ fontSize: '15px' }} />
        </button>
      </form>
    </AuthLayout>
  )
}
