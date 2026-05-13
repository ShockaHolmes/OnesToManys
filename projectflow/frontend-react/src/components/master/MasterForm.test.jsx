import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import MasterForm from './MasterForm'

describe('MasterForm', () => {
  it('renders fields and triggers change + submit handlers', () => {
    const onChange = vi.fn()
    const onSubmit = vi.fn((event) => event.preventDefault())

    render(
      <MasterForm
        formData={{
          project_name: '',
          status: '',
          description: '',
          start_date: '',
          due_date: ''
        }}
        onChange={onChange}
        onSubmit={onSubmit}
        submitLabel="Add Project"
        isSubmitting={false}
      />
    )

    fireEvent.change(screen.getByPlaceholderText('Project name'), {
      target: { value: 'Youth Support Platform' }
    })
    fireEvent.click(screen.getByRole('button', { name: 'Add Project' }))

    expect(onChange).toHaveBeenCalledWith('project_name', 'Youth Support Platform')
    expect(onSubmit).toHaveBeenCalledTimes(1)
  })

  it('renders cancel button when onCancel is provided', () => {
    const onCancel = vi.fn()

    render(
      <MasterForm
        formData={{
          project_name: '',
          status: '',
          description: '',
          start_date: '',
          due_date: ''
        }}
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
