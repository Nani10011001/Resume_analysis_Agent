import React from 'react'
import { Link } from 'react-router-dom'
const Sub2 = () => {
  return (
    <div className='bg-blue-600 rounded-md mt-12 sm:mt-16 lg:mt-20 mb-4 text-white min-h-[220px] sm:min-h-[250px] flex justify-center items-center p-6 sm:p-8'>
      <div className='flex flex-col items-center sm:items-start gap-3 text-center sm:text-left'>
        <p className='font-bold text-2xl sm:text-3xl lg:text-4xl'>Ready to improve your resume?</p>
        <p className="text-sm sm:text-base">Join thousands of job seekers who have improved their ATS scores</p>
        <Link to="/signup" className='bg-white cursor-pointer font-semibold hover:scale-102 w-full sm:w-[170px] py-3 rounded-md text-center text-blue-600'>Get Started Now</Link>
      </div>
    </div>
  )
}

export default Sub2
