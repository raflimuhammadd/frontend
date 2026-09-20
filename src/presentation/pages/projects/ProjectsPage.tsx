"use client";

import type { Project } from "@/domain/types";
import { apiClient } from "@/infrastructure/api/client";
import { Badge } from "@/presentation/components/ui/Badge";
import { Button } from "@/presentation/components/ui/Button";
import { Card, CardContent, CardHeader } from "@/presentation/components/ui/Card";
import { EmptyState } from "@/presentation/components/ui/EmptyState";
import { ErrorState } from "@/presentation/components/ui/ErrorState";
import { Skeleton } from "@/presentation/components/ui/Skeleton";
import { useAuthStore } from "@/shared/stores/auth.store";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import React from "react";

export function ProjectsPage() {
  const { user } = useAuthStore();

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["projects"],
    queryFn: async () => {
      const response = await apiClient.get("/projects");
      return response.data.data || response.data;
    },
  });

  const projects: Project[] = Array.isArray(data) ? data : [];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PLANNING":
        return "info" as const;
      case "ACTIVE":
        return "success" as const;
      case "COMPLETED":
        return "secondary" as const;
      default:
        return "primary" as const;
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "PLANNING":
        return "Planning";
      case "ACTIVE":
        return "Active";
      case "COMPLETED":
        return "Completed";
      default:
        return status;
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-[1430px] mx-auto px-5 md:px-10 py-8">
        <div className="flex justify-between items-center mb-8">
          <Skeleton width="200px" height="32px" />
          <Skeleton width="150px" height="40px" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i} className="border-border-light">
              <CardHeader>
                <Skeleton width="80%" height="24px" className="mb-2" />
                <Skeleton width="60%" height="16px" />
              </CardHeader>
              <CardContent>
                <Skeleton width="100%" height="60px" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-[1430px] mx-auto px-5 md:px-10 py-8">
        <ErrorState
          message={error instanceof Error ? error.message : "Failed to load projects"}
          onRetry={() => refetch()}
        />
      </div>
    );
  }

  return (
    <div className="max-w-[1430px] mx-auto px-5 md:px-10 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <div className="font-mono text-[10px] uppercase tracking-wide-20 text-brand-red mb-3">
            / workspace / projects
          </div>
          <h1 className="text-[46px] md:text-[58px] leading-[.9] font-bold tracking-tight-07 font-heading">
            Projects
          </h1>
          <p className="text-[13px] text-text-secondary mt-4">
            Manage and track your project deliverables
          </p>
        </div>
        {user?.role === "PM" && (
          <Button>
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
            New Project
          </Button>
        )}
      </div>

      {projects.length === 0 ? (
        <EmptyState
          title="No projects yet"
          description="Create your first project to start managing tasks and deliverables"
          icon={
            <svg className="w-16 h-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          }
          action={user?.role === "PM" ? <Button>Create Project</Button> : undefined}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <Link key={project.id} href={`/projects/${project.id}/board`}>
              <Card className="hover:border-brand-red transition-colors cursor-pointer h-full">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-[15px] font-semibold text-text-primary line-clamp-1 font-heading">
                      {project.name}
                    </h3>
                    <Badge color={getStatusColor(project.status)} size="sm">
                      {getStatusLabel(project.status)}
                    </Badge>
                  </div>
                  {project.description && (
                    <p className="text-[13px] text-text-secondary line-clamp-2">
                      {project.description}
                    </p>
                  )}
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-3">
                    {project.progress !== undefined && (
                      <div>
                        <div className="flex justify-between text-[11px] mb-1 font-mono">
                          <span className="text-text-secondary uppercase tracking-wide-15">
                            Progress
                          </span>
                          <span className="text-text-primary font-semibold">
                            {project.progress}%
                          </span>
                        </div>
                        <div className="w-full bg-muted/30 rounded-full h-2">
                          <div
                            className="bg-brand-red h-2 rounded-full transition-all"
                            style={{ width: `${project.progress}%` }}
                          />
                        </div>
                      </div>
                    )}
                    <div className="flex items-center justify-between text-[11px] font-mono">
                      <span className="text-text-secondary uppercase tracking-wide-15">Tasks</span>
                      <span className="text-text-primary font-semibold">
                        {project.completedTasks || 0} / {project.totalTasks || 0}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
