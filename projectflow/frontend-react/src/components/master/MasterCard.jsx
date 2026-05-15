import MasterForm from './MasterForm'

function MasterCard({
  project,
  relatedTasks,
  isSelected,
  isEditing,
  editForm,
  isSubmitting,
  onEditChange,
  onSelect,
  onStartEdit,
  onSaveEdit,
  onCancelEdit,
  onDelete
}) {
  const projectId = Number(project.project_id)

  if (isEditing) {
    return (
      <div className="item-editor">
        <MasterForm
          formData={editForm}
          onChange={onEditChange}
          onSubmit={(event) => {
            event.preventDefault()
            onSaveEdit(projectId)
          }}
          submitLabel="Save"
          isSubmitting={isSubmitting}
          onCancel={onCancelEdit}
          className="item-editor"
        />
      </div>
    )
  }

  return (
    <>
      <button
        type="button"
        className={`item-button ${isSelected ? 'selected' : ''}`}
        onClick={() => onSelect(projectId)}
        aria-expanded={isSelected ? 'true' : 'false'}
      >
        <strong>{project.project_name || `Project ${project.project_id}`}</strong>
        <span>Status: {project.status || 'Unknown'}</span>
      </button>

      {isSelected ? (
        <section className="inline-related-tasks" aria-live="polite">
          <p className="dashboard-note">Tasks under this master record:</p>
          {relatedTasks.length === 0 ? (
            <p className="dashboard-note">No connected detail records were found for this project.</p>
          ) : (
            <div className="inline-related-list">
              {relatedTasks.map((task) => (
                <details key={task.task_id} className="inline-task-details">
                  <summary>
                    <strong>{task.task_title || `Task ${task.task_id}`}</strong>
                    <span>
                      Priority: {task.priority || 'Unknown'} | Status: {task.status || 'Unknown'}
                    </span>
                  </summary>
                  <div className="inline-task-body">
                    <span>Due: {task.due_date || 'Not set'}</span>
                    <p className="dashboard-note">{task.task_description || 'No description provided for this task.'}</p>
                  </div>
                </details>
              ))}
            </div>
          )}
        </section>
      ) : null}

      <div className="row-actions">
        <button type="button" onClick={() => onStartEdit(project)} className="muted">
          Edit
        </button>
        <button
          type="button"
          aria-label="Delete master record"
          onClick={() => onDelete(projectId)}
          className="danger"
          disabled={isSubmitting}
        >
          Delete
        </button>
      </div>
    </>
  )
}

export default MasterCard
