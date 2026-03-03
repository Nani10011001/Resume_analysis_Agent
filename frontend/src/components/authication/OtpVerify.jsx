import { Mail } from 'lucide-react'
import React from 'react'
import NavBar from '../NavBar'
import { FileText } from 'lucide-react'
import { Link } from 'react-router-dom'
const OtpVerify = () => {
  return (
    <div>
      <div className='flex justify-start'>
         <Link to="/" className='flex gap-1 items-center cursor-pointer'>
         <span className='bg-blue-600 rounded-xl text-white px-1.5 py-1'> <FileText /></span>
     <span className='font-semibold text-[20px]'>ResumeAgent</span>
        </Link>
      </div>
 <div className='flex h-screen w-full'>
  
    <div className='flex px-10 justify-center items-center w-[40%]'>
      <div className='flex flex-col gap-3'>
        <p className='text-4xl font-bold'>Secure Your Account</p>
        <p className='text-sm'>We've sent a verification code to your email. Enter it below to complete
your registration and start optimizing your resume</p>
   <div>
    <div className='flex flex-col gap-1'>
      <p className='text-xl font-bold'>Two-Factor Security</p>
      <p className='text-sm'>Extra layer of protection for your account</p>

    </div>
    <div className='flex flex-col my-2 gap-1'>
      <p className='text-xl font-bold'>
        Email Verification
      </p>
      <p className='text-sm'>
        confirm your identity with a one-time code
      </p>
    </div>
   </div>
      </div>
    </div>
{/*     otpsection */}
 <div className='w-[60%] flex justify-center items-center'>
  
  <div className='shadow-sm shadow-black/30 w-[60%] h-[70%] flex flex-col gap-3  items-center '>
  <div className='mt-6'><span><Mail className='text-blue-600'/></span> </div>
  <div className='flex flex-col items-center gap-2'> <p className='font-bold'>Verify Your Email</p>
  <p className='text-sm text-gray-500'>
    we sent 9-digit verification cod to
  </p>
  {/* email */}
  <div>
    <p className='font-semibold text-sm'>Enter verification code</p>
  </div>
   </div>
  </div>
  </div>    
    </div>
    </div>
   
  )
}

export default OtpVerify
