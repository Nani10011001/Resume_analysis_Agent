
import https from "https"

import { env } from "../config/ZodValidation.js";
// Allow self-signed certs when connecting to localhost (dev only)
const agent = new https.Agent({ rejectUnauthorized: false });

export async function* pyDataSend({userId,content}){

    if(!userId){
     throw new Error("invalid userId please resgister")

    }
    try {
        const res=await fetch(env.FASTAPI_URL,{
            method:"POST",
            headers:{"Content-Type":"application/json"},
            body:JSON.stringify(
               {
                 userId,
                content
               }
            )
        })
        if(!res.body){
            throw new Error("no response from the FastApi")

        }
        if(!res.ok){
            throw new Error(`fastapi returned ${ res.status}:`)
        }
 const reader=res.body.getReader()
 const decoader=new TextDecoder()
 while(true){

    const {value,done}=await reader.read()

    if(done) break
    const decoded=decoader.decode(value,{stream:true})
    yield decoded
    console.log("decode python data response",decoded)
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