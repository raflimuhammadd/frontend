'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '@/infrastructure/api/client'
import { useAuthStore } from '@/shared/stores/auth.store'
import type { Task, TaskStatus } from '@/domain/types'

interface TaskModalProps {
  task: Task
  projectId: string
  isOpen: boolean
  onClose: () => void
}

export function TaskModal({ task, projectId, isOpen, onClose }: TaskModalProps) {
  const queryClient = useQueryClient()
  const { user } = useAuthStore()

  const { data: dependencies } = useQuery({
    queryKey: ['task-dependencies', task.id],
    queryFn: async () => {
      const response = await apiClient.get(
        `/projects/${projectId}/tasks/${task.id}/dependencies`
      )
      return response.data.data || response.data
    },
    enabled: isOpen,
  })

  const updateTaskMutation = useMutation({
    mutationFn: async (newStatus: TaskStatus) => {
      const response = await apiClient.put(
        `/projects/${projectId}/tasks/${task.id}`,
        {
          status: newStatus,
          version: task.version,
        }
      )
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks', projectId] })
      onClose()
    },
  })

  const canStartTask = () => {
    if (newStatus === 'IN_PROGRESS' && dependencies) {
      const blockedDeps = dependencies.filter(
        (d: any) => d.dependsOnTask?.status !== 'DONE'
      )
      return blockedDeps.length === 0
    }
    return true
  }

  const isPM = user?.role === 'PM'
  const isAssigned = user?.id === task.assignedToId

  const [newStatus, setNewStatus] = React.useState(task.status)

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-card rounded-lg max-w-md w-full p-6 space-y-4">
        <div>
          <h2 className="text-xl font-bold">{task.title}</h2>
          <p className="text-sm text-muted-foreground mt-1">{task.description}</p>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Status</label>
          <select
            value={newStatus}
            onChange={(e) => setNewStatus(e.target.value as TaskStatus)}
            disabled={!isAssigned || (newStatus === 'DONE' && isPM)}
            className="w-full rounded border border-input bg-background px-3 py-2"
          >
            <option value="TODO">To Do</option>
            <option value="IN_PROGRESS" disabled={!canStartTask()}>
              In Progress {!canStartTask() ? '(Blocked)' : ''}
            </option>
            <option value="DONE">Done</option>
            <option value="BLOCKED">Blocked</option>
          </select>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => updateTaskMutation.mutate(newStatus)}
            disabled={newStatus === task.status || updateTaskMutation.isPending}
            className="flex-1 bg-primary text-primary-foreground px-3 py-2 rounded disabled:opacity-50"
          >
            Save
          </button>
          <button
            onClick={onClose}
            className="flex-1 border border-input px-3 py-2 rounded hover:bg-input"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}

import React from 'react'
