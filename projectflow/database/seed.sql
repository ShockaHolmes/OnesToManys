PRAGMA foreign_keys = ON;

DELETE FROM youth_support_needs;
DELETE FROM foster_youth;
DELETE FROM tasks;
DELETE FROM projects;

DELETE FROM sqlite_sequence WHERE name IN ('projects', 'tasks', 'foster_youth', 'youth_support_needs');

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
    'Create 12 youth profiles for Spring 2026 intake. Example records: YTH-001 (age 18, housing Transitional, education GED In Progress, employment Part-time Retail, support Mentoring + Transportation), YTH-002 (age 19, housing Unstable, education High School Diploma, employment Unemployed, support Housing Support + Job Readiness), YTH-003 (age 20, housing Stable, education Community College, employment Part-time Food Service, support Education Planning), YTH-004 (age 18, housing Shelter, education GED In Progress, employment Unemployed, support Mental Health + Housing Support). Include target fields: youth_code, age, housing_status, education_status, employment_status, risk_level, support_need, assigned_case_worker, intake_date.',
    'High',
    'Not Started',
    '2026-05-16'
),
(
    1,
    'Build database schema',
    'Add SQL objects for youth tracking: table foster_youth(youth_id PK, youth_code UNIQUE, first_name, last_name, age, housing_status, education_status, employment_status, risk_level, county, intake_date, case_worker), table youth_support_needs(need_id PK, youth_id FK, support_need, urgency, referral_status, updated_at), and table service_referrals(referral_id PK, youth_id FK, provider_name, service_type, referral_date, outcome). Create indexes on risk_level, housing_status, and referral_status for chart and dashboard filters.',
    'High',
    'In Progress',
    '2026-05-20'
),
(
    1,
    'Create dashboard charts',
    'Use demo chart metrics based on intake data. Task status chart target: Not Started=1, In Progress=1, Done=1. Task priority chart target: High=2, Medium=1, Low=0. Youth support needs chart target: Housing Support=5, Job Readiness=4, Education Planning=3, Transportation=3, Mentoring=4, Mental Health=2. Add risk-level pie chart: High=4, Medium=5, Low=3.',
    'Medium',
    'Done',
    '2026-05-28'
);

INSERT INTO foster_youth (
    youth_code,
    first_name,
    last_name,
    age,
    housing_status,
    education_status,
    employment_status,
    risk_level,
    county,
    intake_date,
    case_worker
)
VALUES
('YTH-001', 'Amaya', 'Carter', 18, 'Transitional', 'GED In Progress', 'Part-time Retail', 'Medium', 'King', '2026-05-01', 'T. Jackson'),
('YTH-002', 'Jordan', 'Lee', 19, 'Unstable', 'High School Diploma', 'Unemployed', 'High', 'King', '2026-05-01', 'M. Alvarez'),
('YTH-003', 'Nia', 'Brooks', 20, 'Stable', 'Community College', 'Part-time Food Service', 'Low', 'Pierce', '2026-05-02', 'T. Jackson'),
('YTH-004', 'Malik', 'Davis', 18, 'Shelter', 'GED In Progress', 'Unemployed', 'High', 'King', '2026-05-02', 'R. Patel'),
('YTH-005', 'Elena', 'Ramos', 19, 'Transitional', 'Certificate Program', 'Part-time Warehouse', 'Medium', 'Snohomish', '2026-05-03', 'M. Alvarez'),
('YTH-006', 'Darius', 'Stone', 21, 'Unstable', 'Some College', 'Gig Work', 'High', 'King', '2026-05-03', 'R. Patel'),
('YTH-007', 'Kai', 'Nguyen', 18, 'Stable', 'High School Diploma', 'Part-time Grocery', 'Low', 'Pierce', '2026-05-04', 'T. Jackson'),
('YTH-008', 'Sofia', 'Mendez', 20, 'Transitional', 'Community College', 'Work Study', 'Medium', 'Snohomish', '2026-05-04', 'M. Alvarez'),
('YTH-009', 'Brandon', 'Cole', 19, 'Shelter', 'Dropped Out', 'Unemployed', 'High', 'King', '2026-05-05', 'R. Patel'),
('YTH-010', 'Zoe', 'Price', 21, 'Stable', 'Associate Degree', 'Full-time', 'Low', 'Pierce', '2026-05-05', 'T. Jackson'),
('YTH-011', 'Imani', 'Fields', 18, 'Unstable', 'GED In Progress', 'Unemployed', 'Medium', 'King', '2026-05-06', 'M. Alvarez'),
('YTH-012', 'Noah', 'Bennett', 20, 'Transitional', 'Certificate Program', 'Part-time Construction', 'Medium', 'Snohomish', '2026-05-06', 'R. Patel');

INSERT INTO youth_support_needs (
    youth_id,
    support_need,
    urgency,
    referral_status,
    updated_at
)
VALUES
(1, 'Mentoring', 'Medium', 'Referred', '2026-05-10'),
(1, 'Transportation', 'Medium', 'In Progress', '2026-05-10'),
(2, 'Housing Support', 'High', 'In Progress', '2026-05-10'),
(2, 'Job Readiness', 'High', 'Referred', '2026-05-10'),
(3, 'Education Planning', 'Medium', 'In Progress', '2026-05-10'),
(4, 'Housing Support', 'High', 'In Progress', '2026-05-10'),
(4, 'Mental Health', 'High', 'Referred', '2026-05-10'),
(5, 'Job Readiness', 'Medium', 'In Progress', '2026-05-10'),
(5, 'Transportation', 'Medium', 'Referred', '2026-05-10'),
(6, 'Housing Support', 'High', 'Referred', '2026-05-10'),
(6, 'Mentoring', 'Medium', 'In Progress', '2026-05-10'),
(7, 'Education Planning', 'Low', 'Referred', '2026-05-10'),
(8, 'Education Planning', 'Medium', 'In Progress', '2026-05-10'),
(8, 'Mentoring', 'Medium', 'Referred', '2026-05-10'),
(9, 'Housing Support', 'High', 'In Progress', '2026-05-10'),
(9, 'Job Readiness', 'High', 'Referred', '2026-05-10'),
(9, 'Mental Health', 'High', 'Referred', '2026-05-10'),
(10, 'Mentoring', 'Low', 'In Progress', '2026-05-10'),
(11, 'Housing Support', 'High', 'In Progress', '2026-05-10'),
(11, 'Transportation', 'Medium', 'Referred', '2026-05-10'),
(12, 'Job Readiness', 'Medium', 'In Progress', '2026-05-10');