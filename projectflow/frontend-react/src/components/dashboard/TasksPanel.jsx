import DetailForm from '../detail/DetailForm'
import DetailList from '../detail/DetailList'

function TasksPanel({
  tasks,
  projects,
  isSubmitting,
  taskForm,
  setTaskForm,
  onCreateTask,
  editingTaskId,
  editTaskForm,
  setEditTaskForm,
  onBeginEditTask,
  onSaveEditedTask,
  onCancelEditTask,
  onDeleteTask,
  className = ''
}) {
  function updateCreateForm(field, value) {
    setTaskForm((prev) => ({ ...prev, [field]: value }))
  }

  function updateEditForm(field, value) {
    setEditTaskForm((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <article className={`dashboard-panel ${className}`.trim()}>
      <h2>Detail Records (Tasks)</h2>
      <p className="panel-hint">Create or update detail records and connect each one to a master project.</p>
      <DetailForm
        formData={taskForm}
        projects={projects}
        onChange={updateCreateForm}
        onSubmit={onCreateTask}
        submitLabel="Create Detail Record"
        isSubmitting={isSubmitting}
      />

      <DetailList
        tasks={tasks}
        projects={projects}
        editingTaskId={editingTaskId}
        editTaskForm={editTaskForm}
        isSubmitting={isSubmitting}
        onEditTaskChange={updateEditForm}
        onBeginEditTask={onBeginEditTask}
        onSaveEditedTask={onSaveEditedTask}
        onCancelEditTask={onCancelEditTask}
        onDeleteTask={onDeleteTask}
      />
    </article>
  )
}

export default TasksPanel
