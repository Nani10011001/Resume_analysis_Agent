import React from 'react'
import { Link } from 'react-router-dom'
const Sub2 = () => {
  return (
    <div  className='bg-blue-600 rounded-md mt-20 text-white h-[250px] flex justify-center items-center'>
      <div className='flex flex-col gap-3'>
        <p className='font-bold text-4xl'>Ready to improve your resume?</p>
        <p>Jion thousands of job seekers who have improved their ATS scores</p>
        <Link to="/signup" className='bg-white cursor-pointer text-semibold hover:scale-102 w-[150px] py-3 rounded-md text-center text-blue-600'>Get Started Now</Link>
      </div>
    </div>
  )
}

export default Sub2
