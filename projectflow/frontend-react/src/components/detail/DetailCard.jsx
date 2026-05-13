import DetailForm from './DetailForm'

function DetailCard({
  task,
  projects,
  isEditing,
  editForm,
  isSubmitting,
  onEditChange,
  onStartEdit,
  onSaveEdit,
  onCancelEdit,
  onDelete
}) {
  const taskId = Number(task.task_id)

  if (isEditing) {
    return (
      <div className="item-editor">
        <DetailForm
          formData={editForm}
          projects={projects}
          onChange={onEditChange}
          onSubmit={(event) => {
            event.preventDefault()
            onSaveEdit(taskId)
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
      <strong>{task.task_title || `Task ${task.task_id}`}</strong>
      <span>
        Project #{task.project_id} | {task.status || 'Unknown'} | Priority: {task.priority || 'Unknown'}
      </span>
      <div className="row-actions">
        <button type="button" onClick={() => onStartEdit(task)} className="muted">
          Edit
        </button>
        <button type="button" onClick={() => onDelete(taskId)} className="danger" disabled={isSubmitting}>
          Delete
        </button>
      </div>
    </>
  )
}

export default DetailCard
