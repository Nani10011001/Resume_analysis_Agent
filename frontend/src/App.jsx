import Home from './pages/Home.jsx'
import React from 'react'
import {Toaster} from "react-hot-toast"
import { Route,Routes } from 'react-router-dom'
import Signup from "../src/components/authication/Signup.jsx"
import Login from './components/authication/Login.jsx'
import RA_Agent from "./pages/RA_Agent.jsx"

import UploadResume from './pages/UploadResume.jsx'

const App = () => {
  return (
    <div className="px-10 py-5 min-h-screen bg-[radial-gradient(ellipse_at_top_left,_#1a0533_0%,_#0d0d0d_60%)] text-white">
      <Toaster/>
 
      <Routes>
        <Route path='/' element={<Home/>} />
        <Route path='/signup' element={<Signup/>} />
        <Route path='/login' element={<Login/>} />
        <Route path='/chat-ui' element={<RA_Agent/>}/>
        <Route path='/upload-resume' element={<UploadResume/>}/>
      </Routes>
    </div>
  )
}

export default App
