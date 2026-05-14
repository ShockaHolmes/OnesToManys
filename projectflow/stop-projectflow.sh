#!/usr/bin/env bash

set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
RUN_DIR="$ROOT_DIR/.run"

BACKEND_PORT=5000
FRONTEND_PORT=8000

kill_pid_file() {
    local pid_file="$1"
    local name="$2"

    if [[ ! -f "$pid_file" ]]; then
        return
    fi

    local pid
    pid="$(cat "$pid_file" 2>/dev/null || true)"

    if [[ -n "$pid" ]] && kill -0 "$pid" >/dev/null 2>&1; then
        kill "$pid" >/dev/null 2>&1 || true
        echo "Stopped ${name} (PID ${pid})"
    fi

    rm -f "$pid_file"
}

kill_by_port() {
    local port="$1"
    local name="$2"
    local pids

    pids="$(lsof -tiTCP:"$port" -sTCP:LISTEN 2>/dev/null || true)"
    if [[ -n "$pids" ]]; then
        echo "$pids" | xargs kill >/dev/null 2>&1 || true
        echo "Stopped ${name} listener on port ${port}"
    fi
}

mkdir -p "$RUN_DIR"

kill_pid_file "$RUN_DIR/backend.pid" "backend"
kill_pid_file "$RUN_DIR/frontend.pid" "frontend"

# Fallback: stop anything still listening on expected ports.
kill_by_port "$BACKEND_PORT" "backend"
kill_by_port "$FRONTEND_PORT" "frontend"

echo "ProjectFlow services stopped."
