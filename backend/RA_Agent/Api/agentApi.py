from fastapi import APIRouter, HTTPException
from fastapi.responses import StreamingResponse
from pydantic import BaseModel, ConfigDict, Field
from langchain_core.messages import AIMessage, HumanMessage
import time

from RA_Agent.Graphs.graph_builder import Agent_app

class ChatRequest(BaseModel):
    model_config = ConfigDict(populate_by_name=True)
    userId:str
    content:str
    resume_id:str = Field(alias="resumeId")


def stream_response(text: str):
    for word in text.split():
        yield word + " "
        time.sleep(0.02)



chatAgentRouter = APIRouter()
@chatAgentRouter.post("/chat")
async def chat_interface_send(req: ChatRequest):
    userId   = req.userId
    resumeId = req.resume_id
    query    = req.content
    
    try:
       
        result = Agent_app.invoke({
            "userId":userId,
            "resume_id":resumeId,
            "messages":[HumanMessage(content=query)],
            "intent":   "",        
            "retrieved_text":" ",
            "signals": {},
            "score":   0,
            "score_breakdown": {},
            "explanation":    "",
            "full_text":""
        })

        # ── Fix: read the right field based on what the graph returned ──
        # Full analysis pipeline  → result["explanation"]
        # Specialist nodes        → result["messages"][-1].content
        # Greeting / thanks / chat→ result["messages"][-1].content

        explanation = result.get("explanation", "")
        if explanation:
            ai_response = explanation
        else:
            # Grab last AIMessage from messages list
            messages = result.get("messages", [])
            ai_messages = [m for m in messages if isinstance(m, AIMessage)]
            ai_response = ai_messages[-1].content if ai_messages else "Sorry, I couldn't process that."

        if not resumeId or resumeId.strip() == "":
            return StreamingResponse(
        stream_response(
            "⚠️ Please upload your resume first before asking career questions. "
            "I can only give personalized advice once I can see your resume!"
        ),
        media_type="text/plain"
    )
        return StreamingResponse(
            stream_response(ai_response),
            media_type="text/plain"
        )

    except Exception as e:
        print("Error:", e)
        raise HTTPException(status_code=500, detail=str(e))
       