from typing import List
from bson import ObjectId
from datetime import datetime,timezone
from RA_Agent.Db.pyDb import embedding_db
from RA_Agent.DbModel.resumeEmbSchema import ResumeEmbedding


def store_embedding(
    user_id: ObjectId,
    resume_id:ObjectId,
    text:List[str],
    embeddings: List[List[float]],
  
):
    records = []

    for i, chunk in enumerate(text):

        embedding_doc = ResumeEmbedding(
            user_id=user_id,
            chunk_id=i,
            resume_id=resume_id,
            text=chunk.page_content,
            metadata=chunk.metadata,
            embedding=embeddings[i],
            source="pdf",
        
            created_at=datetime.now(timezone.utc)
        )

        records.append(embedding_doc.model_dump())

    if records:
        embedding_db.insert_many(records)
        print(f"Inserted {len(records)} embeddings successfully")
