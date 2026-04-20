from langchain_core.messages import AIMessage
from Graphs.state import Agent_state
from langsmith import traceable
@traceable(name="thanks_node")
def thanks_node(state: Agent_state) -> dict:
    message = AIMessage(
        content="You're welcome 😊 Happy to help!\n\n"
                "If you need anything else, I'm here for:\n\n"
                "• 📄 More resume feedback\n"
                "• 📊 ATS score breakdown\n"
                "• 💼 Job search tips\n"
                "• 🎯 Interview prep\n\n"
                "Just ask anytime!"
    )
    return {"messages": [message]}