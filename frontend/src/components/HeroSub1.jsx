import React from 'react'
import { FileCheck } from 'lucide-react';
import { TrendingUp } from 'lucide-react';
import { Target } from 'lucide-react';
const HeroSub1 = () => {
  return (
    <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 mt-16 sm:mt-20 lg:mt-28'>
      <div className='min-w-0 min-h-[220px] shadow-sm/30 shadow-gray-300 rounded-md hover:scale-[1.02] transition-all cursor-pointer flex flex-col gap-3 p-4 shadow-black/30'>
        <span className='bg-blue-100 w-10 p-2 rounded-md text-blue-600'><Target/></span>
        <p className='font-bold text-xl  text-blue-600 ' >ATS Score Analysis</p>
       <div> <p className=' text-white text-sm' >Get instant feedback on how well
your resume matches Applicant
Tracking Systems with our advanced
AI algorithm</p></div>
      </div>
      <div  className='min-w-0 min-h-[220px] shadow-sm/30 shadow-gray-300 rounded-md hover:scale-[1.02] transition-all cursor-pointer flex flex-col gap-3 p-4 shadow-black/30'>
        <span className='bg-blue-100 w-10 p-2 rounded-md text-blue-600'><FileCheck/></span>
        <p className='font-bold text-xl text-blue-600 '>Skills Extraction</p>
        <div><p className=' text-white text-sm' >Automatically identify and extract
key skills and experience from your
resume to highlight your strengths.</p></div>
      </div>
      <div  className='min-w-0 min-h-[220px] shadow-sm/30 shadow-gray-300 rounded-md hover:scale-[1.02] transition-all cursor-pointer flex flex-col gap-3 p-4 shadow-black/30'>
        <span className='bg-blue-100 w-10 p-2 rounded-md text-blue-600'><TrendingUp/></span>
        <p className='font-bold text-xl text-blue-600'>improvement Tips</p>
        <div><p className=' text-white text-sm ' >Receive personalized suggestions to
optimize your resume and increase
your chances of landing interviews</p></div>
      </div>
    </div>
  )
}

export default HeroSub1
