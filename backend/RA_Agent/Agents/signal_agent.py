
from langchain_core.messages import HumanMessage,SystemMessage
from RA_Agent.Graphs.state import Agent_state
from RA_Agent.SystemPromt.signalPrompt import signalAgentPrompt
from RA_Agent.Config.llmConfig import get_llm
import json

llm=get_llm()
def signal_node(state: Agent_state):

    payload = {
        "retrieved_text": state["retrieved_text"]
    }

    response = llm.invoke([
        SystemMessage(content=signalAgentPrompt()),
        HumanMessage(content=json.dumps(payload))
    ])

    try:
        signals = json.loads(response.content)
    except:
        signals = {}

    return {"signals": signals}