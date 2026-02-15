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
import uuid
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

    
#chat request schema
class ChatRequest(BaseModel):
    userId:str
    content:str

embedding=HuggingFaceEmbeddings(
    model_name="sentence-transformers/all-MiniLM-L6-v2"
)




""" from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent
file = BASE_DIR / "Resume.pdf"

if not os.path.exists(file):
    raise FileNotFoundError("file is not found")
loader=PyPDFLoader(file)
try:
    docs=loader.load()
except Exception as e:
    raise RecursionError("error in pdf load")    


all_pages=[]
for d in docs:
    page_text=d.page_content
    all_pages.append(page_text) 

text = "\n".join(d.page_content for d in docs) """


""" 
if(len(text.strip())<100):
    raise ValueError("unable to extract the pdf data upload text-based pdf")
allExtractionInfo=[]


text_splitter=RecursiveCharacterTextSplitter(
    chunk_size=900,
    chunk_overlap=200
)
chunks=text_splitter.split_text(text)
embeddingTextPdf=embedding.embed_documents(chunks)
print("chunks info: ",len(chunks))
print(len(embeddingTextPdf))
print(len(embeddingTextPdf[0]))  """
#storing embeddings deployed
""" embInfo=store_embedding(user_id=ObjectId("69898924a85793c43ba3a4c3"),
                        text=chunks,
                        embeddings=embeddingTextPdf,
                        version=1)
#nlp extraction info things """
""" userEntities=extract_resume_entities(text=text) """
""" experienceBlock=extract_experience(text=text) """

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
        
        text_splitter=RecursiveCharacterTextSplitter(
            chunk_size=800,
            chunk_overlap=200
        )
        chunks=text_splitter.split_text(docs)
        chunk_texts=[d.page_content for d in chunks]
        pdf_text_embedding=embedding.embed_documents(chunk_texts)
        emb_info=store_embedding(user_id=userId,text=chunk_texts,embeddings=pdf_text_embedding)
        
    except Exception as e:
        print(f"error at file load : {e}")
    finally:
        if os.path.exists(temp_path):
            os.remove(temp_path)



#node of  retrive info node
def retrieve_node(state:Agent_state):
    user_query=state["messages"][-1].content
    query_embeddings=embedding.embed_query(user_query)
    results=vector_search_resume(userid=state["userId"],query_embedding=query_embeddings)
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


llm=ChatGroq(model="mixtral-8x7b-32768",api_key=os.environ['GROQ_API_KEY'])


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

