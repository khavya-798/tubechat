import { MessageSquare, PanelLeft, Plus } from 'lucide-react'

function timeAgo(isoString) {
  const diff = Date.now() - new Date(isoString).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  return `${Math.floor(hrs / 24)}d ago`
}

export default function Sidebar({ open, onToggle, sessions, activeSessionId, onSelectSession, onNewVideo }) {
  return (
    <aside style={{
      width: open ? '300px' : '56px',
      minWidth: open ? '300px' : '56px',
      background: 'var(--sidebar-bg)',
      borderRight: '1px solid var(--border)',
      display: 'flex',
      flexDirection: 'column',
      transition: 'width 0.25s ease, min-width 0.25s ease',
      overflow: 'hidden',
      height: '100%',
    }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        padding: '14px 12px',
        borderBottom: open ? '1px solid var(--border)' : 'none',
        minHeight: '56px',
      }}>
        <button
          onClick={onToggle}
          style={{
            width: '32px', height: '32px',
            borderRadius: '8px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'var(--muted)',
            flexShrink: 0,
            transition: 'background 0.15s',
          }}
          onMouseEnter={e => e.currentTarget.style.background = 'var(--card-bg)'}
          onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
        >
          <PanelLeft size={18} />
        </button>

        {open && (
          <>
            <div style={{
              width: '28px', height: '28px',
              borderRadius: '50%',
              background: 'var(--orange)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0,
            }}>
              <span style={{ fontSize: '14px' }}>✦</span>
            </div>
            <span style={{ fontWeight: 700, fontSize: '15px', whiteSpace: 'nowrap' }}>Tubechat</span>
          </>
        )}
      </div>

      {/* New Video button */}
      <div style={{ padding: open ? '12px' : '8px 10px' }}>
        <button
          onClick={onNewVideo}
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: open ? 'flex-start' : 'center',
            gap: '8px',
            padding: open ? '8px 12px' : '8px',
            border: '1px solid var(--border)',
            borderRadius: '10px',
            color: 'var(--text)',
            background: 'transparent',
            whiteSpace: 'nowrap',
            transition: 'background 0.15s',
          }}
          onMouseEnter={e => e.currentTarget.style.background = 'var(--card-bg)'}
          onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
        >
          <Plus size={16} />
          {open && <span>New video</span>}
        </button>
      </div>

      {/* Recent sessions */}
      {open && sessions.length > 0 && (
        <div style={{ flex: 1, overflowY: 'auto', padding: '0 8px' }}>
          <p style={{
            fontSize: '11px',
            fontWeight: 600,
            color: 'var(--muted)',
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            padding: '8px 6px 6px',
          }}>Recent</p>

          {sessions.map(s => (
            <button
              key={s.session_id}
              onClick={() => onSelectSession(s.session_id)}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '10px',
                padding: '8px 8px',
                borderRadius: '8px',
                background: activeSessionId === s.session_id ? 'var(--card-bg)' : 'transparent',
                textAlign: 'left',
                transition: 'background 0.15s',
                marginBottom: '2px',
              }}
              onMouseEnter={e => { if (activeSessionId !== s.session_id) e.currentTarget.style.background = '#1e1e1e' }}
              onMouseLeave={e => { if (activeSessionId !== s.session_id) e.currentTarget.style.background = 'transparent' }}
            >
              <MessageSquare size={15} style={{ color: 'var(--muted)', flexShrink: 0, marginTop: '2px' }} />
              <div style={{ overflow: 'hidden' }}>
                <p style={{
                  fontSize: '13px',
                  fontWeight: 500,
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  color: 'var(--text)',
                }}>{s.title}</p>
                <p style={{ fontSize: '11px', color: 'var(--muted)', marginTop: '2px' }}>
                  {timeAgo(s.created_at)}
                </p>
              </div>
            </button>
          ))}
        </div>
      )}

      {!open && sessions.length > 0 && (
        <div style={{ padding: '4px 10px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
          {sessions.slice(0, 5).map(s => (
            <button
              key={s.session_id}
              onClick={() => onSelectSession(s.session_id)}
              title={s.title}
              style={{
                width: '36px', height: '36px',
                borderRadius: '8px',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: activeSessionId === s.session_id ? 'var(--card-bg)' : 'transparent',
                color: 'var(--muted)',
                transition: 'background 0.15s',
              }}
              onMouseEnter={e => e.currentTarget.style.background = 'var(--card-bg)'}
              onMouseLeave={e => e.currentTarget.style.background = activeSessionId === s.session_id ? 'var(--card-bg)' : 'transparent'}
            >
              <MessageSquare size={15} />
            </button>
          ))}
        </div>
      )}

      {/* Footer */}
      {open && (
        <div style={{
          padding: '12px 16px',
          borderTop: '1px solid var(--border)',
          color: 'var(--muted)',
          fontSize: '12px',
        }}>
          Ask questions about any YouTube video.
        </div>
      )}
    </aside>
  )
}
