import MasterForm from '../master/MasterForm'
import MasterList from '../master/MasterList'

function ProjectsPanel({
  projects,
  tasks,
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
      <h2>Master Records (Projects)</h2>
      <p className="panel-hint">Choose one project to highlight its connected detail records.</p>
      <MasterForm
        formData={projectForm}
        onChange={updateCreateForm}
        onSubmit={onCreateProject}
        submitLabel="Create Master Record"
        isSubmitting={isSubmitting}
      />

      <MasterList
        projects={projects}
        tasks={tasks}
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
