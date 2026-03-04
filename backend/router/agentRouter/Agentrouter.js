import express from "express"
import { agentController, agentFileController } from "../../controller/agentController.js"
import { upload } from "../../utils/MulterFile.js"

const AgentRouter=express.Router()
AgentRouter.post("/send",agentController)
AgentRouter.post("/upload/resume",upload.single("file"),agentFileController)
export default AgentRouter