## Backend Setup Instructions

This project uses Python, Flask, Flask-CORS, and SQLite for the backend REST API.

### 1. Go to the backend folder

```bash
cd backend

python3 -m venv .venv

source .venv/bin/activate

python3 -m pip install flask flask-cors

python3 app.py

curl http://127.0.0.1:5000/

curl http://127.0.0.1:5000/api/health

## API Testing

### Get all projects

This endpoint returns all master records from the `projects` table.

```bash
curl http://127.0.0.1:5000/api/projects

## API Testing

### Get all projects

This endpoint returns all master records from the `projects` table.

For pretty JSON version:
```bash
curl http://127.0.0.1:5000/api/projects

## Get All Tasks

This endpoint returns all detail records from the `tasks` table.

```bash
curl http://127.0.0.1:5000/api/tasks

Pretty JSON version:

curl http://127.0.0.1:5000/api/tasks | python3 -m json.tool

## Project CRUD API Testing

### Get all projects

```bash
curl http://127.0.0.1:5000/api/projects | python3 -m json.tool

Get one project

curl http://127.0.0.1:5000/api/projects/1 | python3 -m json.tool

Create a project

curl -X POST http://127.0.0.1:5000/api/projects \
  -H "Content-Type: application/json" \
  -d '{
    "project_name": "Portfolio Website",
    "description": "Create a personal portfolio website to show projects, skills, and resume information.",
    "status": "Not Started",
    "start_date": "2026-05-15",
    "due_date": "2026-06-01"
  }' | python3 -m json.tool

Update a project

curl -X PUT http://127.0.0.1:5000/api/projects/2 \
  -H "Content-Type: application/json" \
  -d '{
    "project_name": "Updated Portfolio Website",
    "description": "Create a stronger portfolio website with GitHub links, project screenshots, and contact information.",
    "status": "In Progress",
    "start_date": "2026-05-15",
    "due_date": "2026-06-05"
  }' | python3 -m json.tool

Delete a project

curl -X DELETE http://127.0.0.1:5000/api/projects/2 | python3 -m json.tool

## Task CRUD API Testing

### Get all tasks

```bash
curl http://127.0.0.1:5000/api/tasks | python3 -m json.tool
```

### Get one task

```bash
curl http://127.0.0.1:5000/api/tasks/1 | python3 -m json.tool
```

### Create a task

```bash
curl -X POST http://127.0.0.1:5000/api/tasks \
  -H "Content-Type: application/json" \
  -d '{
    "project_id": 1,
    "task_title": "Create risk score system",
    "task_description": "Build a simple risk score system that helps identify youth who may need housing, education, employment, or mentoring support.",
    "priority": "High",
    "status": "Not Started",
    "due_date": "2026-06-01"
  }' | python3 -m json.tool
```

### Update a task

```bash
curl -X PUT http://127.0.0.1:5000/api/tasks/4 \
  -H "Content-Type: application/json" \
  -d '{
    "project_id": 1,
    "task_title": "Create youth risk score system",
    "task_description": "Update the risk score system to include housing, education, employment, and support-service needs.",
    "priority": "High",
    "status": "In Progress",
    "due_date": "2026-06-03"
  }' | python3 -m json.tool
```

### Delete a task

```bash
curl -X DELETE http://127.0.0.1:5000/api/tasks/4 | python3 -m json.tool
```

### Test invalid project ID

```bash
curl -X POST http://127.0.0.1:5000/api/tasks \
  -H "Content-Type: application/json" \
  -d '{
    "project_id": 999,
    "task_title": "Invalid task",
    "task_description": "This should fail because project 999 does not exist.",
    "priority": "Low",
    "status": "Not Started",
    "due_date": "2026-06-10"
  }' | python3 -m json.tool
```

## One-to-Many Relationship Testing

### Get all tasks for one project

This endpoint returns one project and all tasks connected to that project.

```bash
curl http://127.0.0.1:5000/api/projects/1/tasks | python3 -m json.tool
```

### Test invalid project ID

```bash
curl http://127.0.0.1:5000/api/projects/999/tasks | python3 -m json.tool
```

### Test invalid foreign key when creating a task

```bash
curl -X POST http://127.0.0.1:5000/api/tasks \
  -H "Content-Type: application/json" \
  -d '{
    "project_id": 999,
    "task_title": "Invalid task",
    "task_description": "This task should fail because project 999 does not exist.",
    "priority": "Low",
    "status": "Not Started",
    "due_date": "2026-06-10"
  }' | python3 -m json.tool
```
## One Project With Its Tasks

This endpoint returns one master record and all detail records connected to it.

### Get all tasks for Project 1

```bash
curl http://127.0.0.1:5000/api/projects/1/tasks | python3 -m json.tool
```

### Test invalid project ID

```bash
curl http://127.0.0.1:5000/api/projects/999/tasks | python3 -m json.tool
```

## Create a Task Under a Project

This endpoint creates a detail record directly under a selected master record.

### Create a task under Project 1

```bash
curl -X POST http://127.0.0.1:5000/api/projects/1/tasks \
  -H "Content-Type: application/json" \
  -d '{
    "task_title": "Create resource recommendation logic",
    "task_description": "Build logic that recommends housing, education, employment, and mentoring resources for youth records.",
    "priority": "High",
    "status": "Not Started",
    "due_date": "2026-06-08"
  }' | python3 -m json.tool
