'use client'

import React from 'react'
import Link from 'next/link'
import { HeroSection } from './HeroSection'

interface IconProps extends React.HTMLAttributes<HTMLElement> {
  icon?: string
}

const IconifyIcon = ({ icon, ...props }: IconProps) => {
  const [isLoaded, setIsLoaded] = React.useState(false)
  
  React.useEffect(() => {
    if (!window.iconifyLoaded && typeof window !== 'undefined') {
      const script = document.createElement('script')
      script.src = 'https://code.iconify.design/2/2.3.0/iconify.min.js'
      script.async = true
      document.head.appendChild(script)
    }
  }, [icon])

  if (!icon) return null

  return (
    <span 
      {...props}
      className={`inline-block ${isLoaded ? 'iconify' : ''} ${props.className || ''}`}
      data-icon={icon}
      data-inline="false"
    />
  )
}

interface AuthLayoutProps {
  children: React.ReactNode
  title: string
  subtitle: string
  variant: 'login' | 'register'
}

export function AuthLayout({ children, title, subtitle, variant }: AuthLayoutProps) {
  const registerLink = variant === 'login'
    ? { text: 'Create an account', href: '/register' }
    : { text: 'Sign In', href: '/login' }

  return (
    <div className="min-h-screen w-full bg-white text-text-primary flex flex-col lg:flex-row">
      {/* Hero Section - Hidden on mobile, visible on lg+ */}
      <aside className="hidden lg:flex lg:w-1/2 flex-shrink-0">
        <HeroSection />
      </aside>

      {/* Form Section */}
      <main className="min-h-screen w-full lg:w-1/2 flex items-center justify-center px-6 py-12 md:px-12 lg:px-16 xl:px-24 bg-white">
        <section className="w-full max-w-[430px]">
          {/* Header */}
          <div className="flex items-center justify-between mb-16">
            <div className="font-mono text-[10px] uppercase tracking-wide-18 text-text-secondary">
              Workspace access
            </div>
            <div className="flex items-center gap-2 font-mono text-[9px] uppercase tracking-[.12em] text-brand-green">
              <span className="w-2 h-2 bg-brand-green" />
              Systems online
            </div>
          </div>

          {/* Title Section */}
          <div className="mb-10">
            <div className="font-mono text-[10px] uppercase tracking-wide-20 text-brand-red mb-4">
              / {variant === 'login' ? 'sign in' : 'create account'}
            </div>
            <h2 className="text-[42px] leading-none tracking-tight-06 font-bold font-heading text-text-primary">
              {title}
            </h2>
            <p className="mt-4 text-[14px] leading-6 text-text-secondary">
              {subtitle}
            </p>
          </div>

          {/* Form Content */}
          {children}

          {/* Divider */}
          <div className="flex items-center gap-4 my-9">
            <div className="h-px flex-1 bg-[#dce1e5]" />
            <span className="font-mono text-[9px] uppercase tracking-wide-14 text-[#a0aab3]">
              or
            </span>
            <div className="h-px flex-1 bg-[#dce1e5]" />
          </div>

          {/* SSO Button */}
          <button className="w-full h-11 border border-border-light bg-white text-text-primary font-mono text-[10px] uppercase tracking-[.12em] font-semibold hover:border-text-primary transition-colors">
            <IconifyIcon icon="lucide:key-round" className="mr-2 text-[15px] align-middle inline" />
            Continue with SSO
          </button>

          {/* Footer Link */}
          <p className="text-center mt-10 text-[13px] text-text-secondary">
            {variant === 'login' 
              ? 'New to NodeWave? '
              : 'Already have an account? '
            }
            <Link 
              href={registerLink.href} 
              className="font-semibold text-brand-red hover:underline"
            >
              {registerLink.text}
            </Link>
          </p>

          {/* Security Footer */}
          <div className="mt-16 pt-5 border-t border-[#dce1e5] flex items-center justify-between">
            <span className="font-mono text-[9px] uppercase tracking-[.12em] text-[#a0aab3]">
              Protected session
            </span>
            <span className="flex items-center gap-2 font-mono text-[9px] uppercase tracking-[.12em] text-[#a0aab3]">
              <IconifyIcon icon="lucide:shield-check" className="text-brand-green text-[14px]" />
              JWT secured
            </span>
          </div>
        </section>
      </main>
    </div>
  )
}