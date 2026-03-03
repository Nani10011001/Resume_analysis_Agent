import React from 'react'
import { FileText } from 'lucide-react';
import { Link } from 'react-router-dom';


const NavBar = () => {
  return (
    <div>
      <div className='flex justify-between items-center '>
        <Link to="/" className='flex gap-1 items-center cursor-pointer'>
         <span className='bg-blue-600 rounded-xl text-white px-1.5 py-1'> <FileText /></span>
     <span className='font-semibold text-[20px]'>ResumeAgent</span>
        </Link>
        
        <div className='flex gap-10 font-semibold'>
         
   <Link to="/upload-resume" className='cursor-pointer hover:bg-blue-600 hover:rounded-md hover:transition-all  hover:px-3 py-1 hover:text-white'>Upload</Link>
          
          <Link to="/signup" className=' cursor-pointer hover:bg-blue-600 hover:rounded-md hover:transition-all  hover:px-3 py-1 hover:text-white'>GetStarted</Link>
         </div></div>
    </div>
  )
}

export default NavBar
