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