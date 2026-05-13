# ProjectFlow

## Quick Start

Run these from the projectflow folder.

1. Create and seed the database:

```bash
rm -f database/projectflow.db
sqlite3 database/projectflow.db < database/schema.sql
sqlite3 database/projectflow.db < database/seed.sql
```

2. Start backend (Terminal 1):

```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate
python3 -m pip install flask flask-cors
python3 app.py
```

3. Start React frontend (Terminal 2):

```bash
cd frontend-react
npm install
npm run dev
```

Optional: for Vanilla JS pages, run in another terminal:

```bash
cd frontend-vanilla
python3 -m http.server 8000
```

4. Open:

- React: http://localhost:5173
- API health: http://127.0.0.1:5000/api/health
- Vanilla master view (optional): http://localhost:8000/master-records.html

## Project Purpose

ProjectFlow is a one-to-many project tracking app.

- A master record is a project.
- A detail record is a task connected to a project.
- The app demonstrates CRUD operations, nested REST endpoints, JSON import/export, and master-detail UI behavior in both Vanilla JavaScript and React.

## Tech Stack

### Backend

- Python 3
- Flask
- Flask-CORS
- SQLite

### Frontend

- Vanilla JavaScript, HTML, CSS
- React with Vite

### Testing and Tooling

- Vitest
- Testing Library
- curl for API checks

## Repository Layout

- backend/: Flask API
- database/: SQLite DB file, schema, seed, exports
- frontend-vanilla/: Vanilla JS UI
- frontend-react/: React UI
- docs/: notes and API test output

## Prerequisites

- Python 3.10+
- Node.js 18+
- npm
- sqlite3 CLI

## Database Setup

Run from the projectflow folder.

### 1. Create or reset the database

```bash
rm -f database/projectflow.db
sqlite3 database/projectflow.db < database/schema.sql
sqlite3 database/projectflow.db < database/seed.sql
```

### 2. Verify tables exist

```bash
sqlite3 database/projectflow.db ".tables"
```

Expected tables include projects and tasks.

## Backend Run Instructions

### 1. Go to backend and create venv

```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate
python3 -m pip install flask flask-cors
```

### 2. Start the API

```bash
python3 app.py
```

Backend default URL:

- http://127.0.0.1:5000

### 3. Quick health checks

```bash
curl http://127.0.0.1:5000/
curl http://127.0.0.1:5000/api/health
```

## Frontend Run Instructions

Start backend first, then run either frontend.

### Vanilla JS Frontend

```bash
cd frontend-vanilla
python3 -m http.server 8000
```

Open:

- http://localhost:8000/index.html
- http://localhost:8000/master-records.html
- http://localhost:8000/detail-records.html

### React Frontend

```bash
cd frontend-react
npm install
npm run dev
```

Open:

- http://localhost:5173

## API Route Reference

Base URL:

- http://127.0.0.1:5000

### System Routes

- GET /: API summary and available route list
- GET /api/health: backend and database health check

### Master Routes (Projects)

#### GET /api/projects

Returns all master records.

Example response:

```json
[
  {
    "project_id": 1,
    "project_name": "Mentor Support Hub",
    "description": "Coordinate mentoring workflows",
    "status": "In Progress",
    "start_date": "2026-05-15",
    "due_date": "2026-06-10"
  }
]
```

#### GET /api/projects/{project_id}

Returns one master record.

Example response:

```json
{
  "project_id": 1,
  "project_name": "Mentor Support Hub",
  "description": "Coordinate mentoring workflows",
  "status": "In Progress",
  "start_date": "2026-05-15",
  "due_date": "2026-06-10"
}
```

#### POST /api/projects

Creates one master record.

Example request body:

```json
{
  "project_name": "Portfolio Website",
  "description": "Create a personal portfolio site.",
  "status": "Not Started",
  "start_date": "2026-05-15",
  "due_date": "2026-06-01"
}
```

Example response (201):

```json
{
  "project_id": 2,
  "project_name": "Portfolio Website",
  "description": "Create a personal portfolio site.",
  "status": "Not Started",
  "start_date": "2026-05-15",
  "due_date": "2026-06-01"
}
```

#### PUT /api/projects/{project_id}

Updates one master record.

Example request body:

```json
{
  "project_name": "Updated Portfolio Website",
  "description": "Expanded project details",
  "status": "In Progress",
  "start_date": "2026-05-15",
  "due_date": "2026-06-05"
}
```

Example response:

```json
{
  "project_id": 2,
  "project_name": "Updated Portfolio Website",
  "description": "Expanded project details",
  "status": "In Progress",
  "start_date": "2026-05-15",
  "due_date": "2026-06-05"
}
```

#### DELETE /api/projects/{project_id}

