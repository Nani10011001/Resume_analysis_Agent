import React, { useEffect, useState } from 'react'
import NavBar from '../components/NavBar'
import { Loader, Upload } from 'lucide-react'
import { useAppcontext } from '../contextapp/Context_app'
import toast from "react-hot-toast"
const UploadResume = () => {
  const [pdf,setPdf]=useState(null)
  const [loading,setLoading]=useState(null)
  const {axios,navigate,userId}=useAppcontext()
  const handelFileInput=async(e)=>{
    const file=e.target.files[0]
    if(file&&file.type=="application/pdf"){
      setPdf(file)
      
    
      
      try {
        const {data} = await axios.post("/agent/upload/resume", {
          userId,file
        })
        console.log(data)
        if(data?.success){
          toast.success("File uploaded successfully")
          navigate("/chat-ui")
        }
      } catch (error) {
        console.error("Upload error:", error)
        toast.error(error.response?.data?.message || "Upload failed")
      }
    }
    else{
      toast.error("Only PDF files allowed")
    }
   
  }

  return (
    <div className='w-full h-full'>
     <NavBar/>
     <div className='flex justify-center h-screen items-center'>
        <div className=''>
            <div><p className='font-bold text-2xl text-center'>Upload Your Resume</p>
            <p className='text-gray-500 text-sm my-3 text-center'>Upload your PDF resume to get instant ATS score analysis</p></div>
            <div className='h-[200px] w-[500px] flex justify-center  items-center border-2 border-dashed  border-gray-400'><div className='text-center'>
            <input type="file"
            onChange={handelFileInput}
            id='upload-data' className='hidden ' />
            <label htmlFor="upload-data" className='flex flex-col justify-center items-center'><Upload/></label>
            <p className='my-2 font-semibold text-sm'>Drop your resume here</p>
           
           {pdf && (
  <div className="mt-4 flex items-center justify-between border rounded-lg p-3 w-[300px] bg-gray-50">

    <div className="flex items-center gap-2">
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
)}
<div className='mt-3'><button  onClick={handle} className=' bg-blue-600 rounded-md py-2 w-full text-white'> 
  {
    <Loader/>
  }</button></div>
            </div></div>
            
        </div>
     </div>
    </div>
  )
}

export default UploadResume
