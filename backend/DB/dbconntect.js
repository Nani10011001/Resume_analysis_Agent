import mongoose from "mongoose";
import { env } from "../config/ZodValidation.js";

const DatabaseConnect=async()=>{
    try {
        await mongoose.connect(env.MONG_URL,{dbName:"resumeAgent"})
        console.log("db connected successfully")
    } catch (error) {
        console.log("error at connection db",error)
        process.exit(1)
    }
}
export default DatabaseConnect