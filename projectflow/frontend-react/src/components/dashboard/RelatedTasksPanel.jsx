function RelatedTasksPanel({ selectedProject, isLoadingRelated, relatedTasks }) {
  return (
    <article className="dashboard-panel full-width">
      <h2>Selected Project Details</h2>
      {!selectedProject ? (
        <p className="dashboard-note">Choose a project to view related tasks.</p>
      ) : (
        <>
          <p className="dashboard-note">
            {selectedProject.project_name} (ID: {selectedProject.project_id})
          </p>
          {isLoadingRelated ? (
            <p className="dashboard-note">Loading related tasks...</p>
          ) : relatedTasks.length === 0 ? (
            <p className="dashboard-note">No related tasks for this project.</p>
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
