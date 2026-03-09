import React from "react"
import NavBar from "../components/NavBar"
import { Send, Sparkles } from "lucide-react"
import { useState, useEffect, useRef } from "react"
import { useAppcontext } from "../contextapp/Context_app"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"

const RA_Agent = () => {

  const [inputMessage, setInputMessage] = useState("")
  const [message, setMessage] = useState([])
  const [streamResponse, setStreamResponse] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const messagesEndRef = useRef(null)

  const { userId, resumeIdToken } = useAppcontext()

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "auto" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [message, streamResponse, isLoading])

  const inputHandler = async () => {

    if (!inputMessage.trim()) return

    if (!userId || !resumeIdToken) {
      alert("Please upload your resume first")
      return
    }

    setStreamResponse("")
    setIsLoading(true)

    const user = {
      role: "user",
      text: inputMessage
    }

    setMessage((prev) => [...prev, user])
    setInputMessage("")

    try {

      const res = await fetch("http://localhost:7000/api/agent/send", {
        method: "POST",
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
    <div className="flex flex-col h-screen bg-gray-50">

      <NavBar />

      {/* Chat Body */}
      <div className="flex-1 overflow-y-auto flex flex-col">

        <div className="w-full max-w-4xl mx-auto flex-1 flex flex-col space-y-6 px-4 py-8">

          {/* Greeting */}
          {message.length === 0 && (
            <div className="flex items-start gap-3 mb-8">

              <Sparkles size={24} className="text-blue-500 mt-1 flex-shrink-0" />

              <div className="bg-white border border-gray-200 text-gray-800 text-base px-6 py-4 rounded-xl shadow-sm max-w-2xl">
                Hello! I am Resume Agent. I've analyzed your resume and I'm ready to help you improve it.
              </div>

            </div>
          )}

          {/* Chat Messages */}
          {message.map((msg, index) => (

            <div
              key={index}
              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"} gap-3`}
            >

              {msg.role === "ai" && (
                <Sparkles size={24} className="text-blue-500 mt-1 flex-shrink-0" />
              )}

              <div
                className={`relative break-words ${
                  msg.role === "user"
                    ? "bg-blue-500 text-white rounded-3xl rounded-tr-lg px-6 py-3 max-w-2xl"
                    : "bg-white border border-gray-200 text-gray-800 rounded-xl rounded-tl-lg px-6 py-4 max-w-2xl shadow-sm"
                }`}
              >

                {msg.role === "ai" && (
                  <button
                    onClick={() => navigator.clipboard.writeText(msg.text)}
                    className="absolute -top-3 right-2 text-xs bg-gray-100 px-2 py-1 rounded hover:bg-gray-200"
                  >
                    Copy
                  </button>
                )}

                {msg.role === "ai" ? (

                  <div className="prose prose-sm max-w-none break-words">

                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {msg.text.replace(/---/g, "\n\n---\n\n")}
                    </ReactMarkdown>

                  </div>

                ) : (

                  <p className="text-base">{msg.text}</p>

                )}

              </div>

            </div>

          ))}

          {/* Streaming Response */}
          {streamResponse && (

            <div className="flex items-start gap-3">

              <Sparkles size={20} className="text-blue-500 mt-1 flex-shrink-0" />

              <div className="bg-white border border-gray-200 text-gray-800 rounded-xl rounded-tl-lg px-6 py-4 max-w-2xl shadow-sm">

              <div className="prose prose-sm max-w-none break-words
                        prose-h2:text-lg
                        prose-h2:font-semibold
                        prose-ul:list-disc
                        prose-li:ml-4
                        prose-p:text-gray-700">
                        
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {streamResponse}
                  </ReactMarkdown>

                </div>

              </div>

            </div>

          )}

          {/* Loading */}
          {isLoading && !streamResponse && (

            <div className="flex items-start gap-3">

              <Sparkles size={24} className="text-blue-500 mt-1 flex-shrink-0 animate-spin" />

              <div className="bg-white border border-gray-200 text-gray-500 rounded-xl px-6 py-4 max-w-2xl shadow-sm">
                Processing your question...
              </div>

            </div>

          )}

          <div ref={messagesEndRef} />

        </div>

      </div>

      {/* Input Bar */}
      <div className="bg-white border-t border-gray-200 p-6 flex-shrink-0">

        <div className="max-w-4xl mx-auto">

          <div className="relative">

            <input
              value={inputMessage}
              onKeyDown={enterKeyDown}
              onChange={(e) => setInputMessage(e.target.value)}
              disabled={isLoading}
              type="text"
              placeholder="Ask me any question about your resume..."
              className="w-full py-3 pl-5 pr-14 outline-none border border-gray-300 rounded-full placeholder:text-gray-400 bg-gray-50 focus:bg-white focus:border-blue-400 transition disabled:opacity-50 disabled:cursor-not-allowed"
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

      </div>

    </div>
  )

}

export default RA_Agent