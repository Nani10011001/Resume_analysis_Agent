from fastapi import APIRouter, HTTPException
from fastapi.responses import StreamingResponse
from pydantic import BaseModel, ConfigDict, Field
from langchain_core.messages import AIMessage, HumanMessage
from bson import ObjectId
import time, asyncio

from Config.logger import setup_logger
setup_logger()

import logging
logger = logging.getLogger(__name__)

from Graphs.graph_builder import Agent_app


class ChatRequest(BaseModel):
    model_config = ConfigDict(populate_by_name=True)

    userId: str
    content: str
    resume_id: str = Field(alias="resumeId")


# ObjectId Serializer
def serialize_mongo(obj):
    if isinstance(obj, list):
        return [serialize_mongo(i) for i in obj]

    if isinstance(obj, dict):
        return {k: serialize_mongo(v) for k, v in obj.items()}

    if isinstance(obj, ObjectId):
        return str(obj)

    return obj


# Preserve Markdown formatting while streaming
def stream_response(text: str):
    chunk_size = 20

    for i in range(0, len(text), chunk_size):
        yield text[i:i + chunk_size]
        asyncio.sleep(0.02)


chatAgentRouter = APIRouter()


@chatAgentRouter.post("/chat")
async def chat_interface_send(req: ChatRequest):

    userId = req.userId
    resumeId = req.resume_id
    query = req.content

    # No resume uploaded
    if not resumeId or resumeId.strip() == "":
        return StreamingResponse(
            stream_response(
                "Please upload your resume first before asking career questions. "
                "I can only give personalized advice once I can see your resume!"
            ),
            media_type="text/plain"
        )

    try:

        result = await Agent_app.ainvoke({
            "userId": userId,
            "resume_id": resumeId,
            "messages": [
                HumanMessage(content=query)
            ],
            "intent": "",
            "retrieved_text": " ",
            "score": 0,
            "score_breakdown": {},
            "full_text": ""
        })

        # Strip ObjectId from entire result
        result = serialize_mongo(result)

        explanation = result.get("explanation", "")

        if explanation:
            ai_response = explanation

        else:
            messages = result.get("messages", [])

            ai_messages = [
                m for m in messages
                if isinstance(m, AIMessage)
            ]

            ai_response = (
                ai_messages[-1].content
                if ai_messages
                else "Sorry, I couldn't process that."
            )

        return StreamingResponse(
            stream_response(ai_response),
            media_type="text/plain"
        )

    except Exception as e:

        logger.exception("error at agent streaming")

        raise HTTPException(
            status_code=500,
            detail=str(e)
        )