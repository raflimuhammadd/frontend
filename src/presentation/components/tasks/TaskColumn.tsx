"use client";

import type { Task, TaskStatus } from "@/domain/types";
import { apiClient } from "@/infrastructure/api/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface TaskColumnProps {
  status: TaskStatus;
  tasks: Task[];
  projectId: string;
}

export function TaskColumn({ status, tasks, projectId }: TaskColumnProps) {
  const queryClient = useQueryClient();

  const updateTaskMutation = useMutation({
    mutationFn: async (task: Task) => {
      try {
        const response = await apiClient.put(`/projects/${projectId}/tasks/${task.id}`, {
          ...task,
          version: task.version,
        });
        return response.data;
      } catch (error: any) {
        if (error.response?.status === 409) {
          // Conflict - refetch and retry
          queryClient.invalidateQueries({ queryKey: ["tasks", projectId] });
          throw new Error("Task was modified. Please refresh and try again.");
        }
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks", projectId] });
    },
  });

  const statusLabels: Record<TaskStatus, string> = {
    TODO: "To Do",
    IN_PROGRESS: "In Progress",
    DONE: "Done",
    BLOCKED: "Blocked",
  };

  return (
    <div className="rounded-lg border border-input bg-card p-4">
      <h3 className="font-semibold mb-4">{statusLabels[status]}</h3>

      <div className="space-y-3">
        {tasks.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-8">No tasks</p>
        ) : (
          tasks.map((task) => (
            <div
              key={task.id}
              className="rounded-md border border-input bg-background p-3 hover:shadow-sm cursor-pointer"
            >
              <p className="font-medium text-sm">{task.title}</p>
              <div className="flex justify-between items-center mt-2 text-xs text-muted-foreground">
                <span className={`px-2 py-1 rounded bg-input text-xs`}>{task.priority}</span>
                {status === "BLOCKED" && <span className="text-red-600">Blocked</span>}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
