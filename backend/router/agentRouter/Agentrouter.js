import express from "express"
import { agentController, agentFileController } from "../../controller/agentController.js"
import { upload } from "../../utils/MulterFile.js"
import { authMiddleware } from "../../middleware/authmiddleware.js"
import { rateLimiting } from "../RateLimiting/rateLimit.js"
const AgentRouter=express.Router()
AgentRouter.post("/send",rateLimiting,authMiddleware,agentController)
const logSteps = (name) => (req,res,next)=>{
    console.log("upload Debug:",name)
    next()
}
AgentRouter.post("/upload/resume",
    logSteps("request reached upload"),
    rateLimiting,logSteps("passed rate limiting"),authMiddleware,logSteps("passed authmiddleware"),
    upload.single("file"),logSteps("passed multer") ,agentFileController)
export default AgentRouter