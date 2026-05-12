from dataclasses import dataclass, field
from typing import Optional, List, Dict, Any


@dataclass
class Project:
    project_name: str
    description: str
    status: str
    start_date: str
    due_date: str
    project_id: Optional[int] = None
    tasks: List[Dict[str, Any]] = field(default_factory=list)

    def to_dict(self):
        return {
            "project_id": self.project_id,
            "project_name": self.project_name,
            "description": self.description,
            "status": self.status,
            "start_date": self.start_date,
            "due_date": self.due_date,
            "tasks": self.tasks
        }

    @classmethod
    def from_row(cls, row):
        return cls(
            project_id=row["project_id"],
            project_name=row["project_name"],
            description=row["description"],
            status=row["status"],
            start_date=row["start_date"],
            due_date=row["due_date"]
        )

    def add_task(self, task):
        self.tasks.append(task)