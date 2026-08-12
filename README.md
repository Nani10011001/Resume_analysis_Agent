graph TD
    %% Styling definitions
    classDef client fill:#EBF5FB,stroke:#2980B9,stroke-width:2px,color:#1A5276;
    classDef backend fill:#E8F8F5,stroke:#117A65,stroke-width:2px,color:#0E6251;
    classDef agent fill:#FEF9E7,stroke:#D4AC0D,stroke-width:2px,color:#7D6608;
    classDef storage fill:#FDEDEC,stroke:#CB4335,stroke-width:2px,color:#7B241C;
    classDef monitor fill:#F4ECF7,stroke:#8E44AD,stroke-width:2px,color:#4A235A;

    %% Client Tier
    subgraph Client_Tier ["Frontend Application"]
        UI["React & Tailwind CSS App<br/>(TypeScript)"]
    end
    class UI client;

    %% Backend Tier
    subgraph Backend_Tier ["Backend API & Container Engine"]
        Docker["Docker Container"]
        Express["Node.js / Express Server"]
        Docker --> Express
    end
    class Express,Docker backend;

    %% AI Agent Core
    subgraph Agent_Core ["Python Agentic Engine"]
        LangGraph{"LangGraph<br/>(State Machine / Orchestration)"}
        LlamaIndex["LlamaIndex<br/>(RAG Framework)"]
        Agents["Python Custom Agents<br/>(Tool/Function Calling)"]
    end
    class LangGraph,LlamaIndex,Agents agent;

    %% Data & Memory Layer
    subgraph Storage_Tier ["Data, Cache & Memory Layer"]
        MongoDB[("MongoDB<br/>(User & App Data)")]
        Redis[("Redis<br/>(Short-term Cache / Session)")]
        Mem0[("Mem0<br/>(Long-term User Memory)")]
        VectorDB[("Vector DB / Chroma<br/>(Knowledge Embeddings)")]
    end
    class MongoDB,Redis,Mem0,VectorDB storage;

    %% Observability Layer
    subgraph Observability ["Observability & Guardrails"]
        LangSmith["LangSmith<br/>(LLM Trace & Debugging)"]
    end
    class LangSmith monitor;

    %% System Data Flows
    UI <-->|"API Requests / WebSockets"| Express
    Express <-->|"Invokes Workflows"| LangGraph
    
    %% Internal Agent Loops
    LangGraph <--> Agents
    LangGraph -->|Observability Traces| LangSmith
    Agents <-->|Manages Persona Memory| Mem0
    Agents <-->|Session Context| Redis
    Agents -->|Triggers Retrieval| LlamaIndex
    
    %% Database Associations
    Express <--> MongoDB
    LlamaIndex <--> VectorDB
    
