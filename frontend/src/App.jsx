import { useState, useEffect } from 'react'
import Sidebar from './components/Sidebar'
import LandingPage from './components/LandingPage'
import ChatPage from './components/ChatPage'
import { API_BASE } from './config'

export default function App() {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [sessions, setSessions] = useState([])
  const [activeSession, setActiveSession] = useState(null)

  useEffect(() => {
    fetch(`${API_BASE}/api/sessions`)
      .then(r => r.json())
      .then(setSessions)
      .catch(() => {})
  }, [])

  async function handleAnalyze(url) {
    const res = await fetch(`${API_BASE}/api/analyze`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url }),
    })
    const text = await res.text()
    const data = text ? JSON.parse(text) : {}
    if (!res.ok) throw new Error(data.detail || `Server error ${res.status}`)

    const newSession = {
      session_id: data.session_id,
      title: data.title,
      created_at: new Date().toISOString(),
    }
    setSessions(prev => [newSession, ...prev])
    setActiveSession(newSession)
  }

  function handleSelectSession(sessionId) {
    const s = sessions.find(s => s.session_id === sessionId)
    if (s) setActiveSession(s)
  }

  function handleNewVideo() {
    setActiveSession(null)
  }

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden', background: 'var(--bg)' }}>
      <Sidebar
        open={sidebarOpen}
        onToggle={() => setSidebarOpen(v => !v)}
        sessions={sessions}
        activeSessionId={activeSession?.session_id}
        onSelectSession={handleSelectSession}
        onNewVideo={handleNewVideo}
      />
      {activeSession
        ? <ChatPage session={activeSession} />
        : <LandingPage onAnalyze={handleAnalyze} />
      }
    </div>
  )
}
