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
  return (
    <article className="dashboard-panel">
      <h2>All Tasks</h2>
      <form className="crud-form" onSubmit={onCreateTask}>
        <select
          value={taskForm.project_id}
          onChange={(event) => setTaskForm((prev) => ({ ...prev, project_id: event.target.value }))}
        >
          <option value="">Select project</option>
          {projects.map((project) => (
            <option key={project.project_id} value={project.project_id}>
              {project.project_name || `Project ${project.project_id}`}
            </option>
          ))}
        </select>
        <input
          placeholder="Task title"
          value={taskForm.task_title}
          onChange={(event) => setTaskForm((prev) => ({ ...prev, task_title: event.target.value }))}
        />
        <input
          placeholder="Priority"
          value={taskForm.priority}
          onChange={(event) => setTaskForm((prev) => ({ ...prev, priority: event.target.value }))}
        />
        <input
          placeholder="Status"
          value={taskForm.status}
          onChange={(event) => setTaskForm((prev) => ({ ...prev, status: event.target.value }))}
        />
        <input
          placeholder="Due date (YYYY-MM-DD)"
          value={taskForm.due_date}
          onChange={(event) => setTaskForm((prev) => ({ ...prev, due_date: event.target.value }))}
        />
        <textarea
          placeholder="Task description"
          value={taskForm.task_description}
          onChange={(event) => setTaskForm((prev) => ({ ...prev, task_description: event.target.value }))}
        />
        <button type="submit" disabled={isSubmitting}>
          Add Task
        </button>
      </form>

      {tasks.length === 0 ? (
        <p className="dashboard-note">No tasks found.</p>
      ) : (
        <ul className="item-list compact">
          {tasks.map((task) => {
            const isEditing = Number(editingTaskId) === Number(task.task_id)

            return (
              <li key={task.task_id} className="task-row">
                {isEditing ? (
                  <div className="item-editor">
                    <select
                      value={editTaskForm.project_id}
                      onChange={(event) =>
                        setEditTaskForm((prev) => ({ ...prev, project_id: event.target.value }))
                      }
                    >
                      <option value="">Select project</option>
                      {projects.map((project) => (
                        <option key={project.project_id} value={project.project_id}>
                          {project.project_name || `Project ${project.project_id}`}
                        </option>
                      ))}
                    </select>
                    <input
                      value={editTaskForm.task_title}
                      onChange={(event) =>
                        setEditTaskForm((prev) => ({ ...prev, task_title: event.target.value }))
                      }
                    />
                    <input
                      value={editTaskForm.priority}
                      onChange={(event) => setEditTaskForm((prev) => ({ ...prev, priority: event.target.value }))}
                    />
                    <input
                      value={editTaskForm.status}
                      onChange={(event) => setEditTaskForm((prev) => ({ ...prev, status: event.target.value }))}
                    />
                    <input
                      value={editTaskForm.due_date}
                      onChange={(event) => setEditTaskForm((prev) => ({ ...prev, due_date: event.target.value }))}
                    />
                    <textarea
                      value={editTaskForm.task_description}
                      onChange={(event) =>
                        setEditTaskForm((prev) => ({ ...prev, task_description: event.target.value }))
                      }
                    />
                    <div className="row-actions">
                      <button type="button" onClick={() => onSaveEditedTask(task.task_id)} disabled={isSubmitting}>
                        Save
                      </button>
                      <button type="button" onClick={onCancelEditTask} className="muted">
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <strong>{task.task_title || `Task ${task.task_id}`}</strong>
                    <span>
                      Project #{task.project_id} | {task.status || 'Unknown'} | Priority: {task.priority || 'Unknown'}
                    </span>
                    <div className="row-actions">
                      <button type="button" onClick={() => onBeginEditTask(task)} className="muted">
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => onDeleteTask(task.task_id)}
                        className="danger"
                        disabled={isSubmitting}
                      >
                        Delete
                      </button>
                    </div>
                  </>
                )}
              </li>
            )
          })}
        </ul>
      )}
    </article>
  )
}

export default TasksPanel
