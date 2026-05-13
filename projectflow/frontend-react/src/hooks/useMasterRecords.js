import { useState } from 'react'

function useMasterRecords({
  requestJson,
  runMutation,
  selectedProjectId,
  setSelectedProjectId,
  setError,
  setNotice
}) {
  const [projectForm, setProjectForm] = useState({
    project_name: '',
    status: '',
    description: '',
    start_date: '',
    due_date: ''
  })

  const [editingProjectId, setEditingProjectId] = useState(null)
  const [editProjectForm, setEditProjectForm] = useState({
    project_name: '',
    status: '',
    description: '',
    start_date: '',
    due_date: ''
  })

  function parseProjectPayload(formValue) {
    return {
      project_name: formValue.project_name.trim(),
      status: formValue.status.trim(),
      description: formValue.description.trim(),
      start_date: formValue.start_date.trim(),
      due_date: formValue.due_date.trim()
    }
  }

  function validateProject(payload) {
    return payload.project_name && payload.status
  }

  async function handleCreateProject(event) {
    event.preventDefault()
    const payload = parseProjectPayload(projectForm)

    if (!validateProject(payload)) {
      setError('Project name and status are required.')
      return
    }

    await runMutation(async () => {
      await requestJson('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
      setProjectForm({ project_name: '', status: '', description: '', start_date: '', due_date: '' })
      setNotice('Project created successfully.')
    })
  }

  function beginEditProject(project) {
    setEditingProjectId(Number(project.project_id))
    setEditProjectForm({
      project_name: project.project_name || '',
      status: project.status || '',
      description: project.description || '',
      start_date: project.start_date || '',
      due_date: project.due_date || ''
    })
  }

  async function saveEditedProject(projectId) {
    const payload = parseProjectPayload(editProjectForm)

    if (!validateProject(payload)) {
      setError('Project name and status are required.')
      return
    }

    await runMutation(async () => {
      await requestJson(`/api/projects/${projectId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
      setEditingProjectId(null)
      setNotice('Project updated successfully.')
    })
  }

  async function deleteProject(projectId) {
    await runMutation(async () => {
      await requestJson(`/api/projects/${projectId}`, { method: 'DELETE' })
      if (Number(selectedProjectId) === Number(projectId)) {
        setSelectedProjectId(null)
      }
      setNotice('Project deleted successfully.')
    })
  }

  return {
    projectForm,
    setProjectForm,
    editingProjectId,
    setEditingProjectId,
    editProjectForm,
    setEditProjectForm,
    handleCreateProject,
    beginEditProject,
    saveEditedProject,
    deleteProject
  }
}

export default useMasterRecords
