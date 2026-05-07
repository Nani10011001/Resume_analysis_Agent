import React from 'react'
import { FileText, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAppcontext } from '../contextapp/Context_app';
import toast from "react-hot-toast"

const NavBar = ({ resumeFileName, onRemoveResume = null, showResume = false }) => {
  const {isLodingAUth,
CheckAuthication,axios,jwtToken,navigate,resumeIdToken,setResumeIdToken,setJwtToken}=useAppcontext()
 
 const logout=async()=>{
try {
  const {data}= await axios.post("/logout")
  if(data.success){
    await CheckAuthication()
    sessionStorage.removeItem("resumId")
    setResumeIdToken("")
    setJwtToken("")
    localStorage.removeItem("token")
    sessionStorage.removeItem("resumeFileName")
    
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
      <div className='flex justify-between items-center px-4 py-3'>
        <Link to="/" className='flex gap-1 items-center cursor-pointer'>
         <span className='bg-blue-600 rounded-xl text-white px-1.5 py-1'> <FileText /></span>
     <span className='font-semibold text-[20px] text-white'>ResumeAgent</span>
        </Link>

        <div className='flex gap-4 font-semibold items-center'>
          {/* Resume Tab */}
          {showResume && resumeIdToken && (
            <div className="flex items-center gap-2 bg-blue-600 border px-3 py-1 rounded-lg">
              <FileText size={16} className="text-blue-200" />
              <span className="text-sm font-medium text-white">{resumeFileName}</span>
              {onRemoveResume && (
                <button
                  onClick={onRemoveResume}
                  className="ml-1 text-white hover:text-gray-800 transition"
                >
                  <X size={14} />
                </button>
              )}
            </div>
          )}

          {/* Upload New Link */}
          {!showResume && resumeIdToken && (
            <Link to="/upload-resume" className='cursor-pointer  hover:bg-blue-600 hover:rounded-md hover:transition-all hover:px-3 py-1 text-white hover:text-white'>Upload New</Link>
          )}

          {/* Logout/Getstarted */}
          {
            jwtToken? 
            <button onClick={logout} className='cursor-pointer text-white hover:bg-blue-600 hover:rounded-md hover:transition-all hover:px-3 py-1 hover:text-white'>Logout</button>
            :<Link to="/signup" className='cursor-pointer hover:bg-blue-600 hover:rounded-md hover:transition-all hover:px-3 py-1 hover:text-white'>Getstarted</Link>
          }
        </div></div>
    </div>
  )
}

export default NavBar
