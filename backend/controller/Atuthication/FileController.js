import { success } from "zod"
import FormData from "form-data"
import axios from "axios"
export const FileController=async(userId,file)=>{
    try {
if(!userId){
    
}
        if(!file){
           throw new Error("file is not uploaded")
        }
        const formData=new FormData()
        formData.append("file",file.buffer,{
            filename:file.originalname,
            contentType:file.mimetype
        })
        formData.append("userId",userId)
        const response=await axios.post("http://localhost:7001/upload-resume",formData,{
            headers:formData.getHeaders()
        })
        return response
    } catch (error) {
        console.error(error)
       throw new Error("Error at uploading of file")
    }
}