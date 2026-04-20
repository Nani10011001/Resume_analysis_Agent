from Graphs.state import Agent_state
from langchain_core.messages import SystemMessage,HumanMessage
import json
from SystemPromt.E_prompt import explain_Agent_prompt
from Config.llmConfig import get_llm
from langsmith import traceable
llm=get_llm()
@traceable(name="explanation_agent")
def explanation_node(state: Agent_state):

    user_question = state["messages"][-1].content

    payload = {
        "user_question": user_question,
        "resume_context": state["retrieved_text"],
        "score": state["score"],
        "score_breakdown": state["score_breakdown"],
        "signals": state["signals"]
    }

    response = llm.invoke([
        SystemMessage(content=explain_Agent_prompt()),
        HumanMessage(content=json.dumps(payload))
    ])

    return {
        "explanation": response.content
    }
