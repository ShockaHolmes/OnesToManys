function ProjectsPanel({
  projects,
  selectedProjectId,
  isSubmitting,
  projectForm,
  setProjectForm,
  onCreateProject,
  editingProjectId,
  editProjectForm,
  setEditProjectForm,
  onBeginEditProject,
  onSaveEditedProject,
  onCancelEditProject,
  onDeleteProject,
  onSelectProject
}) {
  return (
    <article className="dashboard-panel">
      <h2>Projects</h2>
      <form className="crud-form" onSubmit={onCreateProject}>
        <input
          placeholder="Project name"
          value={projectForm.project_name}
          onChange={(event) => setProjectForm((prev) => ({ ...prev, project_name: event.target.value }))}
        />
        <input
          placeholder="Status"
          value={projectForm.status}
          onChange={(event) => setProjectForm((prev) => ({ ...prev, status: event.target.value }))}
        />
        <input
          placeholder="Start date (YYYY-MM-DD)"
          value={projectForm.start_date}
          onChange={(event) => setProjectForm((prev) => ({ ...prev, start_date: event.target.value }))}
        />
        <input
          placeholder="Due date (YYYY-MM-DD)"
          value={projectForm.due_date}
          onChange={(event) => setProjectForm((prev) => ({ ...prev, due_date: event.target.value }))}
        />
        <textarea
          placeholder="Description"
          value={projectForm.description}
          onChange={(event) => setProjectForm((prev) => ({ ...prev, description: event.target.value }))}
        />
        <button type="submit" disabled={isSubmitting}>
          Add Project
        </button>
      </form>

      {projects.length === 0 ? (
        <p className="dashboard-note">No projects found.</p>
      ) : (
        <ul className="item-list">
          {projects.map((project) => {
            const projectId = Number(project.project_id)
            const isSelected = projectId === Number(selectedProjectId)
            const isEditing = Number(editingProjectId) === projectId

            return (
              <li key={project.project_id}>
                {isEditing ? (
                  <div className="item-editor">
                    <input
                      value={editProjectForm.project_name}
                      onChange={(event) =>
                        setEditProjectForm((prev) => ({ ...prev, project_name: event.target.value }))
                      }
                    />
                    <input
                      value={editProjectForm.status}
                      onChange={(event) => setEditProjectForm((prev) => ({ ...prev, status: event.target.value }))}
                    />
                    <input
                      value={editProjectForm.start_date}
                      onChange={(event) =>
                        setEditProjectForm((prev) => ({ ...prev, start_date: event.target.value }))
                      }
                    />
                    <input
                      value={editProjectForm.due_date}
                      onChange={(event) => setEditProjectForm((prev) => ({ ...prev, due_date: event.target.value }))}
                    />
                    <textarea
                      value={editProjectForm.description}
                      onChange={(event) =>
                        setEditProjectForm((prev) => ({ ...prev, description: event.target.value }))
                      }
                    />
                    <div className="row-actions">
                      <button type="button" onClick={() => onSaveEditedProject(projectId)} disabled={isSubmitting}>
                        Save
                      </button>
                      <button type="button" onClick={onCancelEditProject} className="muted">
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <button
                      type="button"
                      className={`item-button ${isSelected ? 'selected' : ''}`}
                      onClick={() => onSelectProject(projectId)}
                    >
                      <strong>{project.project_name || `Project ${project.project_id}`}</strong>
                      <span>Status: {project.status || 'Unknown'}</span>
                    </button>
                    <div className="row-actions">
                      <button type="button" onClick={() => onBeginEditProject(project)} className="muted">
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => onDeleteProject(projectId)}
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

export default ProjectsPanel
