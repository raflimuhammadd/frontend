'use client'

import React from 'react'

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  error?: string
  label?: string
  helper?: string
  options: Array<{ value: string; label: string }>
}

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, error, label, helper, id, options, ...props }, ref) => {
    const selectId = id || `select-${Math.random().toString(36).substr(2, 9)}`
    
    return (
      <div className="w-full">
        {label && (
          <label htmlFor={selectId} className="block text-sm font-medium text-foreground mb-1.5">
            {label}
            {props.required && <span className="text-error ml-1">*</span>}
          </label>
        )}
        <select
          ref={ref}
          id={selectId}
          className={`w-full px-3 py-2 bg-input text-foreground border border-border rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed ${
            error ? 'border-error focus:ring-error' : ''
          } ${className || ''}`}
          {...props}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {error && <p className="text-error text-sm mt-1">{error}</p>}
        {helper && !error && <p className="text-muted-foreground text-sm mt-1">{helper}</p>}
      </div>
    )
  }
)
Select.displayName = 'Select'

export { Select }
