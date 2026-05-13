import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import DetailForm from './DetailForm'

describe('DetailForm', () => {
  it('renders fields and triggers change plus submit handlers', () => {
    const onChange = vi.fn()
    const onSubmit = vi.fn((event) => event.preventDefault())

    render(
      <DetailForm
        formData={{
          project_id: '',
          task_title: '',
          task_description: '',
          priority: '',
          status: '',
          due_date: ''
        }}
        projects={[{ project_id: 1, project_name: 'Housing App' }]}
        onChange={onChange}
        onSubmit={onSubmit}
        submitLabel="Add Task"
        isSubmitting={false}
      />
    )

    fireEvent.change(screen.getByPlaceholderText('Task title'), {
      target: { value: 'Create intake workflow' }
    })
    fireEvent.click(screen.getByRole('button', { name: 'Add Task' }))

    expect(onChange).toHaveBeenCalledWith('task_title', 'Create intake workflow')
    expect(onSubmit).toHaveBeenCalledTimes(1)
  })

  it('renders cancel button when onCancel is provided', () => {
    const onCancel = vi.fn()

    render(
      <DetailForm
        formData={{
          project_id: '',
          task_title: '',
          task_description: '',
          priority: '',
          status: '',
          due_date: ''
        }}
        projects={[]}
        onChange={vi.fn()}
        onSubmit={vi.fn((event) => event.preventDefault())}
        submitLabel="Save"
        isSubmitting={false}
        onCancel={onCancel}
      />
    )

    fireEvent.click(screen.getByRole('button', { name: 'Cancel' }))
    expect(onCancel).toHaveBeenCalledTimes(1)
  })
})