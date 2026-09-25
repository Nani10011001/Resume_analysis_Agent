# Resume Analysis Agent

An AI-powered resume analysis and career assistant that analyzes resumes using NLP, structured scoring, semantic retrieval, and LLM-based reasoning. The system can review resumes, provide career guidance, generate cover letters, identify skill gaps, prepare interview questions, assist with salary negotiation, and search for relevant job opportunities.

## 🚀 Live Demo

[Resume Analysis Agent](https://resume-analysis-agent-psi.vercel.app)

---

## 📌 Problem

Most resume tools focus primarily on keyword matching or simple ATS checks. They often provide a score without explaining **why** a resume receives that score or how the candidate can improve it.

Candidates typically need separate tools for:

* Resume analysis
* Career advice
* Cover letter generation
* Skill-gap identification
* Interview preparation
* Job searching

This creates a fragmented workflow where the candidate has to repeatedly provide their resume context to different systems.

### The Goal

Build a single AI-powered career assistant that can understand a user's resume and use that context across multiple career-related tasks.

---

## 💡 Solution

Resume Analysis Agent combines:

* Resume document processing
* NLP-based information extraction
* Rule-based resume scoring
* Semantic vector search
* LangGraph-based agent routing
* LLM-powered reasoning
* MCP-based job search
* Redis-backed application infrastructure

The system first processes the uploaded resume and stores structured information that can later be retrieved by the AI agent.

When the user asks a question, the system determines the user's intent and routes the request to the appropriate agent.

For example:

```text
"Review my resume"
        ↓
Resume Review Agent

"What skills am I missing?"
        ↓
Skill Gap Agent

"Find jobs matching my resume"
        ↓
Job Search Agent + MCP

"Prepare me for an interview"
        ↓
Interview Preparation Agent
```

---

# 🏗️ Architecture

```text
                       ┌──────────────────────┐
                       │      React UI        │
                       │   Vite + Tailwind    │
                       └──────────┬───────────┘
                                  │
                         HTTP / SSE Requests
                                  │
                                  ▼
                       ┌──────────────────────┐
                       │   Express Backend   │
                       │      Node.js        │
                       │                      │
                       │ • Authentication    │
                       │ • Resume Upload     │
                       │ • Rate Limiting     │
                       │ • API Routing       │
                       └──────────┬───────────┘
                                  │
                         Internal API Request
                                  │
                                  ▼
                 ┌────────────────────────────────┐
                 │      FastAPI AI Service         │
                 │                                │
                 │          LangGraph             │
                 │                                │
                 │  Intent Classification         │
                 │          ↓                     │
                 │  Retrieval / NLP               │
                 │          ↓                     │
                 │  Specialist Agent              │
                 └──────────────┬─────────────────┘
                                │
             ┌──────────────────┼────────────────────┐
             │                  │                    │
             ▼                  ▼                    ▼
      ┌─────────────┐   ┌───────────────┐   ┌──────────────┐
      │ NLP / spaCy │   │ MongoDB       │   │ LLM          │
      │             │   │ Vector Search │   │ Groq         │
      └─────────────┘   └───────────────┘   └──────────────┘
                                │
                                │
                                ▼
                       ┌─────────────────┐
                       │ MCP Job Search  │
                       │ FastMCP + Exa   │
                       └─────────────────┘
```

---

# 🔄 End-to-End Workflow

## 1. Resume Upload

The user uploads a resume from the React application.

```text
React
  ↓
POST /api/agent/upload/resume
  ↓
Express + Multer
  ↓
Python AI service
  ↓
PDF / DOCX extraction
```

The backend uses `multer` with memory storage to receive the uploaded document.

---

## 2. Document Processing

The AI service extracts usable text from the resume.

Supported processing currently includes libraries such as:

* `pypdf`
* `python-docx`

The extracted resume content is then processed for NLP and semantic retrieval.

---

## 3. NLP Extraction

The system uses spaCy-based processing to identify useful resume information.

Examples include:

* Skills
* Experience
* Years of experience
* Resume sections
* Resume signals
* Other structured entities

This structured information is later used by the scoring engine and AI agents.

---

## 4. Resume Scoring

The resume is evaluated using a rule-based scoring engine.

The current scoring system considers areas such as:

```text
Achievement Impact
Skill Depth & Proof
Experience Progression
Project Complexity
Clarity & Communication
Structure & ATS Safety
Section Completeness
Penalties
```

The scoring engine produces:

```json
{
  "total_score": 82,
  "breakdown": {
    "achievement_impact": {},
    "skill_depth": {},
    "experience_progression": {},
    "project_complexity": {},
    "clarity": {},
    "structure": {},
    "section_completeness": {},
    "penalties": {}
  }
}
```

This approach combines deterministic scoring with LLM-generated explanations.

---

# 🤖 LangGraph Agent Architecture

The AI system is implemented using LangGraph.

Every request begins with an intent classification step.

```text
                    User Request
                         │
                         ▼
              ┌───────────────────┐
              │ Intent Classifier  │
              └─────────┬─────────┘
                        │
          ┌─────────────┼────────────────┐
          │             │                │
          ▼             ▼                ▼
      Greeting       Retrieval       General Chat
                        │
                        ▼
                Route by Intent
                        │
       ┌────────────────┼─────────────────┐
       │        │       │       │          │
       ▼        ▼       ▼       ▼          ▼
    Resume   Career   Cover   Interview   Skill
    Review   Advice   Letter    Prep       Gap
                │
                ▼
         Salary Negotiation

                 Job Search
                     │
                     ▼
                MCP Tool
                     │
                     ▼
                   Exa
```

### Current specialist agents

| Agent                    | Responsibility                                      |
| ------------------------ | --------------------------------------------------- |
| Resume Review Agent      | Analyze the resume and provide improvement feedback |
| Career Advice Agent      | Provide career guidance using resume context        |
| Cover Letter Agent       | Generate resume-aware cover letters                 |
| Job Search Agent         | Search for relevant job opportunities               |
| Interview Prep Agent     | Generate interview preparation guidance             |
| Salary Negotiation Agent | Provide salary negotiation assistance               |
| Skill Gap Agent          | Identify skills that may need improvement           |
| General Chat Agent       | Handle general conversation                         |
| Greeting Agent           | Handle greetings                                    |
| Thanks Agent             | Handle acknowledgement / thanks                     |

---

# 🔎 Retrieval Architecture

The system uses resume-specific retrieval before specialist reasoning.

The retrieval process can use:

```text
User Query
    ↓
Query Embedding
    ↓
MongoDB Vector Search
    ↓
Resume-specific chunks
    ↓
Retrieved Context
    ↓
Specialist Agent
```

Vector search is filtered using the user's ID and resume ID so that retrieved context belongs to the correct resume.

Conceptually:

```text
User
 │
 ├── Resume A
 │     ├── Chunk 1
 │     ├── Chunk 2
 │     └── Chunk 3
 │
 └── Resume B
       ├── Chunk 1
       ├── Chunk 2
       └── Chunk 3
```

The retrieval layer therefore provides resume-specific context to downstream agents.

---

# 🧠 LLM Processing

The LLM layer is responsible for tasks requiring natural-language reasoning.

Examples:

* Resume feedback
* Career recommendations
* Cover letter generation
* Interview preparation
* Skill-gap explanations
* Salary negotiation guidance
* Job-search query generation

Prompts are separated by task so each agent receives task-specific instructions.

The project currently integrates an LLM through LangChain and Groq.

---

# 🔌 MCP Job Search Integration

The project also contains a dedicated MCP server for job searching.

```text
Job Search Agent
       │
       ▼
LangChain MCP Adapter
       │
       ▼
FastMCP Server
       │
       ▼
Exa Search
       │
       ▼
Job Listings
```

The MCP server searches job sources such as:

* LinkedIn
* Indeed
* Glassdoor
* Wellfound
* Archinect

The job-search agent first generates a compact search query from the user's resume and request.

Example:

```text
Resume:
Software Engineer with Python, FastAPI and React

User:
"Find jobs suitable for me"

Generated query:
"Software Engineer India job opening"
```

That query is sent to the MCP job-search service.

---

# 📊 Resume Analysis Pipeline

```text
Resume Upload
     │
     ▼
Document Extraction
     │
     ▼
Text Cleaning
     │
     ▼
NLP Processing
     │
     ├── Skills
     ├── Experience
     ├── Sections
     └── Resume Signals
     │
     ▼
Embedding Generation
     │
     ▼
MongoDB Vector Storage
     │
     ▼
User Query
     │
     ▼
Intent Classification
     │
     ▼
Resume Retrieval
     │
     ▼
Specialist Agent
     │
     ├── Rule-based Score
     ├── Retrieved Context
     └── LLM Reasoning
     │
     ▼
Streaming Response
     │
     ▼
React UI
```

---

# 🛠️ Tech Stack

## Frontend

* React
* Vite
* Tailwind CSS
* React Router
* Axios
* React PDF
* PDF.js
* React Markdown

## Backend

* Node.js
* Express
* MongoDB
* Mongoose
* Redis
* ioredis
* Multer
* JWT
* bcryptjs
* Zod
* Nodemailer

## AI Service

* Python
* FastAPI
* LangChain
* LangGraph
* Groq
* spaCy
* Hugging Face
* PyPDF
* python-docx
* LangSmith

## Retrieval

* MongoDB Atlas Vector Search
* Embeddings
* Semantic similarity search

## MCP / Web Search

* FastMCP
* Exa
* LangChain MCP Adapters

## Infrastructure

* Docker
* Vercel
* Railway / cloud deployment
* Redis

---

# 🔐 Security

The Express backend includes several security-related layers.

### Authentication

JWT-based authentication protects agent and resume endpoints.

### Password Security

Passwords are hashed using `bcryptjs`.

### Rate Limiting

Agent endpoints are protected by Redis-backed rate limiting.

```text
Client Request
      │
      ▼
Rate Limiter
      │
      ▼
JWT Authentication
      │
      ▼
Controller
      │
      ▼
AI Service
```

### Request Validation

The backend uses Zod for environment and request-related validation.

### CORS

Cross-origin access is configured to allow the frontend application to communicate with the backend securely.

---

# 📡 API Overview

## Authentication

```http
POST /api/...
```

Authentication routes are handled by the Express backend.

## Resume Upload

```http
POST /api/agent/upload/resume
```

Uploads a resume for analysis.

## Agent Query

```http
POST /api/agent/send
```

Sends a user query together with the associated resume context.

The response is streamed using Server-Sent Events.

---

# 📡 Streaming Architecture

The AI response is streamed instead of waiting for the complete response.

```text
React
  │
  │ POST /api/agent/send
  ▼
Express
  │
  │ async generator
  ▼
FastAPI / LangGraph
  │
  │ LLM response chunks
  ▼
Express
  │
  │ text/event-stream
  ▼
React
```

This allows the UI to progressively display the generated response.

---

# 📁 Project Structure

```text
Resume_analysis_Agent/
│
├── frontend/
│   ├── src/
│   ├── public/
│   ├── package.json
│   ├── Dockerfile
│   └── vercel.json
│
├── backend/
│   ├── controller/
│   ├── router/
│   ├── middleware/
│   ├── DB/
│   ├── config/
│   ├── utils/
│   ├── server.js
│   ├── package.json
│   └── Dockerfile
│
├── RA_Agent/
│   ├── Agents/
│   ├── Api/
│   ├── ClassRouter/
│   ├── Config/
│   ├── Db/
│   ├── DbModel/
│   ├── DbSearch/
│   ├── Graphs/
│   ├── LLM_agent/
│   ├── NLP/
│   ├── VectorSearch/
│   ├── SystemPromt/
│   ├── main.py
│   ├── pyproject.toml
│   └── Dockerfile
│
├── MCP/
│   ├── Job_search_mcp.py
│   ├── requirements.txt
│   └── DockerFile
│
└── README.md
```

---

# ⚙️ Local Development

## 1. Clone the repository

```bash
git clone https://github.com/Nani10011001/Resume_analysis_Agent.git

cd Resume_analysis_Agent
```

---

## 2. Frontend

```bash
cd frontend

npm install

npm run dev
```

The Vite development server will start locally.

---

## 3. Express Backend

Open another terminal:

```bash
cd backend

npm install

npm run dev
```

The Express server handles:

* Authentication
* Resume upload
* API routing
* Rate limiting
* Communication with the AI service

---

## 4. AI Service

Open another terminal:

```bash
cd RA_Agent

poetry install

poetry run uvicorn main:app --reload
```

Or run the application directly:

```bash
python main.py
```

---

## 5. MCP Server

Open another terminal:

```bash
cd MCP

pip install -r requirements.txt

python Job_search_mcp.py
```

The MCP server exposes the job-search tool through a streamable HTTP transport.

---

# 🔑 Environment Variables

Create environment files for the services and configure the required credentials.

Typical configuration includes:

```env
MONGODB_URI=
REDIS_URL=
JWT_SECRET=
GROQ_API_KEY=
LANGSMITH_API_KEY=
EXA_API_KEY=
MCP_WEBSEARCH_URL=
BACKEND_URL=
FRONTEND_URL=
PORT=
```

Never commit secrets or `.env` files to Git.

---

# 🐳 Docker

The repository includes Dockerfiles for the major services.

```text
frontend/Dockerfile
backend/Dockerfile
RA_Agent/Dockerfile
MCP/DockerFile
```

This allows the frontend, backend, AI service, and MCP service to be containerized independently.

---

# 🚀 Deployment Architecture

The application is designed as independently deployable services.

```text
                     Internet
                        │
                        ▼
               ┌─────────────────┐
               │    Vercel       │
               │    Frontend     │
               └────────┬────────┘
                        │
                        ▼
               ┌─────────────────┐
               │   Express API   │
               │    Backend      │
               └────────┬────────┘
                        │
                        ▼
               ┌─────────────────┐
               │   FastAPI AI    │
               │    Service      │
               └───────┬─────────┘
                       │
             ┌─────────┼──────────┐
             ▼         ▼          ▼
          MongoDB    Redis      MCP/Exa
```

---

# 🎯 Key Engineering Concepts Demonstrated

This project was built to explore practical AI application engineering rather than only LLM prompting.

It demonstrates:

* Multi-service application architecture
* REST API development
* Authentication and authorization
* Redis-backed rate limiting
* Resume document processing
* NLP information extraction
* Deterministic scoring
* Semantic vector retrieval
* LangGraph state-based workflows
* Specialized AI agents
* MCP tool integration
* Streaming AI responses
* Dockerized services
* LLM observability with LangSmith

---

# 🔮 Future Improvements

Planned improvements include:

* More advanced resume scoring models
* Better job-to-resume semantic matching
* Improved retrieval evaluation
* More structured agent outputs
* Resume comparison against job descriptions
* Additional MCP tools
* Automated resume improvement workflows
* Better evaluation and testing of LLM responses

---


# 👨‍💻 Author

**Nani**

GitHub: [@Nani10011001](https://github.com/Nani10011001)

---

## ⭐ Project Focus

Resume Analysis Agent is primarily a learning and engineering project focused on building a production-oriented AI application using **LangGraph, FastAPI, Node.js, NLP, retrieval, LLMs, and MCP-based tools**.
