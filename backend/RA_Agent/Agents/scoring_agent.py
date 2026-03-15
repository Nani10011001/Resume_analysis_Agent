from langchain_core.runnables import RunnableParallel,RunnableLambda
from RA_Agent.NLP.spacy_ex import extract_experience
from RA_Agent.NLP.spacy_ext import extract_resume_entities
from RA_Agent.DbSearch.nlp_search import get_nlp_info
from RA_Agent.NLP.ScoringPython import scoring_engine
from RA_Agent.Graphs.state import Agent_state
from RA_Agent.Agents.retrive_Agent import safe_object_id
from langsmith import traceable
#make the to run using the runnable for the parallel excution to optimize the time of it
entity_runnable=RunnableLambda(extract_resume_entities)
experience_runnable=RunnableLambda(extract_experience)
nlp_piplie=RunnableParallel(
    {
        "entities":entity_runnable,
        "experience":experience_runnable
    }
    
)

#scoring engin it take the useri and th resume_id thing of it 
# get the data from the nlp_data function based on the resume thing 
# afet geting the data from the resume we store into the full_text thing and the raw_text
#pass the data thing to the nlp_piple it excute the two functions thing we have used optimzed the things of as it
#we store the data into the score_data thing here we have the function which which help score the resume based on the text given thing
# after that we return the data thing as the "score" and the "score_breddown thing help to with overview of the where we lack and out of it "
@traceable(name="scoring_node")
def scoring_node(state: Agent_state):


    full_text = state.get("full_text", "")
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