```

### Confirm Project 1 includes the new task

```bash
curl http://127.0.0.1:5000/api/projects/1/tasks | python3 -m json.tool
```

### Test invalid project ID

```bash
curl -X POST http://127.0.0.1:5000/api/projects/999/tasks \
  -H "Content-Type: application/json" \
  -d '{
    "task_title": "Invalid project task",
    "task_description": "This should fail because Project 999 does not exist.",
    "priority": "Low",
    "status": "Not Started",
    "due_date": "2026-06-15"
  }' | python3 -m json.tool
```

### Test missing required field

```bash
curl -X POST http://127.0.0.1:5000/api/projects/1/tasks \
  -H "Content-Type: application/json" \
  -d '{
    "task_description": "This should fail because task_title is missing.",
    "priority": "Medium",
    "status": "Not Started",
    "due_date": "2026-06-15"
  }' | python3 -m json.tool
```
## Get One Task Under One Project

This endpoint returns one specific detail record only if it belongs to the selected master record.

### Get Task 1 under Project 1

```bash
curl http://127.0.0.1:5000/api/projects/1/tasks/1 | python3 -m json.tool
```

### Test invalid project ID

```bash
curl http://127.0.0.1:5000/api/projects/999/tasks/1 | python3 -m json.tool
```

### Test wrong project/task pairing

```bash
curl http://127.0.0.1:5000/api/projects/2/tasks/1 | python3 -m json.tool
```
## Curl API Testing

The API was tested using curl from the terminal.

Tested endpoint groups:

- Master CRUD endpoints for `projects`
- Detail CRUD endpoints for `tasks`
- Nested relationship endpoints for `projects/{id}/tasks`

Saved testing evidence:

- `docs/curl-tests/api-test-results.txt`

Example test command:

```bash
curl http://127.0.0.1:5000/api/projects/1/tasks | python3 -m json.tool
## Curl API Testing

The API was tested using curl from the terminal.

Tested endpoint groups:

- Master CRUD endpoints for `projects`
- Detail CRUD endpoints for `tasks`
- Nested relationship endpoints for `projects/{id}/tasks`

Saved testing evidence:

- `docs/curl-tests/api-test-results.txt`

Example test command:

```bash
curl http://127.0.0.1:5000/api/projects/1/tasks | python3 -m json.tool

## Export Data to JSON

This endpoint exports the current database data to a JSON file.

The export includes:

- Master records from the `projects` table
- Detail records from the `tasks` table
- Relationship data showing each project with its related tasks

### Endpoint

```bash
GET /api/export/json
```

### Test with curl

```bash
curl http://127.0.0.1:5000/api/export/json | python3 -m json.tool
```

### Export file location

```text
database/exports/projectflow_export.json
```
## Import Data from JSON

This endpoint reloads saved database data from a JSON export file.

The import reloads:

- Master records into the `projects` table
- Detail records into the `tasks` table
- Foreign key relationships between projects and tasks

### Default import file

```text
database/exports/projectflow_export.json
```

### Endpoint

```bash
POST /api/import/json
```

### Import from the default file

```bash
curl -X POST http://127.0.0.1:5000/api/import/json \
  -H "Content-Type: application/json" \
  -d '{}' | python3 -m json.tool
```

### Import from a specific file in the exports folder

```bash
curl -X POST http://127.0.0.1:5000/api/import/json \
  -H "Content-Type: application/json" \
  -d '{"file_name": "projectflow_export.json"}' | python3 -m json.tool
```

### Test missing file error

```bash
curl -X POST http://127.0.0.1:5000/api/import/json \
  -H "Content-Type: application/json" \
  -d '{"file_name": "missing_file.json"}' | python3 -m json.tool
```
## Vanilla JavaScript Frontend Setup

The Vanilla JavaScript frontend is located in:

```text
frontend-vanilla/
```

It includes:

- `index.html`
- `master-records.html`
- `detail-records.html`
- `styles.css`
- `script.js`
- `master-records.js`
- `detail-records.js`

### 1. Start the Flask backend

```bash
cd backend
source .venv/bin/activate
python3 app.py
```

The backend should run at:

```text
http://127.0.0.1:5000 (or next open localhost port)
```

### 2. Start the Vanilla JavaScript frontend

Open a second terminal:

```bash
cd frontend-vanilla
python3 -m http.server 8000
```

### 3. Open the frontend in the browser

```text
http://localhost:8000/index.html
http://localhost:8000/master-records.html
http://localhost:8000/detail-records.html
```

### 4. Test the page

In `index.html`, test:

- Create and load projects/tasks

In `master-records.html`, test:

- Initial loading state
- Error state when backend is not running
- Manual refresh with **Refresh Data** button
- Dynamic display of all master records from `GET /api/projects`

In `detail-records.html`, test:

- Initial loading state
- Error state when backend is not running
- Manual refresh with **Refresh Data** button
- Dynamic display of all detail records from `GET /api/tasks`
- Connected master shown for each detail (project ID and name when available)

If the Flask backend runs on port `5001`, update this line in `frontend-vanilla/script.js` for `index.html`:

```javascript
const API_BASE_URL = "http://127.0.0.1:5001";
```

For `master-records.html`, no manual port change is needed for localhost ports `5000` through `5005` because `master-records.js` auto-detects the backend using `GET /api/health`.

For `detail-records.html`, no manual port change is needed for localhost ports `5000` through `5005` because `detail-records.js` auto-detects the backend using `GET /api/health`.

