import { success } from "zod"
import { FileController } from "./Atuthication/FileController.js"

import { pyDataSend } from "./pyDataSend.js"

export const agentController=async(req,res)=>{
  const {userId,content}=req.body

    try {
        if(!userId || !content){
           return res.status(400).json({
            success:false,
            message:"userid and content fields are required"
           })
        }
        res.setHeader("Content-Type","text/plain")
        res.setHeader("Cache-Control","no-cache")
        res.setHeader("Connection","keep-alive")
        res.flushHeader?.()
        for await (const chunks of pyDataSend({userId,content})){
  res.write(chunks)
  console.log("agentReply: ",chunks)
        }
        console.log("streaming of data completed")
res.end()
        
    } catch (error) {
        console.error(error)
        return res.status(500).json({
            success:false,
            message:"Internal server error"
        })
    }
}
export const agentFileController=async(req,res)=>{
    const {userId}=req.body
    const file=req.file

    try {
      
const fileUpload= await FileController(userId,file)
console.log(fileUpload)
        res.status(200).json({
            success:true,
            resumeId:fileUpload.resumeId || fileUpload.data?.resumeId
        })
    } catch (error) {
 console.error(error)
 res.status(500).json({
    success:false,
    message:"Internal sever error"
 })
    }
}