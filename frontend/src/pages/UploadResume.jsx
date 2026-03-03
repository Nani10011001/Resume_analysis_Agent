import React, { useEffect, useState } from 'react'
import NavBar from '../components/NavBar'
import { Upload } from 'lucide-react'
const UploadResume = () => {
  const [pdfUrl,setPdf]=useState(null)
  const handelFileInput=(e)=>{
    const file=e.target.files[0]
    if(file&&file.type==="application/pdf"){
      const url=URL.createObjectURL(file)
      setPdf(url)
    }
   
  }
  useEffect(()=>{
console.log(pdfUrl)
  },[pdfUrl])
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
            
            </div></div>
        </div>
     </div>
    </div>
  )
}

export default UploadResume
