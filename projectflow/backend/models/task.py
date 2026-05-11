from dataclasses import dataclass
from typing import Optional


@dataclass
class Task:
    project_id: int
    task_title: str
    task_description: str
    priority: str
    status: str
    due_date: str
    task_id: Optional[int] = None

    def to_dict(self):
        return {
            "task_id": self.task_id,
            "project_id": self.project_id,
            "task_title": self.task_title,
            "task_description": self.task_description,
            "priority": self.priority,
            "status": self.status,
            "due_date": self.due_date
        }

    @classmethod
    def from_row(cls, row):
        return cls(
            task_id=row["task_id"],
            project_id=row["project_id"],
            task_title=row["task_title"],
            task_description=row["task_description"],
            priority=row["priority"],
            status=row["status"],
            due_date=row["due_date"]
        )