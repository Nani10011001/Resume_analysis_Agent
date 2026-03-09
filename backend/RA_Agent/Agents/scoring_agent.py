from langchain_core.runnables import RunnableParallel,RunnableLambda
from RA_Agent.NLP.spacy_ex import extract_experience
from RA_Agent.NLP.spacy_ext import extract_resume_entities
from RA_Agent.DbSearch.nlp_search import get_nlp_info
from RA_Agent.NLP.ScoringPython import scoring_engine
from RA_Agent.Graphs.state import Agent_state


entity_runnable=RunnableLambda(extract_resume_entities)
experience_runnable=RunnableLambda(extract_experience)
nlp_piplie=RunnableParallel(
    {
        "entities":entity_runnable,
        "experience":experience_runnable
    }
    
)


def scoring_node(state: Agent_state):

    user_id = safe_object_id(state["userId"])
    resume_id = safe_object_id(state["resume_id"])

    nlp_data = get_nlp_info(
        userId=user_id,
        resume_id=resume_id
    )

    full_text = nlp_data.get("raw_text", "")
    result=nlp_piplie.invoke(full_text)


    score_data = scoring_engine(
        spacy_entities=result["entities"],
        spacy_experience=result["experience"],
        signals=state["signals"],
        full_text=full_text
    )

    return {
        "score": score_data["total_score"],
        "score_breakdown": score_data["breakdown"]
    }