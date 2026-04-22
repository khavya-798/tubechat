import AnswerCard from './AnswerCard'

export default function MessageBubble({ message }) {
  const isUser = message.role === 'user'

  if (isUser) {
    return (
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '16px' }}>
        <div style={{
          background: 'var(--orange)',
          color: 'white',
          padding: '10px 16px',
          borderRadius: '18px 18px 4px 18px',
          maxWidth: '70%',
          fontSize: '14px',
          lineHeight: 1.55,
        }}>
          {message.content}
        </div>
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', justifyContent: 'flex-start', marginBottom: '16px' }}>
      <div style={{
        background: 'var(--card-bg)',
        border: '1px solid var(--border)',
        padding: '14px 16px',
        borderRadius: '4px 18px 18px 18px',
        maxWidth: '80%',
        fontSize: '14px',
      }}>
        {message.loading ? (
          <div style={{ display: 'flex', gap: '4px', alignItems: 'center', padding: '4px 0' }}>
            {[0, 1, 2].map(i => (
              <span key={i} style={{
                width: '6px', height: '6px',
                background: 'var(--muted)',
                borderRadius: '50%',
                display: 'inline-block',
                animation: `bounce 1s ease-in-out ${i * 0.15}s infinite`,
              }} />
            ))}
            <style>{`
              @keyframes bounce {
                0%, 80%, 100% { transform: translateY(0); opacity: 0.4; }
                40% { transform: translateY(-5px); opacity: 1; }
              }
            `}</style>
          </div>
        ) : (
          <AnswerCard
            answer={message.content}
            confidence={message.confidence}
            sources={message.sources}
            follow_up={message.follow_up}
          />
        )}
      </div>
    </div>
  )
}
