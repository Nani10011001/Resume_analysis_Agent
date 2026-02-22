import Home from './pages/Home.jsx'
import React from 'react'
import {Toaster} from "react-hot-toast"
import { Route,Routes } from 'react-router-dom'
import Signup from "../src/components/authication/Signup.jsx"
import Login from './components/authication/Login.jsx'
import RA_Agent from "./pages/RA_Agent.jsx"
const App = () => {
  return (
    <div className="px-10 py-5 min-h-screen bg-gradient-to-br from-gray-100 to-blue-50">
      <Toaster/>
 
      <Routes>
        <Route path='/' element={<Home/>} />
        <Route path='/signup' element={<Signup/>} />
        <Route path='/login' element={<Login/>} />
        <Route path='/chat-ui' element={<RA_Agent/>}/>
      </Routes>
    </div>
  )
}

export default App
