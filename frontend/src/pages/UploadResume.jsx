import React, { useEffect, useState } from 'react'

import NavBar from '../components/NavBar'
import { Loader, Upload } from 'lucide-react'
import { useAppcontext } from '../contextapp/Context_app'
import toast from "react-hot-toast"
import axios from 'axios'
const UploadResume = () => {
  const [pdf,setPdf]=useState(null)
  const [loading,setLoading]=useState(false)
  const {navigate,userId, setResumeIdToken}=useAppcontext()

  const handelFileInput=async()=>{

   

    if(!pdf){
      return toast.error("please upload a resume first")
    }
      if (pdf.type !=="application/pdf") {
  return toast.error("Only PDF files allowed")
}
      try {

        setLoading(true)
        const formData=new FormData()
        formData.append("file",pdf)
        formData.append("userId",userId)
    
        const {data} = await axios.post(
          `${import.meta.env.VITE_BASE_URL}/agent/upload/resume`,
          formData,
          { withCredentials: true }
        )
        const resumeId = data?.resumeId
        if (!data?.success || typeof resumeId !== "string" || !resumeId.trim()) {
          throw new Error(data?.message || "Upload did not return a resume ID")
        }

        sessionStorage.setItem("resumeFileName", pdf.name)
        sessionStorage.setItem("resumeId", resumeId)
        sessionStorage.setItem("resumeUserId", userId)
        setResumeIdToken(resumeId)
        toast.success("File uploaded successfully")
        navigate("/chat-ui")
          
      }
       catch (error) {
        console.error("Upload error:", error)
       return  toast.error(error.response?.data?.message || error.message || "Upload failed")
      }
      finally{
        setLoading(false)
      }

 

  }

  return (
    <div className='w-full min-h-[calc(100dvh-1.5rem)]'>
     <NavBar/>
     <div className='flex justify-center min-h-[calc(100dvh-6rem)] items-center px-1 py-8'>
        <div className='w-full max-w-xl'>
            <div><p className='font-bold text-2xl text-center'>Upload Your Resume</p>
            <p className='text-gray-500 text-sm my-3 text-center'>Upload your PDF resume to get instant ATS score analysis</p></div>
            <div className='min-h-[200px] w-full flex justify-center items-center border-2 border-dashed border-gray-400 rounded-lg p-4'><div className='text-center w-full'>
            <input type="file"
         accept='application/pdf'
          onChange={(e)=>{
            console.log(e.target.files[0])
            setPdf(e.target.files[0])}}
            id='upload-data' className='hidden ' />
            <label htmlFor="upload-data" className='flex flex-col justify-center items-center cursor-pointer'>
              <Upload/>
              </label>
            <p className='my-2 font-semibold text-sm'>Choose a PDF resume to upload</p>
           
           {pdf && (
<div className='w-full flex justify-center'>
    <div className="mt-4 flex min-w-0 items-center justify-between gap-3 border rounded-lg p-3 w-full max-w-sm bg-gray-50">

    <div className="flex items-center  gap-2">
      📄
      <p className="min-w-0 truncate text-black text-sm font-medium">{pdf.name}</p>
    </div>

    <button
      onClick={()=>setPdf(null)}
      className="text-red-500 text-sm"
    >
      ✕
    </button>

  </div>
  </div>
)}
<div className='mt-3 px-4'><button disabled={loading} onClick={handelFileInput} className={`rounded-md py-2 cursor-pointer hover:scale-102 w-full sm:w-1/2 text-white ${loading?"cursor-not-allowed bg-blue-600 text-white":"bg-blue-600 text-sm "}`}
> 
{
  loading?(
<span className='flex gap-2 items-center justify-center text-sm gap-2'><Loader  className='w-4 h-4 animate-spin'/>Submiting..</span>
  ):"submit"


}</button></div>
            </div></div>
            
        </div>
     </div>
    </div>
  )
}

export default UploadResume
