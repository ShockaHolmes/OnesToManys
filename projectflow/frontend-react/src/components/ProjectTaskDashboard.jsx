import { useCallback, useEffect, useMemo, useState } from 'react'
import { requestJson } from '../services/apiClient'
import ProjectsPanel from './dashboard/ProjectsPanel'
import TasksPanel from './dashboard/TasksPanel'
import RelatedTasksPanel from './dashboard/RelatedTasksPanel'
import './ProjectTaskDashboard.css'

function ProjectTaskDashboard() {
  const [projects, setProjects] = useState([])
  const [tasks, setTasks] = useState([])
  const [selectedProjectId, setSelectedProjectId] = useState(null)
  const [relatedTasks, setRelatedTasks] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [isLoadingRelated, setIsLoadingRelated] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [notice, setNotice] = useState('')
  const [error, setError] = useState('')

  const [projectForm, setProjectForm] = useState({
    project_name: '',
    status: '',
    description: '',
    start_date: '',
    due_date: ''
  })

  const [taskForm, setTaskForm] = useState({
    project_id: '',
    task_title: '',
    task_description: '',
    priority: '',
    status: '',
    due_date: ''
  })

  const [editingProjectId, setEditingProjectId] = useState(null)
  const [editingTaskId, setEditingTaskId] = useState(null)
  const [editProjectForm, setEditProjectForm] = useState({
    project_name: '',
    status: '',
    description: '',
    start_date: '',
    due_date: ''
  })
  const [editTaskForm, setEditTaskForm] = useState({
    project_id: '',
    task_title: '',
    task_description: '',
    priority: '',
    status: '',
    due_date: ''
  })

  const loadInitialData = useCallback(async () => {
    setIsLoading(true)
    setError('')

    try {
      const [projectsData, tasksData] = await Promise.all([requestJson('/api/projects'), requestJson('/api/tasks')])
      const safeProjects = Array.isArray(projectsData) ? projectsData : []
      const safeTasks = Array.isArray(tasksData) ? tasksData : []

      setProjects(safeProjects)
      setTasks(safeTasks)

      if (selectedProjectId) {
        const stillExists = safeProjects.some(
          (project) => Number(project.project_id) === Number(selectedProjectId)
        )

        if (!stillExists) {
          setSelectedProjectId(null)
          setRelatedTasks([])
        }
      }
    } catch (loadError) {
      setError(loadError.message)
    } finally {
      setIsLoading(false)
    }
  }, [selectedProjectId])

  useEffect(() => {
    loadInitialData().catch(() => {
      setError('Failed to load data.')
    })
  }, [loadInitialData])

  useEffect(() => {
    let isMounted = true

    async function loadRelatedTasks() {
      if (!selectedProjectId) {
        setRelatedTasks([])
        return
      }

      setIsLoadingRelated(true)

      try {
        const payload = await requestJson(`/api/projects/${selectedProjectId}/tasks`)

        if (!isMounted) {
          return
        }

        setRelatedTasks(Array.isArray(payload?.tasks) ? payload.tasks : [])
      } catch {
        if (!isMounted) {
          return
        }

        setRelatedTasks([])
      } finally {
        if (isMounted) {
          setIsLoadingRelated(false)
        }
      }
    }

    loadRelatedTasks()

    return () => {
      isMounted = false
    }
  }, [selectedProjectId])

  const selectedProject = useMemo(
    () => projects.find((project) => Number(project.project_id) === Number(selectedProjectId)) || null,
    [projects, selectedProjectId]
  )

  async function runMutation(action) {
    setIsSubmitting(true)
    setError('')
    setNotice('')

    try {
      await action()
      await loadInitialData()
    } catch (mutationError) {
      setError(mutationError.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  function parseProjectPayload(formValue) {
    return {
      project_name: formValue.project_name.trim(),
      status: formValue.status.trim(),
      description: formValue.description.trim(),
      start_date: formValue.start_date.trim(),
      due_date: formValue.due_date.trim()
    }
  }

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

  function validateProject(payload) {
    return payload.project_name && payload.status
  }

  function validateTask(payload) {
    return Number.isFinite(payload.project_id) && payload.task_title && payload.priority && payload.status
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

  async function deleteProject(projectId) {
    await runMutation(async () => {
      await requestJson(`/api/projects/${projectId}`, { method: 'DELETE' })
      if (Number(selectedProjectId) === Number(projectId)) {
        setSelectedProjectId(null)
      }
      setNotice('Project deleted successfully.')
    })
  }

  async function deleteTask(taskId) {
    await runMutation(async () => {
      await requestJson(`/api/tasks/${taskId}`, { method: 'DELETE' })
      setNotice('Task deleted successfully.')
    })
  }

  if (isLoading) {
    return <p className="dashboard-note">Loading projects and tasks...</p>
  }

  if (error && projects.length === 0 && tasks.length === 0) {
    return <p className="dashboard-note error">Could not load data: {error}</p>
  }

  return (
    <section className="dashboard-grid">
      <ProjectsPanel
        projects={projects}
        selectedProjectId={selectedProjectId}
        isSubmitting={isSubmitting}
        projectForm={projectForm}
        setProjectForm={setProjectForm}
        onCreateProject={handleCreateProject}
        editingProjectId={editingProjectId}
        editProjectForm={editProjectForm}
        setEditProjectForm={setEditProjectForm}
        onBeginEditProject={beginEditProject}
        onSaveEditedProject={saveEditedProject}
        onCancelEditProject={() => setEditingProjectId(null)}
        onDeleteProject={deleteProject}
        onSelectProject={setSelectedProjectId}
      />

      <TasksPanel
        tasks={tasks}
        projects={projects}
        isSubmitting={isSubmitting}
        taskForm={taskForm}
        setTaskForm={setTaskForm}
        onCreateTask={handleCreateTask}
        editingTaskId={editingTaskId}
        editTaskForm={editTaskForm}
        setEditTaskForm={setEditTaskForm}
        onBeginEditTask={beginEditTask}
        onSaveEditedTask={saveEditedTask}
        onCancelEditTask={() => setEditingTaskId(null)}
        onDeleteTask={deleteTask}
      />

      <RelatedTasksPanel
        selectedProject={selectedProject}
        isLoadingRelated={isLoadingRelated}
        relatedTasks={relatedTasks}
      />

      {(notice || error) && (
        <article className="dashboard-panel full-width">
          {notice && <p className="dashboard-note success">{notice}</p>}
          {error && <p className="dashboard-note error">{error}</p>}
        </article>
      )}
    </section>
  )
}

export default ProjectTaskDashboard