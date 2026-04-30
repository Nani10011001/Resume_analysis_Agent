FROM python:3.12-slim

WORKDIR /RA_Agent

# Install build tools + Poetry
RUN apt-get update && apt-get install -y build-essential curl git \
    && pip install --no-cache-dir poetry \
    && rm -rf /var/lib/apt/lists/*

# Copy dependency files first
COPY pyproject.toml poetry.lock* ./

# Install dependencies
RUN poetry config virtualenvs.create false \
    && poetry install --no-interaction --no-ansi

# Install spaCy model
RUN python -m spacy download en_core_web_sm

# Copy the rest of the code
COPY . .

EXPOSE 10000

CMD poetry run uvicorn main:app --host 0.0.0.0 --port ${PORT:-10000}
