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
      <div className="field-block">
        <label>Connected Master Project</label>
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
      </div>
      <div className="field-block">
        <label>Task Title</label>
        <input
          placeholder="Task title"
          value={formData.task_title}
          onChange={(event) => onChange('task_title', event.target.value)}
        />
      </div>
      <div className="field-block">
        <label>Priority</label>
        <input
          placeholder="Priority"
          value={formData.priority}
          onChange={(event) => onChange('priority', event.target.value)}
        />
      </div>
      <div className="field-block">
        <label>Status</label>
        <input
          placeholder="Status"
          value={formData.status}
          onChange={(event) => onChange('status', event.target.value)}
        />
      </div>
      <div className="field-block">
        <label>Due Date</label>
        <input
          placeholder="Due date (YYYY-MM-DD)"
          value={formData.due_date}
          onChange={(event) => onChange('due_date', event.target.value)}
        />
      </div>
      <div className="field-block">
        <label>Task Description</label>
        <textarea
          placeholder="Task description"
          value={formData.task_description}
          onChange={(event) => onChange('task_description', event.target.value)}
        />
      </div>
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
