# Foster Path Dashboard Demo Data

This file contains copy/paste-ready example data you can show in the project demo.

## 1. Master Record Example (Project)

Use this in the Master Record form (`master-records.html`) or `POST /api/projects`.

```json
{
  "project_name": "Foster Path Dashboard",
  "description": "Tracks support needs for youth aging out of foster care and visualizes outcomes for program teams.",
  "status": "In Progress",
  "start_date": "2026-05-12",
  "due_date": "2026-06-12"
}
```

## 2. Related Detail Records Examples (Tasks)

Use these in the Detail Record form (`detail-records.html`) or `POST /api/tasks`.

### A) Create youth data

```json
{
  "project_id": 1,
  "task_title": "Create youth data",
  "task_description": "Create intake records for 12 youth with housing, education, employment, risk level, and support needs.",
  "priority": "High",
  "status": "Not Started",
  "due_date": "2026-05-16"
}
```

### B) Build database schema

```json
{
  "project_id": 1,
  "task_title": "Build database schema",
  "task_description": "Create normalized tables for youth, support needs, and service referrals.",
  "priority": "High",
  "status": "In Progress",
  "due_date": "2026-05-20"
}
```

### C) Create dashboard charts

```json
{
  "project_id": 1,
  "task_title": "Create dashboard charts",
  "task_description": "Build bar, doughnut, and risk-level charts for youth support and task progress.",
  "priority": "Medium",
  "status": "Done",
  "due_date": "2026-05-28"
}
```

## 3. Example Youth Dataset (Actual Demo Records)

These are realistic records you can present as input data for the Foster Path dashboard.

