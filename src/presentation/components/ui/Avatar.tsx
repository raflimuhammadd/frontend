'use client'

import React from 'react'

export interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  src?: string
  alt?: string
  fallback?: string
  size?: 'sm' | 'md' | 'lg'
}

const Avatar = React.forwardRef<HTMLDivElement, AvatarProps>(
  ({ className, src, alt, fallback, size = 'md', ...props }, ref) => {
    const sizes = {
      sm: 'w-8 h-8 text-xs',
      md: 'w-10 h-10 text-sm',
      lg: 'w-12 h-12 text-base',
    }
    
    const getInitials = (name?: string) => {
      if (!name) return '?'
      return name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    }
    
    return (
      <div
        ref={ref}
        className={`rounded-full bg-secondary flex items-center justify-center font-medium text-secondary-foreground overflow-hidden ${sizes[size]} ${className || ''}`}
        {...props}
      >
        {src ? (
          <img src={src} alt={alt || fallback || 'Avatar'} className="w-full h-full object-cover" />
        ) : (
          <span>{getInitials(fallback || alt)}</span>
        )}
      </div>
    )
  }
)
Avatar.displayName = 'Avatar'

export { Avatar }
