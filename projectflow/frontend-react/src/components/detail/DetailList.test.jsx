import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import DetailList from './DetailList'

function buildProps(overrides = {}) {
  return {
    tasks: [
      {
        task_id: 3,
        project_id: 1,
        task_title: 'Schedule outreach call',
        priority: 'High',
        status: 'In Progress'
      }
    ],
    projects: [{ project_id: 1, project_name: 'Housing App' }],
    editingTaskId: null,
    editTaskForm: {
      project_id: '',
      task_title: '',
      task_description: '',
      priority: '',
      status: '',
      due_date: ''
    },
    isSubmitting: false,
    onEditTaskChange: vi.fn(),
    onBeginEditTask: vi.fn(),
    onSaveEditedTask: vi.fn(),
    onCancelEditTask: vi.fn(),
    onDeleteTask: vi.fn(),
    ...overrides
  }
}

describe('DetailList', () => {
  it('shows empty state when there are no tasks', () => {
    render(<DetailList {...buildProps({ tasks: [] })} />)
    expect(screen.getByText('No tasks found.')).toBeInTheDocument()
  })

  it('renders tasks from API data and allows editing a task', () => {
    const props = buildProps()
    render(<DetailList {...props} />)

    expect(screen.getByText('Schedule outreach call')).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'Edit' }))
    expect(props.onBeginEditTask).toHaveBeenCalledWith(props.tasks[0])
  })
})