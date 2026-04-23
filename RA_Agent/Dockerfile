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

CMD ["poetry", "run", "uvicorn", "main:app", "--host", "0.0.0.0", "--port", "6000"]
