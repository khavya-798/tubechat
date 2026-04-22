import { useState } from 'react'
import { Loader2 } from 'lucide-react'

function YouTubeIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <rect x="2" y="5" width="20" height="14" rx="4" fill="#e07b39" />
      <polygon points="10,9 16,12 10,15" fill="white" />
    </svg>
  )
}

export default function UrlInput({ onAnalyze }) {
  const [url, setUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const [step, setStep] = useState('')
  const [error, setError] = useState('')

  async function handleSubmit(e) {
    e.preventDefault()
    const trimmed = url.trim()
    if (!trimmed) return
    setError('')
    setStep('Starting...')
    setLoading(true)
    try {
      await onAnalyze(trimmed, (currentStep) => setStep(currentStep))
    } catch (err) {
      setError(err.message || 'Something went wrong')
      setStep('')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ width: '100%', maxWidth: '640px' }}>
      <form onSubmit={handleSubmit} style={{
        display: 'flex',
        alignItems: 'center',
        background: '#1c1c1c',
        border: `1px solid ${loading ? 'var(--orange)' : 'var(--border)'}`,
        borderRadius: '50px',
        padding: '6px 6px 6px 16px',
        gap: '10px',
        transition: 'border-color 0.2s',
      }}>
        <YouTubeIcon />
        <input
          value={url}
          onChange={e => setUrl(e.target.value)}
          placeholder="https://youtube.com/watch?v=..."
          disabled={loading}
          style={{
            flex: 1,
            background: 'transparent',
            border: 'none',
            outline: 'none',
            color: loading ? 'var(--muted)' : 'var(--text)',
            fontSize: '14px',
          }}
        />
        <button
          type="submit"
          disabled={loading || !url.trim()}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            background: loading || !url.trim() ? '#5a3a1a' : 'var(--orange)',
            color: 'white',
            padding: '8px 20px',
            borderRadius: '50px',
            fontWeight: 600,
            fontSize: '14px',
            transition: 'background 0.15s',
            cursor: loading || !url.trim() ? 'not-allowed' : 'pointer',
            whiteSpace: 'nowrap',
          }}
        >
          {loading && <Loader2 size={15} style={{ animation: 'spin 1s linear infinite' }} />}
          {loading ? 'Working...' : 'Analyze →'}
        </button>
      </form>

      {/* Live step indicator */}
      {loading && step && (
        <div style={{
          display: 'flex', alignItems: 'center', gap: '8px',
          justifyContent: 'center', marginTop: '12px',
        }}>
          <span style={{
            width: '7px', height: '7px', borderRadius: '50%',
            background: 'var(--orange)',
            display: 'inline-block',
            animation: 'pulse 1.2s ease-in-out infinite',
          }} />
          <p style={{ color: 'var(--orange-text)', fontSize: '13px', fontWeight: 500 }}>
            {step}
          </p>
        </div>
      )}

      {error && (
        <p style={{ textAlign: 'center', color: '#f87171', fontSize: '12px', marginTop: '10px' }}>
          {error}
        </p>
      )}

      {!loading && !error && (
        <p style={{ textAlign: 'center', color: 'var(--muted)', fontSize: '12px', marginTop: '10px' }}>
          Try a tutorial, lecture, podcast, or talk.
        </p>
      )}

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes pulse { 0%, 100% { opacity: 0.3; transform: scale(0.8); } 50% { opacity: 1; transform: scale(1.2); } }
      `}</style>
    </div>
  )
}
