import "./config/dotenv.checking.js"
import express from "express"
import cors from "cors"
import { env } from "./config/ZodValidation.js"
import DatabaseConnect from "./DB/dbconntect.js"
import router from "./router/authrouter.js"
import cookieParser from "cookie-parser"
import AgentRouter from "./router/agentRouter/Agentrouter.js"
import { redisConnect } from "./DB/Redis/redisConnection.js"
const app=express()

const allowedOrigins = [
  process.env.FRONTEND_URL || "http://localhost:3000",
  "http://localhost:5173",
];
app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);

    if (
      allowedOrigins.includes(origin) ||
      origin.endsWith(".vercel.app")
    ) {
      return callback(null, true);
    }

    callback(new Error("Not allowed by CORS"));
  },
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
}));

app.use(express.json())
app.use(cookieParser())
app.get("/health",(req,res)=>{
  res.json({
    statusInfo:"ok"
  })
})
app.use("/api",router)
app.use("/api/agent",AgentRouter)



const serverStart=async()=>{

    try {

     await DatabaseConnect()
     await redisConnect()
    app.listen(env.PORT,()=>console.log(`server running at${process.env.PORT}`))
    } catch (error) {
        console.log("server starting error",error)
        process.exit(1)
    }
}
serverStart()