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
    sessionStorage.removeItem("resumeId")
    sessionStorage.removeItem("resumeUserId")
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
    <div className="w-full">
      <div className='flex flex-wrap justify-between items-center gap-3 px-1 py-3 sm:px-4'>
        <Link to="/" className='flex min-w-0 gap-1 items-center cursor-pointer'>
         <span className='shrink-0 bg-blue-600 rounded-xl text-white px-1.5 py-1'> <FileText /></span>
     <span className='truncate font-semibold text-lg sm:text-[20px] text-white'>ResumeAgent</span>
        </Link>

        <div className='flex flex-wrap justify-end gap-2 sm:gap-4 font-semibold items-center'>
          {/* Resume Tab */}
          {showResume && resumeIdToken && (
            <div className="flex min-w-0 max-w-[52vw] sm:max-w-xs items-center gap-2 bg-blue-600 border px-2 sm:px-3 py-1 rounded-lg">
              <FileText size={16} className="text-blue-200" />
              <span className="truncate text-xs sm:text-sm font-medium text-white">{resumeFileName || "Uploaded resume"}</span>
              {onRemoveResume && (
                <button
                  onClick={onRemoveResume}
                  aria-label="Remove resume"
                  className="ml-1 shrink-0 text-white hover:text-gray-800 transition"
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
