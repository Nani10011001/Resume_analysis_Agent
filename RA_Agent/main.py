from fastapi import FastAPI
from Api.agentApi import chatAgentRouter
from Api.uploadFile import fileAgentRouter
from Config.logger import setup_logger
from contextlib import asynccontextmanager
import os
from dotenv import load_dotenv
load_dotenv()
setup_logger()
import logging
logger = logging.getLogger(__name__)
import uvicorn
app=FastAPI()
app.include_router(chatAgentRouter)
app.include_router(fileAgentRouter)

@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("App started successfully")
    yield
    logger.info("App shutting down")
if __name__ == "__main__":
    port = int(os.environ.get("PORT", 10000))
    uvicorn.run(app, host="0.0.0.0", port=port)
   
    