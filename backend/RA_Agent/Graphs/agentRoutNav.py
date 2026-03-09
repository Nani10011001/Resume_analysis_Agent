from RA_Agent.Graphs.state import Agent_state
from RA_Agent.Agents.greeting_agent import greeting_node
from RA_Agent.Agents.thanks_agent import thanks_node

def router_Agent(state:Agent_state):
    if greeting_node(state):
        return "greeting"
    if thanks_node(state):
        return "thanking"
    return "chatAgent"
