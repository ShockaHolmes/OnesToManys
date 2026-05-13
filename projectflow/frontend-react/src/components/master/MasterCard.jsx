import MasterForm from './MasterForm'

function MasterCard({
  project,
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
      >
        <strong>{project.project_name || `Project ${project.project_id}`}</strong>
        <span>Status: {project.status || 'Unknown'}</span>
      </button>
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
