

export const agentController=async(req,res)=>{
  const {userId,content}=req.body
  const file=req.body.file
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