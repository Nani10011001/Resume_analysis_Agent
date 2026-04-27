FROM python:3.12-slim

WORKDIR /RA_Agent

# Install build tools + Poetry
RUN apt-get update && apt-get install -y build-essential \
    && pip install --no-cache-dir poetry

# Copy dependency files first
COPY pyproject.toml poetry.lock* ./

# Install dependencies (model included via Poetry)
RUN poetry config virtualenvs.create false \
    && poetry install --no-interaction --no-ansi

# Copy the rest of the code
COPY . .

EXPOSE 7001

CMD sh -c "poetry run python MCP/Job_search_mcp.py & poetry run uvicorn main:app --host 0.0.0.0 --port ${PORT:-8000} & wait"
