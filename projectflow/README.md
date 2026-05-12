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
