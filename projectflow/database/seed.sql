INSERT INTO projects (project_name, description, status, start_date, due_date)
VALUES
('Foster Path Dashboard', 'Build a dashboard that tracks support resources for youth aging out of care.', 'In Progress', '2026-05-01', '2026-06-01'),
('Portfolio Website', 'Create a personal portfolio website for job applications.', 'Not Started', '2026-05-05', '2026-05-25'),
('Python Notes App', 'Build a CLI notes manager using Python and markdown files.', 'In Progress', '2026-04-20', '2026-05-20');

INSERT INTO tasks (project_id, task_title, task_description, priority, status, due_date)
VALUES
(1, 'Create synthetic youth data', 'Generate realistic sample data for testing.', 'High', 'Done', '2026-05-03'),
(1, 'Build database schema', 'Create tables for youth, services, and recommendations.', 'High', 'In Progress', '2026-05-07'),
(1, 'Create dashboard charts', 'Show risk levels and service recommendations.', 'Medium', 'Not Started', '2026-05-15'),

(2, 'Design homepage', 'Create layout for homepage and hero section.', 'Medium', 'Not Started', '2026-05-08'),
(2, 'Add GitHub projects', 'List projects with links to repositories.', 'High', 'Not Started', '2026-05-12'),

(3, 'Create note model', 'Define note title, body, tags, and timestamps.', 'High', 'Done', '2026-04-25'),
(3, 'Add search feature', 'Allow users to search notes by title or content.', 'Medium', 'In Progress', '2026-05-10');