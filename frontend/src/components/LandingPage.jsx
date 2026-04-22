import UrlInput from './UrlInput'

const features = [
  { title: 'Grounded answers', desc: 'Every answer cites the transcript.' },
  { title: 'Timestamps', desc: 'Jump to the exact moment.' },
  { title: 'Confidence', desc: 'Know how sure the model is.' },
]

function LinkedInIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
      <rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/>
    </svg>
  )
}

function GitHubIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
      <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/>
    </svg>
  )
}

export default function LandingPage({ onAnalyze }) {
  return (
    <div style={{
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
      overflow: 'hidden',
      padding: '40px 24px 24px',
    }}>
      {/* Background glows */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        background: `
          radial-gradient(ellipse at 80% 0%, rgba(90,42,0,0.55) 0%, transparent 55%),
          radial-gradient(ellipse at 100% 100%, rgba(100,20,0,0.45) 0%, transparent 45%)
        `,
      }} />

      <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '28px', width: '100%', flex: 1, justifyContent: 'center' }}>

        {/* Badge */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: '7px',
          background: '#1e1e1e',
          border: '1px solid var(--border)',
          borderRadius: '50px',
          padding: '6px 16px',
          fontSize: '13px',
          color: 'var(--text-secondary)',
        }}>
          <span>✦</span>
          <span>Ask anything about any video</span>
        </div>

        {/* Heading */}
        <div style={{ textAlign: 'center' }}>
          <h1 style={{ fontSize: 'clamp(32px, 5vw, 52px)', fontWeight: 800, lineHeight: 1.15, letterSpacing: '-0.02em' }}>
            Chat with any{' '}
            <span style={{ color: 'var(--orange-text)' }}>YouTube video.</span>
          </h1>
          <p style={{
            marginTop: '16px',
            color: 'var(--text-secondary)',
            fontSize: 'clamp(14px, 2vw, 17px)',
            lineHeight: 1.6,
            maxWidth: '520px',
            margin: '16px auto 0',
          }}>
            Paste a link and get answers grounded in the transcript —<br />
            with timestamps, source excerpts, and a confidence score.
          </p>
        </div>

        {/* URL input */}
        <UrlInput onAnalyze={onAnalyze} />

        {/* Feature cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '12px',
          width: '100%',
          maxWidth: '640px',
          marginTop: '8px',
        }}>
          {features.map(f => (
            <div key={f.title} style={{
              background: 'rgba(26,26,26,0.8)',
              border: '1px solid var(--border)',
              borderRadius: '12px',
              padding: '16px',
            }}>
              <p style={{ fontWeight: 600, fontSize: '13px', marginBottom: '4px' }}>{f.title}</p>
              <p style={{ color: 'var(--muted)', fontSize: '12px', lineHeight: 1.5 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div style={{
        position: 'relative', zIndex: 1,
        marginTop: '32px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '10px',
      }}>
        <p style={{ fontSize: '12px', color: 'var(--muted)' }}>
          Built by <span style={{ color: 'var(--orange-text)', fontWeight: 600 }}>Khavyanjali</span>
        </p>
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          <a
            href="https://www.linkedin.com/in/khavyanjali-gopisetty-019720254/"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'flex', alignItems: 'center', gap: '6px',
              color: 'var(--muted)', fontSize: '12px',
              textDecoration: 'none',
              padding: '5px 12px',
              border: '1px solid var(--border)',
              borderRadius: '50px',
              transition: 'color 0.15s, border-color 0.15s',
            }}
            onMouseEnter={e => { e.currentTarget.style.color = '#0a66c2'; e.currentTarget.style.borderColor = '#0a66c2' }}
            onMouseLeave={e => { e.currentTarget.style.color = 'var(--muted)'; e.currentTarget.style.borderColor = 'var(--border)' }}
          >
            <LinkedInIcon /> LinkedIn
          </a>
          <a
            href="https://github.com/khavya-798"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'flex', alignItems: 'center', gap: '6px',
              color: 'var(--muted)', fontSize: '12px',
              textDecoration: 'none',
              padding: '5px 12px',
              border: '1px solid var(--border)',
              borderRadius: '50px',
              transition: 'color 0.15s, border-color 0.15s',
            }}
            onMouseEnter={e => { e.currentTarget.style.color = '#ffffff'; e.currentTarget.style.borderColor = '#ffffff' }}
            onMouseLeave={e => { e.currentTarget.style.color = 'var(--muted)'; e.currentTarget.style.borderColor = 'var(--border)' }}
          >
            <GitHubIcon /> GitHub
          </a>
        </div>
      </div>
    </div>
  )
}
