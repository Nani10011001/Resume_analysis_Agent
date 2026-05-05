
import https from "https"

import { env } from "../config/ZodValidation.js";
// Allow self-signed certs when connecting to localhost (dev only)
const agent = new https.Agent({ rejectUnauthorized: false });

export async function* pyDataSend({userId,content,resumeId}){

    if(!userId){
     throw new Error("invalid userId please resgister")

    }
    try {
        const res=await fetch(`${process.env.AGENT_URL}/chat`,{
            method:"POST",
            headers:{"Content-Type":"application/json"},
            body:JSON.stringify(
               {
                 userId,
                content,
                resume_id:resumeId
               }
            )
        }).catch(err=>{
            console.log("error at fetch",err)
        })
        if(!res.body){
            throw new Error("no response from the FastApi")

        }
        if (!res.ok) {
      const text = await res.text()
      throw new Error(`fastapi returned ${res.status}: ${text}`)
    }
 const reader=res.body.getReader()
 const decoder=new TextDecoder()
 while(true){

    const {value,done}=await reader.read()

    if(done) break
    const decoded=decoder.decode(value,{stream:true})
    yield decoded
    
 }
    } catch (error) {
        console.error("FastAPI connection error - Full details:", {
            message: error.message,
            stack: error.stack,
            code: error.code
        })
        throw new Error(`FastAPI unavailable: ${error.message}`)
    }
}