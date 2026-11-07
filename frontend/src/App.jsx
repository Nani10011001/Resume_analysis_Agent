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
    <div className="min-h-screen overflow-x-hidden bg-slate-950 px-3 py-3 text-white sm:px-5 sm:py-4 lg:px-10 lg:py-5">
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
