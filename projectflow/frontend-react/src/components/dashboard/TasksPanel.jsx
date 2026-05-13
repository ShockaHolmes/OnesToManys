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
  onDeleteTask
}) {
  function updateCreateForm(field, value) {
    setTaskForm((prev) => ({ ...prev, [field]: value }))
  }

  function updateEditForm(field, value) {
    setEditTaskForm((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <article className="dashboard-panel">
      <h2>All Tasks</h2>
      <DetailForm
        formData={taskForm}
        projects={projects}
        onChange={updateCreateForm}
        onSubmit={onCreateTask}
        submitLabel="Add Task"
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
