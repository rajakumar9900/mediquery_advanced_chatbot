import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'

const API_BASE = '/api'

// Braille conversion mapping
const brailleMap = {
  'a': '⠁', 'b': '⠃', 'c': '⠉', 'd': '⠙', 'e': '⠑', 'f': '⠋',
  'g': '⠛', 'h': '⠓', 'i': '⠊', 'j': '⠚', 'k': '⠅', 'l': '⠇',
  'm': '⠍', 'n': '⠝', 'o': '⠕', 'p': '⠏', 'q': '⠟', 'r': '⠗',
  's': '⠎', 't': '⠞', 'u': '⠥', 'v': '⠧', 'w': '⠺', 'x': '⠭',
  'y': '⠽', 'z': '⠵',
  'A': '⠁', 'B': '⠃', 'C': '⠉', 'D': '⠙', 'E': '⠑', 'F': '⠋',
  'G': '⠛', 'H': '⠓', 'I': '⠊', 'J': '⠚', 'K': '⠅', 'L': '⠇',
  'M': '⠍', 'N': '⠝', 'O': '⠕', 'P': '⠏', 'Q': '⠟', 'R': '⠗',
  'S': '⠎', 'T': '⠞', 'U': '⠥', 'V': '⠧', 'W': '⠺', 'X': '⠭',
  'Y': '⠽', 'Z': '⠵',
  '0': '⠚', '1': '⠁', '2': '⠃', '3': '⠉', '4': '⠙', '5': '⠑',
  '6': '⠋', '7': '⠛', '8': '⠓', '9': '⠊',
  ' ': '⠀', '.': '⠲', ',': '⠂', '?': '⠦', '!': '⠖', ':': '⠒',
  ';': '⠆', '-': '⠤', '(': '⠶', ')': '⠶', '"': '⠦', "'": '⠄'
}

const convertToBraille = (text) => {
  console.log("Converting to Braille:", text)
  let converted = ''
  for (let i = 0; i < text.length; i++) {
    const char = text[i]
    if (brailleMap[char]) {
      converted += brailleMap[char]
    } else {
      converted += char
    }
  }
  console.log("Braille result:", converted)
  return converted
}

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
  const [showBraille, setShowBraille] = useState(false)
  const { start, listening, supported } = useSpeechToText()
  const navigate = useNavigate()

  useEffect(() => {
    const onSTT = (e) => setInput(e.detail)
    window.addEventListener('stt-result', onSTT)
    return () => window.removeEventListener('stt-result', onSTT)
  }, [])

  // Load chat history (simplified)
  useEffect(() => {
    // For now, start with empty messages
    setMessages([])
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
    
    // Track user activity (simplified)
    console.log('Chat message sent:', { messageLength: text.length })
    
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
      
      // Save to Firebase (disabled for now)
      console.log('Would save to Firebase:', { message: text, response: reply })
      console.log('Chat response received:', { responseLength: reply.length })
    } catch (e) {
      await typeAppend('Error contacting server.')
      console.log('Chat error:', { error: 'server_error' })
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

  const handleBrailleConversion = () => {
    console.log("Braille conversion clicked, input:", input)
    if (input.trim()) {
      const brailleText = convertToBraille(input)
      console.log("Converted to Braille:", brailleText)
      setInput(brailleText)
    } else {
      console.log("No input text to convert")
    }
  }

  const toggleBrailleView = () => {
    console.log("Toggle Braille view clicked, current state:", showBraille)
    setShowBraille(!showBraille)
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
            <button 
              className="btn !bg-green-600 !text-white" 
              onClick={handleBrailleConversion}
              disabled={!input.trim()}
              title="Convert to Braille"
            >
              🔤 Braille
            </button>
            <button 
              className="btn !bg-purple-600 !text-white" 
              onClick={toggleBrailleView}
              title="Toggle Braille View"
            >
              {showBraille ? '👁️ Text' : '🔤 Braille'}
            </button>
          </div>
          <div className="flex justify-between items-center text-[11px] text-gray-500 mt-2">
            <span>Disclaimer: ⚠️ This is not medical advice. Please consult a doctor.</span>
            <button 
              onClick={() => navigate('/braille-chat')}
              className="text-purple-600 hover:text-purple-800 underline"
            >
              Full Braille Converter
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}


