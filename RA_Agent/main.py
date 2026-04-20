from fastapi import FastAPI
from Api.agentApi import chatAgentRouter
from Api.uploadFile import fileAgentRouter
import uvicorn
app=FastAPI()
app.include_router(chatAgentRouter)
app.include_router(fileAgentRouter)
if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=7001)