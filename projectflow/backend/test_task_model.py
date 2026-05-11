from models.task import Task


task = Task(
    task_id=1,
    project_id=1,
    task_title="Build database schema",
    task_description="Create the projects and tasks tables.",
    priority="High",
    status="In Progress",
    due_date="2026-05-15"
)

print(task)
print(task.to_dict())