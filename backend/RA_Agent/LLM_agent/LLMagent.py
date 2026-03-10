# RA_Agent/Agents/new_agents.py

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

llm = get_llm()


def general_chat_node(state: Agent_state) -> dict:
    user_message = state["messages"][-1].content
    response = llm.invoke(generalPrompt(user_message))
    return {"messages": [AIMessage(content=response.content)]}


def resume_review_node(state: Agent_state) -> dict:
    user_message = state["messages"][-1].content
    retrieved_text = state.get("retrieved_text", "No resume content available.")
    response = llm.invoke(resumeReviewPrompt(user_message, retrieved_text))
    return {"messages": [AIMessage(content=response.content)]}


def career_advice_node(state: Agent_state) -> dict:
    user_message = state["messages"][-1].content
    retrieved_text = state.get("retrieved_text", "No resume context available.")
    response = llm.invoke(careerAdvicePrompt(user_message, retrieved_text))
    return {"messages": [AIMessage(content=response.content)]}


def cover_letter_node(state: Agent_state) -> dict:
    user_message = state["messages"][-1].content
    retrieved_text = state.get("retrieved_text", "No resume context available.")
    response = llm.invoke(coverLetterPrompt(user_message, retrieved_text))
    return {"messages": [AIMessage(content=response.content)]}


def job_search_node(state: Agent_state) -> dict:
    user_message = state["messages"][-1].content
    retrieved_text = state.get("retrieved_text", "No resume context available.")
    response = llm.invoke(jobSearchPrompt(user_message, retrieved_text))
    return {"messages": [AIMessage(content=response.content)]}


def interview_prep_node(state: Agent_state) -> dict:
    user_message = state["messages"][-1].content
    retrieved_text = state.get("retrieved_text", "No resume context available.")
    response = llm.invoke(interviewPrepPrompt(user_message, retrieved_text))
    return {"messages": [AIMessage(content=response.content)]}


def salary_negotiation_node(state: Agent_state) -> dict:
    user_message = state["messages"][-1].content
    retrieved_text = state.get("retrieved_text", "No resume context available.")
    response = llm.invoke(salaryNegotiationPrompt(user_message, retrieved_text))
    return {"messages": [AIMessage(content=response.content)]}


def skill_gap_node(state: Agent_state) -> dict:
    user_message = state["messages"][-1].content
    retrieved_text = state.get("retrieved_text", "No resume context available.")
    response = llm.invoke(skillGapPrompt(user_message, retrieved_text))
    return {"messages": [AIMessage(content=response.content)]}