query="what is architecture work did the candidate do?"
query_embedding=embedding.embed_query(query)

""" result=vector_search_resume(
    userid="69898924a85793c43ba3a4c3",
    query_embedding=query_embedding
)
for r in result:
    print("top_search_data: ",r) """
    
Designed and implemented an end-to-end LLM-powered Resume Intelligence System using:

RAG architecture

Vector embeddings (MiniLM)

NLP entity extraction (spaCy)

Rule-based scoring engine

LangGraph multi-agent orchestration

Groq-hosted Mixtral for structured signal extraction

POST /upload-resume
    ↓
Validate file
    ↓
Temp save
    ↓
Load PDF
    ↓
Chunk
    ↓
Embed
    ↓
Store in Vector DB with userId
    ↓
Delete temp file
    ↓
Return success
