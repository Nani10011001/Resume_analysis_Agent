from typing import List
from bson import ObjectId
from datetime import datetime,timezone
from RA_Agent.Db.pyDb import embedding_db
from RA_Agent.DbModel.resumeEmbSchema import ResumeEmbedding


def store_embedding(
    user_id: ObjectId,
    
    text:List[str],
    embeddings: List[List[float]],
    version: int = 1
):
    records = []

    for i, chunk in enumerate(text):

        embedding_doc = ResumeEmbedding(
            user_id=user_id,
            chunk_id=i,
            text=chunk,
            embedding=embeddings[i],
            source="pdf",
            version=version,
            created_at=datetime.now(timezone.utc)
        )

        records.append(embedding_doc.model_dump())

    if records:
        embedding_db.insert_many(records)
        print(f"Inserted {len(records)} embeddings successfully")
