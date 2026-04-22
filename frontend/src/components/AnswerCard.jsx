import { useState } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'

const confidenceStyle = {
  high: { bg: '#0f2e1a', color: '#4ade80', label: 'High confidence' },
  medium: { bg: '#2e2200', color: '#facc15', label: 'Medium confidence' },
  low: { bg: '#2e0f0f', color: '#f87171', label: 'Low confidence' },
}

export default function AnswerCard({ answer, confidence, sources, follow_up }) {
  const [showSources, setShowSources] = useState(false)
  const conf = confidenceStyle[confidence] || confidenceStyle.medium

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
      <p style={{ lineHeight: 1.65, fontSize: '14px' }}>{answer}</p>

      {/* Confidence badge */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
        <span style={{
          background: conf.bg,
          color: conf.color,
          fontSize: '11px',
          fontWeight: 600,
          padding: '3px 10px',
          borderRadius: '50px',
        }}>{conf.label}</span>

        {sources?.length > 0 && (
          <button
            onClick={() => setShowSources(v => !v)}
            style={{
              display: 'flex', alignItems: 'center', gap: '4px',
              color: 'var(--muted)', fontSize: '11px',
              padding: '3px 8px',
              border: '1px solid var(--border)',
              borderRadius: '50px',
              background: 'transparent',
              transition: 'background 0.15s',
            }}
            onMouseEnter={e => e.currentTarget.style.background = 'var(--card-bg)'}
            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
          >
            {showSources ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
            {sources.length} source{sources.length > 1 ? 's' : ''}
          </button>
        )}
      </div>

      {/* Source excerpts */}
      {showSources && sources?.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          {sources.map((src, i) => (
            <div key={i} style={{
              background: '#111',
              border: '1px solid var(--border)',
              borderLeft: '3px solid var(--orange)',
              borderRadius: '6px',
              padding: '8px 12px',
              fontSize: '12px',
              color: 'var(--text-secondary)',
              lineHeight: 1.6,
              fontStyle: 'italic',
            }}>
              "{src.length > 200 ? src.slice(0, 200) + '…' : src}"
            </div>
          ))}
        </div>
      )}

      {/* Follow-up */}
      {follow_up && (
        <p style={{
          fontSize: '12px',
          color: 'var(--muted)',
          fontStyle: 'italic',
          borderTop: '1px solid var(--border)',
          paddingTop: '8px',
          marginTop: '2px',
        }}>
          💡 {follow_up}
        </p>
      )}
    </div>
  )
}
