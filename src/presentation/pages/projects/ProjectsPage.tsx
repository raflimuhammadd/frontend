'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'
import { apiClient } from '@/infrastructure/api/client'
import { useAuthStore } from '@/shared/stores/auth.store'
import type { Project } from '@/domain/types'

export function ProjectsPage() {
  const { isAuthenticated } = useAuthStore()
  const router = useRouter()

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/auth/login')
    }
  }, [isAuthenticated, router])

  const { data: projectsData, isLoading, error } = useQuery({
    queryKey: ['projects'],
    queryFn: async () => {
      const response = await apiClient.get('/projects')
      return response.data.data || response.data
    },
    enabled: isAuthenticated,
  })

  const projects: Project[] = Array.isArray(projectsData) ? projectsData : []

  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="space-y-4 p-6">
      <h1 className="text-3xl font-bold">Projects</h1>

      {isLoading && (
        <div className="flex items-center justify-center py-12">
          <p className="text-muted-foreground">Loading projects...</p>
        </div>
      )}

      {error && (
        <div className="rounded-md bg-red-500/15 p-4 text-red-600">
          Failed to load projects. Please try again.
        </div>
      )}

      {!isLoading && projects.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12">
          <p className="text-muted-foreground">No projects yet</p>
        </div>
      )}

      {!isLoading && projects.length > 0 && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <div
              key={project.id}
              className="rounded-lg border border-input bg-card p-6 hover:shadow-md cursor-pointer transition-shadow"
            >
              <h3 className="font-semibold text-lg">{project.name}</h3>
              <p className="text-sm text-muted-foreground mt-2">
                {project.description}
              </p>
              {project.progress !== undefined && (
                <div className="mt-4">
                  <div className="flex justify-between text-sm mb-1">
                    <span>Progress</span>
                    <span>{project.progress}%</span>
                  </div>
                  <div className="w-full bg-input rounded-full h-2">
                    <div
                      className="bg-primary h-2 rounded-full"
                      style={{ width: `${project.progress}%` }}
                    />
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
