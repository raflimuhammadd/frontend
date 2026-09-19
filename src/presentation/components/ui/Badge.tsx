'use client'

import React from 'react'
import type { TaskStatus, UserRole, Department } from '@/domain/types'

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'outline' | 'dot'
  size?: 'sm' | 'md'
  color?: 'primary' | 'secondary' | 'success' | 'error' | 'warning' | 'info'
}

const Badge = React.forwardRef<HTMLDivElement, BadgeProps>(
  ({ className, variant = 'default', size = 'md', color = 'primary', children, ...props }, ref) => {
    const baseStyles = 'inline-flex items-center font-mono font-semibold rounded-md transition-colors'
    
    const variants = {
      default: 'px-2.5 py-1',
      outline: 'border px-2.5 py-1',
      dot: 'gap-2 px-2 py-1',
    }
    
    const sizes = {
      sm: 'text-[9px] tracking-wide-15',
      md: 'text-[10px] tracking-wide-15',
    }
    
    const colors = {
      primary: 'bg-brand-primary/15 text-brand-primary border-brand-primary/30',
      secondary: 'bg-text-secondary/15 text-text-secondary border-text-secondary/30',
      success: 'bg-status-done/15 text-status-done border-status-done/30',
      error: 'bg-status-blocked/15 text-status-blocked border-status-blocked/30',
      warning: 'bg-status-in-progress/15 text-status-in-progress border-status-in-progress/30',
      info: 'bg-status-todo/15 text-status-todo border-status-todo/30',
    }
    
    return (
      <div
        ref={ref}
        className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${colors[color]} ${className || ''}`}
        {...props}
      >
        {children}
      </div>
    )
  }
)
Badge.displayName = 'Badge'

export const StatusBadge = ({ status }: { status: TaskStatus }) => {
  const config = {
    TODO: { label: 'Todo', color: '#3b82f6', dotColor: 'status-todo' },
    IN_PROGRESS: { label: 'In Progress', color: '#f4a261', dotColor: 'status-in-progress' },
    DONE: { label: 'Done', color: '#2a9d8f', dotColor: 'status-done' },
    BLOCKED: { label: 'Blocked', color: '#e63946', dotColor: 'status-blocked' },
  }[status]
  
  return (
    <span className="flex items-center gap-2 text-[10px] uppercase tracking-wide-08 font-semibold font-mono">
      <span 
        className={`w-2 h-2 rounded-full flex-shrink-0 ${status === 'BLOCKED' ? 'animate-pulse-dot' : ''}`} 
        style={{ backgroundColor: config.color }}
      />
      {config.label}
    </span>
  )
}

export const TaskStatusBadge = ({ status }: { status: TaskStatus }) => (
  <StatusBadge status={status} />
)

export const PriorityBadge = ({ priority }: { priority: 'LOW' | 'MEDIUM' | 'HIGH' }) => {
  const config = {
    LOW: { label: 'Low', color: 'info' as const },
    MEDIUM: { label: 'Medium', color: 'warning' as const },
    HIGH: { label: 'High', color: 'error' as const },
  }[priority]
  
  return <Badge color={config.color} size="sm">{config.label}</Badge>
}

export const RoleBadge = ({ role }: { role: UserRole }) => {
  const config = {
    PM: { label: 'Product Manager', color: 'primary' as const },
    FRONTEND: { label: 'Frontend', color: 'info' as const },
    BACKEND: { label: 'Backend', color: 'info' as const },
    UIUX: { label: 'UI/UX', color: 'warning' as const },
    CLIENT_GUEST: { label: 'Client Guest', color: 'secondary' as const },
  }[role]
  
  return <Badge color={config.color}>{config.label}</Badge>
}

export const DepartmentBadge = ({ department }: { department: Department }) => {
  const config = {
    PRODUCT: { label: 'Product', color: 'primary' as const },
    ENGINEERING: { label: 'Engineering', color: 'info' as const },
    DESIGN: { label: 'Design', color: 'warning' as const },
    CLIENT: { label: 'Client', color: 'secondary' as const },
  }[department]
  
  return <Badge color={config.color}>{config.label}</Badge>
}

export { Badge }