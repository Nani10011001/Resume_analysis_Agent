import "./config/dotenv.checking.js"
import express from "express"
import cors from "cors"
import { env } from "./config/ZodValidation.js"
import DatabaseConnect from "./DB/dbconntect.js"
import router from "./router/authrouter.js"
import cookieParser from "cookie-parser"
import AgentRouter from "./router/agentRouter/Agentrouter.js"
const app=express()

app.use(cors())
app.use(express.json())
app.use(cookieParser())
app.use("/api",router)
app.use("/api/agent",AgentRouter)
const serverStart=async()=>{

    try {
        app.listen(env.PORT,()=>console.log(`server running at${process.env.PORT}`))
     await DatabaseConnect()
    } catch (error) {
        console.log("server starting error",error)
        process.exit(1)
    }
}
serverStart()