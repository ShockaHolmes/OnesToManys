#!/usr/bin/env bash

set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BACKEND_DIR="$ROOT_DIR/backend"
FRONTEND_DIR="$ROOT_DIR/frontend-vanilla"
RUN_DIR="$ROOT_DIR/.run"

BACKEND_PORT=5000
FRONTEND_PORT=8000

mkdir -p "$RUN_DIR"

is_listening() {
    local port="$1"
    lsof -nP -iTCP:"$port" -sTCP:LISTEN >/dev/null 2>&1
}

start_backend() {
    if is_listening "$BACKEND_PORT"; then
        echo "Backend already running on http://127.0.0.1:${BACKEND_PORT}"
        return
    fi

    if [[ ! -d "$BACKEND_DIR/.venv" ]]; then
        echo "Creating backend virtual environment..."
        python3 -m venv "$BACKEND_DIR/.venv"
    fi

    local backend_python="$BACKEND_DIR/.venv/bin/python"

    if ! "$backend_python" -c "import flask, flask_cors" >/dev/null 2>&1; then
        echo "Installing backend dependencies (flask, flask-cors)..."
        "$backend_python" -m pip install flask flask-cors >/dev/null
    fi

    echo "Starting backend on http://127.0.0.1:${BACKEND_PORT} ..."
    (
        cd "$BACKEND_DIR"
        PORT="$BACKEND_PORT" nohup "$backend_python" app.py > "$RUN_DIR/backend.log" 2>&1 &
        echo $! > "$RUN_DIR/backend.pid"
    )
}

start_frontend() {
    if is_listening "$FRONTEND_PORT"; then
        echo "Frontend already running on http://localhost:${FRONTEND_PORT}"
        return
    fi

    echo "Starting frontend on http://localhost:${FRONTEND_PORT} ..."
    (
        cd "$FRONTEND_DIR"
        nohup python3 -m http.server "$FRONTEND_PORT" > "$RUN_DIR/frontend.log" 2>&1 &
        echo $! > "$RUN_DIR/frontend.pid"
    )
}

open_pages() {
    open "http://127.0.0.1:${BACKEND_PORT}/api/health"
    open "http://localhost:${FRONTEND_PORT}/index.html"
}

start_backend
start_frontend
open_pages

echo ""
echo "ProjectFlow started."
echo "- Backend health: http://127.0.0.1:${BACKEND_PORT}/api/health"
echo "- Frontend:       http://localhost:${FRONTEND_PORT}/index.html"
echo "Logs are in: $RUN_DIR"