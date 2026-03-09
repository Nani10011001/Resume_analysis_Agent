from typing import TypedDict,Annotated,Any,Dict,Sequence
from langgraph.graph import add_messages
from langchain_core.messages import HumanMessage,BaseMessage,AIMessage

class Agent_state(TypedDict):
    userId:str
    messages:Annotated[Sequence[BaseMessage],add_messages]
    resume_id:str
    retrieved_text: str
    signals: Dict[str, Any]
    score: float
    score_breakdown: Dict[str, Any]
    explanation: str