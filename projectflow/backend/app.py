from flask import Flask, jsonify
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
            "/api/projects",
            "/api/health"
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


if __name__ == "__main__":
    app.run(debug=True)