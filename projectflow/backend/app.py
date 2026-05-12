import os
import socket
import sys
import sqlite3
from pathlib import Path


PROJECT_DIR = Path(__file__).resolve().parent
VENV_PYTHON = PROJECT_DIR / ".venv" / "bin" / "python"


if VENV_PYTHON.exists() and Path(sys.executable).resolve() != VENV_PYTHON.resolve():
    os.execv(
        str(VENV_PYTHON),
        [str(VENV_PYTHON), str(Path(__file__).resolve()), *sys.argv[1:]]
    )


from flask import Flask, jsonify, request
from flask_cors import CORS


app = Flask(__name__)
CORS(app)


BASE_DIR = Path(__file__).resolve().parent.parent
DB_PATH = BASE_DIR / "database" / "projectflow.db"


def get_db_connection():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA foreign_keys = ON")
    return conn


@app.route("/", methods=["GET"])
def home():
    return jsonify({
        "success": True,
        "message": "ProjectFlow API is running.",
        "database": "Connected to projectflow.db",
        "available_routes": [
            "GET /api/health",

            "GET /api/projects",
            "GET /api/projects/<project_id>",
            "POST /api/projects",
            "PUT /api/projects/<project_id>",
            "DELETE /api/projects/<project_id>",

            "GET /api/tasks",
            "GET /api/tasks/<task_id>",
            "POST /api/tasks",
            "PUT /api/tasks/<task_id>",
            "DELETE /api/tasks/<task_id>",

            "GET /api/projects/<project_id>/tasks",
            "GET /api/projects/<project_id>/tasks/<task_id>",
            "POST /api/projects/<project_id>/tasks"
        ]
    })


@app.route("/api/health", methods=["GET"])
def health_check():
    try:
        conn = get_db_connection()
        conn.execute("SELECT 1").fetchone()
        conn.close()

        return jsonify({
            "success": True,
            "message": "Backend server is running and database connection works."
        })

    except Exception as error:
        return jsonify({
            "success": False,
            "message": "Backend server is running, but database connection failed.",
            "error": str(error)
        }), 500


# ---------------------------------------------------------
# PROJECT ROUTES
# Master table: projects
# ---------------------------------------------------------

@app.route("/api/projects", methods=["GET"])
def get_projects():
    conn = get_db_connection()

    projects = conn.execute(
        "SELECT * FROM projects"
    ).fetchall()

    conn.close()

    return jsonify([dict(project) for project in projects])


@app.route("/api/projects/<int:project_id>", methods=["GET"])
def get_project(project_id):
    conn = get_db_connection()

    project = conn.execute(
        "SELECT * FROM projects WHERE project_id = ?",
        (project_id,)
    ).fetchone()

    conn.close()

    if project is None:
        return jsonify({
            "error": "Project not found",
            "project_id": project_id
        }), 404

    return jsonify(dict(project))


@app.route("/api/projects", methods=["POST"])
def create_project():
    data = request.get_json() or {}

    required_fields = ["project_name", "status"]

    for field in required_fields:
        if field not in data or data[field] == "":
            return jsonify({
                "error": f"{field} is required"
            }), 400

    project_name = data["project_name"]
    description = data.get("description", "")
    status = data["status"]
    start_date = data.get("start_date", "")
    due_date = data.get("due_date", "")

    conn = get_db_connection()

    cursor = conn.execute(
        """
        INSERT INTO projects (
            project_name,
            description,
            status,
            start_date,
            due_date
        )
        VALUES (?, ?, ?, ?, ?)
        """,
        (
            project_name,
            description,
            status,
            start_date,
            due_date
        )
    )

    conn.commit()

    new_project_id = cursor.lastrowid

    new_project = conn.execute(
        "SELECT * FROM projects WHERE project_id = ?",
        (new_project_id,)
    ).fetchone()

    conn.close()

    return jsonify(dict(new_project)), 201


@app.route("/api/projects/<int:project_id>", methods=["PUT"])
def update_project(project_id):
    data = request.get_json() or {}

    conn = get_db_connection()

    existing_project = conn.execute(
        "SELECT * FROM projects WHERE project_id = ?",
        (project_id,)
    ).fetchone()

    if existing_project is None:
        conn.close()
        return jsonify({
            "error": "Project not found",
            "project_id": project_id
        }), 404

    project_name = data.get("project_name", existing_project["project_name"])
    description = data.get("description", existing_project["description"])
    status = data.get("status", existing_project["status"])
    start_date = data.get("start_date", existing_project["start_date"])
    due_date = data.get("due_date", existing_project["due_date"])

    conn.execute(
        """
        UPDATE projects
        SET project_name = ?,
            description = ?,
            status = ?,
            start_date = ?,
            due_date = ?
        WHERE project_id = ?
        """,
        (
            project_name,
            description,
            status,
            start_date,
            due_date,
            project_id
        )
    )

    conn.commit()

    updated_project = conn.execute(
        "SELECT * FROM projects WHERE project_id = ?",
        (project_id,)
    ).fetchone()

    conn.close()

    return jsonify(dict(updated_project))


