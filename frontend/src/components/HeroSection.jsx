import React from 'react'
import { Sparkles } from 'lucide-react';
const HeroSection = () => {
  return (
    <div className='flex flex-col  justify-center items-center mt-32'>
      
    <p className='flex gap-2 bg-blue-50 text-blue-400  px-2 rounded-2xl'>
         <span><Sparkles/></span>Ai powered Analysis</p>

      <div>
        <div className='my-3'>
          <h2 className='text-6xl font-bold'>AI Resume Analyzer</h2>
          <p className='my-4 text-sm text-gray-500 text-center'>Turn your resume into an ATS-optimized, recruiter-ready document in one click.</p>
        </div>

        <div className='flex gap-5'>
          <button className='cursor-pointer bg-blue-600 px-3 py-2 rounded-md text-white hover:scale-102 '>Upload Resume</button>
        <button className=' cursor-pointer border-2 border-gray-400 px-3 py-2 rounded-md  hover:scale-102 '>Try Demo</button>
        </div>
      </div>
    </div>
  )
}

export default HeroSection
