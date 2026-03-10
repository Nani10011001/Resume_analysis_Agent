# Resume Analysis Agent Architecture

## 📋 Overview

ResumeAgent is a **multi-agent AI system** built with **LangGraph** and **FastAPI** that analyzes resumes using natural language processing and LLM-powered agents. The system provides intelligent resume analysis with scoring, skill extraction, and actionable explanations.

---

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                     Frontend (React/Vite)                       │
│                      Port 5173                                  │
└─────────────────────────────┬───────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                   Node.js Backend                               │
│                      Port 7000                                  │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │ Express Server                                           │   │
│  │ - Authentication & JWT verification                     │   │
│  │ - File upload handling (passes to FastAPI)             │   │
│  │ - CORS & Cookie management                             │   │
│  └──────────────────────────────────────────┬──────────────┘   │
└─────────────────────────────────────────────┼──────────────────┘
                                              │
                                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                   FastAPI Backend                               │
│                      Port 7001                                  │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │ Resume Upload API                                        │   │
│  │ - PDF extraction                                         │   │
│  │ - Text chunking & embedding                             │   │
│  │ - NLP entity extraction                                 │   │
│  │ - Store in MongoDB                                      │   │
│  └──────────────────────┬───────────────────────────────────┘   │
│                         │                                        │
│                         ▼                                        │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │        LangGraph Agent Orchestration                     │   │
│  │        (Multi-agent workflow)                            │   │
│  └──────────────────────────────────────────────────────────┘   │
│                         │                                        │
│                         ▼                                        │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │ MongoDB Database                                         │   │
│  │ - Resume embeddings                                     │   │
│  │ - NLP extracted data                                    │   │
│  │ - User data & history                                  │   │
│  └──────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🤖 Agent Components

### **1. Router Agent**
- **Purpose**: Directs user input to appropriate agent
- **Routes**:
  - `greeting` → Greeting Agent
  - `thanking` → Thanks Agent
  - `chatAgent` → Resume Analysis Pipeline

### **2. Greeting Agent**
- **Purpose**: Handles greeting messages
- **Triggers**: "hi", "hello", "hey", "greetings", etc.
- **Output**: Friendly greeting response

### **3. Thanks Agent**
- **Purpose**: Handles thank you messages
- **Triggers**: "thanks", "thank you", "appreciated", etc.
- **Output**: Polite acknowledgment

### **4. Retrieval Agent**
- **Purpose**: Retrieves relevant resume data from database
- **Function**: Vector similarity search for resume information
- **Output**: Relevant resume text & context

### **5. Signal Agent**
- **Purpose**: Detects patterns and signals in the resume
- **Analyzes**:
  - Red flags in work history
  - Career progression patterns
  - Skills alignment with job requirements
- **Output**: Structured signals dictionary

### **6. Scoring Agent**
- **Purpose**: Calculates ATS (Applicant Tracking System) score
- **Evaluates**:
  - Keyword match percentage
  - Experience level alignment
  - Skills relevance
  - Format compliance
- **Output**: Score (0-100) + breakdown

### **7. Explanation Agent**
- **Purpose**: Generates human-readable analysis
- **Creates**: 
  - Summary of findings
  - Recommendations for improvement
  - Actionable insights
- **Output**: Natural language explanation

---

## 🔄 LangGraph Workflow

### **State Graph Structure**

```
Agent_state
├── userId (str)
├── messages (Sequence[BaseMessage])
├── resume_id (str)
├── retrieved_text (str)
├── signals (Dict)
├── score (float)
├── score_breakdown (Dict)
└── explanation (str)
```

### **Workflow Paths**

#### **Path 1: Greeting**
```
START → Router → Greeting Agent → END
```

#### **Path 2: Thanks**
```
START → Router → Thanks Agent → END
```

#### **Path 3: Resume Analysis Pipeline**
```
START 
  → Router 
  → Retrieval Agent 
  → Signal Agent 
  → Scoring Agent 
  → Explanation Agent 
  → END
```

---

## 📊 Data Flow

### **Resume Upload Flow**

```
1. User uploads PDF (Frontend)
   ↓
2. Node.js backend receives file
   ↓
3. Sends to FastAPI: POST /upload-resume
   ↓
4. FastAPI processes:
   - Extract PDF text
   - Chunk text (RecursiveCharacterTextSplitter)
   - Extract entities (Spacy NLP)
   - Extract experience (Spacy NLP)
   - Create embeddings (Embedding model)
   ↓
5. Store in MongoDB:
   - Nlp_info_store: NLP extracted data
   - store_embedding: Vector embeddings
   ↓
6. Return resume_id to frontend
```

### **Query Analysis Flow**

