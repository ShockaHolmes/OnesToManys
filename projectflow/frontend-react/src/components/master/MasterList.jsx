import MasterCard from './MasterCard'

function MasterList({
  projects,
  selectedProjectId,
  editingProjectId,
  editProjectForm,
  isSubmitting,
  onEditProjectChange,
  onSelectProject,
  onBeginEditProject,
  onSaveEditedProject,
  onCancelEditProject,
  onDeleteProject
}) {
  if (projects.length === 0) {
    return <p className="dashboard-note">No projects found.</p>
  }

  return (
    <ul className="item-list">
      {projects.map((project) => {
        const projectId = Number(project.project_id)

        return (
          <li key={project.project_id}>
            <MasterCard
              project={project}
              isSelected={projectId === Number(selectedProjectId)}
              isEditing={projectId === Number(editingProjectId)}
              editForm={editProjectForm}
              isSubmitting={isSubmitting}
              onEditChange={onEditProjectChange}
              onSelect={onSelectProject}
              onStartEdit={onBeginEditProject}
              onSaveEdit={onSaveEditedProject}
              onCancelEdit={onCancelEditProject}
              onDelete={onDeleteProject}
            />
          </li>
        )
      })}
    </ul>
  )
}

export default MasterList
