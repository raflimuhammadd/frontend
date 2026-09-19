'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/presentation/components/ui/Button'
import { Input } from '@/presentation/components/ui/Input'
import { Select } from '@/presentation/components/ui/Select'
import { Card, CardContent, CardHeader } from '@/presentation/components/ui/Card'
import { RoleBadge, DepartmentBadge } from '@/presentation/components/ui/Badge'
import { useAuthStore } from '@/shared/stores/auth.store'

const registerSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string().min(1, 'Please confirm your password'),
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  role: z.enum(['PM', 'FRONTEND', 'BACKEND', 'UIUX', 'CLIENT_GUEST']),
  department: z.enum(['PRODUCT', 'ENGINEERING', 'DESIGN', 'CLIENT']),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
})

type RegisterFormData = z.infer<typeof registerSchema>

export function RegisterForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const { setAuth } = useAuthStore()
  const router = useRouter()

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      role: 'CLIENT_GUEST',
      department: 'CLIENT',
    },
  })

  const selectedRole = watch('role')
  const selectedDepartment = watch('department')

  const departmentOptions = [
    { value: 'PRODUCT', label: 'Product Management' },
    { value: 'ENGINEERING', label: 'Engineering' },
    { value: 'DESIGN', label: 'Design' },
    { value: 'CLIENT', label: 'Client' },
  ]

  const roleOptions = [
    { value: 'PM', label: 'Product Manager' },
    { value: 'FRONTEND', label: 'Frontend Engineer' },
    { value: 'BACKEND', label: 'Backend Engineer' },
    { value: 'UIUX', label: 'UI/UX Designer' },
    { value: 'CLIENT_GUEST', label: 'Client Guest' },
  ]

  const onSubmit = async (data: RegisterFormData) => {
    setIsLoading(true)
    setError('')

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/register`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: data.email,
            password: data.password,
            firstName: data.firstName,
            lastName: data.lastName,
            role: data.role,
            department: data.department,
          }),
        }
      )

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Registration failed')
      }

      setAuth(result.data.token, result.data.user)
      router.push('/projects')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="w-full max-w-lg bg-background-card border border-border-light p-8">
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
        <div className="grid grid-cols-2 gap-4">
          <Input
            label="First Name"
            placeholder="John"
            error={errors.firstName?.message}
            required
            {...register('firstName')}
          />
          <Input
            label="Last Name"
            placeholder="Doe"
            error={errors.lastName?.message}
            required
            {...register('lastName')}
          />
        </div>
        <Input
          label="Email"
          type="email"
          placeholder="john@nodewave.com"
          error={errors.email?.message}
          required
          {...register('email')}
        />
        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Password"
            type="password"
            placeholder="••••••••"
            error={errors.password?.message}
            required
            {...register('password')}
          />
          <Input
            label="Confirm Password"
            type="password"
            placeholder="••••••••"
            error={errors.confirmPassword?.message}
            required
            {...register('confirmPassword')}
          />
        </div>
        <Select
          label="Role"
          options={roleOptions}
          error={errors.role?.message}
          required
          {...register('role')}
        />
        {selectedRole && (
          <div className="flex items-center gap-2">
            <span className="text-[11px] text-text-secondary">Selected role:</span>
            <RoleBadge role={selectedRole as any} />
          </div>
        )}
        <Select
          label="Department"
          options={departmentOptions}
          error={errors.department?.message}
          required
          {...register('department')}
        />
        {selectedDepartment && (
          <div className="flex items-center gap-2">
            <span className="text-[11px] text-text-secondary">Selected department:</span>
            <DepartmentBadge department={selectedDepartment as any} />
          </div>
        )}
        <Button type="submit" className="w-full" isLoading={isLoading}>
          Create Account
        </Button>
      </form>

      {/* Login Link */}
      <div className="mt-4 text-center text-[11px] text-text-secondary">
        Already have an account?{' '}
        <Link href="/login" className="text-brand-primary hover:underline font-semibold">
          Sign In
        </Link>
      </div>
    </div>
  )
}
