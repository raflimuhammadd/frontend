'use client'

import React from 'react'

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  width?: string
  height?: string
  circle?: boolean
}

const Skeleton = React.forwardRef<HTMLDivElement, SkeletonProps>(
  ({ className, width, height, circle, style, ...props }, ref) => (
    <div
      ref={ref}
      className={`animate-pulse bg-muted/30 ${circle ? 'rounded-full' : 'rounded-md'} ${className || ''}`}
      style={{ width, height, ...style }}
      {...props}
    />
  )
)
Skeleton.displayName = 'Skeleton'

export { Skeleton }
