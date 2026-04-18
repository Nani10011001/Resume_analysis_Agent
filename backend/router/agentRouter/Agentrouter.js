import express from "express"
import { agentController, agentFileController } from "../../controller/agentController.js"
import { upload } from "../../utils/MulterFile.js"
import { authMiddleware } from "../../middleware/authmiddleware.js"
import { rateLimiting } from "../../RateLimiting/rateLimit.js"
const AgentRouter=express.Router()
AgentRouter.post("/send",rateLimiting,authMiddleware,agentController)
AgentRouter.post("/upload/resume",rateLimiting,authMiddleware,upload.single("file"),agentFileController)
export default AgentRouter