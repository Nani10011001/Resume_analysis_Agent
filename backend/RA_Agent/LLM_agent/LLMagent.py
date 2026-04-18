# RA_Agent/Agents/new_agents.py
from langsmith import traceable
from langchain_core.messages import AIMessage
from RA_Agent.Graphs.state import Agent_state
from RA_Agent.Config.llmConfig import get_llm
from RA_Agent.LLM_agent.Prompt.Prompty import (
    generalPrompt,
    resumeReviewPrompt,
    careerAdvicePrompt,
    coverLetterPrompt,
    jobSearchPrompt,
    interviewPrepPrompt,
    salaryNegotiationPrompt,
    skillGapPrompt,
)
from langchain_core.messages import HumanMessage,AIMessage,SystemMessage
from langchain_mcp_adapters.client import MultiServerMCPClient
llm = get_llm()
@traceable(name="general_chat_agent")
#general chat help us to get to chat with the ag
def general_chat_node(state: Agent_state) -> dict:
    user_message = state["messages"][-1].content
    response = llm.invoke(generalPrompt(user_message))
    return {"messages": [AIMessage(content=response.content)]}

@traceable(name = "resume_review_node")
def resume_review_node(state: Agent_state) -> dict:
    user_message = state["messages"][-1].content
    retrieved_text = state.get("retrieved_text", "No resume content available.")
    response = llm.invoke(resumeReviewPrompt(user_message, retrieved_text))
    return {"messages": [AIMessage(content=response.content)]}

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


mcp_client = MultiServerMCPClient({
    "websearch": {
        "url": "http://localhost:8000/mcp",   #  streamable-http
        "transport": "streamable_http",        # ← un
    }
})
@traceable(name="job_search_node")

async def job_search_node(state: Agent_state) -> dict:
    user_message = state["messages"][-1].content
    retrieved_text = state.get("retrieved_text", "No resume context available.")

    if not retrieved_text.strip():
        retrieved_text = "No resume uploaded yet. Give general job search advice."

    # ── 1. Extract smart query FROM resume ────────────────────────────────────
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

 # → "Senior Architect New York job opening"
    
    smart_query = extraction.content.strip()
    print("Smart query:", smart_query)   # → "Senior Architect NYC 10 years"

    # ── 2. Use smart query for MCP search ─────────────────────────────────────
    web_results = "Search unavailable."
    try:
        tools = await mcp_client.get_tools()
        web_search_tool = next(t for t in tools if t.name == "webMcp")
        raw = await web_search_tool.ainvoke({"query": smart_query})  # ← resume-based query
        
        print("MCP raw result:", raw)
        web_results = str(raw)[:500]

    except Exception as e:
        print("MCP ERROR:", e)
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