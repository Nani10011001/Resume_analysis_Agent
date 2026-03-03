import axios from "axios"
import { env } from "../../config/ZodValidation.js"
import { success } from "zod"

export const pyAgentcon=async(userId,content)=>{
  if(!userId || !content){
    return res.json({
      success:false,
      message:"is not authroized "
    })
  }

    try {
     await axios.post(env.FASTAPI_URL,{userId,content})
    } catch (error) {
        console.error("error at fastApi connting---: ",error)
    }
}