@app.route("/api/projects/<int:project_id>", methods=["DELETE"])
def delete_project(project_id):
    conn = get_db_connection()

    existing_project = conn.execute(
        "SELECT * FROM projects WHERE project_id = ?",
        (project_id,)
    ).fetchone()

    if existing_project is None:
        conn.close()
        return jsonify({
            "error": "Project not found",
            "project_id": project_id
        }), 404

    conn.execute(
        "DELETE FROM tasks WHERE project_id = ?",
        (project_id,)
    )

    conn.execute(
        "DELETE FROM projects WHERE project_id = ?",
        (project_id,)
    )

    conn.commit()
    conn.close()

    return jsonify({
        "message": "Project and related tasks deleted successfully",
        "deleted_project_id": project_id
    })


# ---------------------------------------------------------
# TASK ROUTES
# Detail table: tasks
# ---------------------------------------------------------

@app.route("/api/tasks", methods=["GET"])
def get_tasks():
    conn = get_db_connection()

    tasks = conn.execute(
        "SELECT * FROM tasks"
    ).fetchall()

    conn.close()

    return jsonify([dict(task) for task in tasks])


@app.route("/api/tasks/<int:task_id>", methods=["GET"])
def get_task(task_id):
    conn = get_db_connection()

    task = conn.execute(
        "SELECT * FROM tasks WHERE task_id = ?",
        (task_id,)
    ).fetchone()

    conn.close()

    if task is None:
        return jsonify({
            "error": "Task not found",
            "task_id": task_id
        }), 404

    return jsonify(dict(task))


@app.route("/api/tasks", methods=["POST"])
def create_task():
    data = request.get_json() or {}

    required_fields = ["project_id", "task_title", "priority", "status"]

    for field in required_fields:
        if field not in data or data[field] == "":
            return jsonify({
                "error": f"{field} is required"
            }), 400

    project_id = data["project_id"]
    task_title = data["task_title"]
    task_description = data.get("task_description", "")
    priority = data["priority"]
    status = data["status"]
    due_date = data.get("due_date", "")

    conn = get_db_connection()

    project = conn.execute(
        "SELECT * FROM projects WHERE project_id = ?",
        (project_id,)
    ).fetchone()

    if project is None:
        conn.close()
        return jsonify({
            "error": "Cannot create task because project_id does not exist",
            "project_id": project_id
        }), 400

    cursor = conn.execute(
        """
        INSERT INTO tasks (
            project_id,
            task_title,
            task_description,
            priority,
            status,
            due_date
        )
        VALUES (?, ?, ?, ?, ?, ?)
        """,
        (
            project_id,
            task_title,
            task_description,
            priority,
            status,
            due_date
        )
    )

    conn.commit()

    new_task_id = cursor.lastrowid

    new_task = conn.execute(
        "SELECT * FROM tasks WHERE task_id = ?",
        (new_task_id,)
    ).fetchone()

    conn.close()

    return jsonify(dict(new_task)), 201


@app.route("/api/tasks/<int:task_id>", methods=["PUT"])
def update_task(task_id):
    data = request.get_json() or {}

    conn = get_db_connection()

    existing_task = conn.execute(
        "SELECT * FROM tasks WHERE task_id = ?",
        (task_id,)
    ).fetchone()

    if existing_task is None:
        conn.close()
        return jsonify({
            "error": "Task not found",
            "task_id": task_id
        }), 404

    project_id = data.get("project_id", existing_task["project_id"])

    project = conn.execute(
        "SELECT * FROM projects WHERE project_id = ?",
        (project_id,)
    ).fetchone()

    if project is None:
        conn.close()
        return jsonify({
            "error": "Cannot update task because project_id does not exist",
            "project_id": project_id
        }), 400

    task_title = data.get("task_title", existing_task["task_title"])
    task_description = data.get("task_description", existing_task["task_description"])
    priority = data.get("priority", existing_task["priority"])
    status = data.get("status", existing_task["status"])
    due_date = data.get("due_date", existing_task["due_date"])

    conn.execute(
        """
        UPDATE tasks
        SET project_id = ?,
            task_title = ?,
            task_description = ?,
            priority = ?,
            status = ?,
            due_date = ?
        WHERE task_id = ?
        """,
        (
            project_id,
            task_title,
            task_description,
            priority,
            status,
            due_date,
            task_id
        )
    )

    conn.commit()

    updated_task = conn.execute(
        "SELECT * FROM tasks WHERE task_id = ?",
        (task_id,)
    ).fetchone()

    conn.close()

    return jsonify(dict(updated_task))