```json
[
  {
    "youth_code": "YTH-001",
    "first_name": "Amaya",
    "last_name": "Carter",
    "age": 18,
    "housing_status": "Transitional",
    "education_status": "GED In Progress",
    "employment_status": "Part-time Retail",
    "risk_level": "Medium",
    "support_needs": ["Mentoring", "Transportation"],
    "assigned_case_worker": "T. Jackson",
    "intake_date": "2026-05-01"
  },
  {
    "youth_code": "YTH-002",
    "first_name": "Jordan",
    "last_name": "Lee",
    "age": 19,
    "housing_status": "Unstable",
    "education_status": "High School Diploma",
    "employment_status": "Unemployed",
    "risk_level": "High",
    "support_needs": ["Housing Support", "Job Readiness"],
    "assigned_case_worker": "M. Alvarez",
    "intake_date": "2026-05-01"
  },
  {
    "youth_code": "YTH-003",
    "first_name": "Nia",
    "last_name": "Brooks",
    "age": 20,
    "housing_status": "Stable",
    "education_status": "Community College",
    "employment_status": "Part-time Food Service",
    "risk_level": "Low",
    "support_needs": ["Education Planning"],
    "assigned_case_worker": "T. Jackson",
    "intake_date": "2026-05-02"
  },
  {
    "youth_code": "YTH-004",
    "first_name": "Malik",
    "last_name": "Davis",
    "age": 18,
    "housing_status": "Shelter",
    "education_status": "GED In Progress",
    "employment_status": "Unemployed",
    "risk_level": "High",
    "support_needs": ["Housing Support", "Mental Health"],
    "assigned_case_worker": "R. Patel",
    "intake_date": "2026-05-02"
  },
  {
    "youth_code": "YTH-005",
    "first_name": "Elena",
    "last_name": "Ramos",
    "age": 19,
    "housing_status": "Transitional",
    "education_status": "Certificate Program",
    "employment_status": "Part-time Warehouse",
    "risk_level": "Medium",
    "support_needs": ["Job Readiness", "Transportation"],
    "assigned_case_worker": "M. Alvarez",
    "intake_date": "2026-05-03"
  },
  {
    "youth_code": "YTH-006",
    "first_name": "Darius",
    "last_name": "Stone",
    "age": 21,
    "housing_status": "Unstable",
    "education_status": "Some College",
    "employment_status": "Gig Work",
    "risk_level": "High",
    "support_needs": ["Housing Support", "Mentoring"],
    "assigned_case_worker": "R. Patel",
    "intake_date": "2026-05-03"
  },
  {
    "youth_code": "YTH-007",
    "first_name": "Kai",
    "last_name": "Nguyen",
    "age": 18,
    "housing_status": "Stable",
    "education_status": "High School Diploma",
    "employment_status": "Part-time Grocery",
    "risk_level": "Low",
    "support_needs": ["Education Planning"],
    "assigned_case_worker": "T. Jackson",
    "intake_date": "2026-05-04"
  },
  {
    "youth_code": "YTH-008",
    "first_name": "Sofia",
    "last_name": "Mendez",
    "age": 20,
    "housing_status": "Transitional",
    "education_status": "Community College",
    "employment_status": "Work Study",
    "risk_level": "Medium",
    "support_needs": ["Education Planning", "Mentoring"],
    "assigned_case_worker": "M. Alvarez",
    "intake_date": "2026-05-04"
  },
  {
    "youth_code": "YTH-009",
    "first_name": "Brandon",
    "last_name": "Cole",
    "age": 19,
    "housing_status": "Shelter",
    "education_status": "Dropped Out",
    "employment_status": "Unemployed",
    "risk_level": "High",
    "support_needs": ["Housing Support", "Job Readiness", "Mental Health"],
    "assigned_case_worker": "R. Patel",
    "intake_date": "2026-05-05"
  },
  {
    "youth_code": "YTH-010",
    "first_name": "Zoe",
    "last_name": "Price",
    "age": 21,
    "housing_status": "Stable",
    "education_status": "Associate Degree",
    "employment_status": "Full-time",
    "risk_level": "Low",
    "support_needs": ["Mentoring"],
    "assigned_case_worker": "T. Jackson",
    "intake_date": "2026-05-05"
  },
  {
    "youth_code": "YTH-011",
    "first_name": "Imani",
    "last_name": "Fields",
    "age": 18,
    "housing_status": "Unstable",
    "education_status": "GED In Progress",
    "employment_status": "Unemployed",
    "risk_level": "Medium",
    "support_needs": ["Housing Support", "Transportation"],
    "assigned_case_worker": "M. Alvarez",
    "intake_date": "2026-05-06"
  },
  {
    "youth_code": "YTH-012",
    "first_name": "Noah",
    "last_name": "Bennett",
    "age": 20,
    "housing_status": "Transitional",
    "education_status": "Certificate Program",
    "employment_status": "Part-time Construction",
    "risk_level": "Medium",
    "support_needs": ["Job Readiness"],
    "assigned_case_worker": "R. Patel",
    "intake_date": "2026-05-06"
  }
]
```

## 4. Optional Schema Example for Youth Data

This is an add-on schema example you can present for the "Build database schema" detail task.

```sql
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
  FOREIGN KEY (youth_id) REFERENCES foster_youth(youth_id)
);

CREATE INDEX idx_foster_youth_risk_level ON foster_youth(risk_level);
CREATE INDEX idx_foster_youth_housing_status ON foster_youth(housing_status);
CREATE INDEX idx_youth_support_referral_status ON youth_support_needs(referral_status);
```

## 5. Chart-Ready Aggregates

These values match the sample detail tasks and youth dataset above.

```json
{
  "task_status": {
    "Not Started": 1,
    "In Progress": 1,
    "Done": 1
  },
  "task_priority": {
    "High": 2,
    "Medium": 1
  },
  "support_needs": {
    "Housing Support": 5,
    "Job Readiness": 4,
    "Education Planning": 3,
    "Transportation": 3,
    "Mentoring": 4,
    "Mental Health": 2
  },
  "risk_levels": {
    "High": 4,
    "Medium": 5,
    "Low": 3
  }
}
```

## 6. Demo Script Snippet

- Create the master record first.
- Add the three related detail records in this order:
  1. Create youth data
  2. Build database schema
  3. Create dashboard charts
- Show charts using the aggregate JSON as expected values.
- Explain that each detail record maps to implementation work and measurable dashboard outputs.
