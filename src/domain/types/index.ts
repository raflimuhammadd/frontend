export type UserRole = "PM" | "FRONTEND" | "BACKEND" | "UIUX" | "CLIENT_GUEST";
export type Department = "PRODUCT" | "ENGINEERING" | "DESIGN" | "CLIENT";
export type TaskStatus = "TODO" | "IN_PROGRESS" | "DONE" | "BLOCKED";

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  department: Department;
  avatar?: string;
}

export interface Project {
  id: string;
  name: string;
  description?: string;
  status: "PLANNING" | "ACTIVE" | "COMPLETED";
  ownerId: string;
  clientId?: string;
  progress?: number;
  totalTasks?: number;
  completedTasks?: number;
  createdAt: string;
}

export interface Task {
  id: string;
  projectId: string;
  title: string;
  description?: string;
  status: TaskStatus;
  assignedToId?: string;
  assignedDepartment?: Department;
  priority: "LOW" | "MEDIUM" | "HIGH";
  dueDate?: string;
  clientVisible: boolean;
  version: number;
  createdAt: string;
  updatedAt: string;
}

export interface TaskDependency {
  id: string;
  taskId: string;
  dependsOnTaskId: string;
  dependsOnTask?: Task;
}

export interface AuthResponse {
  success: boolean;
  data: {
    token: string;
    user: User;
  };
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  code?: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    total: number;
    page: number;
    rows: number;
    totalPages: number;
  };
}
