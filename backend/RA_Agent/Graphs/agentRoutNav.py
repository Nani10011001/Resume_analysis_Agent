from RA_Agent.Graphs.state import Agent_state
from RA_Agent.Config.llmConfig import get_llm

llm=get_llm()

def router_agent(state:Agent_state):
    user_input=state["messages"][-1].content
    
