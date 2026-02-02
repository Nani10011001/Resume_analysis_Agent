import "./config/dotenv.checking.js"
import express from "express"
import cors from "cors"
import { env } from "./config/ZodValidation.js"
import DatabaseConnect from "./DB/dbconntect.js"
import router from "./router/authrouter.js"
const app=express()

app.use(cors())
app.use(express.json())
app.use("/api",router)
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