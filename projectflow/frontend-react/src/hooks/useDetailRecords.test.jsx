import { act, renderHook } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import useDetailRecords from './useDetailRecords'

function setupHook() {
  const requestJson = vi.fn()
  const runMutation = vi.fn(async (action) => {
    await action()
  })
  const setError = vi.fn()
  const setNotice = vi.fn()

  const hook = renderHook(() =>
    useDetailRecords({
      requestJson,
      runMutation,
      setError,
      setNotice
    })
  )

  return {
    hook,
    requestJson,
    runMutation,
    setError,
    setNotice
  }
}

describe('useDetailRecords', () => {
  it('validates create payload and sets an error when required fields are missing', async () => {
    const { hook, setError, requestJson } = setupHook()

    await act(async () => {
      await hook.result.current.handleCreateTask({ preventDefault: vi.fn() })
    })

    expect(setError).toHaveBeenCalledWith('Project, task title, priority, and status are required for tasks.')
    expect(requestJson).not.toHaveBeenCalled()
  })

  it('creates a task with POST request when form is valid', async () => {
    const { hook, requestJson, runMutation, setNotice } = setupHook()

    await act(async () => {
      hook.result.current.setTaskForm({
        project_id: '1',
        task_title: 'Build dashboard filters',
        task_description: 'Support filtering by status and priority',
        priority: 'Medium',
        status: 'Not Started',
        due_date: '2026-06-10'
      })
    })

    await act(async () => {
      await hook.result.current.handleCreateTask({ preventDefault: vi.fn() })
    })

    expect(runMutation).toHaveBeenCalledTimes(1)
    expect(requestJson).toHaveBeenCalledWith('/api/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        project_id: 1,
        task_title: 'Build dashboard filters',
        task_description: 'Support filtering by status and priority',
        priority: 'Medium',
        status: 'Not Started',
        due_date: '2026-06-10'
      })
    })
    expect(setNotice).toHaveBeenCalledWith('Task created successfully.')
  })

  it('updates and deletes tasks through the API', async () => {
    const { hook, requestJson, runMutation, setNotice } = setupHook()

    await act(async () => {
      hook.result.current.beginEditTask({
        task_id: 7,
        project_id: 2,
        task_title: 'Prepare check-in form',
        task_description: 'Draft follow-up questions',
        priority: 'High',
        status: 'In Progress',
        due_date: '2026-06-12'
      })
    })

    await act(async () => {
      await hook.result.current.saveEditedTask(7)
    })

    expect(runMutation).toHaveBeenCalledTimes(1)
    expect(requestJson).toHaveBeenCalledWith('/api/tasks/7', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        project_id: 2,
        task_title: 'Prepare check-in form',
        task_description: 'Draft follow-up questions',
        priority: 'High',
        status: 'In Progress',
        due_date: '2026-06-12'
      })
    })
    expect(setNotice).toHaveBeenCalledWith('Task updated successfully.')

    await act(async () => {
      await hook.result.current.deleteTask(7)
    })

    expect(runMutation).toHaveBeenCalledTimes(2)
    expect(requestJson).toHaveBeenCalledWith('/api/tasks/7', { method: 'DELETE' })
    expect(setNotice).toHaveBeenCalledWith('Task deleted successfully.')
  })
})