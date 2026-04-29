import React from "react"
import NavBar from "../components/NavBar"
import { Send, Sparkles, Upload, X } from "lucide-react"
import { useState, useEffect, useRef } from "react"
import { useAppcontext } from "../contextapp/Context_app"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import toast from "react-hot-toast"

const RA_Agent = () => {

  const [inputMessage, setInputMessage] = useState("")
  const [message, setMessage] = useState([])
  const [streamResponse, setStreamResponse] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [selectedFile, setSelectedFile] = useState(null)
  const [showResumeTab, setShowResumeTab] = useState(true)
  const [resumeFileName, setResumeFileName] = useState("Resume.pdf")

  const messagesEndRef = useRef(null)
  const fileInputRef = useRef(null)

  const { userId, resumeIdToken, navigate } = useAppcontext()

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "auto" })
  }
const hasStarted = message.length > 0
  useEffect(() => {
    scrollToBottom()
  }, [message, streamResponse, isLoading])

  useEffect(() => {
    if (!userId || !resumeIdToken) {
      toast.error("Register and upload a resume before trying it")
    }
  }, [userId, resumeIdToken])

  useEffect(() => {
    const storedFileName = sessionStorage.getItem("resumeFileName")
    if (storedFileName) {
      setResumeFileName(storedFileName)
    }
  }, [])

  if (!userId || !resumeIdToken) return null

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedFile(file)
    }
  }

  const handleRemoveFile = () => {
    setSelectedFile(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const inputHandler = async () => {

    if (!inputMessage.trim()) return

   

    setStreamResponse("")
    setIsLoading(true)
  

    const user = {
      role: "user",
      text: inputMessage
    }

    setMessage((prev) => [...prev, user])
    setInputMessage("")

    try {

      const res = await fetch(`${import.meta.env.VITE_BASE_URL}/agent/send`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          userId: userId,
          content: user.text,
          resumeId: resumeIdToken
        })
      })
      

      if (!res.ok) {
        throw new Error(`Server error: ${res.status}`)
      }

      if (!res.body) {
        throw new Error("No response from server")
      }

      const reader = res.body.getReader()
      const decoder = new TextDecoder()

      let fullChunk = ""

      while (true) {

        const { value, done } = await reader.read()

        if (done) break

        const chunk = decoder.decode(value, { stream: true })

        fullChunk += chunk

        setStreamResponse(fullChunk)

      }

      const aiMessage = {
        role: "ai",
        text: fullChunk
      }

      setMessage((prev) => [...prev, aiMessage])

      setStreamResponse("")

    } catch (error) {

      console.error("Chat error:", error)

      const errorMessage = {
        role: "ai",
        text: `Error: ${error.message}`
      }

      setMessage((prev) => [...prev, errorMessage])

      setStreamResponse("")

    } finally {

      setIsLoading(false)
  

    }

  }

  const enterKeyDown = (e) => {

    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      inputHandler()
    }

  }

  return (
    <div className="flex flex-col h-screen bg-[radial-gradient(ellipse_at_top_left,_#1a0533_0%,_#0d0d0d_60%)] text-black">

      <NavBar 
        showResume={showResumeTab}
        resumeFileName={resumeFileName}
        onRemoveResume={() => setShowResumeTab(false)}
      />

      {/* Chat Body */}
      <div className="flex-1 overflow-y-auto flex flex-col">

  <div className="w-full max-w-4xl mx-auto flex-1 flex flex-col space-y-6 px-4 py-8">

    {/* 👇 INITIAL SCREEN */}
    

      {!hasStarted && !isLoading && (
  <div className="flex flex-col items-center justify-center h-full text-center">

    <Sparkles size={40} className="text-blue-500 mb-4" />

    <h1 className="text-4xl font-bold text-blue-700 ">Resume Agent</h1>
    <p className="text-gray-500 mt-2">
      AI-powered resume assistant
    </p>

    {/* INPUT (CENTER) */}
    <div className="mt-6 w-full max-w-xl relative">

      <input
        value={inputMessage}
        onKeyDown={enterKeyDown}
        onChange={(e) => setInputMessage(e.target.value)}
        placeholder="Ask anything about your resume..."
        className="w-full py-3 pl-5 pr-14 border rounded-full text-white bg-gray-800"
      />

      <button
        onClick={inputHandler}
        className="absolute right-4 top-1/2 -translate-y-1/2"
      >
        <Send  className="text-white"size={20} />
      </button>

    </div>

    {/* SUGGESTIONS */}
    <div className="grid grid-cols-3 gap-4 mt-6 w-full max-w-xl">

      {[
        "Review my resume",
        "Find skill gaps",
        "Improve ATS score",
        "Negotiation tips",
        "Career Adivce",
        "interview preparation"
      ].map((item, i) => (

        <div
          key={i}
          onClick={() => setInputMessage(item)}
          className=" cursor-pointer max-w-fit p-3 bg-blue-600 text-white shadow-sm shadow-black/30 rounded-xl hover:shadow-md"
        >
          {item}
        </div>

      ))}

    </div>

  </div>
)}

    {/* 👇 CHAT MESSAGES */}
    {message.map((msg, index) => (
      <div
        key={index}
        className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"} gap-3`}
      >

        {msg.role === "ai" && (
          <Sparkles size={24} className="text-blue-500 mt-1" />
        )}

        <div
          className={`${
            msg.role === "user"
              ? "bg-blue-500 text-white rounded-3xl px-6 py-3 max-w-2xl"
              : " border rounded-xl px-6 py-4 text-white max-w-2xl shadow-sm"
          }`}
        >

          {msg.role === "ai" ? (
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {msg.text}
            </ReactMarkdown>
          ) : (
            msg.text
          )}

        </div>

      </div>
    ))}

    {/* STREAMING */}
    {streamResponse && (
      <div className="flex items-start gap-3">
        <Sparkles size={20} className="text-blue-500 mt-1" />
        <div className=" border rounded-xl px-6 py-4 max-w-2xl  text-white shadow-sm">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {streamResponse}
          </ReactMarkdown>
        </div>
      </div>
    )}

    {/* LOADING */}
    {isLoading && !streamResponse && (
      <div className="flex items-start gap-3">
        <Sparkles className="animate-spin text-blue-500" />
        <div className="text-white border rounded-xl px-6 py-4">
          Thinking...
        </div>
      </div>
    )}

    <div ref={messagesEndRef} />

  </div>
</div>

    {/* 👇 INPUT SECTION */}
    <div className="w-full max-w-4xl mx-auto px-4 pb-6">
      {/* FILE DISPLAY */}
      {selectedFile && (
        <div className="flex items-center justify-between bg-blue-50 border border-blue-200 rounded-lg p-3 mb-3">
          <div className="flex items-center gap-2">
            <Upload size={18} className="text-blue-600" />
            <span className="text-sm font-medium text-blue-900">{selectedFile.name}</span>
          </div>
          <button
            onClick={handleRemoveFile}
            className="text-blue-600 hover:text-blue-800 transition"
          >
            <X size={18} />
          </button>
        </div>
      )}

 
{
  hasStarted&&(<div className="  p-6 flex-shrink-0">

        <div className="max-w-4xl mx-auto">

          <div className="relative">

            <input
              value={inputMessage}
              onKeyDown={enterKeyDown}
              onChange={(e) => setInputMessage(e.target.value)}
              disabled={isLoading}
              type="text"
              placeholder="Ask me any question about your resume..."
              className="w-full py-3 pl-5 pr-14 outline-none border bg-gray-800 border-gray-300 rounded-full placeholder:text-gray-400  focus:bg-gray-700 text-white focus:border-white transition disabled:opacity-50 disabled:cursor-not-allowed"
            />

            <button
              disabled={isLoading}
              onClick={inputHandler}
              className="absolute top-1/2 right-4 -translate-y-1/2 text-gray-400 hover:text-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              <Send size={22} />
            </button>

          </div>

        </div>

      </div>)
}
       
          
      </div>
    </div>


  )

}

export default RA_Agent
