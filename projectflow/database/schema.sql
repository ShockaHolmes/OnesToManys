
DROP TABLE IF EXISTS tasks;
DROP TABLE IF EXISTS projects;
DROP TABLE IF EXISTS youth_support_needs;
DROP TABLE IF EXISTS foster_youth;

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

CREATE TABLE foster_youth (
    youth_id INTEGER PRIMARY KEY AUTOINCREMENT,
    youth_code TEXT NOT NULL UNIQUE,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    age INTEGER NOT NULL,
    housing_status TEXT NOT NULL,
    education_status TEXT NOT NULL,
    employment_status TEXT NOT NULL,
    risk_level TEXT NOT NULL,
    county TEXT,
    intake_date TEXT NOT NULL,
    case_worker TEXT NOT NULL
);

CREATE TABLE youth_support_needs (
    need_id INTEGER PRIMARY KEY AUTOINCREMENT,
    youth_id INTEGER NOT NULL,
    support_need TEXT NOT NULL,
    urgency TEXT NOT NULL,
    referral_status TEXT NOT NULL,
    updated_at TEXT NOT NULL,
    FOREIGN KEY (youth_id) REFERENCES foster_youth(youth_id) ON DELETE CASCADE
);

CREATE INDEX idx_foster_youth_risk_level ON foster_youth(risk_level);
CREATE INDEX idx_foster_youth_housing_status ON foster_youth(housing_status);
CREATE INDEX idx_youth_support_referral_status ON youth_support_needs(referral_status);