```
1. User sends message (Frontend)
   ↓
2. Node.js backend receives query
   ↓
3. Sends to FastAPI LangGraph: POST /chat
   ↓
4. Router Agent determines intent
   ↓
5. Follows appropriate path (greeting/thanks/analysis)
   ↓
6. Resume Analysis Pipeline:
   - Retrieve relevant resume data
   - Detect signals/patterns
   - Calculate score
   - Generate explanation
   ↓
7. Return structured response to frontend
```

---

## 🛠️ Key Technologies

| Component | Technology | Purpose |
|-----------|-----------|---------|
| **Frontend** | React, Vite | User interface |
| **Backend (Auth)** | Node.js, Express | Authentication, file routing |
| **Agent Framework** | LangGraph | Multi-agent orchestration |
| **LLM** | Groq (ChatGroq) | Language model for analysis |
| **NLP** | Spacy | Entity & experience extraction |
| **Embeddings** | LangChain embeddings | Vector representations |
| **Document Processing** | PyPDFLoader | PDF text extraction |
| **Database** | MongoDB | Data persistence |
| **API Framework** | FastAPI | Resume analysis API |

---

## 📁 Project Structure

```
RA_Agent/
├── main.py                    # FastAPI app entry point
├── Agents/                    # Individual agent implementations
│   ├── greeting_agent.py
│   ├── thanks_agent.py
│   ├── signal_agent.py
│   ├── scoring_agent.py
│   ├── explanation_agent.py
│   └── retrive_Agent.py
├── Graphs/
│   ├── graph_builder.py      # LangGraph workflow definition
│   ├── state.py              # State schema
│   └── agentRoutNav.py       # Router logic
├── Api/
│   ├── uploadFile.py         # Resume upload endpoint
│   └── agentApi.py           # Chat/analysis endpoint
├── Config/
│   ├── llmConfig.py          # Groq LLM configuration
│   └── EmbConfig.py          # Embedding configuration
├── NLP/
│   ├── spacy_ext.py          # Entity extraction
│   ├── spacy_ex.py           # Experience extraction
│   └── ScoringPython.py      # Scoring logic
├── DbModel/
│   ├── resumeEmbSchema.py    # Embedding storage schema
│   ├── NLP_schema.py         # NLP data schema
│   ├── storeEmb.py           # Save embeddings
│   └── storeNlp.py           # Save NLP data
└── DbSearch/
    └── nlp_search.py         # Query NLP data
```

---

## API Endpoints

### **File Upload**
```
POST /upload-resume
Headers: Content-Type: multipart/form-data
Body:
  - userId: string
  - file: PDF file

Response:
  {
    "success": true,
    "resume_id": "...objectId...",
    "message": "Resume processed successfully"
  }
```

### **Chat/Analysis**
```
POST /chat
Body:
  {
    "userId": "...",
    "resume_id": "...",
    "message": "user query"
  }

Response (Resume Analysis):
  {
    "messages": [...],
    "score": 85,
    "score_breakdown": {...},
    "signals": {...},
    "explanation": "..."
  }

Response (Greeting):
  {
    "messages": ["Hello! I'm ResumeAgent..."]
  }
```

---

## 🔐 Authentication & Security

- **JWT Tokens**: 7-day expiration
- **httpOnly Cookies**: Secure token storage
- **CORS**: Configured with credentials
- **Environment Variables**: Sensitive data in `.env`
- **MongoDB Caching**: User sessions in database

---

## 🚀 Running the System

### **1. Start Node.js Backend (Port 7000)**
```bash
cd backend
npm start
```

### **2. Start FastAPI Backend (Port 7001)**
```bash
cd backend/RA_Agent
python -m uvicorn main:app --port 7001 --reload
```

### **3. Start Frontend (Port 5173)**
```bash
cd frontend
npm run dev
```

---

## 📈 Agent Performance & Metrics

| Agent | Metric | Target |
|-------|--------|--------|
| **Scoring** | ATS Match Accuracy | 90%+ |
| **Entity Extraction** | Precision | 85%+ |
| **Signal Detection** | Recall | 80%+ |
| **LLM Explanation** | Relevance Score | 8/10+ |

---

## 🔮 Future Enhancements

- [ ] Add job description matching
- [ ] Implement resume recommendations engine
- [ ] Add interview preparation agent
- [ ] Multi-language support
- [ ] Real-time feedback during resume upload
- [ ] Resume comparison with job market data
- [ ] Skills gap analysis agent

---

## 📝 Notes

- **Agent Stateful**: Uses LangGraph for state management
- **Streaming**: Supports streaming responses for better UX
- **Modular**: Each agent can be updated independently
- **Extensible**: Easy to add new agents to the workflow
- **Production-Ready**: Implements best practices for auth, error handling, and logging

---

**Created**: March 2026  
**Framework**: LangGraph + FastAPI + React  
**Status**: Active Development
