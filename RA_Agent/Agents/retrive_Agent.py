from bson import ObjectId
import hashlib
from Graphs.state import Agent_state
from VectorSearch.vector_search import vector_search_resume
from Config.EmbConfig import embedding
from langchain_core.runnables import RunnableParallel,RunnableLambda
from DbSearch.nlp_search import get_nlp_info
from langsmith import traceable
def safe_object_id(value: str) -> ObjectId:

    try:
        if len(value) == 24:
            return ObjectId(value)

        hash_obj = hashlib.md5(value.encode())
        return ObjectId(hash_obj.hexdigest()[:24])

    except:
        return ObjectId()
    
@traceable(name="retrive_node")
def retrieve_node(state: Agent_state):
    query = state["messages"][-1].content
    user_id_str = state["userId"]
    resume_id_str = state.get("resume_id", "")  
    # guard first before any conversion
    if not resume_id_str or resume_id_str.strip() == "":
        return {
            "retrieved_text": "No resume uploaded yet. Give general advice.",
            "full_text": ""
        }
    user_id=safe_object_id(user_id_str)
    resume_id = safe_object_id(resume_id_str)
    query_embedding = embedding.embed_query(query)

    

    #parallel fetching of the data things
    parallel_fetch=RunnableParallel(
        retrieved_text=RunnableLambda(
            lambda _:"\n".join(r["text"] for r in vector_search_resume(
                 userid=user_id,
        resume_id=resume_id,
        query_embedding=query_embedding
            ))
        ),
        full_text=RunnableLambda(
            lambda _:get_nlp_info(
                userId=user_id,
                resume_id=resume_id
                
            )
        )
    )


    results = parallel_fetch.invoke({})
    
    return {"retrieved_text": results["retrieved_text"],
            "full_text":results["full_text"]}