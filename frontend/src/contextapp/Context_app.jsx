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
      const userId=localStorage.getItem("token") || ""
const [resumeIdToken, setResumeIdToken] = useState(() => {
    const storedResumeId = sessionStorage.getItem("resumeId")
    const storedUserId = sessionStorage.getItem("resumeUserId")

    return storedResumeId && storedUserId === userId ? storedResumeId : ""
  })

      const [isLodingAUth,setIsLoadingAuth]=useState(false)
      const [jwtToken,setJwtToken]=useState("")
      const [resumeSessionActive, setResumeSessionActive] = useState(false)

     useEffect(() => {
       const storedResumeId = sessionStorage.getItem("resumeId")
       const storedUserId = sessionStorage.getItem("resumeUserId")
       if (storedResumeId && storedUserId !== userId) {
      sessionStorage.removeItem("resumeId")
      sessionStorage.removeItem("resumeFileName")
      sessionStorage.removeItem("resumeUserId")
       }
     }, [userId])

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

     // Activate resume session when component mounts (user enters chat)
     useEffect(() => {
       if (resumeIdToken) {
         setResumeSessionActive(true)
       }
       
       // Cleanup: deactivate when user leaves
       return () => {
         setResumeSessionActive(false)
       }
     }, [resumeIdToken])

   const value={
axios,
navigate,
userId,
resumeIdToken,
setResumeIdToken,
isLodingAUth,
CheckAuthication,
jwtToken,
setJwtToken,
resumeSessionActive,
setResumeSessionActive
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
