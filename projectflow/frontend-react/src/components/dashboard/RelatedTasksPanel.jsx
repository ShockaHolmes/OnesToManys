function RelatedTasksPanel({ selectedProject, isLoadingRelated, relatedTasks }) {
  return (
    <article className="dashboard-panel">
      <h2>Selected Project And Related Tasks</h2>
      {!selectedProject ? (
        <p className="dashboard-note">Select a project to load its connected detail records.</p>
      ) : (
        <>
          <div className="selected-master-card">
            <strong>{selectedProject.project_name} (ID: {selectedProject.project_id})</strong>
            <span>Status: {selectedProject.status || 'Unknown'}</span>
            <span>
              Start: {selectedProject.start_date || 'Not set'} | Due: {selectedProject.due_date || 'Not set'}
            </span>
            <p className="dashboard-note">
              {selectedProject.description || 'No description provided for this project.'}
            </p>
          </div>

          {isLoadingRelated ? (
            <p className="dashboard-note">Loading related tasks...</p>
          ) : relatedTasks.length === 0 ? (
            <p className="dashboard-note">No connected detail records were found for this project.</p>
          ) : (
            <ul className="item-list compact">
              {relatedTasks.map((task) => (
                <li key={task.task_id} className="task-row">
                  <strong>{task.task_title || `Task ${task.task_id}`}</strong>
                  <span>
                    Priority: {task.priority || 'Unknown'} | Status: {task.status || 'Unknown'}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </>
      )}
    </article>
  )
}

export default RelatedTasksPanel
