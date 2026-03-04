import React, { useContext } from 'react'
import { createContext } from 'react'
 const AppContext=createContext()
 import axios from 'axios'

 axios.defaults.baseURL=import.meta.env.VITE_BASE_URL
 console.log("axios default",import.meta.env.VITE_BASE_URL)

 import { useNavigate } from 'react-router-dom'
export  const Context_app = ({children}) => {
    const navigate=useNavigate()
      const userId=localStorage.getItem("token")
   const value={
axios,
navigate,
userId
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
