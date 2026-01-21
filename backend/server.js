import express from "express"
import dotenv from "dotenv"
dotenv.config()
import cors from "cors"
import DatabaseConnect from "./DB/dbconntect.js"
const app=express()

app.use(cors())

const serverStart=async()=>{

    try {
        app.listen(process.env.PORT,()=>console.log(`server running at${process.env.PORT}`))
     await DatabaseConnect()
    } catch (error) {
        console.log("server starting error",error)
        process.exit(1)
    }
}
serverStart()