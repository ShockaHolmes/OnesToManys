
DROP TABLE IF EXISTS tasks;
DROP TABLE IF EXISTS projects;

CREATE TABLE projects (
    project_id INTEGER PRIMARY KEY AUTOINCREMENT,
    project_name TEXT NOT NULL,
    description TEXT,
    status TEXT NOT NULL,
    start_date TEXT,
    due_date TEXT
);

CREATE TABLE tasks (
    task_id INTEGER PRIMARY KEY AUTOINCREMENT,
    project_id INTEGER NOT NULL,
    task_title TEXT NOT NULL,
    task_description TEXT,
    priority TEXT NOT NULL,
    status TEXT NOT NULL,
    due_date TEXT,
    FOREIGN KEY (project_id) REFERENCES projects(project_id)
);