import { useCallback, useEffect, useMemo, useState } from 'react'
import { requestJson } from '../services/apiClient'
import useDetailRecords from '../hooks/useDetailRecords'
import useMasterRecords from '../hooks/useMasterRecords'
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

  const {
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
  } = useMasterRecords({
    requestJson,
    runMutation,
    selectedProjectId,
    setSelectedProjectId,
    setError,
    setNotice
  })

  const {
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
  } = useDetailRecords({
    requestJson,
    runMutation,
    setError,
    setNotice
  })

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