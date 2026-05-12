PRAGMA foreign_keys = ON;

DELETE FROM tasks;
DELETE FROM projects;

DELETE FROM sqlite_sequence WHERE name IN ('projects', 'tasks');

INSERT INTO projects (
    project_name,
    description,
    status,
    start_date,
    due_date
)
VALUES (
    'Foster Path Dashboard',
    'A data dashboard project that helps identify support needs for youth aging out of the foster care system and connects them with helpful resources.',
    'In Progress',
    '2026-05-12',
    '2026-06-12'
);

INSERT INTO tasks (
    project_id,
    task_title,
    task_description,
    priority,
    status,
    due_date
)
VALUES
(
    1,
    'Create youth data',
    'Create sample youth records that include age, housing status, education status, employment status, and support needs.',
    'High',
    'Not Started',
    '2026-05-16'
),
(
    1,
    'Build database schema',
    'Design and create the database structure needed to store project data, youth data, service resources, and dashboard information.',
    'High',
    'In Progress',
    '2026-05-20'
),
(
    1,
    'Create dashboard charts',
    'Build visual charts that show risk levels, service needs, task progress, and resource recommendations.',
    'Medium',
    'Not Started',
    '2026-05-28'
);