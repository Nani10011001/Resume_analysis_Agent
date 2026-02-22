import React from 'react'
import { useState } from 'react'
import axios from "axios"
import toast from 'react-hot-toast'
import { Sparkles } from 'lucide-react'
const Signup = () => {
  const [username,setUsername]=useState("")
  const [email,setEmail]=useState("")
  const [password,setPassword]=useState("")

  const inputHandler=async()=>{
    const creditenial={
      username,
      email,
      password
    }
    try {
      const {data}=axios.post("http://localhost:7000/api/signup",creditenial)
      if(data.success){
 toast.success(data.message)
      }
    } catch (error) {
      console.log(error)
      toast.error(error.message)
    }
  }
  return (
    <div className=' w-full h-full rounded-md flex shadow-sm shadow-black '>
      <div className='max-w-1/2 min-h-screen p-10 flex flex-col gap-20 text-white bg-blue-600'>
<div>       <p className='flex gap-2 items-center font-bold text-2xl'><span className='text-white'>
  <Sparkles/></span> ResumeAgent</p>
  </div>
  
 <div className='flex flex-col gap-7'>
  <div>
<h4 className='uppercase text-3xl font-bold'>Transform your resume with Ai</h4>
  </div>
   <div>
    <p>Join thousands of professionals who have improved their ATS scores and landed their dream jobs with ResumeAgent</p>
    </div>
<div className='bg-gradient-to-br from-20%  from-blue-600/30 to-80% to-white/20 backdrop-blur-lg rounded-xl p-4 shadow-sm shadow-white/50'>
  <div className='flex gap-2 items-center'>
    <div className='bg-white/25 flex justify-center items-center w-[50px] h-[50px] rounded-full'>92
  </div> <div>
    <div className='text-xs'>
      <p>ATS Score</p> <p>Excellent Match</p>
      </div>
    </div>
  </div>
  <div className='my-2'>
  <div>
<div className='flex justify-between text-xs '><p>Skill match</p>
<p className='text-end'>85%</p></div>
<div className="w-full h-2 bg-white/20 rounded-full" >
<div className='w-[85%]  h-full bg-white'></div>
</div>
  </div>
  <div>
    <div className='my-2'>
<div className='flex justify-between text-xs'>
  <p>Experience Level</p>
<p className='text-end'>78%</p>
</div>
<div className="w-full h-2 bg-white/20 rounded-full" >
<div className='w-[78%]  h-full bg-white'></div>
</div>
  </div>
  </div>
  </div>
</div>
 </div>

      </div>

    <div className='max-w-1/2 min-h-screen p-10 flex justify-center  gap-20'>
       <div className='shadow-sm shadow-black max-w-full p-10'>
  <p className='font-bold'>Create account</p>
  <p></p>
<form action="">
  <div><label htmlFor="">Email address</label><input type="text" placeholder='Enter your email' /></div>
</form>
 </div>
    </div>
    </div>
  )
}

export default Signup
