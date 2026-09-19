'use client'

import React from 'react'
import { useDroppable } from '@dnd-kit/core'
import { Badge } from '@/presentation/components/ui/Badge'
import { EmptyState } from '@/presentation/components/ui/EmptyState'
import { SortableTaskCard } from './TaskCard'
import type { Task, TaskStatus } from '@/domain/types'

interface SortableTaskColumnProps {
  status: TaskStatus
  label: string
  color: 'primary' | 'warning' | 'success' | 'error'
  tasks: Task[]
  projectId: string
  onTaskUpdate: () => void
}

export function SortableTaskColumn({
  status,
  label,
  color,
  tasks,
  projectId,
  onTaskUpdate,
}: SortableTaskColumnProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: status,
  })

  return (
    <div
      ref={setNodeRef}
      className={`bg-card border border-border rounded-lg p-4 transition-colors ${
        isOver ? 'border-primary bg-primary/5' : ''
      }`}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-foreground">{label}</h3>
        <Badge color={color} size="sm">
          {tasks.length}
        </Badge>
      </div>

      <div className="space-y-3 min-h-[200px]">
        {tasks.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <p className="text-sm text-muted-foreground">No tasks</p>
          </div>
        ) : (
          tasks.map((task) => (
            <SortableTaskCard
              key={task.id}
              task={task}
              projectId={projectId}
              onView={() => {}}
            />
          ))
        )}
      </div>
    </div>
  )
}
