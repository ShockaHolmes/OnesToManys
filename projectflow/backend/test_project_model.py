from models.project import Project


project = Project(
    project_name="Foster Path Dashboard",
    description="Build a dashboard for support resources.",
    status="In Progress",
    start_date="2026-05-01",
    due_date="2026-06-01",
    project_id=1
)

print(project)
print(project.to_dict())