@app.route("/api/tasks/<int:task_id>", methods=["DELETE"])
def delete_task(task_id):
    conn = get_db_connection()

    existing_task = conn.execute(
        "SELECT * FROM tasks WHERE task_id = ?",
        (task_id,)
    ).fetchone()

    if existing_task is None:
        conn.close()
        return jsonify({
            "error": "Task not found",
            "task_id": task_id
        }), 404

    conn.execute(
        "DELETE FROM tasks WHERE task_id = ?",
        (task_id,)
    )

    conn.commit()
    conn.close()

    return jsonify({
        "message": "Task deleted successfully",
        "deleted_task_id": task_id
    })


# ---------------------------------------------------------
# ONE-TO-MANY RELATIONSHIP ROUTES
# Project -> Tasks
# ---------------------------------------------------------

@app.route("/api/projects/<int:project_id>/tasks", methods=["GET"])
def get_tasks_by_project(project_id):
    conn = get_db_connection()

    project = conn.execute(
        "SELECT * FROM projects WHERE project_id = ?",
        (project_id,)
    ).fetchone()

    if project is None:
        conn.close()
        return jsonify({
            "error": "Project not found",
            "project_id": project_id
        }), 404

    tasks = conn.execute(
        "SELECT * FROM tasks WHERE project_id = ?",
        (project_id,)
    ).fetchall()

    conn.close()

    return jsonify({
        "project": dict(project),
        "tasks": [dict(task) for task in tasks]
    })

@app.route("/api/projects/<int:project_id>/tasks/<int:task_id>", methods=["GET"])
def get_one_task_for_project(project_id, task_id):
    conn = get_db_connection()

    project = conn.execute(
        "SELECT * FROM projects WHERE project_id = ?",
        (project_id,)
    ).fetchone()

    if project is None:
        conn.close()
        return jsonify({
            "error": "Project not found",
            "project_id": project_id
        }), 404

    task = conn.execute(
        """
        SELECT * FROM tasks
        WHERE project_id = ?
        AND task_id = ?
        """,
        (project_id, task_id)
    ).fetchone()

    conn.close()

    if task is None:
        return jsonify({
            "error": "Task not found for this project",
            "project_id": project_id,
            "task_id": task_id
        }), 404

    return jsonify({
        "project": dict(project),
        "task": dict(task)
    })

@app.route("/api/projects/<int:project_id>/tasks", methods=["POST"])
def create_task_for_project(project_id):
    data = request.get_json() or {}

    required_fields = ["task_title", "priority", "status"]

    for field in required_fields:
        if field not in data or data[field] == "":
            return jsonify({
                "error": f"{field} is required"
            }), 400

    task_title = data["task_title"]
    task_description = data.get("task_description", "")
    priority = data["priority"]
    status = data["status"]
    due_date = data.get("due_date", "")

    conn = get_db_connection()

    project = conn.execute(
        "SELECT * FROM projects WHERE project_id = ?",
        (project_id,)
    ).fetchone()

    if project is None:
        conn.close()
        return jsonify({
            "error": "Cannot create task because project does not exist",
            "project_id": project_id
        }), 404

    cursor = conn.execute(
        """
        INSERT INTO tasks (
            project_id,
            task_title,
            task_description,
            priority,
            status,
            due_date
        )
        VALUES (?, ?, ?, ?, ?, ?)
        """,
        (
            project_id,
            task_title,
            task_description,
            priority,
            status,
            due_date
        )
    )

    conn.commit()

    new_task_id = cursor.lastrowid

    new_task = conn.execute(
        "SELECT * FROM tasks WHERE task_id = ?",
        (new_task_id,)
    ).fetchone()

    conn.close()

    return jsonify({
        "message": "Task created successfully under project",
        "project_id": project_id,
        "task": dict(new_task)
    }), 201


if __name__ == "__main__":
    requested_port = int(os.getenv("PORT", "5000"))
    host = "127.0.0.1"

    def port_is_in_use(port):
        with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as sock:
            return sock.connect_ex((host, port)) == 0

    while port_is_in_use(requested_port):
        requested_port += 1

    app.run(debug=True, host=host, port=requested_port)