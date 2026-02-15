import axios from "axios"
import { env } from "../../config/ZodValidation.js"

export const pyAgentcon=async(userId,content)=>{
  if(!userId || !content){
    throw new Error("Error occured passing parameter")
  }

    try {
     await axios.post(env.FASTAPI_URL,{userId,content})
    } catch (error) {
        console.error("error at fastApi connting---: ",error)
    }
}