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

  // Auto-scroll to bottom when messages change
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

    // Add user message
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
    <div className="flex flex-col h-full" style={{ minHeight: 'calc(100vh - 160px)' }}>
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4" id="chat-messages">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}
          >
            <div
              className="max-w-[80%] sm:max-w-[70%] px-5 py-3.5 rounded-2xl text-sm leading-relaxed"
              style={{
                background:
                  msg.role === 'user'
                    ? 'linear-gradient(135deg, #6366f1, #4f46e5)'
                    : 'rgba(255, 255, 255, 0.05)',
                border:
                  msg.role === 'user'
                    ? 'none'
                    : '1px solid rgba(255, 255, 255, 0.08)',
                color: msg.role === 'user' ? '#ffffff' : '#e2e8f0',
                borderRadius:
                  msg.role === 'user'
                    ? '20px 20px 4px 20px'
                    : '20px 20px 20px 4px',
                boxShadow:
                  msg.role === 'user'
                    ? '0 4px 15px rgba(99, 102, 241, 0.3)'
                    : 'none',
              }}
            >
              {/* Avatar indicator */}
              <div className="flex items-center gap-2 mb-1.5">
                <span className="text-xs font-semibold uppercase tracking-wider" style={{
                  color: msg.role === 'user' ? 'rgba(255,255,255,0.7)' : '#64748b',
                }}>
                  {msg.role === 'user' ? 'You' : '⚖️ FAIRCHAT'}
                </span>
              </div>
              {/* Message content — render newlines */}
              <div style={{ whiteSpace: 'pre-wrap' }}>{msg.content}</div>
            </div>
          </div>
        ))}

        {/* Typing indicator */}
        {isLoading && (
          <div className="flex justify-start animate-fade-in">
            <div
              className="px-5 py-4 rounded-2xl"
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '20px 20px 20px 4px',
              }}
            >
              <div className="flex gap-1.5">
                {[0, 1, 2].map((i) => (
                  <div
                    key={i}
                    className="w-2.5 h-2.5 rounded-full"
                    style={{
                      background: '#6366f1',
                      animation: `typing-dot 1.4s infinite`,
                      animationDelay: `${i * 0.2}s`,
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick Questions */}
      {messages.length <= 1 && (
        <div className="px-4 pb-3">
          <div className="flex flex-wrap gap-2 justify-center">
            {quickQuestions.map((q, i) => (
              <button
                key={i}
                onClick={() => handleSend(q)}
                className="px-4 py-2 rounded-xl text-xs font-medium transition-all duration-200 cursor-pointer"
                style={{
                  background: 'rgba(99, 102, 241, 0.08)',
                  border: '1px solid rgba(99, 102, 241, 0.15)',
                  color: '#818cf8',
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = 'rgba(99, 102, 241, 0.15)'
                  e.target.style.borderColor = 'rgba(99, 102, 241, 0.3)'
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = 'rgba(99, 102, 241, 0.08)'
                  e.target.style.borderColor = 'rgba(99, 102, 241, 0.15)'
                }}
              >
                {q}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input Area */}
      <div className="p-4" style={{
        borderTop: '1px solid rgba(255, 255, 255, 0.06)',
        background: 'rgba(10, 14, 26, 0.5)',
      }}>
        <div className="max-w-4xl mx-auto flex gap-3">
          <div className="flex-1 relative">
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask about bias in your data..."
              rows="1"
              className="w-full px-5 py-3.5 rounded-xl text-sm resize-none outline-none transition-all duration-200"
              id="chat-input"
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                color: '#f1f5f9',
              }}
              onFocus={(e) => {
                e.target.style.borderColor = 'rgba(99, 102, 241, 0.4)'
                e.target.style.boxShadow = '0 0 20px rgba(99, 102, 241, 0.1)'
              }}
              onBlur={(e) => {
                e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)'
                e.target.style.boxShadow = 'none'
              }}
            />
          </div>
          <button
            onClick={() => handleSend()}
            disabled={!input.trim() || isLoading}
            className="btn-primary px-5 py-3.5 rounded-xl text-sm flex-shrink-0"
            id="chat-send-btn"
            style={{
              opacity: !input.trim() || isLoading ? 0.5 : 1,
            }}
          >
            {isLoading ? (
              <span className="animate-spin">⟳</span>
            ) : (
              '➤'
            )}
            Send
          </button>
        </div>
      </div>
    </div>
  )
}
