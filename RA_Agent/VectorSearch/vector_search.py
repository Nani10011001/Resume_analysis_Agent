from bson import ObjectId
from Db.pyDb import embedding_db
from Config.logger import setup_logger
import logging
setup_logger()
logger = logging.getLogger(__name__)
def vector_search_resume(userid:ObjectId,
                         query_embedding:list[float],
                        resume_id:ObjectId,
                         top_k:int=10):
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
    logger.info("retriving the query from it")
    results = list(embedding_db.aggregate(pipeline))
    return results
    
    