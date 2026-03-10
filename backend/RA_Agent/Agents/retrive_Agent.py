from bson import ObjectId
import hashlib
from RA_Agent.Graphs.state import Agent_state
from RA_Agent.VectorSearch.vector_search import vector_search_resume
from RA_Agent.Config.EmbConfig import embedding
def safe_object_id(value: str) -> ObjectId:

    try:
        if len(value) == 24:
            return ObjectId(value)

        hash_obj = hashlib.md5(value.encode())
        return ObjectId(hash_obj.hexdigest()[:24])

    except:
        return ObjectId()
    

def retrieve_node(state: Agent_state):
    query = state["messages"][-1].content
    user_id = safe_object_id(state["userId"])
    resume_id = safe_object_id(state["resume_id"])


    query_embedding = embedding.embed_query(query)
    results = vector_search_resume(
        userid=user_id,
        resume_id=resume_id,
        query_embedding=query_embedding
    )

    chunks = [r["text"] for r in results] if results else []
    return {"retrieved_text": "\n".join(chunks)}