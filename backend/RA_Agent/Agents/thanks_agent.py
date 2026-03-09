from langchain_core.messages import AIMessage
from RA_Agent.Graphs.state import Agent_state
def thanks_node(state: Agent_state):
    msg=state["messages"][-1].content.lower().strip()
    thanks_words=["thanks",
        "thank you",
        "thankyou",
        "thanks a lot",
        "thanks buddy",
        "thx",
        "ty"
        "thank you so much",
        "thanks bro"]
    words=msg.split()
    if len(words)==1 and words[0] in thanks_words:
        return True
    return False
def Thanks_greet():
    message=AIMessage(
        content="You're welcome 😊. Let me know if you need help analyzing your resume or finding skill improvements."
    )
    return {
        "messages":[message]
    }