Deletes one master record and its related detail records.

Example response:

```json
{
  "message": "Project and related tasks deleted successfully",
  "deleted_project_id": 2
}
```

### Detail Routes (Tasks)

#### GET /api/tasks

Returns all detail records.

Example response:

```json
[
  {
    "task_id": 1,
    "project_id": 1,
    "task_title": "Schedule onboarding",
    "task_description": "Prepare mentor onboarding schedule",
    "priority": "High",
    "status": "Not Started",
    "due_date": "2026-06-01"
  }
]
```

#### GET /api/tasks/{task_id}

Returns one detail record.

Example response:

```json
{
  "task_id": 1,
  "project_id": 1,
  "task_title": "Schedule onboarding",
  "task_description": "Prepare mentor onboarding schedule",
  "priority": "High",
  "status": "Not Started",
  "due_date": "2026-06-01"
}
```

#### POST /api/tasks

Creates one detail record.

Example request body:

```json
{
  "project_id": 1,
  "task_title": "Create risk score system",
  "task_description": "Build a simple youth risk score flow.",
  "priority": "High",
  "status": "Not Started",
  "due_date": "2026-06-01"
}
```

Example response (201):

```json
{
  "task_id": 4,
  "project_id": 1,
  "task_title": "Create risk score system",
  "task_description": "Build a simple youth risk score flow.",
  "priority": "High",
  "status": "Not Started",
  "due_date": "2026-06-01"
}
```

#### PUT /api/tasks/{task_id}

Updates one detail record.

Example request body:

```json
{
  "project_id": 1,
  "task_title": "Create youth risk score system",
  "task_description": "Update scoring inputs",
  "priority": "High",
  "status": "In Progress",
  "due_date": "2026-06-03"
}
```

Example response:

```json
{
  "task_id": 4,
  "project_id": 1,
  "task_title": "Create youth risk score system",
  "task_description": "Update scoring inputs",
  "priority": "High",
  "status": "In Progress",
  "due_date": "2026-06-03"
}
```

#### DELETE /api/tasks/{task_id}

Deletes one detail record.

Example response:

```json
{
  "message": "Task deleted successfully",
  "deleted_task_id": 4
}
```

### Nested Relationship Routes (One-to-Many)

#### GET /api/projects/{project_id}/tasks

Returns one master record plus all connected detail records.

Example response:

```json
{
  "project": {
    "project_id": 1,
    "project_name": "Mentor Support Hub",
    "description": "Coordinate mentoring workflows",
    "status": "In Progress",
    "start_date": "2026-05-15",
    "due_date": "2026-06-10"
  },
  "tasks": [
    {
      "task_id": 1,
      "project_id": 1,
      "task_title": "Schedule onboarding",
      "task_description": "Prepare mentor onboarding schedule",
      "priority": "High",
      "status": "Not Started",
      "due_date": "2026-06-01"
    }
  ]
}
```

#### GET /api/projects/{project_id}/tasks/{task_id}

Returns one specific detail record under one specific master record.

Example response:

```json
{
  "project": {
    "project_id": 1,
    "project_name": "Mentor Support Hub",
    "description": "Coordinate mentoring workflows",
    "status": "In Progress",
    "start_date": "2026-05-15",
    "due_date": "2026-06-10"
  },
  "task": {
    "task_id": 1,
    "project_id": 1,
    "task_title": "Schedule onboarding",
    "task_description": "Prepare mentor onboarding schedule",
    "priority": "High",
    "status": "Not Started",
    "due_date": "2026-06-01"
  }
}
```

#### POST /api/projects/{project_id}/tasks

Creates a detail record directly under the selected master record.

Example request body:

```json
{
  "task_title": "Create resource recommendation logic",
  "task_description": "Recommend support resources for youth",
  "priority": "High",
  "status": "Not Started",
  "due_date": "2026-06-08"
}
```

Example response (201):

```json
{
  "message": "Task created successfully under project",
  "project_id": 1,
  "task": {
    "task_id": 9,
    "project_id": 1,
    "task_title": "Create resource recommendation logic",
    "task_description": "Recommend support resources for youth",
    "priority": "High",
    "status": "Not Started",
    "due_date": "2026-06-08"
  }
}
```

### Data Import and Export Routes

- GET /api/export/json
- POST /api/import/json

## Frontend Testing Checklist

### Master Records View

- Master list loads
- Create, edit, delete actions work
- Selecting a master shows connected detail records
- Related details update without page reload

### Detail Records View

- Detail list loads
- Create, edit, delete actions work
- Each detail shows connected master information

## React Test Commands

```bash
cd frontend-react
npm test
npm run test:coverage
npm run build
```

Note: Vitest does not support the watchAll flag.
