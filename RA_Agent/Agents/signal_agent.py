
from langchain_core.messages import HumanMessage,SystemMessage
from Graphs.state import Agent_state
from SystemPromt.signalPrompt import signalAgentPrompt
from Config.llmConfig import get_llm
import json
from langsmith import traceable
llm=get_llm()
# we take the retriveText from the vecotorDb thing and store it into the state["retriver_text"]
@traceable(name='signal_node_Agent')
def signal_node(state: Agent_state):

    payload = {
        "retrieved_text": state["retrieved_text"],
        "full_text":state["full_text"]
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