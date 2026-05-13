import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import ProjectTaskDashboard from './ProjectTaskDashboard'

vi.mock('../services/apiClient', () => ({
  requestJson: vi.fn()
}))

import { requestJson } from '../services/apiClient'

describe('ProjectTaskDashboard', () => {
  it('loads related detail records with the nested endpoint when a master record is selected', async () => {
    requestJson.mockImplementation(async (path) => {
      if (path === '/api/projects') {
        return [
          {
            project_id: 1,
            project_name: 'Mentor Support Hub',
            status: 'In Progress',
            start_date: '2026-05-15',
            due_date: '2026-06-10',
            description: 'Coordinates mentoring tasks and follow-up.'
          }
        ]
      }

      if (path === '/api/tasks') {
        return []
      }

      if (path === '/api/projects/1/tasks') {
        return {
          project: {
            project_id: 1,
            project_name: 'Mentor Support Hub'
          },
          tasks: [
            {
              task_id: 3,
              task_title: 'Schedule mentor onboarding',
              priority: 'High',
              status: 'Not Started'
            }
          ]
        }
      }

      throw new Error(`Unexpected path: ${path}`)
    })

    render(<ProjectTaskDashboard />)

    const projectButton = await screen.findByRole('button', { name: /Mentor Support Hub/i })
    expect(screen.getByText('Select a project to load its connected detail records.')).toBeInTheDocument()

    fireEvent.click(projectButton)

    await waitFor(() => {
      expect(requestJson).toHaveBeenCalledWith('/api/projects/1/tasks')
    })

    expect(await screen.findByText('Schedule mentor onboarding')).toBeInTheDocument()
    expect(screen.getByText(/Priority: High/)).toBeInTheDocument()
  })
})