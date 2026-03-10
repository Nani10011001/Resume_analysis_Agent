import React, { useContext, useEffect, useState } from 'react'
import { createContext } from 'react'
 const AppContext=createContext()
 import axios from 'axios'

 axios.defaults.baseURL=import.meta.env.VITE_BASE_URL
 axios.defaults.withCredentials=true
 //console.log("axios default",import.meta.env.VITE_BASE_URL)

 import { useNavigate } from 'react-router-dom'

export  const Context_app = ({children}) => {
    const navigate=useNavigate()
      const userId=localStorage.getItem("token")
const [resumeIdToken, setResumeIdToken] = useState(
    localStorage.getItem("resumeId") || ""  )
      const [isLodingAUth,setIsLoadingAuth]=useState(false)
      const [jwtToken,setJwtToken]=useState("")
     const CheckAuthication=async()=>{
      try {
        const {data}=await axios.get("/auth-status")
        if(data.success){
setIsLoadingAuth(false)
setJwtToken(data.userId)

        }
      } catch (error) {
        setIsLoadingAuth(false)
        setJwtToken(null)
      }
     }
  
     useEffect(()=>{
CheckAuthication()
     },[])
   const value={
axios,
navigate,
userId,
resumeIdToken,
setResumeIdToken,
isLodingAUth,
CheckAuthication,
jwtToken
   }
  return (
    <AppContext.Provider value={value}>
      {
        children
      }
    </AppContext.Provider>
  )
}



 export  const useAppcontext=()=>{
    return useContext(AppContext)
}
