'use client'

import { useQuery } from '@tanstack/react-query'
import { apiClient } from '@/infrastructure/api/client'
import { TaskColumn } from '@/presentation/components/tasks/TaskColumn'
import type { Task, TaskStatus } from '@/domain/types'

interface TaskBoardPageProps {
  projectId: string
}

const STATUSES: TaskStatus[] = ['TODO', 'IN_PROGRESS', 'DONE', 'BLOCKED']

export function TaskBoardPage({ projectId }: TaskBoardPageProps) {
  const { data: tasksData, isLoading } = useQuery({
    queryKey: ['tasks', projectId],
    queryFn: async () => {
      const response = await apiClient.get(`/projects/${projectId}/tasks`)
      return response.data.data || response.data
    },
  })

  const tasks: Task[] = Array.isArray(tasksData) ? tasksData : []

  const tasksByStatus = STATUSES.reduce(
    (acc, status) => {
      acc[status] = tasks.filter((t) => t.status === status)
      return acc
    },
    {} as Record<TaskStatus, Task[]>
  )

  if (isLoading) {
    return <div className="p-6">Loading board...</div>
  }

  return (
    <div className="space-y-6 p-6">
      <h1 className="text-3xl font-bold">Task Board</h1>

      <div className="grid grid-cols-4 gap-4">
        {STATUSES.map((status) => (
          <TaskColumn
            key={status}
            status={status}
            tasks={tasksByStatus[status]}
            projectId={projectId}
          />
        ))}
      </div>
    </div>
  )
}
