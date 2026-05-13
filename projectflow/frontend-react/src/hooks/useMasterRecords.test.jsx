import { act, renderHook } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import useMasterRecords from './useMasterRecords'

function setupHook() {
  const requestJson = vi.fn()
  const runMutation = vi.fn(async (action) => {
    await action()
  })
  const setSelectedProjectId = vi.fn()
  const setError = vi.fn()
  const setNotice = vi.fn()

  const hook = renderHook(() =>
    useMasterRecords({
      requestJson,
      runMutation,
      selectedProjectId: null,
      setSelectedProjectId,
      setError,
      setNotice
    })
  )

  return {
    hook,
    requestJson,
    runMutation,
    setSelectedProjectId,
    setError,
    setNotice
  }
}

describe('useMasterRecords', () => {
  it('validates create payload and sets an error when required fields are missing', async () => {
    const { hook, setError, requestJson } = setupHook()

    await act(async () => {
      await hook.result.current.handleCreateProject({
        preventDefault: vi.fn()
      })
    })

    expect(setError).toHaveBeenCalledWith('Project name and status are required.')
    expect(requestJson).not.toHaveBeenCalled()
  })

  it('creates a project with POST request when form is valid', async () => {
    const { hook, requestJson, runMutation, setNotice } = setupHook()

    await act(async () => {
      hook.result.current.setProjectForm({
        project_name: 'Mentor Match Portal',
        status: 'Not Started',
        description: 'Matches youth to mentors',
        start_date: '2026-05-20',
        due_date: '2026-06-15'
      })
    })

    await act(async () => {
      await hook.result.current.handleCreateProject({
        preventDefault: vi.fn()
      })
    })

    expect(runMutation).toHaveBeenCalledTimes(1)
    expect(requestJson).toHaveBeenCalledWith('/api/projects', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        project_name: 'Mentor Match Portal',
        status: 'Not Started',
        description: 'Matches youth to mentors',
        start_date: '2026-05-20',
        due_date: '2026-06-15'
      })
    })
    expect(setNotice).toHaveBeenCalledWith('Project created successfully.')
  })
})
