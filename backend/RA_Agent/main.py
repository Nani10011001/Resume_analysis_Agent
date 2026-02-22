from langchain_huggingface import HuggingFaceEmbeddings
from langchain_groq import ChatGroq
from langgraph.graph import StateGraph,END,START

from langchain_community.document_loaders import UnstructuredPDFLoader,PyPDFLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from typing import TypedDict,Annotated,Sequence,Dict,Any,List
from langchain_core.messages import AIMessage,BaseMessage,HumanMessage,SystemMessage
from fastapi import FastAPI,UploadFile,File,Form,HTTPException

from langgraph.graph import add_messages
from pydantic import BaseModel
from langchain_core.tools import tool
import os
import json
from RA_Agent.VectorSearch.vector_search import vector_search_resume
from RA_Agent.NLP.spacy_ext import extract_resume_entities
from RA_Agent.NLP.spacy_ex import extract_experience 
from RA_Agent.DbModel.storeEmb import store_embedding
from bson import ObjectId
from RA_Agent.SystemPromt.signalPrompt import signalAgentPrompt
from RA_Agent.SystemPromt.E_prompt import explain_Agent_prompt
from RA_Agent.NLP.ScoringPython import scoring_engine
from RA_Agent.DbModel.NLP_schema import NLP_schema_str
import uuid
from RA_Agent.DbSearch.nlp_search import get_nlp_info
from RA_Agent.DbModel.storeNlp import Nlp_info_store
class Agent_state(TypedDict):
    userId:str
    messages:Annotated[Sequence[BaseMessage],add_messages]
    explanation:str
    signals:Dict[str,Any]
    retrieved_text:str
    spacy_entities:Dict[str,Any]
    spacy_experience:List[Dict[str,Any]]
    score:float
    score_breakdown:Dict[str,Any]
    jd_requirements:Dict[str,Any]
    resume_id:str

    
#chat request schema
class ChatRequest(BaseModel):
    userId:str
    content:str
    resume_id:str

embedding=HuggingFaceEmbeddings(
    model_name="sentence-transformers/all-MiniLM-L6-v2"
)
llm=ChatGroq(model="mixtral-8x7b-32768",api_key=os.environ['GROQ_API_KEY'],streaming=True)
app=FastAPI()
@app.post("/upload-resume")
async def upload_resume(userId:str=Form(),file:UploadFile=File()):
    if file.content_type!="application/pdf":
        raise HTTPException(status_code=400,detail="Only PDF allowed")
    os.makedirs("temp",exist_ok=True)
    unique_name=f"{uuid.uuid4()}.pdf"
    temp_path=os.path.join("temp",unique_name)
    print(unique_name,"tempath: ",temp_path)

    with open(temp_path,"wb") as f:
        f.write(await file.read())
        
    try:
        loader=PyPDFLoader(temp_path)
        docs=loader.load()
        print(len(docs))
        resume_id=ObjectId()
        user_object_id=ObjectId(userId)
        text_splitter=RecursiveCharacterTextSplitter(
            chunk_size=800,
            chunk_overlap=200
        )
        full_text="\n".join(d.page_content for d in docs)
        chunks=text_splitter.split_documents(docs)
        chunks_texts=[d.page_content for d in chunks]
        print("chunk_data: ",chunks_texts)
        pdf_text_embedding=embedding.embed_documents(chunks_texts)
        extract_resume_info=extract_resume_entities(text=full_text)
        extract_resume_experience=extract_experience(text=full_text)
        #NLP store 
        Nlp_info_store(userId=user_object_id,
                       resumeId=resume_id,
                       raw_text=full_text,
                       nlp_extraction_info=extract_resume_info,
                       nlp__experience_info=extract_resume_experience)
        
        store_embedding(user_id=user_object_id,
                                 resume_id=resume_id,
                                 text=chunks,
                                 embeddings=pdf_text_embedding)

        
    except Exception as e:
        print(f"error at file load : {e}")
    finally:
        if os.path.exists(temp_path):
            os.remove(temp_path)



#node of  retrive info node
def retrieve_node(state:Agent_state):
    user_query=state["messages"][-1].content
    userId=ObjectId(state["userId"])
    resume_id=ObjectId(state["resume_id"])
    query_embeddings=embedding.embed_query(user_query)
    results=vector_search_resume(userid=ObjectId(state["userId"]),resume_id=ObjectId(state['resume_id']),query_embedding=query_embeddings)
    nlp_data=get_nlp_info(userId=userId,resume_id=resume_id)
    ext_entities = nlp_data.get("nlp_extraction_info", {})
    exp_entities = nlp_data.get("nlp_experience_info", {})
    chunksInfo=[r["text"] for r in results]

    return {
        "retrieved_text":"\n".join(chunksInfo),
        "spacy_entities":ext_entities,
        "spacy_experience":exp_entities

        

    }

# signal node f
def signal_node(state:Agent_state):
    payload={
        "retrieved_text":state["retrieved_text"],
       "jd_requirements":state["jd_requirements"]
       
    }
    response=llm.invoke([
        SystemMessage(content=signalAgentPrompt()),
        HumanMessage(content=json.dumps(payload))

    ]

    )
    return {
        "signals":json.loads(response.content)
    }
#scoring node
def scoring_node(state:Agent_state):
    scoringData=scoring_engine(spacy_entities=state["spacy_entities"],spacy_experience=state["spacy_experience"],
                   signals=state["signals"],jd_requirements=state["jd_requirements"])
    return {
        "score":scoringData["total_score"],
        "score_breakdown":scoringData["breakdown"]
    }





def explanation_node(state:Agent_state):
    payload={
        "score":state["score"],
        "score_breakdown":state["score_breakdown"],
        "signals":state["signals"]
    }
    response=llm.invoke([
        SystemMessage(content=explain_Agent_prompt()),
        HumanMessage(content=json.dumps(payload))

    ])

    return {"explanation":response.content}
@tool
def McpTools():
    """its mcp server for providing the links of match job thing """
    pass

graph=StateGraph(Agent_state)
graph.add_node("retrive_node",retrieve_node)
graph.add_node("scoring_node",scoring_node)
graph.add_node("signal_node",signal_node)
graph.add_node("explanation_node",explanation_node)
graph.add_edge(START,"retrive_node")
graph.add_edge("retrive_node","signal_node")
graph.add_edge("signal_node","scoring_node")
graph.add_edge("scoring_node","explanation_node")
graph.add_edge("explanation_node",END)
Agent_app=graph.compile()

app.post("/chat")
async def chat_interface_send(req:ChatRequest):
    userId=req.userId
    resume_id=req.resume_id
    query=req.content

    Agent_app.invoke({
        "userId":userId,
        "j"
    })