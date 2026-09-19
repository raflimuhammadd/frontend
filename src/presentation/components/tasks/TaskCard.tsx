'use client'

import React from 'react'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Button } from '@/presentation/components/ui/Button'
import { StatusBadge } from '@/presentation/components/ui/Badge'
import { PriorityBadge } from '@/presentation/components/ui/Badge'
import { Avatar } from '@/presentation/components/ui/Avatar'
import type { Task } from '@/domain/types'

interface TaskCardProps {
  task: Task
  projectId: string
  onView?: (task: Task) => void
}

export function TaskCard({ task, projectId, onView }: TaskCardProps) {
  return (
    <div 
      onClick={() => onView?.(task)}
      className="px-5 py-4 grid grid-cols-[2.35fr_1fr_80px_1.3fr_1fr_70px] gap-4 items-center transition-all hover:bg-hover-bg hover:translate-x-[2px] cursor-pointer border-b border-border-light group"
    >
      {/* Task ID + Title */}
      <div className="flex flex-col gap-1 min-w-0">
        <span className="font-mono text-[10px] text-text-secondary">
          NW-{String(task.id).padStart(3, '0')}
        </span>
        <span className="text-[13px] font-bold text-text-primary truncate">
          {task.title}
        </span>
      </div>
      
      {/* Status */}
      <div>
        <StatusBadge status={task.status} />
      </div>
      
      {/* Priority */}
      <div className="flex justify-center">
        <PriorityBadge priority={task.priority} />
      </div>
      
      {/* Assignee */}
      <div className="flex items-center gap-2 min-w-0">
        {task.assignedToId ? (
          <>
            <Avatar size="sm" fallback={task.title} />
            <span className="text-[12px] text-text-primary truncate">
              {task.title}
            </span>
          </>
        ) : (
          <span className="text-[12px] text-text-tertiary italic">Unassigned</span>
        )}
      </div>
      
      {/* Due Date */}
      <div>
        {task.dueDate && (
          <span className="font-mono text-[10px] text-text-secondary">
            {new Date(task.dueDate).toLocaleDateString('en-US', { 
              month: 'short', 
              day: 'numeric' 
            })}
          </span>
        )}
      </div>
      
      {/* Actions */}
      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <button 
          className="p-1 hover:bg-border-light rounded"
          title="Edit"
        >
          <span className="inline-block w-[14px] h-[14px]" data-icon="lucide:edit-2" data-inline="false" />
        </button>
        <button 
          className="p-1 hover:bg-border-light rounded"
          title="Delete"
        >
          <span className="inline-block w-[14px] h-[14px]" data-icon="lucide:trash-2" data-inline="false" />
        </button>
      </div>
    </div>
  )
}

export function SortableTaskCard({ task, projectId, onView }: TaskCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: task.id,
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <TaskCard task={task} projectId={projectId} onView={onView} />
    </div>
  )
}
