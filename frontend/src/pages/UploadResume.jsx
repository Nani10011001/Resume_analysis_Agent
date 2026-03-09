import React, { useEffect, useState } from 'react'

import NavBar from '../components/NavBar'
import { Loader, Upload } from 'lucide-react'
import { useAppcontext } from '../contextapp/Context_app'
import toast from "react-hot-toast"
const UploadResume = () => {
  const [pdf,setPdf]=useState(null)
  const [loading,setLoading]=useState(false)
  const {axios,navigate,userId}=useAppcontext()

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

        const {data} = await axios.post("/agent/upload/resume", formData)
        console.log(data)

        if(data?.success){
          toast.success("File uploaded successfully")
          navigate("/chat-ui")
        } 
        const resumeId=data.resumeId
        localStorage.setItem("resumeId",resumeId)
     
          
      }
       catch (error) {
        console.error("Upload error:", error)
       return  toast.error(error.response?.data?.message || "Upload failed")
      }
      finally{
        setLoading(false)
      }

 

  }

  return (
    <div className='w-full h-full'>
     <NavBar/>
     <div className='flex justify-center h-screen items-center'>
        <div className=''>
            <div><p className='font-bold text-2xl text-center'>Upload Your Resume</p>
            <p className='text-gray-500 text-sm my-3 text-center'>Upload your PDF resume to get instant ATS score analysis</p></div>
            <div className='h-[200px] w-[500px] flex justify-center  items-center border-2 border-dashed  border-gray-400'><div className='text-center w-full'>
            <input type="file"
         accept='application/pdf'
          onChange={(e)=>{
            console.log(e.target.files[0])
            setPdf(e.target.files[0])}}
            id='upload-data' className='hidden ' />
            <label htmlFor="upload-data" className='flex flex-col justify-center items-center'>
              <Upload/>
              </label>
            <p className='my-2 font-semibold text-sm'>Drop your resume here</p>
           
           {pdf && (
<div className='w-full flex justify-center'>
    <div className="mt-4 flex items-center justify-be border rounded-lg p-3 w-1/3 bg-gray-50">

    <div className="flex items-center  gap-2">
      📄
      <p className="text-sm font-medium">{pdf.name}</p>
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
<div className='mt-3'><button disabled={loading}  onClick={handelFileInput} className={`  rounded-md py-2 cursor-pointer hover:scale-102  w-1/3 text-white ${loading?"cursor-not-allowed bg-blue-600 text-white":"bg-blue-600 text-sm "}`}
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
