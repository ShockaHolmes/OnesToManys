function DetailForm({
  formData,
  projects,
  onChange,
  onSubmit,
  submitLabel,
  isSubmitting,
  onCancel,
  className = 'crud-form'
}) {
  return (
    <form className={className} onSubmit={onSubmit}>
      <select
        value={formData.project_id}
        onChange={(event) => onChange('project_id', event.target.value)}
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
        value={formData.task_title}
        onChange={(event) => onChange('task_title', event.target.value)}
      />
      <input
        placeholder="Priority"
        value={formData.priority}
        onChange={(event) => onChange('priority', event.target.value)}
      />
      <input
        placeholder="Status"
        value={formData.status}
        onChange={(event) => onChange('status', event.target.value)}
      />
      <input
        placeholder="Due date (YYYY-MM-DD)"
        value={formData.due_date}
        onChange={(event) => onChange('due_date', event.target.value)}
      />
      <textarea
        placeholder="Task description"
        value={formData.task_description}
        onChange={(event) => onChange('task_description', event.target.value)}
      />
      <div className="row-actions">
        <button type="submit" disabled={isSubmitting}>
          {submitLabel}
        </button>
        {onCancel ? (
          <button type="button" onClick={onCancel} className="muted">
            Cancel
          </button>
        ) : null}
      </div>
    </form>
  )
}

export default DetailForm
