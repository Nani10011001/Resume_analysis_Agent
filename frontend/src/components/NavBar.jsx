import React from 'react'
import { FileText } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAppcontext } from '../contextapp/Context_app';
import toast from "react-hot-toast"

const NavBar = () => {
  const {isLodingAUth,
CheckAuthication,axios,jwtToken,navigate,setResumeIdToken}=useAppcontext()
 
 const logout=async()=>{
try {
  const {data}= await axios.post("/logout")
  if(data.success){
    await CheckAuthication()
    localStorage.removeItem("resumId")
    setResumeIdToken("")
    localStorage.removeItem("token")
    navigate("/")
    return toast.success("logout successfull")
  }
} catch (error) {
    console.error(error)
  return toast.error(error.response?.data?.message || "server error")

}

 }
  return (
    <div>
      <div className='flex justify-between items-center '>
        <Link to="/" className='flex gap-1 items-center cursor-pointer'>
         <span className='bg-blue-600 rounded-xl text-white px-1.5 py-1'> <FileText /></span>
     <span className='font-semibold text-[20px]'>ResumeAgent</span>
        </Link>
        
        <div className='flex gap-10 font-semibold'>
         
   <Link to="/upload-resume" className='cursor-pointer hover:bg-blue-600 hover:rounded-md hover:transition-all  hover:px-3 py-1 hover:text-white'>Upload</Link>
          
          {
            jwtToken? 
            <button onClick={logout}  className='cursor-pointer hover:bg-blue-600 hover:rounded-md hover:transition-all  hover:px-3 py-1 hover:text-white'>Logout</button>:<Link to="/signup" className='cursor-pointer hover:bg-blue-600 hover:rounded-md hover:transition-all  hover:px-3 py-1 hover:text-white'>Getstarted</Link>
          
          
          }
         </div></div>
    </div>
  )
}

export default NavBar
