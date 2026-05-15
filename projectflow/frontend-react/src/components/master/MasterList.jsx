import MasterCard from './MasterCard'

function MasterList({
  projects,
  tasks,
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
        const relatedTasks = tasks.filter((task) => Number(task.project_id) === projectId)

        return (
          <li key={project.project_id}>
            <MasterCard
              project={project}
              relatedTasks={relatedTasks}
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
