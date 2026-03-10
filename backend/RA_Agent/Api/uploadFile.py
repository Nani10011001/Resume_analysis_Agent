import os
import uuid
import hashlib
from fastapi import HTTPException, Form, UploadFile, File
from bson import ObjectId
from langchain_community.document_loaders import PyPDFLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter

from RA_Agent.Config.EmbConfig import embedding
from RA_Agent.NLP.spacy_ext import extract_resume_entities
from RA_Agent.NLP.spacy_ex import extract_experience
from RA_Agent.DbModel.storeNlp import Nlp_info_store
from RA_Agent.DbModel.storeEmb import store_embedding
from RA_Agent.Agents.retrive_Agent import safe_object_id
from fastapi import FastAPI,APIRouter

fileAgentRouter=APIRouter()


@fileAgentRouter.post("/upload-resume")
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

