
import nodemailer from "nodemailer"
import { env } from "../config/ZodValidation.js"

const ClientMailConfig=nodemailer.createTransport(
    {
        service:"gmail",
        auth:{
            user:env.EMAIL_USER,
            pass:env.PASS_KEY
        }
    })

   export  const otpSentEmail=async(email,otp)=>
        {
        const html = `
    <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6;">
      <h2 style="color: #075e54;">🔐 ResumeAgent Verification</h2>
      
      <p>Hi there,</p>
      
      <p>Your one-time password (OTP) to verify your ResumeAgent Web account is:</p>
      
      <h1 style="background: #e0f7fa; color: #000; padding: 10px 20px; display: inline-block; border-radius: 5px; letter-spacing: 2px;">
        ${otp}
      </h1>

      <p><strong>This OTP is valid for the next 3 minutes.</strong> Please do not share this code with anyone.</p>

      <p>If you didn’t request this OTP, please ignore this email.</p>

      <p style="margin-top: 20px;">Thanks & Regards,<br/>ResumeAgent Web Security Team</p>

      <hr style="margin: 30px 0;" />

      <small style="color: #777;">This is an automated message. Please do not reply.</small>
    </div>`
    await ClientMailConfig.sendMail({
        from:`ResumeAgent web ${env.EMAIL_USER}`,
        to:email,
        subject:"ResumeAgent web configuration verification",
        html
    })
    }