import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import MasterList from './MasterList'

function buildProps(overrides = {}) {
  return {
    projects: [
      {
        project_id: 1,
        project_name: 'Housing Help App',
        status: 'In Progress'
      }
    ],
    selectedProjectId: null,
    editingProjectId: null,
    editProjectForm: {
      project_name: '',
      status: '',
      description: '',
      start_date: '',
      due_date: ''
    },
    isSubmitting: false,
    onEditProjectChange: vi.fn(),
    onSelectProject: vi.fn(),
    onBeginEditProject: vi.fn(),
    onSaveEditedProject: vi.fn(),
    onCancelEditProject: vi.fn(),
    onDeleteProject: vi.fn(),
    ...overrides
  }
}

describe('MasterList', () => {
  it('shows empty state when there are no projects', () => {
    render(<MasterList {...buildProps({ projects: [] })} />)
    expect(screen.getByText('No projects found.')).toBeInTheDocument()
  })

  it('renders projects from API data and allows selecting a project', () => {
    const props = buildProps()
    render(<MasterList {...props} />)

    expect(screen.getByText('Housing Help App')).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: /Housing Help App/i }))
    expect(props.onSelectProject).toHaveBeenCalledWith(1)
  })
})
