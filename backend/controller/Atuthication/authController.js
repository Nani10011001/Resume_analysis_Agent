import { hash, success } from "zod"
import { User } from "../../DB/authication/user.auth.js"
import jwt from "jsonwebtoken"
import bcrypt from "bcryptjs"
import { env } from "../../config/ZodValidation.js"

export const signUp =async(req,res)=>{
    try {
        const {username,email,password}=req.body
        if(!username|| !email || !password){
            return res.status(400).json({
                success:false,
                message:"all fields are required"
            })
        }
const userAleardyExit=await User.findOne({email})


       
        if(userAleardyExit){
            return res.status(400).json({
                success:false,
         message:"user alreadyexist "
            })
        } 
        const hashPassword=await bcrypt.hash(password,10)

        

        const user=await User.create({
            username:username,
            email:email,
            password:hashPassword,


        })
        
        const jwtToken= jwt.sign({userId:user._id},env.JWT_SECRETE,{expiresIn:"7d"})
        res.cookie("token",jwtToken,{
            httpOnly:true,
            secure:process.env.NODE_ENV==="production",
            sameSite:"strict",
            maxAge:7*24*60*60*1000
       
        }) 
return res.status(200).json({
    success:true,
    message:"signup successfully",
    userDetail:user,
    jsonToken:jwtToken
})
        
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success:false,
            message:error.message,
            errorDetails:"server error at signup "
        })
    }
}
export const Login=async(req,res)=>{
    try {
        const {email,password}=req.body
        if(!email|| !password){
            return res.status(400).json({
                success:false,
                message:"all fields are required"
            })
        }
        const user=await User.findOne({email})
        if(!user){
            return res.status(400).json({
                success:false,
                message:"user does not exist"
            })
        }
        const MatchPassword=bcrypt.compare(password,user.password)
        if(!MatchPassword){
            return res.status(400).json({
                success:false,
                message:"password is invalid"
            })
        }
        return res.status(200).json({
            success:true,
            message:"login successfully"

        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success:false,
            message:error.message
        })
        
    }
}