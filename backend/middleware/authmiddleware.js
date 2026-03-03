import jwt from "jsonwebtoken"
import { env } from "../config/ZodValidation"

export const authMiddleware=async(req,res,next)=>{
       const token=req.cookies?.token
        if(!token){
         return res.status(404).json({
            success:false,
            message:"authication token is missing"
         })

        }
       
    try{
     
            const jwtVerifyDecode=jwt.verify(token,env.JWT_SECRETE)
        req.userId=jwtVerifyDecode
        console.log(req.user)
        next()
    }
    catch(error){
console.error(error)
return res.status(500).json({
    success:false,
    message:"Internal server error"
})
    }
}