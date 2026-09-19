'use client'

import React from 'react'
import { useQuery } from '@tanstack/react-query'
import { apiClient } from '@/infrastructure/api/client'
import { useAuthStore } from '@/shared/stores/auth.store'
import { Card, CardContent, CardHeader } from '@/presentation/components/ui/Card'
import { Badge } from '@/presentation/components/ui/Badge'
import { Input } from '@/presentation/components/ui/Input'
import { Skeleton } from '@/presentation/components/ui/Skeleton'
import { ErrorState } from '@/presentation/components/ui/ErrorState'
import { Button } from '@/presentation/components/ui/Button'

interface AuditLog {
  id: string
  userId: string
  taskId: string
  action: string
  changedField?: string
  oldValue?: string
  newValue?: string
  timestamp: string
  user?: {
    firstName: string
    lastName: string
    role: string
  }
  task?: {
    title: string
  }
}

export function AuditTrailPage() {
  const { user } = useAuthStore()
  const [searchQuery, setSearchQuery] = React.useState('')
  const [actionFilter, setActionFilter] = React.useState<string>('')
  const [dateFilter, setDateFilter] = React.useState<string>('')

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['audit-logs'],
    queryFn: async () => {
      const response = await apiClient.get('/audit-logs')
      return response.data.data || response.data || []
    },
    enabled: user?.role === 'PM',
  })

  const auditLogs: AuditLog[] = Array.isArray(data) ? data : []

  const filteredLogs = auditLogs.filter(log => {
    const matchesSearch =
      log.taskId?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.action?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.user?.firstName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.user?.lastName?.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesAction = !actionFilter || log.action === actionFilter
    return matchesSearch && matchesAction
  })

  const getActionColor = (action: string) => {
    switch (action.toLowerCase()) {
      case 'create':
      case 'created':
        return 'success'
      case 'update':
      case 'updated':
        return 'warning'
      case 'delete':
      case 'deleted':
        return 'error'
      case 'status_change':
        return 'info'
      default:
        return 'secondary'
    }
  }

  const formatTimestamp = (timestamp: string) => {
    try {
      const date = new Date(timestamp)
      const now = new Date()
      const diffMs = now.getTime() - date.getTime()
      const diffMins = Math.floor(diffMs / 60000)
      const diffHours = Math.floor(diffMs / 3600000)
      const diffDays = Math.floor(diffMs / 86400000)

      if (diffMins < 1) return 'just now'
      if (diffMins < 60) return `${diffMins} min ago`
      if (diffHours < 24) return `${diffHours} hr ago`
      if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`
      return date.toLocaleDateString()
    } catch {
      return timestamp
    }
  }

  if (user?.role !== 'PM') {
    return (
      <div className="max-w-[1430px] mx-auto px-5 md:px-10 py-8">
        <div className="text-center py-20">
          <div className="text-[48px] mb-4">🔒</div>
          <h2 className="text-[24px] font-bold mb-2">Access Denied</h2>
          <p className="text-text-secondary">Only Project Managers can access the audit trail.</p>
        </div>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="max-w-[1430px] mx-auto px-5 md:px-10 py-8">
        <Skeleton width="300px" height="60px" className="mb-8" />
        <Skeleton width="100%" height="400px" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="max-w-[1430px] mx-auto px-5 md:px-10 py-8">
        <ErrorState
          message={error instanceof Error ? error.message : 'Failed to load audit logs'}
          onRetry={() => refetch()}
        />
      </div>
    )
  }

  return (
    <div className="max-w-[1430px] mx-auto px-5 md:px-10 py-8">
      <div className="mb-10">
        <div className="font-mono text-[10px] uppercase tracking-wide-20 text-brand-red mb-3">
          / admin / compliance
        </div>
        <h1 className="text-[46px] md:text-[58px] leading-[.9] font-bold tracking-tight-07 font-heading">
          Audit trail.
        </h1>
        <p className="text-[13px] text-text-secondary mt-5 max-w-[430px]">
          Immutable record of all task changes, status transitions, and user actions across projects.
        </p>
      </div>

      <Card className="border-border-light mb-6">
        <CardHeader className="border-b border-border-light">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-2">
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-text-secondary text-[15px]" data-icon="lucide:search" data-inline="false" />
                <input
                  type="text"
                  placeholder="Search task, user, or action"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-[220px] h-9 pl-9 pr-3 rounded-none border border-border-light text-[11px] outline-none focus:border-text-primary"
                />
              </div>
              <select
                value={actionFilter}
                onChange={e => setActionFilter(e.target.value)}
                className="h-9 px-3 border border-border-light text-[11px] outline-none focus:border-text-primary"
              >
                <option value="">All actions</option>
                <option value="created">Created</option>
                <option value="updated">Updated</option>
                <option value="status_change">Status Change</option>
                <option value="deleted">Deleted</option>
              </select>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <span className="inline-block w-[14px] h-[14px]" data-icon="lucide:download" data-inline="false" />
                <span className="ml-2">Export</span>
              </Button>
              <span className="font-mono text-[9px] uppercase text-text-secondary">
                {filteredLogs.length} entries
              </span>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          {filteredLogs.length === 0 ? (
            <div className="p-8 text-center text-text-secondary">
              <div className="text-[13px] mb-2">No audit logs found</div>
              <p className="text-[11px]">
                {auditLogs.length === 0
                  ? 'Changes to tasks will be recorded here'
                  : 'Try adjusting your filters'}
              </p>
            </div>
          ) : (
            <div className="divide-y divide-border-light">
              {filteredLogs.map(log => (
                <div key={log.id} className="p-4 hover:bg-hover-bg transition-colors">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-muted/30 text-text-primary flex items-center justify-center font-mono text-[9px] font-bold">
                        {log.user?.firstName?.[0] || '?'}
                        {log.user?.lastName?.[0] || '?'}
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-[13px] font-semibold text-text-primary">
                            {log.user?.firstName} {log.user?.lastName}
                          </span>
                          <Badge color={getActionColor(log.action)} size="sm">
                            {log.action}
                          </Badge>
                        </div>
                        <div className="text-[11px] text-text-secondary">
                          <span className="font-mono">{log.user?.role || 'Unknown'}</span>
                          {' · '}
                          {formatTimestamp(log.timestamp)}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="ml-11 space-y-2">
                    <div className="text-[12px]">
                      <span className="text-text-secondary">Task: </span>
                      <span className="font-mono text-text-primary">
                        {log.task?.title || log.taskId?.slice(0, 8).toUpperCase()}
                      </span>
                    </div>

                    {log.changedField && (
                      <div className="text-[12px]">
                        <span className="text-text-secondary">Field: </span>
                        <span className="font-mono text-text-primary">{log.changedField}</span>
                      </div>
                    )}

                    {(log.oldValue || log.newValue) && (
                      <div className="flex items-start gap-2 text-[11px] font-mono mt-2 p-2 bg-hover-bg rounded">
                        {log.oldValue && (
                          <div className="flex-1">
                            <span className="text-text-secondary">Old: </span>
                            <span className="text-brand-red line-through">{log.oldValue}</span>
                          </div>
                        )}
                        {log.newValue && (
                          <div className="flex-1">
                            <span className="text-text-secondary">New: </span>
                            <span className="text-brand-green">{log.newValue}</span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <div className="p-4 bg-hover-bg border border-border-light">
        <div className="flex items-start gap-3">
          <span className="inline-block w-[16px] h-[16px] text-text-secondary mt-0.5" data-icon="lucide:shield-check" data-inline="false" />
          <div>
            <h4 className="text-[11px] font-semibold text-text-primary mb-1 font-mono uppercase tracking-wide-15">
              Immutable audit trail
            </h4>
            <p className="text-[11px] text-text-secondary">
              All changes are permanently recorded and cannot be modified or deleted. This log serves as the
              authoritative source of truth for compliance and accountability.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
