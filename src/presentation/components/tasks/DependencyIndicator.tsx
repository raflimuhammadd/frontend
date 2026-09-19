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

  return (
    <div className="mt-2 space-y-1">
      {blockedCount > 0 && (
        <div className="text-xs bg-red-500/20 text-red-600 px-2 py-1 rounded">
          {blockedCount} blocker{blockedCount !== 1 ? 's' : ''}
        </div>
      )}
      <div className="text-xs text-muted-foreground">
        Depends on {deps.length} task{deps.length !== 1 ? 's' : ''}
      </div>
    </div>
  )
}
