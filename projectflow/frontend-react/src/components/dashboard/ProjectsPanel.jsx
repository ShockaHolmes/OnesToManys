import MasterForm from '../master/MasterForm'
import MasterList from '../master/MasterList'

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
  function updateCreateForm(field, value) {
    setProjectForm((prev) => ({ ...prev, [field]: value }))
  }

  function updateEditForm(field, value) {
    setEditProjectForm((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <article className="dashboard-panel">
      <h2>Projects</h2>
      <MasterForm
        formData={projectForm}
        onChange={updateCreateForm}
        onSubmit={onCreateProject}
        submitLabel="Add Project"
        isSubmitting={isSubmitting}
      />

      <MasterList
        projects={projects}
        selectedProjectId={selectedProjectId}
        editingProjectId={editingProjectId}
        editProjectForm={editProjectForm}
        isSubmitting={isSubmitting}
        onEditProjectChange={updateEditForm}
        onSelectProject={onSelectProject}
        onBeginEditProject={onBeginEditProject}
        onSaveEditedProject={onSaveEditedProject}
        onCancelEditProject={onCancelEditProject}
        onDeleteProject={onDeleteProject}
      />
    </article>
  )
}

export default ProjectsPanel
