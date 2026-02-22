import React from 'react'
import { FileCheck } from 'lucide-react';
import { TrendingUp } from 'lucide-react';
import { Target } from 'lucide-react';
const HeroSub1 = () => {
  return (
    <div className='flex justify-between mt-28'>
      <div className='max-w-1/4 shadow-sm h-[250px] rounded-md hover:scale-102 transition-all cursor-pointer flex flex-col gap-3 p-3 shadow-black'>
        <span className='bg-blue-100 w-10 p-2 rounded-md text-blue-600'><Target/></span>
        <p className='font-semibold text-xl' >ATS Score Analysis</p>
       <div> <p className=' text-gray-600 ' >Get instant feedback on how well
your resume matches Applicant
Tracking Systems with our advanced
AI algorithm</p></div>
      </div>
      <div  className='max-w-1/4 shadow-sm h-[250px] rounded-md hover:scale-102 transition-all cursor-pointer flex flex-col gap-3 p-3 shadow-black'>
        <span className='bg-blue-100 w-10 p-2 rounded-md text-blue-600'><FileCheck/></span>
        <p className='font-semibold text-xl'>Skills Extraction</p>
        <div><p className=' text-gray-600 ' >Automatically identify and extract
key skills and experience from your
resume to highlight your strengths.</p></div>
      </div>
      <div  className='max-w-1/4 shadow-sm h-[250px] rounded-md hover:scale-102 transition-all cursor-pointer flex flex-col gap-3 p-3 shadow-black'>
        <span className='bg-blue-100 w-10 p-2 rounded-md text-blue-600'><TrendingUp/></span>
        <p className='font-semibold text-xl'>improvement Tips</p>
        <div><p className=' text-gray-600 ' >Receive personalized suggestions to
optimize your resume and increase
your chances of landing interviews</p></div>
      </div>
    </div>
  )
}

export default HeroSub1
