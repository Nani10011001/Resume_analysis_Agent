from langchain_core.messages import AIMessage
from RA_Agent.Graphs.state import Agent_state
from langsmith import traceable
@traceable(name="greeting_node")
def greeting_node(state: Agent_state) -> dict:
    message = AIMessage(
        content="Hello 👋 I'm ResumeAgent. I can help you with:\n\n"
                "• 📄 Resume review & feedback\n"
                "• 📊 ATS score analysis\n"
                "• 💼 Job search strategy\n"
                "• 🎯 Interview preparation\n"
                "• 💰 Salary negotiation\n\n"
                "Upload your resume or ask me anything to get started."
    )
    return {"messages": [message]}