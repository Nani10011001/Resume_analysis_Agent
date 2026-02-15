import { hash, success } from "zod"
import { User } from "../../DB/authication/user.auth.js"
import jwt from "jsonwebtoken"
import bcrypt from "bcryptjs"
import { env } from "../../config/ZodValidation.js"
import { otpGenerator } from "../../utils/otpGenerator.js"
import { otpSentEmail } from "../../utils/emailService.js"
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

        const otp=otpGenerator()
        await otpSentEmail(email,otp)
        
        const user=await User.create({
            username:username,
            email:email,
            password:hashPassword,
            emailOtp:otp,
         otpExpiry:Date.now()+3*60*1000


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
export const OtpverifyPage=async(req,res)=>{
    const {email,otp}=req.body

    try {
            if(!otp){
        return res.status(400).json({
            success:false,
            message:"OTP is requireed"
        })
    }
    const user=await User.findOne({email})
    if(user.emailOtp!==otp || Date.now()>user.otpExpiry){
        return res.status(400).json({
            sucess:false,
            message:"invalid OTP or OTP is Expired"
        })
    }
    user.emailOtp=null
    user.otpExpiry=null
    await user.save()
    return res.status(200).json({
        success:true,
        message:"OTP is Successfully verified"
    })
    } catch (error) {
       console.error(error)
       return res.status(500).json({
        success:false,
        message:"Internal error"
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