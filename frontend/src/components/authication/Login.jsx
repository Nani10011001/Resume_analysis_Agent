import React from 'react'
import { Loader, Sparkles } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useAppcontext } from '../../contextapp/Context_app'
import { useState } from 'react'
import {toast} from "react-hot-toast"
const Login = () => {
  const [email,setEmail]=useState("")
    const [password,setPassword]=useState("")
    const [isLoding,setIsLoading]=useState(false)
  
  const {navigate,axios}=useAppcontext()
    const inputHandler=async(e)=>{
      e.preventDefault()
      setIsLoading(true)
      const creditenial={
       
        email,
        password
      }
      try {
        const {data}= await axios.post("/login",creditenial)
        console.log(data)
        if(data.success){
   toast.success(data.message)
   navigate("/upload-resume")
        }
      
localStorage.setItem("token", data.userIdentity)
      } catch (error) {
        console.log(error)
        toast.error(error.response?.data?.message||"login failed")
      }
      finally{
        setIsLoading(false)
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

    <div className='w-1/2 flex justify-center  p-10   gap-20'>
       <div className='shadow-sm shadow-black/30 w-full p-10'>
  <p className='font-bold text-center text-2xl'>Welcome back</p>
  <p className='text-gray-500 my-3'>Log in to continue to your dashboard</p>
<form action=""onSubmit={inputHandler} className=''>
  
  <div  className='flex flex-col gap-2 '>
    <label className='text-sm font-bold' htmlFor="">Email address</label>
    <input type="text"  placeholder='Enter your email'
    value={email}
    onChange={(e)=>setEmail(e.target.value)}
      className='w-full py-2 outline-none border-2 placeholder:p-3 indent-2 border-gray-300 rounded-md mb-3' />
    </div>
<div className='flex flex-col gap-2 '>
  <label className='text-sm font-bold' htmlFor="">password</label>
  <input type="password" 
    value={password}
    onChange={(e)=>setPassword(e.target.value)}
    className='w-full py-2 outline-none border-2 placeholder:p-3 indent-2 border-gray-300 rounded-md mb-3' placeholder='Enter your password' />
</div>
<div>
  <button disabled={isLoding} type='submit' className={`w-full text-white  py-2 rounded-md ${isLoding?"cursor-not-allowed bg-blue-600":"bg-blue-600"} `} >{

isLoding?(<span className='flex justify-center items-center gap-2'>
  <Loader className='animate-spin w-4 h-4'/>
  Login....
</span>):"Login"
}</button></div>
</form>
<div className='text-center mt-4'>
 <p>If you dont't have an account go to <Link to="/signup" className='underline text-blue-600'>Signup</Link></p>
</div>
 </div>
 
    </div>
    </div>
  )
}

export default Login
