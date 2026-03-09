from langchain_core.messages import AIMessage

from RA_Agent.Graphs.state import Agent_state


def greeting_node(state:Agent_state):
    userMessage=state["messages"][-1].content.lower().strip()
    greetings =[
        "hi",
        "hello",
        "hey",
        "hi there"
        "hi there",
        "hello there",
        "hey there",
        "good morning",
        "good afternoon",
        "good evening",
        "greetings",
        "yo",
        "sup",
        "what's up",
        "whats up",
        "hiya",
        "howdy",
        "hey buddy",
        "hello assistant",
        "hey assistant",
        "hi assistant",
        "hey bot",
        "hello bot"
    ]
    words=userMessage.split()
    if len(words)==1 and words[0] in greetings:
        return True
    return False

def greeting_response():
    message=AIMessage(
content="Hello 👋 I'm your AI Resume Assistant. You can upload your resume or ask career-related questions."
    )
    
    return {"messages":[message]}
