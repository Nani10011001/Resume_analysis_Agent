from bson import ObjectId
from RA_Agent.Db.pyDb import embedding_db

def vector_search_resume(userid:ObjectId,
                         query_embedding:list[float],
                        resume_id:ObjectId,
                         top_k:int=5):
    pipeline = [
        {
            "$vectorSearch": {
                "index": "vector_index",
                "path": "embedding",
                "queryVector": query_embedding,
                "numCandidates": 100,
                "limit": top_k,
                "filter": {
                    "user_id": ObjectId(userid),
                     "resume_id":resume_id
                }
            }
        },
        {
            "$project": {
                "_id": 0,
                "text": 1,
                "score": { "$meta": "vectorSearchScore" }
            }
        }
    ]

    results = list(embedding_db.aggregate(pipeline))
    return results
    
    