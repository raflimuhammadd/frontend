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
  const [isLoaded, setIsLoaded] = React.useState(false)
  
  React.useEffect(() => {
    if (!window.iconifyLoaded && typeof window !== 'undefined') {
      const script = document.createElement('script')
      script.src = 'https://code.iconify.design/2/2.3.0/iconify.min.js'
      script.async = true
      script.onload = () => setIsLoaded(true)
      document.head.appendChild(script)
    } else {
      setIsLoaded(true)
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

export const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false)
  const { user, logout } = useAuthStore()
  const pathname = usePathname()
  
  if (!user) return null

  const navItems = [
    { 
      href: '/projects', 
      label: 'Projects', 
      icon: 'lucide:layout-dashboard',
      roles: ['PM', 'FRONTEND', 'BACKEND', 'UIUX']
    },
    { 
      href: '/tasks', 
      label: 'Tasks', 
      icon: 'lucide:check-square-2',
      roles: ['PM', 'FRONTEND', 'BACKEND', 'UIUX']
    },
    { 
      href: '/admin', 
      label: 'Admin', 
      icon: 'lucide:settings',
      roles: ['PM']
    },
  ].filter(item => item.roles.includes(user.role))

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
        className={`fixed left-0 top-0 z-40 w-[238px] h-screen bg-[#111827] text-[#e5e5e5] flex flex-col border-r border-[#374151] overflow-hidden
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}
      >
        {/* Header */}
        <div className="h-[84px] px-6 flex items-center border-b border-[#374151]">
          <div className="w-8 h-8 border border-[#dc2626] text-[#dc2626] flex items-center justify-center mr-3">
            <IconifyIcon icon="lucide:command" className="text-[17px]" />
          </div>
          <div>
            <div className="font-bold tracking-tight text-[20px] leading-5 font-heading">
              nodewave
            </div>
            <div className="font-mono text-[9px] uppercase tracking-[0.2em] text-[#6b7280] mt-1">
              control room
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="px-4 pt-7 flex-1 overflow-y-auto">
          <p className="px-3 mb-3 text-[10px] uppercase tracking-[0.18em] font-semibold text-[#6b7280] font-mono">
            Workspace
          </p>
          <nav className="space-y-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={closeSidebar}
                  className={`flex items-center gap-3 px-3 py-3 text-[12px] uppercase tracking-[0.08em] font-mono transition-colors rounded-md
                    ${isActive 
                      ? 'bg-[#dc2626] text-white font-semibold' 
                      : 'text-[#9ca3af] hover:text-[#e5e5e5] hover:bg-[#1a222a]'
                    }`}
                >
                  <IconifyIcon icon={item.icon} className="text-[16px]" />
                  {item.label}
                </Link>
              )
            })}
          </nav>
        </div>

        {/* User Profile Footer */}
        <div className="mt-auto p-4 border-t border-[#374151]">
          <div className="flex items-center gap-3 mb-3">
            <Avatar 
              fallback={`${user.firstName} ${user.lastName}`}
              src={user.avatar}
              size="sm"
            />
            <div className="min-w-0 flex-1">
              <div className="text-[12px] font-semibold truncate">
                {user.firstName} {user.lastName}
              </div>
              <div className="font-mono text-[9px] uppercase text-[#6b7280] mt-1">
                {user.role === 'PM' ? 'PM / admin' : user.role.toLowerCase()}
              </div>
            </div>
          </div>
          <button
            onClick={logout}
            className="w-full px-3 py-2 text-[10px] uppercase tracking-[0.1em] font-mono font-semibold text-[#6b7280] hover:text-[#dc2626] hover:bg-[#1a222a] rounded-md transition-colors"
          >
            Sign out
          </button>
        </div>
      </aside>

      {/* Spacer for desktop */}
      <div className="hidden md:block w-[238px] flex-shrink-0" />
    </>
  )
}
