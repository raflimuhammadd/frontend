'use client'

import React from 'react'
import { useQuery } from '@tanstack/react-query'
import { apiClient } from '@/infrastructure/api/client'
import { Card, CardContent, CardHeader } from '@/presentation/components/ui/Card'
import { Badge } from '@/presentation/components/ui/Badge'
import { Skeleton } from '@/presentation/components/ui/Skeleton'
import { EmptyState } from '@/presentation/components/ui/EmptyState'
import { ErrorState } from '@/presentation/components/ui/ErrorState'

interface ClientMetrics {
  projectId: string
  projectName: string
  totalTasks: number
  completedTasks: number
  blockedTasks: number
  progress: number
}

export function ClientGuestDashboard({ projectId }: { projectId: string }) {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['client-metrics', projectId],
    queryFn: async () => {
      const response = await apiClient.get(`/projects/${projectId}/client-metrics`)
      return response.data.data
    },
  })

  const metrics: ClientMetrics = data || {}

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Skeleton width="300px" height="40px" className="mb-6" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} width="100%" height="120px" />
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ErrorState
          message={error instanceof Error ? error.message : 'Failed to load metrics'}
          onRetry={() => refetch()}
        />
      </div>
    )
  }

  if (!metrics.projectId) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <EmptyState
          title="No project data available"
          description="You don't have access to any projects or no data is available at this time"
        />
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">{metrics.projectName}</h1>
        <p className="text-muted-foreground mt-1">Project Overview</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card className="border-border">
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground mb-1">Progress</p>
            <p className="text-3xl font-bold text-primary mb-2">{metrics.progress}%</p>
            <div className="w-full bg-muted/30 rounded-full h-2">
              <div
                className="bg-primary h-2 rounded-full transition-all"
                style={{ width: `${metrics.progress}%` }}
              />
            </div>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground mb-1">Total Tasks</p>
            <p className="text-3xl font-bold text-foreground">{metrics.totalTasks}</p>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground mb-1">Completed</p>
            <p className="text-3xl font-bold text-success">{metrics.completedTasks}</p>
            <p className="text-xs text-muted-foreground mt-1">
              {metrics.totalTasks > 0
                ? Math.round((metrics.completedTasks / metrics.totalTasks) * 100)
                : 0}
              % of tasks
            </p>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground mb-1">Blocked</p>
            <p className="text-3xl font-bold text-error">{metrics.blockedTasks}</p>
          </CardContent>
        </Card>
      </div>

      <Card className="border-border">
        <CardHeader>
          <h2 className="text-lg font-semibold text-foreground">Timeline</h2>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-3 h-3 rounded-full bg-success flex-shrink-0" />
              <div className="flex-1">
                <p className="text-sm font-medium text-foreground">On Track</p>
                <p className="text-xs text-muted-foreground">Project is progressing as planned</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-3 h-3 rounded-full bg-warning flex-shrink-0" />
              <div className="flex-1">
                <p className="text-sm font-medium text-foreground">Attention Needed</p>
                <p className="text-xs text-muted-foreground">{metrics.blockedTasks} tasks require attention</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
