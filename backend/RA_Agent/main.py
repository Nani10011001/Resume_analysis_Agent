from langchain_huggingface import HuggingFaceEmbeddings
from langchain_groq import ChatGroq
from langgraph.graph import StateGraph,END,START
from pymongo import MongoClient
from langchain_community.document_loaders import UnstructuredPDFLoader,PyPDFLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from typing import TypedDict,Annotated,Sequence
from langchain_core.messages import AIMessage,BaseMessage,HumanMessage,SystemMessage
from fastapi import FastAPI
from langgraph.graph import add_messages

import os
class Agent_state(TypedDict):
    userId:str
    messages:Annotated[Sequence[BaseMessage],add_messages]

embedding=HuggingFaceEmbeddings(
    model_name="sentence-transformers/all-MiniLM-L6-v2"
)
""" textemb=embedding.embed_query("hello")
#print(textemb)
print(len(textemb))
 """
file="Stack_market.pdf"

if not os.path.exists(file):
    raise FileNotFoundError("file illa da dey")
loader=PyPDFLoader(file)
try:
    docs=loader.load()
except Exception as e:
    raise RecursionError("error in pdf load")    
docs=loader.load()

all_pages=[]
for d in docs:
    page_text=d.page_content
    all_pages.append(page_text)
text="\n".join(all_pages)
if(len(text.strip())<100):
    raise ValueError("unable to extract the pdf data upload text-based pdf")
print(text[:200])
print("length",len(text))


text_splitter=RecursiveCharacterTextSplitter(
    chunk_size=900,
    chunk_overlap=200
)
chunks=text_splitter.split_text(text)

print(chunks)

    