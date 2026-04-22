import { useState, useRef, useEffect } from 'react'
import { Send } from 'lucide-react'
import MessageBubble from './MessageBubble'
import { API_BASE } from '../config'

export default function ChatPage({ session }) {
  const [messages, setMessages] = useState([])
  const [question, setQuestion] = useState('')
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  async function sendQuestion(e) {
    e.preventDefault()
    const q = question.trim()
    if (!q || loading) return
    setQuestion('')

    const userMsg = { role: 'user', content: q, id: Date.now() }
    const pendingMsg = { role: 'bot', loading: true, id: Date.now() + 1 }
    setMessages(prev => [...prev, userMsg, pendingMsg])
    setLoading(true)

    try {
      const res = await fetch(`${API_BASE}/api/ask`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ session_id: session.session_id, question: q }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.detail || 'Request failed')

      setMessages(prev => prev.map(m =>
        m.id === pendingMsg.id
          ? { ...m, loading: false, content: data.answer, confidence: data.confidence, sources: data.sources, follow_up: data.follow_up }
          : m
      ))
    } catch (err) {
      setMessages(prev => prev.map(m =>
        m.id === pendingMsg.id
          ? { ...m, loading: false, content: `Error: ${err.message}`, confidence: 'low', sources: [] }
          : m
      ))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Background glows */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0,
        background: `
          radial-gradient(ellipse at 80% 0%, rgba(90,42,0,0.4) 0%, transparent 50%),
          radial-gradient(ellipse at 100% 100%, rgba(100,20,0,0.3) 0%, transparent 40%)
        `,
      }} />

      {/* Header */}
      <div style={{
        position: 'relative', zIndex: 1,
        padding: '16px 24px',
        borderBottom: '1px solid var(--border)',
        background: 'rgba(12,12,12,0.8)',
        backdropFilter: 'blur(8px)',
      }}>
        <p style={{ fontSize: '13px', color: 'var(--muted)' }}>Chatting about</p>
        <h2 style={{ fontSize: '15px', fontWeight: 600, marginTop: '2px', color: 'var(--text)' }}>
          {session.title}
        </h2>
      </div>

      {/* Messages */}
      <div style={{
        flex: 1, overflowY: 'auto',
        padding: '24px',
        position: 'relative', zIndex: 1,
        display: 'flex', flexDirection: 'column',
      }}>
        {messages.length === 0 && (
          <div style={{
            flex: 1, display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
            color: 'var(--muted)', gap: '8px',
          }}>
            <p style={{ fontSize: '15px', fontWeight: 500, color: 'var(--text-secondary)' }}>Video is ready</p>
            <p style={{ fontSize: '13px' }}>Ask anything about the transcript.</p>
          </div>
        )}
        {messages.map(m => <MessageBubble key={m.id} message={m} />)}
        <div ref={bottomRef} />
      </div>

      {/* Input bar */}
      <div style={{
        position: 'relative', zIndex: 1,
        padding: '16px 24px',
        borderTop: '1px solid var(--border)',
        background: 'rgba(12,12,12,0.9)',
        backdropFilter: 'blur(8px)',
      }}>
        <form onSubmit={sendQuestion} style={{
          display: 'flex', gap: '10px', alignItems: 'center',
          background: '#1c1c1c',
          border: '1px solid var(--border)',
          borderRadius: '50px',
          padding: '8px 8px 8px 18px',
        }}>
          <input
            value={question}
            onChange={e => setQuestion(e.target.value)}
            placeholder="Ask a question about the video..."
            disabled={loading}
            style={{
              flex: 1, background: 'transparent',
              border: 'none', outline: 'none',
              color: 'var(--text)', fontSize: '14px',
            }}
          />
          <button
            type="submit"
            disabled={!question.trim() || loading}
            style={{
              width: '36px', height: '36px',
              borderRadius: '50%',
              background: question.trim() && !loading ? 'var(--orange)' : '#3a2a1a',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: 'white',
              transition: 'background 0.15s',
              cursor: question.trim() && !loading ? 'pointer' : 'not-allowed',
              flexShrink: 0,
            }}
          >
            <Send size={15} />
          </button>
        </form>
      </div>
    </div>
  )
}
