"use client";

import type { Task, TaskStatus } from "@/domain/types";
import { apiClient } from "@/infrastructure/api/client";
import { SortableTaskColumn } from "@/presentation/components/tasks/SortableTaskColumn";
import { TaskModal } from "@/presentation/components/tasks/TaskModal";
import { Badge } from "@/presentation/components/ui/Badge";
import { Button } from "@/presentation/components/ui/Button";
import { EmptyState } from "@/presentation/components/ui/EmptyState";
import { ErrorState } from "@/presentation/components/ui/ErrorState";
import { Input } from "@/presentation/components/ui/Input";
import { Select } from "@/presentation/components/ui/Select";
import { Skeleton } from "@/presentation/components/ui/Skeleton";
import { useAuthStore } from "@/shared/stores/auth.store";
import { DndContext, type DragEndEvent, closestCorners } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { useQuery } from "@tanstack/react-query";
import React from "react";

interface TaskBoardPageProps {
  projectId: string;
}

const STATUSES: TaskStatus[] = ["TODO", "IN_PROGRESS", "DONE", "BLOCKED"];

export function TaskBoardPage({ projectId }: TaskBoardPageProps) {
  const { user } = useAuthStore();
  const [isTaskModalOpen, setIsTaskModalOpen] = React.useState(false);
  const [filters, setFilters] = React.useState({
    assignee: "",
    priority: "",
    dueDateFrom: "",
    dueDateTo: "",
  });

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["tasks", projectId],
    queryFn: async () => {
      const response = await apiClient.get(`/projects/${projectId}/tasks`);
      return response.data.data || response.data;
    },
  });

  const tasks: Task[] = Array.isArray(data) ? data : [];

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (active && over && active.id !== over.id) {
      try {
        await apiClient.patch(`/tasks/${active.id}/status`, {
          status: over.id as TaskStatus,
        });
        refetch();
      } catch (error) {
        console.error("Failed to update task status:", error);
      }
    }
  };

  const tasksByStatus = STATUSES.reduce(
    (acc, status) => {
      acc[status] = tasks.filter((task) => task.status === status);
      return acc;
    },
    {} as Record<TaskStatus, Task[]>,
  );

  const statusConfigs = {
    TODO: { label: "Todo", color: "primary" as const },
    IN_PROGRESS: { label: "In Progress", color: "warning" as const },
    DONE: { label: "Done", color: "success" as const },
    BLOCKED: { label: "Blocked", color: "error" as const },
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-6">
          <Skeleton width="300px" height="40px" />
          <Skeleton width="150px" height="40px" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="border border-border rounded-lg p-4">
              <Skeleton width="100px" height="24px" className="mb-4" />
              {[1, 2, 3].map((j) => (
                <Skeleton key={j} width="100%" height="80px" className="mb-3 rounded-md" />
              ))}
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ErrorState
          message={error instanceof Error ? error.message : "Failed to load tasks"}
          onRetry={() => refetch()}
        />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Task Board</h1>
          <p className="text-muted-foreground mt-1">
            Drag tasks between columns to update their status
          </p>
        </div>
        <Button onClick={() => setIsTaskModalOpen(true)}>
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          New Task
        </Button>
      </div>

      {/* Filters */}
      <div className="mb-6 bg-card border border-border rounded-lg p-4">
        <h3 className="text-sm font-medium text-foreground mb-3">Filters</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Select
            label="Assignee"
            options={[
              { value: "", label: "All assignees" },
              { value: "me", label: "Assigned to me" },
              { value: "unassigned", label: "Unassigned" },
            ]}
            value={filters.assignee}
            onChange={(e) => setFilters({ ...filters, assignee: e.target.value })}
          />
          <Select
            label="Priority"
            options={[
              { value: "", label: "All priorities" },
              { value: "HIGH", label: "High" },
              { value: "MEDIUM", label: "Medium" },
              { value: "LOW", label: "Low" },
            ]}
            value={filters.priority}
            onChange={(e) => setFilters({ ...filters, priority: e.target.value })}
          />
          <Input
            label="Due Date From"
            type="date"
            value={filters.dueDateFrom}
            onChange={(e) => setFilters({ ...filters, dueDateFrom: e.target.value })}
          />
          <Input
            label="Due Date To"
            type="date"
            value={filters.dueDateTo}
            onChange={(e) => setFilters({ ...filters, dueDateTo: e.target.value })}
          />
        </div>
      </div>

      {/* Task Board */}
      {tasks.length === 0 ? (
        <EmptyState
          title="No tasks yet"
          description="Create your first task to start managing project deliverables"
          icon={
            <svg className="w-16 h-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              />
            </svg>
          }
          action={<Button onClick={() => setIsTaskModalOpen(true)}>Create Task</Button>}
        />
      ) : (
        <DndContext collisionDetection={closestCorners} onDragEnd={handleDragEnd}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {STATUSES.map((status) => (
              <SortableContext
                key={status}
                items={tasksByStatus[status].map((t) => t.id)}
                strategy={verticalListSortingStrategy}
              >
                <SortableTaskColumn
                  status={status}
                  label={statusConfigs[status].label}
                  color={statusConfigs[status].color}
                  tasks={tasksByStatus[status]}
                  projectId={projectId}
                  onTaskUpdate={refetch}
                />
              </SortableContext>
            ))}
          </div>
        </DndContext>
      )}

      <TaskModal
        isOpen={isTaskModalOpen}
        onClose={() => setIsTaskModalOpen(false)}
        projectId={projectId}
        onTaskCreated={refetch}
      />
    </div>
  );
}
