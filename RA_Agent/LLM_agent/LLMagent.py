# RA_Agent/Agents/new_agents.py
import os
from dotenv import load_dotenv
from langsmith import traceable
from langchain_core.messages import AIMessage
from Graphs.state import Agent_state
from Config.llmConfig import get_llm
from NLP.ScoringPython import scoring_engine
from langchain_core.messages import HumanMessage,AIMessage,SystemMessage
from langchain_mcp_adapters.client import MultiServerMCPClient
from LLM_agent.Prompt.Prompty import (
    generalPrompt,
    resumeReviewPrompt,
    careerAdvicePrompt,
    coverLetterPrompt,
    jobSearchPrompt,
    interviewPrepPrompt,
    salaryNegotiationPrompt,
    skillGapPrompt,
)

llm = get_llm()
@traceable(name="general_chat_agent")
#general chat help us to get to chat with the ag
def general_chat_node(state: Agent_state) -> dict:
    user_message = state["messages"][-1].content
    response = llm.invoke(generalPrompt(user_message))
    return {"messages": [AIMessage(content=response.content)]}

@traceable(name = "resume_review_node")
# Agents/resume_review_agent.py


def resume_review_node(state: Agent_state) -> dict:
    retrieved_text = state.get("retrieved_text", "")
    full_text      = state.get("full_text", "")
    user_message   = state["messages"][-1].content
    # Scoring 
    spacy_entities   = state.get("spacy_entities", {})
    spacy_experience = state.get("spacy_experience", [])
    signals          = state.get("signals", {})

    score_result = scoring_engine(spacy_entities, spacy_experience, signals, full_text)
    score_breakdown = score_result  # {"total_score": ..., "breakdown": {...}}
    # Review
    prompt   = resumeReviewPrompt(user_message, retrieved_text, score_breakdown)
    response = llm.invoke(prompt)

    return {
        "messages":      [AIMessage(content=response.content)],
        "score_breakdown": score_breakdown
    }

    

@traceable(name = "career_advice_node")
def career_advice_node(state: Agent_state) -> dict:
    user_message = state["messages"][-1].content
    retrieved_text = state.get("retrieved_text", "No resume context available.")
    response = llm.invoke(careerAdvicePrompt(user_message, retrieved_text))
    return {"messages": [AIMessage(content=response.content)]}

@traceable(name = "cover_letter_node")
def cover_letter_node(state: Agent_state) -> dict:
    user_message = state["messages"][-1].content
    retrieved_text = state.get("retrieved_text", "No resume context available.")
    response = llm.invoke(coverLetterPrompt(user_message, retrieved_text))
    return {"messages": [AIMessage(content=response.content)]}


load_dotenv(os.path.join(os.path.dirname(__file__), "../.env"))

# Read MCP URL from environment for flexibility in deployments
MCP_WEBSEARCH_URL = os.environ.get("MCP_WEBSEARCH_URL", "http://localhost:10000/mcp")

mcp_client = MultiServerMCPClient({
    "websearch": {
        "url": MCP_WEBSEARCH_URL,
        "transport": "streamable_http",
    }
})
@traceable(name="job_search_node")

async def job_search_node(state: Agent_state) -> dict:
    user_message = state["messages"][-1].content
    retrieved_text = state.get("retrieved_text", "No resume context available.")

    if not retrieved_text.strip():
        retrieved_text = "No resume uploaded yet. Give general job search advice."

    # Extract smart query FROM resume
    extraction = llm.invoke([
    SystemMessage(content="""Extract a job search query from this resume.
Return ONLY a short string like:
'Senior Architect New York job opening'
Rules:
- Include job title, location, and 'job opening'
- Max 8 words
- No explanation"""),
    HumanMessage(content=f"Resume:\n{retrieved_text}\nUser asked: {user_message}")
])

 # "Senior Architect New York job opening"
    
    smart_query = extraction.content.strip()
    # "Senior Architect NYC 10 years"

    # Use smart query for MCP search
    web_results = "Search unavailable."
    try:
        tools = await mcp_client.get_tools()
        print("tools object",tools)
        print("AVAILABLE TOOL NAMES:", [t.name for t in tools])
        web_search_tools = next(
            (t for t in tools if t.name == "web_search"),
            None
        )
        raw = await web_search_tools.ainvoke({
            "query":smart_query
        })
        
        web_results = str(raw)[:1000]
       
    except Exception as e:
        print("MCP ERROR:", repr(e))
        web_results = f"Search unavailable: {e}"

    # ── 3. Pass everything to prompt ──────────────────────────────────────────
    response = llm.invoke(jobSearchPrompt(user_message, retrieved_text, web_results))
    return {"messages": [AIMessage(content=response.content)]}

#interviw preparation
@traceable(name = "interview_prep_agent")
def interview_prep_node(state: Agent_state) -> dict:
    user_message = state["messages"][-1].content
    retrieved_text = state.get("retrieved_text", "No resume context available.")
    response = llm.invoke(interviewPrepPrompt(user_message, retrieved_text))
    return {"messages": [AIMessage(content=response.content)]}

@traceable(name = "salary_negotiation_agent")
def salary_negotiation_node(state: Agent_state) -> dict:
    user_message = state["messages"][-1].content
    retrieved_text = state.get("retrieved_text", "No resume context available.")
    response = llm.invoke(salaryNegotiationPrompt(user_message, retrieved_text))
    return {"messages": [AIMessage(content=response.content)]}

@traceable( name= "skill_gap_node")
def skill_gap_node(state: Agent_state) -> dict:
    user_message = state["messages"][-1].content
    retrieved_text = state.get("retrieved_text", "No resume context available.")
    response = llm.invoke(skillGapPrompt(user_message, retrieved_text))
    return {"messages": [AIMessage(content=response.content)]}