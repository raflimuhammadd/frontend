'use client'

import React, { useId } from 'react'

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string
  label?: string
  helper?: string
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, error, label, helper, id, ...props }, ref) => {
    const generatedId = useId()
    const inputId = id || generatedId
    
    return (
      <div className="w-full">
        {label && (
          <label htmlFor={inputId} className="block text-[10px] uppercase tracking-[0.15em] font-semibold font-mono text-text-secondary mb-2">
            {label}
            {props.required && <span className="text-brand-red ml-1">*</span>}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={`w-full h-12 px-4 bg-background-card text-text-primary border text-[13px] transition-all duration-250 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed placeholder:text-text-tertiary
            ${error 
              ? 'border-brand-red focus:border-brand-red focus:shadow-focus-red' 
              : 'border-border-light focus:border-brand-red focus:shadow-focus-red'
            } ${className || ''}`}
          {...props}
        />
        {error && <p className="text-brand-red text-[10px] font-mono mt-1">{error}</p>}
        {helper && !error && <p className="text-text-secondary text-[10px] font-mono mt-1">{helper}</p>}
      </div>
    )
  }
)
Input.displayName = 'Input'

export { Input }
