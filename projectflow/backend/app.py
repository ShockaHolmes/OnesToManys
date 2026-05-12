from flask import Flask, jsonify, request
from flask_cors import CORS
import sqlite3
from pathlib import Path

app = Flask(__name__)
CORS(app)

BASE_DIR = Path(__file__).resolve().parent.parent
DB_PATH = BASE_DIR / "database" / "projectflow.db"


def get_db_connection():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn


@app.route("/", methods=["GET"])
def home():
    return jsonify({
        "success": True,
        "message": "ProjectFlow API is running.",
        "database": "Connected to projectflow.db",
        "available_routes": [
            "GET /api/projects",
            "GET /api/projects/<project_id>",
            "POST /api/projects",
            "PUT /api/projects/<project_id>",
            "DELETE /api/projects/<project_id>",
            "GET /api/tasks",
            "GET /api/health"
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
        return jsonify({"error": "Project not found"}), 404

    return jsonify(dict(project))


@app.route("/api/projects", methods=["POST"])
def create_project():
    data = request.get_json()

    required_fields = ["project_name", "status"]

    for field in required_fields:
        if field not in data or data[field] == "":
            return jsonify({"error": f"{field} is required"}), 400

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
    data = request.get_json()

    conn = get_db_connection()

    existing_project = conn.execute(
        "SELECT * FROM projects WHERE project_id = ?",
        (project_id,)
    ).fetchone()

    if existing_project is None:
        conn.close()
        return jsonify({"error": "Project not found"}), 404

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
        return jsonify({"error": "Project not found"}), 404

    # Delete related tasks first so there are no orphan task records.
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

@app.route("/api/tasks", methods=["GET"])
def get_tasks():
    conn = get_db_connection()

    tasks = conn.execute(
        "SELECT * FROM tasks"
    ).fetchall()

    conn.close()

    return jsonify([dict(task) for task in tasks])


if __name__ == "__main__":
    app.run(debug=True)