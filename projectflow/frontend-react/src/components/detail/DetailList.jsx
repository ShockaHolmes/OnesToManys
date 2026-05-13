import DetailCard from './DetailCard'

function DetailList({
  tasks,
  projects,
  editingTaskId,
  editTaskForm,
  isSubmitting,
  onEditTaskChange,
  onBeginEditTask,
  onSaveEditedTask,
  onCancelEditTask,
  onDeleteTask
}) {
  if (tasks.length === 0) {
    return <p className="dashboard-note">No tasks found.</p>
  }

  return (
    <ul className="item-list compact">
      {tasks.map((task) => {
        const taskId = Number(task.task_id)

        return (
          <li key={task.task_id} className="task-row">
            <DetailCard
              task={task}
              projects={projects}
              isEditing={taskId === Number(editingTaskId)}
              editForm={editTaskForm}
              isSubmitting={isSubmitting}
              onEditChange={onEditTaskChange}
              onStartEdit={onBeginEditTask}
              onSaveEdit={onSaveEditedTask}
              onCancelEdit={onCancelEditTask}
              onDelete={onDeleteTask}
            />
          </li>
        )
      })}
    </ul>
  )
}

export default DetailList
