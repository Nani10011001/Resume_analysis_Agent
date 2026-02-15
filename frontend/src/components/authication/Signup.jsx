import React from 'react'
import { useState } from 'react'
import axios from "axios"
import toast from 'react-hot-toast'
const Signup = () => {
  const [username,setUsername]=useState("")
  const [email,setEmail]=useState("")
  const [password,setPassword]=useState("")

  const inputHandler=async()=>{
    const creditenial={
      username,
      email,
      password
    }
    try {
      const {data}=axios.post("http://localhost:7000/api/signup",creditenial)
      if(data.success){
 toast.success(data.message)
      }
    } catch (error) {
      console.log(error)
      toast.error(error.message)
    }
  }
  return (
    <div>
      <div>
        <h1>
          create Account
        </h1>
      </div>
    </div>
  )
}

export default Signup
