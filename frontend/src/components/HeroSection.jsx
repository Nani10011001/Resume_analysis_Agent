import React from 'react'
import {  Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAppcontext } from '../contextapp/Context_app'
const HeroSection = () => {
  const { userId, resumeIdToken } = useAppcontext()
  const tryDemoPath = !userId
    ? '/signup'
    : !resumeIdToken
      ? '/upload-resume'
      : '/chat-ui'
  const tryDemoLabel = !userId
    ? 'Sign up to try'
    : !resumeIdToken
      ? 'Upload resume to try'
      : 'Try Demo'

  return (
    <div className='flex flex-col justify-center items-center mt-16 sm:mt-24 lg:mt-32 px-1'>
      
    <p className='flex items-center gap-2 p-2 px-4 sm:px-6 bg-blue-100/10 text-xs sm:text-sm text-blue-400 rounded-2xl text-center'>
         <span><Sparkles className='w-5'/></span>Powered by 8 Specialized AI Agents</p>

      <div className= "flex flex-col items-center" >
        <div className='my-3'>
          <h2 className='text-4xl sm:text-5xl lg:text-6xl text-center font-bold leading-tight'>Build AI-powered application<br className="hidden sm:block" /> <span className='text-blue-600 text-center'>for resume analysis</span></h2>
          <h3></h3>
          <p className='my-4 text-sm sm:text-base max-w-[600px] mx-auto text-gray-400 text-center'>Meet your all-in-one career assistant. Eight specialized AI agents work together to analyze your resume, identify skill gaps, recommend learning resources, discover career opportunities, and guide your next move.</p>
        </div>

        <div className='flex flex-wrap justify-center gap-3 sm:gap-5'>
          <Link to="/upload-resume" className='cursor-pointer bg-blue-600 px-4 py-2 rounded-md text-white hover:scale-102 '>Upload Resume</Link>
        <Link to={tryDemoPath} className='cursor-pointer border-2 border-gray-400 px-4 py-2 rounded-md hover:scale-102'>{tryDemoLabel}</Link>
        </div>
      </div>
    </div>
  )
}

export default HeroSection
