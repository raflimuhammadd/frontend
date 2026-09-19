'use client'

import React from 'react'

export interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  children: React.ReactNode
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full'
}

export const Modal = ({ isOpen, onClose, title, children, size = 'md' }: ModalProps) => {
  React.useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    
    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      document.body.style.overflow = 'hidden'
    }
    
    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, onClose])
  
  if (!isOpen) return null
  
  const sizes = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
    full: 'max-w-[95vw] h-[95vh]',
  }
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center animate-in">
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm" 
        onClick={onClose}
        aria-hidden="true"
      />
      <div 
        className={`relative bg-card border border-border rounded-lg shadow-2xl w-full ${sizes[size]} mx-4 max-h-[90vh] flex flex-col`}
        role="dialog"
        aria-modal="true"
      >
        {title && (
          <div className="flex items-center justify-between px-6 py-4 border-b border-border">
            <h2 className="text-xl font-semibold text-foreground">{title}</h2>
            <button
              onClick={onClose}
              className="text-muted-foreground hover:text-foreground transition-colors p-1 rounded-md hover:bg-muted/30"
              aria-label="Close modal"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        )}
        <div className="px-6 py-4 overflow-y-auto flex-1">
          {children}
        </div>
      </div>
    </div>
  )
}

export interface ModalFooterProps extends React.HTMLAttributes<HTMLDivElement> {}

export const ModalFooter = ({ className, children, ...props }: ModalFooterProps) => {
  return (
    <div className={`px-6 py-4 border-t border-border flex gap-3 justify-end ${className || ''}`} {...props}>
      {children}
    </div>
  )
}
