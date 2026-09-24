from fastapi import FastAPI
from Api.agentApi import chatAgentRouter
from Api.uploadFile import fileAgentRouter
from Config.logger import setup_logger
from contextlib import asynccontextmanager
import os
from dotenv import load_dotenv
import logging
import uvicorn
from fastapi.middleware.cors import CORSMiddleware
load_dotenv()
setup_logger()

logger = logging.getLogger(__name__)

@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("App started successfully")
    yield
    logger.info("App shutting down")

app = FastAPI(lifespan=lifespan)
Backend_url = os.environ.get("BACKEND_URL", "http://localhost:3000")
app.add_middleware(
    CORSMiddleware,
    allow_origins=[Backend_url],  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],

)
@app.get("/")
def health():
    return {"status": "ok"}
app.include_router(chatAgentRouter)
app.include_router(fileAgentRouter)


if __name__ == "__main__":
    port = int(os.environ.get("PORT", 10000))
    uvicorn.run("main:app", host="0.0.0.0", port=port)