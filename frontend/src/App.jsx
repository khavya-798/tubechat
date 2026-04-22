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
    // Wake the backend (F1 tier sleeps after inactivity)
    fetch(`${API_BASE}/api/health`).catch(() => {})
    fetch(`${API_BASE}/api/sessions`)
      .then(r => r.json())
      .then(setSessions)
      .catch(() => {})
  }, [])

  async function handleAnalyze(url, onProgress) {
    // Start the job — returns immediately with job_id
    const res = await fetch(`${API_BASE}/api/analyze`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url }),
    })
    const text = await res.text()
    const data = text ? JSON.parse(text) : {}
    if (!res.ok) throw new Error(data.detail || `Server error ${res.status}`)

    const { job_id } = data

    // Poll /api/status every 2 seconds until done or error
    return new Promise((resolve, reject) => {
      const interval = setInterval(async () => {
        try {
          const statusRes = await fetch(`${API_BASE}/api/status/${job_id}`)
          const job = await statusRes.json()

          if (onProgress) onProgress(job.step)

          if (job.status === 'done') {
            clearInterval(interval)
            const newSession = {
              session_id: job.session_id,
              title: job.title,
              created_at: new Date().toISOString(),
            }
            setSessions(prev => [newSession, ...prev])
            setActiveSession(newSession)
            resolve()
          } else if (job.status === 'error') {
            clearInterval(interval)
            reject(new Error(job.error || 'Analysis failed'))
          }
        } catch (err) {
          clearInterval(interval)
          reject(err)
        }
      }, 2000)
    })
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
