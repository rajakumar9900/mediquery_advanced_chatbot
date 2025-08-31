import { useEffect, useMemo, useRef, useState } from 'react'

const API_BASE = '/api'

function useSpeechToText() {
  const recognitionRef = useRef(null)
  const [listening, setListening] = useState(false)
  const [supported, setSupported] = useState(false)

  useEffect(() => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition
    if (SR) {
      setSupported(true)
      const rec = new SR()
      rec.lang = 'en-US'
      rec.interimResults = false
      rec.continuous = false
      rec.onresult = (e) => {
        const last = e.results[e.results.length - 1]
        const transcript = last[0].transcript
        window.dispatchEvent(new CustomEvent('stt-result', { detail: transcript }))
      }
      rec.onend = () => setListening(false)
      recognitionRef.current = rec
    }
  }, [])

  const start = () => {
    if (recognitionRef.current && !listening) {
      setListening(true)
      recognitionRef.current.start()
    }
  }

  return { start, listening, supported }
}

// TTS disabled per request; keeping placeholder for future use

function MessageBubble({ role, text }) {
  const isUser = role === 'user'
  return (
    <div className={`w-full flex items-start gap-2 ${isUser ? 'justify-end flex-row-reverse' : 'justify-start'} my-1`}>
      <div className="avatar">{isUser ? 'You' : 'AI'}</div>
      <div className={`max-w-[80%] whitespace-pre-wrap rounded-2xl px-4 py-3 text-[15px] leading-relaxed shadow ${isUser ? 'bubble-user' : 'bubble-bot'}`}>{text}</div>
    </div>
  )
}

export default function ChatPage() {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [typingText, setTypingText] = useState('')
  const { start, listening, supported } = useSpeechToText()

  useEffect(() => {
    const onSTT = (e) => setInput(e.detail)
    window.addEventListener('stt-result', onSTT)
    return () => window.removeEventListener('stt-result', onSTT)
  }, [])

  useEffect(() => {
    let raf
    if (typingText) {
      // basic typing animation is handled by how we append, so no-op here
    }
    return () => cancelAnimationFrame(raf)
  }, [typingText])

  const sendMessage = async () => {
    const text = input.trim()
    if (!text || loading) return
    setInput('')
    const next = [...messages, { role: 'user', text }]
    setMessages(next)
    setLoading(true)
    setTypingText('')
    try {
      const res = await fetch(`${API_BASE}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text }),
      })
      const data = await res.json()
      const reply = data.reply || data.error || 'Sorry, no response.'

      // typing animation (TTS currently disabled)
      await typeAppend(reply)
    } catch (e) {
      await typeAppend('Error contacting server.')
    } finally {
      setLoading(false)
    }
  }

  function typeAppend(fullText) {
    return new Promise((resolve) => {
      const tokens = Array.from(fullText)
      let buf = ''
      const step = () => {
        const ch = tokens.shift()
        if (ch !== undefined) {
          buf += ch
          setTypingText(buf)
          requestAnimationFrame(step)
        } else {
          setMessages((m) => [...m, { role: 'assistant', text: buf }])
          setTypingText('')
          resolve()
        }
      }
      step()
    })
  }

  return (
    <div className="h-full">
      <div className="max-w-4xl mx-auto h-full flex flex-col px-4">
        <div className="flex-1 overflow-y-auto py-4 space-y-2">
          {messages.map((m, i) => (
            <MessageBubble key={i} role={m.role} text={m.text} />
          ))}
          {typingText && <MessageBubble role="assistant" text={typingText} />}
        </div>
        <div className="sticky bottom-0 py-3 bg-gradient-to-t from-white/90 dark:from-gray-900/90">
          <div className="card flex items-center gap-2 p-2">
            <input
              className="input flex-1"
              placeholder="Type your medical question..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
            />
            <button className="btn !bg-blue-600 !text-white" onClick={sendMessage} disabled={loading}>Send</button>
            <button className="btn" onClick={start} disabled={!supported || listening}>
              {listening ? 'Listening…' : '🎤 Mic'}
            </button>
          </div>
          <div className="text-[11px] text-gray-500 mt-2">
            Disclaimer: ⚠️ This is not medical advice. Please consult a doctor.
          </div>
        </div>
      </div>
    </div>
  )
}


