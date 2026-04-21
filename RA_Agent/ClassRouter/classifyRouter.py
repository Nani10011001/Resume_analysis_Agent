from Graphs.state import Agent_state
from Config.llmConfig import get_llm
from langchain_core.messages import AIMessage
from langsmith import traceable

INTENTS = {
    "greeting":             "User says hi, hello, hey, or any casual opener.",
    "thanking":             "User says thanks, thank you, or shows appreciation.",
    "general_chat":         "Casual conversation, off-topic, or unclear messages.",
    "resume_review":        "User wants feedback or improvements on their resume/CV.",
    "career_advice":        "User wants strategic career guidance or planning.",
    "cover_letter":         "User wants to write or improve a cover letter.",
    "job_search":           "User is looking for jobs or wants role recommendations.",
    "interview_prep":       "User wants to prepare for an interview.",
    "salary_negotiation":   "User wants advice on salary, offers, or negotiation.",
    "skill_gap":            "User wants to identify missing skills for a target role.",
    "resume_analysis":      "User wants a full resume analysis with scoring.",
}

INTENT_TO_NODE = {
    "greeting":             "greeting_node",
    "thanking":             "thanks_node",
    "general_chat":         "general_chat_node",
    "resume_review":        "signal_node",
    "career_advice":        "retrieval_node",
    "cover_letter":         "retrieval_node",
    "job_search":           "retrieval_node",
    "interview_prep":       "retrieval_node",
    "salary_negotiation":   "retrieval_node",
    "skill_gap":            "retrieval_node",
    "resume_analysis":      "signal_node",
}

INTENT_TO_SPECIALIST = {
    "resume_review":        "resume_review_node",
    "career_advice":        "career_advice_node",
    "cover_letter":         "cover_letter_node",
    "job_search":           "job_search_node",
    "interview_prep":       "interview_prep_node",
    "salary_negotiation":   "salary_negotiation_node",
    "skill_gap":            "skill_gap_node",
    "resume_analysis":      "resume_review_node",    # full pipeline
}
llm=get_llm()

@traceable(name="classifyIntenrprompt")
def classifyIntentPrompt(user_message: str) -> str:
    intent_definitions = "\n".join(
        f"- {key}: {desc}" for key, desc in INTENTS.items()
    )
    print("intent_info: ----",intent_definitions)
    return f"""
You are an intent classifier for a resume analysis AI system called ResumeAgent.

Return ONLY one intent label from the list below.
No explanation. No punctuation. Just the label.

Intents:
{intent_definitions}

User message: "{user_message}"

Intent:
""".strip()

@traceable(name="intent_classify_node")
def intent_classifier_node(state: Agent_state) -> dict:
    user_message = state["messages"][-1].content

    response = llm.invoke(classifyIntentPrompt(user_message))

    # Clean + validate LLM output — fallback to general_chat if unrecognized
    raw    = response.content.strip().lower().strip("`\"' ")
    intent = raw if raw in INTENTS else "general_chat"
    print(f"[INTENT] message: {user_message}")
    print(f"[INTENT] raw: {raw}")
    print(f"[INTENT] final: {intent}")
    return {"intent": intent}
@traceable(name="router_by_intent")

def route_by_intent(state: Agent_state) -> str:
    intent = state.get("intent", "general_chat")
    return INTENT_TO_NODE.get(intent, "general_chat_node")

@traceable(name="router_after_retrival")
def route_after_retrieval(state):
    intent = state.get("intent", "")

    if intent == "resume_analysis":
        return "signal_node"

    elif intent == "career_advice":
        return "career_advice_node"

    elif intent == "job_search":
        return "job_search_node"

    elif intent == "cover_letter":
        return "cover_letter_node"

    elif intent == "interview_prep":
        return "interview_prep_node"

    elif intent == "salary_negotiation":
        return "salary_negotiation_node"

    elif intent == "skill_gap":
        return "skill_gap_node"

    return "general_chat_node"