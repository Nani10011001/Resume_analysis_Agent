import { success } from "zod"
import FormData from "form-data"
import axios from "axios"
import https from "https"
import { env } from "../../config/ZodValidation.js"

// Allow self-signed certs when connecting to localhost (dev only)
const agent = new https.Agent({ rejectUnauthorized: false });

export const FileController=async(userId,file)=>{
    try {
if(!userId){
   throw new Error("UserId is required")
}
        if(!file){
           throw new Error("file is not uploaded")
        }
        if(file.mimetype!=="application/pdf"){
            throw new Error("Only PDF files are allowed")
        }
        const formData=new FormData()
        formData.append("file",file.buffer,{
            filename:file.originalname,
            contentType:file.mimetype
        })
        
        formData.append("userId",userId)
        const fastApiBaseUrl = env.FASTAPI_URL.replace('/api/chat', '/upload-resume');
        const response=await axios.post(`${fastApiBaseUrl}/upload-resume`,formData,{
            headers:formData.getHeaders(),
            httpsAgent: agent
        })
        return response.data
    } catch (error) {
        console.error("file upload error - details:",error.message, error.response?.data || error)
       throw new Error(`File upload failed: ${error.message}`)
    }
}