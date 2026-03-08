#!/usr/bin/env bash
set -euo pipefail

PORT="${1:-6184}"
PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
URL="http://localhost:${PORT}"

if command -v python3 >/dev/null 2>&1; then
  PYTHON_BIN="python3"
elif command -v python >/dev/null 2>&1; then
  PYTHON_BIN="python"
else
  echo "Error: Python is not installed. Install python3 and try again."
  exit 1
fi

cd "$PROJECT_DIR"
echo "Serving AgileProject from: $PROJECT_DIR"
echo "Open in browser: $URL"
echo "Press Ctrl+C to stop."

if command -v open >/dev/null 2>&1; then
  open "$URL" >/dev/null 2>&1 || true
elif command -v xdg-open >/dev/null 2>&1; then
  xdg-open "$URL" >/dev/null 2>&1 || true
fi

exec "$PYTHON_BIN" -m http.server "$PORT"
