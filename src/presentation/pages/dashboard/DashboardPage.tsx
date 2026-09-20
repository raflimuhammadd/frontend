"use client";

import type { Project, Task } from "@/domain/types";
import { apiClient } from "@/infrastructure/api/client";
import { Badge } from "@/presentation/components/ui/Badge";
import { Button } from "@/presentation/components/ui/Button";
import { Card, CardContent, CardHeader } from "@/presentation/components/ui/Card";
import { ErrorState } from "@/presentation/components/ui/ErrorState";
import { MetricGrid } from "@/presentation/components/ui/MetricCard";
import { Skeleton } from "@/presentation/components/ui/Skeleton";
import { useAuthStore } from "@/shared/stores/auth.store";
import { useQuery } from "@tanstack/react-query";
import { CheckSquare2, FolderKanban, History, ListChecks } from "lucide-react";
import Link from "next/link";
import React from "react";

export function DashboardPage() {
  const { user } = useAuthStore();

  const { data: projects, isLoading: projectsLoading } = useQuery({
    queryKey: ["projects"],
    queryFn: async () => {
      const response = await apiClient.get("/projects");
      return response.data.data || response.data;
    },
  });

  const { data: tasks, isLoading: tasksLoading } = useQuery({
    queryKey: ["tasks-all"],
    queryFn: async () => {
      const response = await apiClient.get("/tasks");
      return response.data.data || response.data;
    },
  });

  const projectsList: Project[] = Array.isArray(projects) ? projects : [];
  const tasksList: Task[] = Array.isArray(tasks) ? tasks : [];

  const metrics = [
    {
      label: "Active Projects",
      value: projectsList.filter((p) => p.status === "ACTIVE").length,
      subtext: `${projectsList.length} total`,
    },
    {
      label: "Total Tasks",
      value: tasksList.length,
      subtext: `${user?.role || "team"} view`,
    },
    {
      label: "In Progress",
      value: tasksList.filter((t) => t.status === "IN_PROGRESS").length,
      subtext: `${Math.round((tasksList.filter((t) => t.status === "IN_PROGRESS").length / (tasksList.length || 1)) * 100)}% workload`,
    },
    {
      label: "Blocked",
      value: tasksList.filter((t) => t.status === "BLOCKED").length,
      subtext: "dependency risk",
    },
  ];

  const recentTasks = tasksList.slice(0, 5);
  const activeProjects = projectsList.filter((p) => p.status === "ACTIVE").slice(0, 3);

  if (projectsLoading || tasksLoading) {
    return (
      <div className="max-w-[1430px] mx-auto px-5 md:px-10 py-8">
        <Skeleton width="300px" height="60px" className="mb-8" />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-border-light border border-border-light mb-8">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-background-card px-4 py-5">
              <Skeleton width="60%" height="12px" className="mb-4" />
              <Skeleton width="80%" height="32px" className="mb-2" />
              <Skeleton width="40%" height="9px" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-[1430px] mx-auto px-5 md:px-10 py-8">
      <div className="mb-10">
        <div className="font-mono text-[10px] uppercase tracking-wide-20 text-brand-red mb-3">
          / dashboard / overview
        </div>
        <h1 className="text-[46px] md:text-[58px] leading-[.9] font-bold tracking-tight-07 font-heading">
          Control center.
        </h1>
        <p className="text-[13px] text-text-secondary mt-5 max-w-[430px]">
          Real-time operational view of delivery state across all projects and departments.
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-border-light border border-border-light mb-8">
        {metrics.map((metric, index) => (
          <div key={index} className="bg-background-card px-4 py-5">
            <div className="flex justify-between items-start">
              <span className="text-[10px] uppercase tracking-wide-15 text-text-secondary font-semibold font-mono">
                {metric.label}
              </span>
              <FolderKanban className="w-4 h-4 text-text-secondary" />
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
        <Card className="border-border-light">
          <CardHeader className="border-b border-border-light">
            <div className="flex items-center justify-between">
              <h3 className="text-[13px] uppercase tracking-wide-15 font-semibold font-mono text-text-primary">
                Active Projects
              </h3>
              <Link href="/projects">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-[10px] uppercase tracking-wide-15 font-mono"
                >
                  View all
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {activeProjects.length === 0 ? (
              <div className="p-6 text-center text-text-secondary text-[13px]">
                No active projects
              </div>
            ) : (
              <div className="divide-y divide-border-light">
                {activeProjects.map((project) => (
                  <Link
                    key={project.id}
                    href={`/projects/${project.id}/board`}
                    className="block p-4 hover:bg-hover-bg hover:translate-x-[2px] transition-all"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="text-[13px] font-semibold text-text-primary">
                        {project.name}
                      </h4>
                      <Badge color="success" size="sm">
                        Active
                      </Badge>
                    </div>
                    {project.description && (
                      <p className="text-[12px] text-text-secondary line-clamp-1 mb-3">
                        {project.description}
                      </p>
                    )}
                    {project.progress !== undefined && (
                      <div>
                        <div className="flex justify-between text-[11px] mb-1">
                          <span className="text-text-secondary font-mono">Progress</span>
                          <span className="text-text-primary font-semibold font-mono">
                            {project.progress}%
                          </span>
                        </div>
                        <div className="w-full bg-muted/30 rounded-full h-1.5">
                          <div
                            className="bg-brand-red h-1.5 rounded-full transition-all"
                            style={{ width: `${project.progress}%` }}
                          />
                        </div>
                      </div>
                    )}
                  </Link>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="border-border-light">
          <CardHeader className="border-b border-border-light">
            <div className="flex items-center justify-between">
              <h3 className="text-[13px] uppercase tracking-wide-15 font-semibold font-mono">
                Recent Tasks
              </h3>
              <Link href="/tasks">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-[10px] uppercase tracking-wide-15 font-mono"
                >
                  View all
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {recentTasks.length === 0 ? (
              <div className="p-6 text-center text-text-secondary text-[13px]">No tasks yet</div>
            ) : (
              <div className="divide-y divide-border-light">
                {recentTasks.map((task) => (
                  <div
                    key={task.id}
                    className="p-4 hover:bg-hover-bg hover:translate-x-[2px] transition-all"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-mono text-[10px] text-text-secondary">
                            TASK-{task.id.slice(0, 6)}
                          </span>
                          <Badge
                            color={
                              task.status === "DONE"
                                ? "success"
                                : task.status === "BLOCKED"
                                  ? "error"
                                  : task.status === "IN_PROGRESS"
                                    ? "warning"
                                    : "secondary"
                            }
                            size="sm"
                          >
                            {task.status.replace("_", " ")}
                          </Badge>
                        </div>
                        <h4 className="text-[13px] font-semibold text-text-primary line-clamp-1">
                          {task.title}
                        </h4>
                      </div>
                      <span
                        className={`text-[10px] uppercase font-semibold font-mono ${
                          task.priority === "HIGH"
                            ? "text-brand-red"
                            : task.priority === "MEDIUM"
                              ? "text-brand-orange"
                              : "text-text-secondary"
                        }`}
                      >
                        ● {task.priority}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link href="/tasks">
          <Card className="border-border-light hover:border-brand-red transition-colors cursor-pointer h-full">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-brand-dark text-white flex items-center justify-center">
                  <CheckSquare2 className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-[13px] uppercase tracking-wide-15 font-semibold font-mono mb-1">
                    Task Control
                  </h4>
                  <p className="text-[11px] text-text-secondary">Manage tasks & dependencies</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link href="/projects">
          <Card className="border-border-light hover:border-brand-red transition-colors cursor-pointer h-full">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-brand-dark text-white flex items-center justify-center">
                  <FolderKanban className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-[13px] uppercase tracking-wide-15 font-semibold font-mono mb-1">
                    Projects
                  </h4>
                  <p className="text-[11px] text-text-secondary">View all projects</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>

        {user?.role === "PM" && (
          <Link href="/admin/audit">
            <Card className="border-border-light hover:border-brand-red transition-colors cursor-pointer h-full">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-brand-dark text-white flex items-center justify-center">
                    <History className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-[13px] uppercase tracking-wide-15 font-semibold font-mono mb-1">
                      Audit Trail
                    </h4>
                    <p className="text-[11px] text-text-secondary">View change history</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        )}
      </div>
    </div>
  );
}
