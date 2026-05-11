import sqlite3
from pathlib import Path

from flask import Flask, jsonify
try:
    from flask_cors import CORS
except ImportError:
    CORS = lambda app: None

app = Flask(__name__)
CORS(app)

BASE_DIR = Path(__file__).resolve().parent.parent
DB_PATH = BASE_DIR / "database" / "projectflow.db"


def get_db_connection():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn


@app.route("/")
def home():
    return jsonify({
        "message": "ProjectFlow API is running",
        "endpoints": [
            "/api/projects",
            "/api/tasks",
            "/api/projects/<project_id>/tasks"
        ]
    })


@app.route("/api/projects", methods=["GET"])
def get_projects():
    conn = get_db_connection()
    projects = conn.execute("SELECT * FROM projects").fetchall()
    conn.close()

    return jsonify([dict(project) for project in projects])


@app.route("/api/tasks", methods=["GET"])
def get_tasks():
    conn = get_db_connection()
    tasks = conn.execute("SELECT * FROM tasks").fetchall()
    conn.close()

    return jsonify([dict(task) for task in tasks])


@app.route("/api/projects/<int:project_id>/tasks", methods=["GET"])
def get_tasks_by_project(project_id):
    conn = get_db_connection()

    project = conn.execute(
        "SELECT * FROM projects WHERE project_id = ?",
        (project_id,)
    ).fetchone()

    if project is None:
        conn.close()
        return jsonify({"error": "Project not found"}), 404

    tasks = conn.execute(
        "SELECT * FROM tasks WHERE project_id = ?",
        (project_id,)
    ).fetchall()

    conn.close()

    return jsonify({
        "project": dict(project),
        "tasks": [dict(task) for task in tasks]
    })


if __name__ == "__main__":
    app.run(debug=True)