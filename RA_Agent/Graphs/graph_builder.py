# RA_Agent/Graphs/graph_builder.py

from langgraph.graph import StateGraph, END

from Graphs.state import Agent_state
from ClassRouter.classifyRouter import (
    intent_classifier_node,
    route_by_intent,
    route_after_retrieval,
)

# ── Existing agents ──────────────────────────────────────────────────────────
from Agents.greeting_agent    import greeting_node
from Agents.thanks_agent      import thanks_node
from Agents.retrive_Agent     import retrieve_node
from Agents.signal_agent      import signal_node
from Agents.scoring_agent     import scoring_node
from Agents.explanation_agent import explanation_node

# ── New agents ───────────────────────────────────────────────────────────────
from LLM_agent.LLMagent import (
    general_chat_node,
    resume_review_node,
    career_advice_node,
    cover_letter_node,
    job_search_node,
    interview_prep_node,
    salary_negotiation_node,
    skill_gap_node,
)


def build_graph():
    graph = StateGraph(Agent_state)

    

    # Always runs first — classifies intent, writes to state
    graph.add_node("intent_classifier_node",  intent_classifier_node)

    # Simple nodes — no resume context needed
    graph.add_node("greeting_node",           greeting_node)
    graph.add_node("thanks_node",             thanks_node)
    graph.add_node("general_chat_node",       general_chat_node)

    # Retrieval — always runs before any specialist node
    graph.add_node("retrieval_node",          retrieve_node)

    # Specialist nodes — receive retrieved_text from retrieval_node
    graph.add_node("resume_review_node",      resume_review_node)
    graph.add_node("career_advice_node",      career_advice_node)
    graph.add_node("cover_letter_node",       cover_letter_node)
    graph.add_node("job_search_node",         job_search_node)
    graph.add_node("interview_prep_node",     interview_prep_node)
    graph.add_node("salary_negotiation_node", salary_negotiation_node)
    graph.add_node("skill_gap_node",          skill_gap_node)

    # Full analysis pipeline nodes
    graph.add_node("signal_node",             signal_node)
    graph.add_node("scoring_node",            scoring_node)
    graph.add_node("explanation_node",        explanation_node)

    # ── Step 2: Entry point 
    # Every single run starts here — no exceptions
    graph.set_entry_point("intent_classifier_node")

    # ── Conditional edges — NO explicit map, trust the functions
    graph.add_conditional_edges("intent_classifier_node", route_by_intent)
    graph.add_conditional_edges("retrieval_node", route_after_retrieval)

    # ── Step 5: Full analysis pipeline edges
    graph.add_edge("signal_node",      "scoring_node")
    graph.add_edge("scoring_node",     "explanation_node")
    graph.add_edge("explanation_node", END)

    # ── Step 6: Specialist nodes → END 
    graph.add_edge("resume_review_node",      END)
    graph.add_edge("career_advice_node",      END)
    graph.add_edge("cover_letter_node",       END)
    graph.add_edge("job_search_node",         END)
    graph.add_edge("interview_prep_node",     END)
    graph.add_edge("salary_negotiation_node", END)
    graph.add_edge("skill_gap_node",          END)

    # ── Step 7: Simple nodes → END 
    graph.add_edge("greeting_node",      END)
    graph.add_edge("thanks_node",        END)
    graph.add_edge("general_chat_node",  END)

    return graph.compile()


# Compiled app — import this in main.py and agentApi.py
Agent_app= build_graph()