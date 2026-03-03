import React from 'react'
import NavBar from '../components/NavBar'
import { Send } from 'lucide-react'
import { Sparkles } from 'lucide-react'
import { useState } from 'react'

const RA_Agent = (e) => {
  const [inputMessage,setInputMessage]=useState('')
  const [message,setMessage]=useState([])
  const [streamResponse,setStreamResponse]=useState('')
  const inputHandler=async()=>{
if(!inputMessage) return 
  const user={
    role:"user",
    text:inputMessage
  }
  
 setMessage((prev)=>[
  ...prev,user
]) 
const res=await fetch("http://localhost:7000/api/send",{
  method:"POST",
  headers:{
    "Content-Type":"application/json"
  },
  body:JSON.stringify(
   {
     userId:"",
    content:""
   }
  )

})
// read the stream code response of it

const reader=res.body.getReader()
const decodeer=new TextDecoder()
// while used because of the streaming response thing if not used only get one chunk
// how it is done each time we loop we get the one in like ("hello world is response")
// for the first time you get the "hello" value=hello done=false(boolen) thing because loop response think still their
// once respnse finished loop break done
let fullChunk=""
while(true){
  const {value,done}=reader.read()
if(done) break
const chunk=decodeer.decode(value,{stream:true})// why we do this means we get Uint8Array(5) [72, 101, 108, 108] 72 → "H"
fullChunk+=chunk
setStreamResponse(fullChunk)
}
const aiMessage={
  role:"ai",
  text:fullChunk
}
setMessage((prev)=>[
  ...prev,aiMessage
])
console.log(message)
setInputMessage("")
  }

  const enterKeyDown=(e)=>{
    

    if(e.key==="Enter"){
      e.preventDefault()
      inputHandler()
    }

  }

  
  return (
    <div className='flex flex-col h-screen'>
      <NavBar/>
      {/*chat body*/}
    
      
        <div className=' w-full  overflow-y-auto flex-1 space-y-4 px-20 py-10'>
          {/* aiMessage */}

<span><Sparkles size={20} className="text-blue-400" /></span>
 <div className="bg-gray-200 text-gray-800 text-sm px-4 py-2 rounded-2xl max-w-md"> Hello! I am Resume Agent. I've analyzed your resume and I'm ready to help you improve it. </div> 


  
 
  {
    message.map((msg,index)=>(
<div key={index} className={`flex ${
msg.role==="user"?"justify-end ":"justify-start border-2 border-gray-300 text-sm px-3 py-2  rounded-bl-2xl rounded-r-2xl "
}`}>
  {
    msg.role==="ai"&&(
        <span><Sparkles size={20} className='text-blue-400'/></span>
    )
  }
  <div  className={`${msg.role==="user"?"bg-blue-500 text-white":"border-2 border-gray-400 "} rounded-br-2xl  px-3 py-2  rounded-l-2xl max-w-md`}>

{msg.text}
     </div> 
      </div>

    ))
    
  }

 </div>
    
     {/*  inputbar */}
     <div className='p-4 mb-5 flex justify-center'>
       <div className=' relative w-[70%]'>
<input
value={inputMessage}
 onKeyDown={enterKeyDown}
onChange={(e)=>setInputMessage(e.target.value)}
 type="text" 
 placeholder='Ask me any question about your resume...'
  className=' w-full py-2 pl-4 pr-12 outline-none border-2 placeholder:text-sm border-gray-300  py-2 indent-3  rounded-2xl placeholder:px-3 placeholder:text-gray-500' />
  <button 
 
  onClick={inputHandler}
  className='absolute top-1/2 right-5 -translate-y-1/2'><Send size={20} className='text-gray-500'/></button>
    </div>
     </div>
     
    </div>
  )
}

export default RA_Agent
