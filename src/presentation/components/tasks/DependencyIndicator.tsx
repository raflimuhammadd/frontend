'use client'

import { useQuery } from '@tanstack/react-query'
import { apiClient } from '@/infrastructure/api/client'
import type { Task, TaskDependency } from '@/domain/types'

interface DependencyIndicatorProps {
  task: Task
  projectId: string
}

export function DependencyIndicator({ task, projectId }: DependencyIndicatorProps) {
  const { data: dependencies } = useQuery({
    queryKey: ['task-dependencies', task.id],
    queryFn: async () => {
      const response = await apiClient.get(
        `/projects/${projectId}/tasks/${task.id}/dependencies`
      )
      return response.data.data || response.data
    },
  })

  const deps: TaskDependency[] = Array.isArray(dependencies) ? dependencies : []
  const blockedCount = deps.filter((d) => d.dependsOnTask?.status !== 'DONE').length

  if (deps.length === 0) return null

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'DONE':
        return 'text-status-done'
      case 'IN_PROGRESS':
        return 'text-status-in-progress'
      case 'BLOCKED':
        return 'text-status-blocked'
      default:
        return 'text-status-todo'
    }
  }

  return (
    <div className="mt-2 space-y-1">
      {blockedCount > 0 && (
        <div className="text-[10px] bg-status-blocked/10 text-status-blocked px-2 py-1 rounded font-mono uppercase tracking-[0.08em]">
          {blockedCount} blocker{blockedCount !== 1 ? 's' : ''}
        </div>
      )}
      <div className="space-y-1">
        {deps.slice(0, 3).map((dep) => (
          <div 
            key={dep.id} 
            className="font-mono text-[10px] text-text-secondary hover:text-brand-red hover:drop-shadow-[0_0_12px_rgba(230,57,70,0.45)] transition-all cursor-pointer"
          >
            → NW-{String(dep.dependsOnTaskId).padStart(3, '0')}{' '}
            <span className={getStatusColor(dep.dependsOnTask?.status || 'TODO')}>
              {dep.dependsOnTask?.status?.toLowerCase().replace('_', ' ') || 'pending'}
            </span>
          </div>
        ))}
        {deps.length > 3 && (
          <div className="font-mono text-[10px] text-text-tertiary">
            +{deps.length - 3} more
          </div>
        )}
      </div>
    </div>
  )
}
