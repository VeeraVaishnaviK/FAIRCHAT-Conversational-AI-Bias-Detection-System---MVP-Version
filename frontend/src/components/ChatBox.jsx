import { useState, useRef, useEffect } from 'react'
import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || '/api'

export default function ChatBox({ analysisContext }) {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: "Hi! I'm FAIRCHAT, your AI bias expert. 👋\n\nI can help you understand bias analysis results, explain what the numbers mean, and suggest ways to improve fairness.\n\nTry asking me something like:\n• \"What does the bias level mean?\"\n• \"How can I fix the bias in my data?\"\n• \"Explain the fairness score\"",
    },
  ])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef(null)
  const inputRef = useRef(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const quickQuestions = [
    'What does this bias mean?',
    'How can I fix the bias?',
    'Explain the fairness score',
    'Which features are problematic?',
  ]

  const handleSend = async (messageText) => {
    const text = messageText || input.trim()
    if (!text || isLoading) return

    const userMessage = { role: 'user', content: text }
    setMessages((prev) => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    try {
      const response = await axios.post(`${API_URL}/chat`, {
        message: text,
        context: analysisContext || null,
        history: messages.slice(-6).map((m) => ({
          role: m.role,
          content: m.content,
        })),
      })

      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: response.data.response },
      ])
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: "I'm having trouble connecting right now. Please make sure the backend server is running and try again.",
        },
      ])
    } finally {
      setIsLoading(false)
      inputRef.current?.focus()
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="flex flex-col h-full bg-slate-900/20" style={{ minHeight: '600px' }}>
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto px-6 py-8 space-y-6" id="chat-messages">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}
          >
            <div
              className={`max-w-[85%] sm:max-w-[75%] px-5 py-4 rounded-2xl text-[14px] leading-relaxed shadow-sm ${
                msg.role === 'user'
                  ? 'bg-indigo-600 text-white rounded-tr-none'
                  : 'bg-white/5 border border-white/10 text-slate-200 rounded-tl-none'
              }`}
            >
              <div className="flex items-center gap-2 mb-2">
                <span className={`text-[10px] font-black uppercase tracking-widest ${
                  msg.role === 'user' ? 'text-indigo-200' : 'text-indigo-400'
                }`}>
                  {msg.role === 'user' ? 'You' : 'FAIRCHAT'}
                </span>
              </div>
              <div style={{ whiteSpace: 'pre-wrap' }}>{msg.content}</div>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start animate-fade-in">
            <div className="px-6 py-4 rounded-2xl bg-white/5 border border-white/10 rounded-tl-none">
              <div className="flex gap-1.5">
                {[0, 1, 2].map((i) => (
                  <div
                    key={i}
                    className="w-1.5 h-1.5 rounded-full bg-indigo-400/60 animate-bounce"
                    style={{ animationDelay: `${i * 0.15}s` }}
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Questions */}
      <div className="px-6 py-3 flex flex-wrap gap-2 justify-center border-t border-white/5 bg-black/20">
        {quickQuestions.map((q, i) => (
          <button
            key={i}
            onClick={() => handleSend(q)}
            className="px-4 py-2 rounded-full text-[11px] font-bold transition-all duration-300 border border-indigo-500/10 text-indigo-400 hover:bg-indigo-500/10 hover:border-indigo-500/30"
            style={{ background: 'rgba(99, 102, 241, 0.03)' }}
          >
            {q}
          </button>
        ))}
      </div>

      {/* Input Area */}
      <div className="p-6 bg-slate-900/50 border-t border-white/5">
        <div className="max-w-4xl mx-auto flex gap-4">
          <div className="flex-1">
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask about your dataset's fairness..."
              rows="1"
              className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-2xl text-sm outline-none focus:border-indigo-500/50 focus:bg-white/10 transition-all resize-none"
              id="chat-input"
            />
          </div>
          <button
            onClick={() => handleSend()}
            disabled={!input.trim() || isLoading}
            className="btn-primary w-14 h-14 !p-0 flex items-center justify-center !rounded-2xl transition-all"
            id="chat-send-btn"
            style={{ opacity: !input.trim() || isLoading ? 0.4 : 1 }}
          >
            {isLoading ? '...' : '➤'}
          </button>
        </div>
      </div>
    </div>
  )
}
