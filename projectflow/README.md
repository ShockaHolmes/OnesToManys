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