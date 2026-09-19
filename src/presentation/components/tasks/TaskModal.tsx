'use client'

import React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Modal, ModalFooter } from '@/presentation/components/ui/Modal'
import { Input } from '@/presentation/components/ui/Input'
import { Select } from '@/presentation/components/ui/Select'
import { Button } from '@/presentation/components/ui/Button'
import { apiClient } from '@/infrastructure/api/client'

const taskSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH']),
  status: z.enum(['TODO', 'IN_PROGRESS', 'DONE', 'BLOCKED']),
  assignedToId: z.string().optional(),
  assignedDepartment: z.enum(['PRODUCT', 'ENGINEERING', 'DESIGN', 'CLIENT']).optional(),
  dueDate: z.string().optional(),
  clientVisible: z.boolean().optional(),
})

type TaskFormData = z.infer<typeof taskSchema>

interface TaskModalProps {
  isOpen: boolean
  onClose: () => void
  projectId: string
  task?: any
  onTaskCreated?: () => void
  onTaskUpdated?: () => void
}

export function TaskModal({
  isOpen,
  onClose,
  projectId,
  task,
  onTaskCreated,
  onTaskUpdated,
}: TaskModalProps) {
  const [isLoading, setIsLoading] = React.useState(false)
  const [error, setError] = React.useState('')

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<TaskFormData>({
    resolver: zodResolver(taskSchema),
    defaultValues: task || {
      priority: 'MEDIUM',
      status: 'TODO',
      clientVisible: false,
    },
  })

  const onSubmit = async (data: TaskFormData) => {
    setIsLoading(true)
    setError('')

    try {
      if (task) {
        await apiClient.patch(`/tasks/${task.id}`, data)
        onTaskUpdated?.()
      } else {
        await apiClient.post(`/projects/${projectId}/tasks`, data)
        onTaskCreated?.()
      }
      reset()
      onClose()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save task')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={task ? 'Edit Task' : 'Create New Task'}
      size="lg"
    >
      {error && (
        <div className="mb-4 rounded-md bg-error/15 border border-error/30 p-3 text-sm text-error">
          {error}
        </div>
      )}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          label="Title"
          placeholder="Task title"
          error={errors.title?.message}
          required
          {...register('title')}
        />
        <div>
          <label className="block text-sm font-medium text-foreground mb-1.5">
            Description
          </label>
          <textarea
            placeholder="Task description..."
            className="w-full px-3 py-2 bg-input text-foreground border border-border rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent min-h-[100px] resize-y"
            {...register('description')}
          />
          {errors.description && (
            <p className="text-error text-sm mt-1">{errors.description.message}</p>
          )}
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Select
            label="Priority"
            options={[
              { value: 'LOW', label: 'Low' },
              { value: 'MEDIUM', label: 'Medium' },
              { value: 'HIGH', label: 'High' },
            ]}
            error={errors.priority?.message}
            required
            {...register('priority')}
          />
          <Select
            label="Status"
            options={[
              { value: 'TODO', label: 'Todo' },
              { value: 'IN_PROGRESS', label: 'In Progress' },
              { value: 'DONE', label: 'Done' },
              { value: 'BLOCKED', label: 'Blocked' },
            ]}
            error={errors.status?.message}
            required
            {...register('status')}
          />
        </div>
        <Select
          label="Department"
          options={[
            { value: '', label: 'Select department' },
            { value: 'PRODUCT', label: 'Product Management' },
            { value: 'ENGINEERING', label: 'Engineering' },
            { value: 'DESIGN', label: 'Design' },
            { value: 'CLIENT', label: 'Client' },
          ]}
          error={errors.assignedDepartment?.message}
          {...register('assignedDepartment')}
        />
        <Input
          label="Due Date"
          type="date"
          error={errors.dueDate?.message}
          {...register('dueDate')}
        />
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="clientVisible"
            className="w-4 h-4 bg-input border-border rounded focus:ring-2 focus:ring-primary"
            {...register('clientVisible')}
          />
          <label htmlFor="clientVisible" className="text-sm text-foreground">
            Visible to client
          </label>
        </div>
        <ModalFooter>
          <Button type="button" variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" isLoading={isLoading}>
            {task ? 'Update Task' : 'Create Task'}
          </Button>
        </ModalFooter>
      </form>
    </Modal>
  )
}
