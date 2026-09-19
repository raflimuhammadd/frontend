'use client'

import React from 'react'

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'destructive' | 'ghost' | 'outline'
  size?: 'sm' | 'md' | 'lg'
  isLoading?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', isLoading, disabled, children, ...props }, ref) => {
    const baseStyles = 'inline-flex items-center justify-center font-mono font-semibold uppercase tracking-widest rounded-md transition-all focus:outline-none focus:ring-4 focus:ring-focus-ring/30 disabled:opacity-50 disabled:cursor-not-allowed'
    
    const variants = {
      primary: 'bg-[#111820] text-white shadow-red hover:shadow-red-hover hover:translate-x-[2px] hover:translate-y-[2px] active:shadow-red-hover active:translate-x-[2px] active:translate-y-[2px]',
      secondary: 'bg-text-secondary text-white hover:bg-text-secondary/90 active:bg-text-secondary/80',
      destructive: 'bg-brand-red text-white hover:bg-red-700 active:bg-red-800',
      ghost: 'text-text-primary hover:bg-hover-bg active:bg-border-light',
      outline: 'border-2 border-brand-primary text-brand-primary hover:bg-brand-primary/10 active:bg-brand-primary/20',
    }
    
    const sizes = {
      sm: 'px-2 py-1 text-[10px] gap-1 h-8',
      md: 'px-4 py-2 text-[10px] gap-2 h-12',
      lg: 'px-6 py-3 text-[11px] gap-2 h-12',
    }
    
    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className || ''}`}
        {...props}
      >
        {isLoading && (
          <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
        )}
        {children}
      </button>
    )
  }
)
Button.displayName = 'Button'

export { Button }
