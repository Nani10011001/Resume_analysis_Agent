import { FileController } from "./Atuthication/FileController"


export const agentController=async(req,res)=>{
  const {userId,content}=req.body

    try {
        if(!userId || !content){
           return res.status(400).json({
            success:false,
            message:"userid and content fields are required"
           })
        }

        
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
        
    } catch (error) {
        
    }
}