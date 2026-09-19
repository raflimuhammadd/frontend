'use client'

import React from 'react'

export interface MetricCardProps {
  label: string
  value: string | number
  subtext?: string
  icon?: string
}

export function MetricCard({ label, value, subtext, icon }: MetricCardProps) {
  return (
    <div className="bg-background-card px-4 py-5 border border-border-light">
      <div className="flex justify-between items-start">
        <span className="text-[10px] uppercase tracking-[0.15em] text-text-secondary font-semibold font-mono">
          {label}
        </span>
        {icon && (
          <span className="inline-block w-[16px] h-[16px] text-text-secondary" data-icon={icon} data-inline="false" />
        )}
      </div>
      <div className="text-[32px] font-bold tracking-[-0.06em] mt-3 font-heading text-text-primary">
        {value}
      </div>
      {subtext && (
        <div className="font-mono text-[9px] uppercase text-text-secondary mt-1">
          {subtext}
        </div>
      )}
    </div>
  )
}

export interface MetricGridProps {
  metrics: MetricCardProps[]
}

export function MetricGrid({ metrics }: MetricGridProps) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-border-light border border-border-light mb-6">
      {metrics.map((metric, index) => (
        <MetricCard key={index} {...metric} />
      ))}
    </div>
  )
}
