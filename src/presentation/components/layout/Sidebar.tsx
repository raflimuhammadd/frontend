'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAuthStore } from '@/shared/stores/auth.store'
import { Avatar } from '../ui/Avatar'

interface IconProps extends React.HTMLAttributes<HTMLElement> {
  icon?: string
}

const IconifyIcon = ({ icon, ...props }: IconProps) => {
  if (!icon) return null

  return (
    <span 
      {...props}
      className={`iconify inline-block ${props.className || ''}`}
      data-icon={icon}
      data-inline="false"
    />
  )
}

export const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false)
  const { user, logout } = useAuthStore()
  const pathname = usePathname()
  
  if (!user) return null

  const navItems = [
    { 
      href: '/', 
      label: 'Overview', 
      icon: 'lucide:layout-dashboard',
      roles: ['PM', 'FRONTEND', 'BACKEND', 'UIUX'],
      section: 'workspace'
    },
    { 
      href: '/projects', 
      label: 'Projects', 
      icon: 'lucide:folder-kanban',
      roles: ['PM', 'FRONTEND', 'BACKEND', 'UIUX'],
      section: 'workspace'
    },
    { 
      href: '/tasks', 
      label: 'Tasks', 
      icon: 'lucide:check-square-2',
      roles: ['PM', 'FRONTEND', 'BACKEND', 'UIUX'],
      section: 'workspace'
    },
    { 
      href: '/team', 
      label: 'Team', 
      icon: 'lucide:users',
      roles: ['PM', 'FRONTEND', 'BACKEND', 'UIUX'],
      section: 'workspace'
    },
    { 
      href: '/reports', 
      label: 'Reports', 
      icon: 'lucide:bar-chart-3',
      roles: ['PM'],
      section: 'operations'
    },
    { 
      href: '/admin/audit', 
      label: 'Audit trail', 
      icon: 'lucide:history',
      roles: ['PM'],
      section: 'operations'
    },
    { 
      href: '/settings', 
      label: 'Settings', 
      icon: 'lucide:settings-2',
      roles: ['PM'],
      section: 'operations'
    },
  ].filter(item => item.roles.includes(user.role))

  const workspaceItems = navItems.filter(item => item.section === 'workspace')
  const operationsItems = navItems.filter(item => item.section === 'operations')

  const closeSidebar = () => setIsOpen(false)

  return (
    <>
      {/* Hamburger Menu Button (Mobile) */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden fixed top-4 left-4 z-50 w-10 h-10 flex items-center justify-center bg-[#111827] text-[#e5e5e5] rounded-md"
        aria-label="Toggle menu"
      >
        <IconifyIcon 
          icon={isOpen ? 'lucide:x' : 'lucide:menu'} 
          className="text-[20px]"
        />
      </button>

      {/* Backdrop (Mobile) */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-30 md:hidden" 
          onClick={closeSidebar}
        />
      )}

      {/* Sidebar */}
      <aside 
        className={`fixed left-0 top-0 z-40 w-[238px] h-screen bg-brand-dark text-white flex flex-col border-r border-background-dark overflow-hidden
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}
      >
        {/* Header */}
        <div className="h-[84px] px-6 flex items-center border-b border-background-dark">
          <div className="w-8 h-8 border border-brand-red text-brand-red flex items-center justify-center mr-3">
            <IconifyIcon icon="lucide:command" className="text-[17px]" />
          </div>
          <div>
            <div className="font-bold tracking-tight-05 text-[20px] leading-5 font-heading">
              nodewave
            </div>
            <div className="font-mono text-[9px] uppercase tracking-wide-20 text-text-secondary mt-1">
              control room
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="px-4 pt-7 flex-1 overflow-y-auto">
          <p className="px-3 mb-3 text-[10px] uppercase tracking-wide-18 font-semibold text-[#66727e]">
            Workspace
          </p>
          <nav className="space-y-1 mb-8">
            {workspaceItems.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={closeSidebar}
                   className={`flex items-center gap-3 px-3 py-3 text-[12px] uppercase tracking-wide-08 text-text-tertiary hover:text-white hover:bg-background-dark/80 transition-colors
                    ${isActive 
                      ? 'bg-brand-red text-white font-semibold' 
                      : ''
                    }`}
                >
                  <IconifyIcon icon={item.icon} className="text-[16px]" />
                  {item.label}
                </Link>
              )
            })}
          </nav>

          {operationsItems.length > 0 && (
            <>
              <p className="px-3 mb-3 text-[10px] uppercase tracking-wide-18 font-semibold text-[#66727e]">
                Operations
              </p>
              <nav className="space-y-1">
                {operationsItems.map((item) => {
                  const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={closeSidebar}
                      className={`flex items-center gap-3 px-3 py-3 text-[12px] uppercase tracking-wide-08 text-[#9ca8b3] hover:text-white hover:bg-[#1a222a] transition-colors
                        ${isActive 
                          ? 'bg-brand-red text-white font-semibold' 
                          : ''
                        }`}
                    >
                      <IconifyIcon icon={item.icon} className="text-[16px]" />
                      {item.label}
                    </Link>
                  )
                })}
              </nav>
            </>
          )}
        </div>

        {/* User Profile Footer */}
        <div className="mt-auto p-4 border-t border-background-dark">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-background-dark text-text-on-dark flex items-center justify-center font-mono text-[10px]">
              {user.firstName[0]}{user.lastName[0]}
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-[12px] font-semibold truncate">
                {user.firstName} {user.lastName}
              </div>
              <div className="font-mono text-[9px] uppercase text-text-secondary mt-1">
                {user.role === 'PM' ? 'PM / admin' : user.role.toLowerCase()}
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Spacer for desktop */}
      <div className="hidden md:block w-[238px] flex-shrink-0" />
    </>
  )
}
