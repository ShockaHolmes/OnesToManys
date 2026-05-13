function MasterForm({
  formData,
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
        <label>Project Name</label>
        <input
          placeholder="Project name"
          value={formData.project_name}
          onChange={(event) => onChange('project_name', event.target.value)}
        />
      </div>
      <div className="field-block">
        <label>Project Status</label>
        <input
          placeholder="Status"
          value={formData.status}
          onChange={(event) => onChange('status', event.target.value)}
        />
      </div>
      <div className="field-block">
        <label>Start Date</label>
        <input
          placeholder="Start date (YYYY-MM-DD)"
          value={formData.start_date}
          onChange={(event) => onChange('start_date', event.target.value)}
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
        <label>Description</label>
        <textarea
          placeholder="Description"
          value={formData.description}
          onChange={(event) => onChange('description', event.target.value)}
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

export default MasterForm
