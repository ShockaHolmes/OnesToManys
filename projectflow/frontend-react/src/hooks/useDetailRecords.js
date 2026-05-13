import { useState } from 'react'

function useDetailRecords({ requestJson, runMutation, setError, setNotice }) {
  const [taskForm, setTaskForm] = useState({
    project_id: '',
    task_title: '',
    task_description: '',
    priority: '',
    status: '',
    due_date: ''
  })

  const [editingTaskId, setEditingTaskId] = useState(null)
  const [editTaskForm, setEditTaskForm] = useState({
    project_id: '',
    task_title: '',
    task_description: '',
    priority: '',
    status: '',
    due_date: ''
  })

  function parseTaskPayload(formValue) {
    return {
      project_id: Number(formValue.project_id),
      task_title: formValue.task_title.trim(),
      task_description: formValue.task_description.trim(),
      priority: formValue.priority.trim(),
      status: formValue.status.trim(),
      due_date: formValue.due_date.trim()
    }
  }

  function validateTask(payload) {
    return Number.isFinite(payload.project_id) && payload.task_title && payload.priority && payload.status
  }

  async function handleCreateTask(event) {
    event.preventDefault()
    const payload = parseTaskPayload(taskForm)

    if (!validateTask(payload)) {
      setError('Project, task title, priority, and status are required for tasks.')
      return
    }

    await runMutation(async () => {
      await requestJson('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
      setTaskForm({
        project_id: '',
        task_title: '',
        task_description: '',
        priority: '',
        status: '',
        due_date: ''
      })
      setNotice('Task created successfully.')
    })
  }

  function beginEditTask(task) {
    setEditingTaskId(Number(task.task_id))
    setEditTaskForm({
      project_id: String(task.project_id || ''),
      task_title: task.task_title || '',
      task_description: task.task_description || '',
      priority: task.priority || '',
      status: task.status || '',
      due_date: task.due_date || ''
    })
  }

  async function saveEditedTask(taskId) {
    const payload = parseTaskPayload(editTaskForm)

    if (!validateTask(payload)) {
      setError('Project, task title, priority, and status are required for tasks.')
      return
    }

    await runMutation(async () => {
      await requestJson(`/api/tasks/${taskId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
      setEditingTaskId(null)
      setNotice('Task updated successfully.')
    })
  }

  async function deleteTask(taskId) {
    await runMutation(async () => {
      await requestJson(`/api/tasks/${taskId}`, { method: 'DELETE' })
      setNotice('Task deleted successfully.')
    })
  }

  return {
    taskForm,
    setTaskForm,
    editingTaskId,
    setEditingTaskId,
    editTaskForm,
    setEditTaskForm,
    handleCreateTask,
    beginEditTask,
    saveEditedTask,
    deleteTask
  }
}

export default useDetailRecords
