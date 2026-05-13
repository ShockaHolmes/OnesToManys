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

## API Endpoint List

### System

- GET /: API summary
- GET /api/health: service and DB health check

### Projects (Master Records)

- GET /api/projects: list all projects
- GET /api/projects/{project_id}: get one project
- POST /api/projects: create project
- PUT /api/projects/{project_id}: update project
- DELETE /api/projects/{project_id}: delete project and related tasks

### Tasks (Detail Records)

- GET /api/tasks: list all tasks
- GET /api/tasks/{task_id}: get one task
- POST /api/tasks: create task
- PUT /api/tasks/{task_id}: update task
- DELETE /api/tasks/{task_id}: delete task

### Nested One-to-Many Routes

- GET /api/projects/{project_id}/tasks: get project and its tasks
- GET /api/projects/{project_id}/tasks/{task_id}: get one task under one project
- POST /api/projects/{project_id}/tasks: create task under a specific project

### Data Portability

- GET /api/export/json: export DB data to JSON
- POST /api/import/json: import DB data from JSON

## Useful API Examples

### Get all projects

```bash
curl http://127.0.0.1:5000/api/projects | python3 -m json.tool
```

### Get tasks for one project

```bash
curl http://127.0.0.1:5000/api/projects/1/tasks | python3 -m json.tool
```

### Create a project

```bash
curl -X POST http://127.0.0.1:5000/api/projects \
  -H "Content-Type: application/json" \
  -d '{
    "project_name": "Portfolio Website",
    "description": "Create a personal portfolio site.",
    "status": "Not Started",
    "start_date": "2026-05-15",
    "due_date": "2026-06-01"
  }' | python3 -m json.tool
```

### Create a task

```bash
curl -X POST http://127.0.0.1:5000/api/tasks \
  -H "Content-Type: application/json" \
  -d '{
    "project_id": 1,
    "task_title": "Create risk score system",
    "task_description": "Build a simple youth risk score flow.",
    "priority": "High",
    "status": "Not Started",
    "due_date": "2026-06-01"
  }' | python3 -m json.tool
```

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
