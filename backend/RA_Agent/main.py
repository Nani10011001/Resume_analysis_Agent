from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.responses import StreamingResponse
from pydantic import BaseModel, ConfigDict, Field
from langchain_core.messages import AIMessage, BaseMessage, HumanMessage, SystemMessage
from langgraph.graph import StateGraph, START, END, add_messages
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_groq import ChatGroq
import os, time, traceback, json, uuid, hashlib
from typing import TypedDict, Annotated, Sequence, Dict, Any, List
from bson import ObjectId
from langchain_community.document_loaders import PyPDFLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter


from RA_Agent.VectorSearch.vector_search import vector_search_resume
from RA_Agent.NLP.spacy_ext import extract_resume_entities
from RA_Agent.NLP.spacy_ex import extract_experience
from RA_Agent.NLP.ScoringPython import scoring_engine
from RA_Agent.SystemPromt.signalPrompt import signalAgentPrompt


from RA_Agent.DbModel.storeEmb import store_embedding
from RA_Agent.DbSearch.nlp_search import get_nlp_info
from RA_Agent.DbModel.storeNlp import Nlp_info_store







app = FastAPI()




class ChatRequest(BaseModel):
    model_config = ConfigDict(populate_by_name=True)

    userId: str
    content: str
    resume_id: str = Field(alias="resumeId")







@app.post("/upload-resume")
async def upload_resume(userId: str = Form(), file: UploadFile = File()):

    if file.content_type != "application/pdf":
        raise HTTPException(status_code=400, detail="Only PDF allowed")

    os.makedirs("temp", exist_ok=True)

    unique_name = f"{uuid.uuid4()}.pdf"
    temp_path = os.path.join("temp", unique_name)

    with open(temp_path, "wb") as f:
        f.write(await file.read())

    try:

        loader = PyPDFLoader(temp_path)
        docs = loader.load()

        resume_id = ObjectId()
        user_object_id = safe_object_id(userId)

        text_splitter = RecursiveCharacterTextSplitter(
            chunk_size=800,
            chunk_overlap=200
        )

        full_text = "\n".join(d.page_content for d in docs)

        chunks = text_splitter.split_documents(docs)
        chunks_texts = [d.page_content for d in chunks]

        embeddings = embedding.embed_documents(chunks_texts)

        entities = extract_resume_entities(full_text)
        experience = extract_experience(full_text)

        Nlp_info_store(
            userId=user_object_id,
            resumeId=resume_id,
            raw_text=full_text,
            nlp_extraction_info=entities,
            nlp__experience_info=experience
        )

        store_embedding(
            user_id=user_object_id,
            resume_id=resume_id,
            text=chunks,
            embeddings=embeddings
        )

        return {"resume_id": str(resume_id)}

    finally:

        if os.path.exists(temp_path):
            os.remove(temp_path)


#greeting node




    

def chatNode(state:Agent_state):
    pass












graph = StateGraph(Agent_state)

graph.add_node("retrieve_node", retrieve_node)
graph.add_node("signal_node", signal_node)
graph.add_node("scoring_node", scoring_node)
graph.add_node("explanation_node", explanation_node)

graph.add_edge(START, "retrieve_node")
graph.add_edge("retrieve_node", "signal_node")
graph.add_edge("signal_node", "scoring_node")
graph.add_edge("scoring_node", "explanation_node")
graph.add_edge("explanation_node", END)
graph.add_conditional_edges(
    ""
)

Agent_app = graph.compile()


def stream_response(text: str):

    for word in text.split():
        yield word + " "
        time.sleep(0.02)

chat_memory = {}

@app.post("/chat")
async def chat_interface_send(req: ChatRequest):

    userId = req.userId
    resumeId = req.resume_id
    query = req.content

    try:

        history = chat_memory.get(userId, [])
        history.append(HumanMessage(content=query))
        result = Agent_app.invoke({
            "userId": userId,
            "resume_id": resumeId,
            "messages": history,
            "retrieved_text": "",
            "signals": {},
            "score": 0,
            "score_breakdown": {},
            "explanation": ""
        })

        ai_response = result["explanation"]

        history.append(AIMessage(content=ai_response))

        chat_memory[userId] = history

        return StreamingResponse(
            stream_response(ai_response),
            media_type="text/plain"
        )

    except Exception as e:

        print("Error:", e)
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))