
import nodemailer from "nodemailer"
import { env } from "../config/ZodValidation.js"

const ClientMailConfig=nodemailer.createTransport(
    {
        service:"gmail",
        auth:{

            user:env.EMAIL_USER,
            pass:env.PASS_KEY
        },
        
        tls:{
          rejectUnauthorized: false
        }
    })

   export  const SentEmail=async(toEmail)=>
        {
        const html = `<div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6; max-width: 600px; margin: auto;">

  <h2 style="color: #075e54;">🚀 Welcome to ResumeAgent</h2>

  <p>Hi there,</p>

  <p>
    Welcome to <strong>ResumeAgent</strong> — your intelligent AI-powered assistant designed to help you build, analyze, and improve your resume with precision.
  </p>

  <p>
    We're excited to have you on board! With ResumeAgent, you can:
  </p>

  <ul style="padding-left: 20px;">
    <li>📄 Analyze your resume with AI insights</li>
    <li>🎯 Identify skill gaps and improvements</li>
    <li>⚡ Optimize resumes for ATS systems</li>
    <li>📊 Get personalized recommendations</li>
  </ul>

  <p>
    Get started by logging into your account and exploring the features designed to accelerate your career growth.
  </p>

  <div style="text-align: center; margin: 20px 0;">
    <a href="https://resume-analysis-agent-psi.vercel.app" style="background-color: #075e54; color: #fff; padding: 12px 20px; text-decoration: none; border-radius: 5px; font-weight: bold;">
      Get Started
    </a>
  </div>

  <p>
    If you have any questions or need assistance, feel free to reach out to our support team.
  </p>

  <p style="margin-top: 20px;">
    Best Regards,<br/>
    <strong>ResumeAgent Team</strong>
  </p>

  <hr style="margin: 30px 0;" />

  <small style="color: #777;">
    This is an automated message. Please do not reply.
  </small>

</div>`
    await ClientMailConfig.sendMail({
        from:`ResumeAgent web ${env.EMAIL_USER}`,
        to:toEmail,
        subject:"ResumeAgent web configuration verification",
        html
    })
    }