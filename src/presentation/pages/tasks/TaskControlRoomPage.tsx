'use client'

import React from 'react'
import Link from 'next/link'
import { useQuery } from '@tanstack/react-query'
import { apiClient } from '@/infrastructure/api/client'
import { useAuthStore } from '@/shared/stores/auth.store'
import { MetricGrid } from '@/presentation/components/ui/MetricCard'
import { Card, CardContent, CardHeader } from '@/presentation/components/ui/Card'
import { Button } from '@/presentation/components/ui/Button'
import { Badge } from '@/presentation/components/ui/Badge'
import { Input } from '@/presentation/components/ui/Input'
import { Skeleton } from '@/presentation/components/ui/Skeleton'
import { ErrorState } from '@/presentation/components/ui/ErrorState'
import type { Task } from '@/domain/types'

export function TaskControlRoomPage() {
  const { user } = useAuthStore()
  const [searchQuery, setSearchQuery] = React.useState('')
  const [statusFilter, setStatusFilter] = React.useState<string>('')
  const [priorityFilter, setPriorityFilter] = React.useState<string>('')
  const [currentPage, setCurrentPage] = React.useState(1)
  const itemsPerPage = 6

  const { data: tasks, isLoading, error, refetch } = useQuery({
    queryKey: ['tasks-all'],
    queryFn: async () => {
      const response = await apiClient.get('/tasks')
      return response.data.data || response.data
    },
  })

  const tasksList: Task[] = Array.isArray(tasks) ? tasks : []

  const filteredTasks = tasksList.filter(task => {
    const matchesSearch =
      task.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.title.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = !statusFilter || task.status === statusFilter
    const matchesPriority = !priorityFilter || task.priority === priorityFilter
    return matchesSearch && matchesStatus && matchesPriority
  })

  const paginatedTasks = filteredTasks.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  const totalPages = Math.ceil(filteredTasks.length / itemsPerPage)

  const metrics = [
    {
      label: 'Total Tasks',
      value: tasksList.length,
      subtext: `${tasksList.length} tasks`,
      icon: 'lucide:list-checks',
    },
    {
      label: 'In Progress',
      value: tasksList.filter(t => t.status === 'IN_PROGRESS').length,
      subtext: `${Math.round(
        (tasksList.filter(t => t.status === 'IN_PROGRESS').length / (tasksList.length || 1)) * 100
      )}% workload`,
    },
    {
      label: 'Blocked',
      value: tasksList.filter(t => t.status === 'BLOCKED').length,
      subtext: 'dependency risk',
    },
    {
      label: 'Completed',
      value: tasksList.filter(t => t.status === 'DONE').length,
      subtext: `${Math.round(
        (tasksList.filter(t => t.status === 'DONE').length / (tasksList.length || 1)) * 100
      )}% complete`,
    },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'TODO':
        return 'secondary'
      case 'IN_PROGRESS':
        return 'warning'
      case 'DONE':
        return 'success'
      case 'BLOCKED':
        return 'error'
      default:
        return 'primary'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'HIGH':
        return 'text-brand-red'
      case 'MEDIUM':
        return 'text-brand-orange'
      case 'LOW':
        return 'text-text-secondary'
      default:
        return 'text-text-secondary'
    }
  }

  if (isLoading) {
    return (
      <div className="max-w-[1430px] mx-auto px-5 md:px-10 py-8">
        <Skeleton width="300px" height="60px" className="mb-8" />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-border-light border border-border-light mb-8">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="bg-background-card px-4 py-5">
              <Skeleton width="60%" height="12px" className="mb-4" />
              <Skeleton width="80%" height="32px" className="mb-2" />
              <Skeleton width="40%" height="9px" />
            </div>
          ))}
        </div>
        <Skeleton width="100%" height="400px" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="max-w-[1430px] mx-auto px-5 md:px-10 py-8">
        <ErrorState
          message={error instanceof Error ? error.message : 'Failed to load tasks'}
          onRetry={() => refetch()}
        />
      </div>
    )
  }

  return (
    <div className="max-w-[1430px] mx-auto px-5 md:px-10 py-8">
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-10">
        <div>
          <div className="font-mono text-[10px] uppercase tracking-wide-20 text-brand-red mb-3">
            / delivery / active project
          </div>
          <h1 className="text-[46px] md:text-[58px] leading-[.9] font-bold tracking-tight-07 font-heading">
            Task control.
          </h1>
          <p className="text-[13px] text-text-secondary mt-5 max-w-[430px]">
            A live operational view of ownership, dependency health, and delivery state.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="h-10 px-4">
            <span className="inline-block w-[15px] h-[15px]" data-icon="lucide:download" data-inline="false" />
            <span className="ml-2 text-[11px] uppercase tracking-wide-15 font-mono">Export</span>
          </Button>
          <Button className="h-10 px-4 bg-text-primary text-white">
            <span className="inline-block w-[16px] h-[16px]" data-icon="lucide:plus" data-inline="false" />
            <span className="ml-2 text-[11px] uppercase tracking-wide-15 font-mono">New task</span>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-border-light border border-border-light mb-8">
        {metrics.map((metric, index) => (
          <div key={index} className="bg-background-card px-4 py-5">
            <div className="flex justify-between items-start">
              <span className="text-[10px] uppercase tracking-wide-15 text-text-secondary font-semibold font-mono">
                {metric.label}
              </span>
              {metric.icon && (
                <span className="inline-block w-[16px] h-[16px] text-text-secondary" data-icon={metric.icon} data-inline="false" />
              )}
            </div>
            <div className="text-[32px] font-bold tracking-tight-06 mt-3 font-heading text-text-primary">
              {metric.value}
            </div>
            {metric.subtext && (
              <div className="font-mono text-[9px] uppercase text-text-secondary mt-1">
                {metric.subtext}
              </div>
            )}
          </div>
        ))}
      </div>

      <Card className="border-border-light">
        <CardHeader className="border-b border-border-light">
          <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-2">
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-text-secondary text-[15px]" data-icon="lucide:search" data-inline="false" />
                <input
                  type="text"
                  placeholder="Search task ID or name"
                  value={searchQuery}
                  onChange={e => {
                    setSearchQuery(e.target.value)
                    setCurrentPage(1)
                  }}
                  className="w-[220px] h-9 pl-9 pr-3 rounded-none border border-border-light text-[11px] outline-none focus:border-text-primary"
                />
              </div>
              <button className="h-9 px-3 border border-border-light text-[10px] uppercase tracking-wide-15 font-semibold flex items-center gap-2 hover:border-text-primary">
                <span className="inline-block w-[14px] h-[14px]" data-icon="lucide:sliders-horizontal" data-inline="false" />
                Filters
                <span className="font-mono text-brand-red">03</span>
              </button>
              <button className="h-9 px-3 text-[10px] uppercase tracking-wide-15 text-text-secondary flex items-center gap-2 hover:text-text-primary">
                <span className="inline-block w-[14px] h-[14px]" data-icon="lucide:arrow-up-down" data-inline="false" />
                Recent
              </button>
            </div>
            <div className="flex items-center gap-3">
              <span className="font-mono text-[9px] uppercase text-text-secondary">
                {Math.max(1, (currentPage - 1) * itemsPerPage + 1)}—
                {Math.min(currentPage * itemsPerPage, filteredTasks.length)} / {filteredTasks.length}
              </span>
              <button className="w-8 h-8 border border-border-light text-text-primary flex items-center justify-center">
                <span className="inline-block w-[15px] h-[15px]" data-icon="lucide:layout-list" data-inline="false" />
              </button>
            </div>
          </div>
        </CardHeader>

        <div className="hidden md:grid px-5 py-3 bg-hover-bg border-b border-border-light grid-cols-[2.35fr_1fr_80px_1.3fr_1fr_70px] gap-4 text-[10px] uppercase tracking-wide-15 font-semibold text-text-secondary font-mono">
          <div>Task</div>
          <div>Status</div>
          <div>Owner</div>
          <div>Dependencies</div>
          <div>Priority</div>
          <div></div>
        </div>

        <CardContent className="p-0">
          {paginatedTasks.length === 0 ? (
            <div className="p-8 text-center text-text-secondary">
              <div className="text-[13px] mb-2">No tasks found</div>
              <p className="text-[11px]">Try adjusting your filters or search query</p>
            </div>
          ) : (
            <div className="divide-y divide-border-light">
              {paginatedTasks.map(task => (
                <div
                  key={task.id}
                  className="task-row px-4 md:px-5 py-4 grid grid-cols-1 md:grid-cols-[2.35fr_1fr_80px_1.3fr_1fr_70px] gap-3 md:gap-4 items-center hover:bg-hover-bg hover:translate-x-[2px] transition-all"
                >
                  <div>
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-[10px] text-text-secondary">
                        {task.id.slice(0, 6).toUpperCase()}
                      </span>
                      <span className="text-[13px] font-semibold text-text-primary">{task.title}</span>
                    </div>
                    <div className="font-mono text-[9px] uppercase text-text-secondary mt-2 md:pl-[45px]">
                      {task.assignedDepartment || 'unassigned'} · just now
                    </div>
                  </div>

                  <div>
                    <Badge color={getStatusColor(task.status)} size="sm">
                      {task.status.replace('_', ' ')}
                    </Badge>
                  </div>

                  <div className="flex md:justify-start">
                    <div className="w-7 h-7 bg-muted/30 text-text-primary flex items-center justify-center font-mono text-[9px] font-bold">
                      {task.id.slice(0, 2).toUpperCase()}
                    </div>
                  </div>

                  <div className="font-mono text-[10px] text-text-secondary">
                    — no blockers
                  </div>

                  <div className={`text-[10px] uppercase font-semibold ${getPriorityColor(task.priority)}`}>
                    ● {task.priority}
                  </div>

                  <div className="flex gap-1 justify-end md:justify-start">
                    <button title="View task" className="w-7 h-7 text-text-secondary hover:text-text-primary">
                      <span className="inline-block w-[15px] h-[15px]" data-icon="lucide:eye" data-inline="false" />
                    </button>
                    <button title="More actions" className="w-7 h-7 text-text-secondary hover:text-text-primary">
                      <span className="inline-block w-[15px] h-[15px]" data-icon="lucide:more-horizontal" data-inline="false" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>

        <div className="px-4 md:px-5 py-4 border-t border-border-light flex flex-col md:flex-row md:items-center justify-between gap-3">
          <span className="font-mono text-[9px] uppercase tracking-wide-15 text-text-secondary">
            Dependency gate active · status transitions are validated server-side
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="w-8 h-8 border border-border-light text-text-secondary flex items-center justify-center hover:text-text-primary disabled:opacity-50"
            >
              <span className="inline-block w-[14px] h-[14px]" data-icon="lucide:chevron-left" data-inline="false" />
            </button>
            <span className="w-8 h-8 bg-text-primary text-white font-mono text-[10px] flex items-center justify-center">
              {currentPage.toString().padStart(2, '0')}
            </span>
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="w-8 h-8 border border-border-light text-text-primary flex items-center justify-center hover:text-text-primary disabled:opacity-50"
            >
              <span className="inline-block w-[14px] h-[14px]" data-icon="lucide:chevron-right" data-inline="false" />
            </button>
          </div>
        </div>
      </Card>
    </div>
  )
}
