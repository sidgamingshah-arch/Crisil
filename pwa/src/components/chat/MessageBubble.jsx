import styles from './MessageBubble.module.css'

function formatTime(iso) {
  return new Intl.DateTimeFormat(undefined, { hour: '2-digit', minute: '2-digit' }).format(new Date(iso))
}

export function MessageBubble({ message, isOwn }) {
  const isLocation = message.type === 'location'
  const isSystem   = message.type === 'system'

  if (isSystem) {
    return (
      <div className={styles.system}>
        <span>{message.content}</span>
      </div>
    )
  }

  return (
    <div className={[styles.row, isOwn ? styles.ownRow : ''].join(' ')}>
      {!isOwn && (
        <img
          className="avatar"
          style={{ width: 28, height: 28, alignSelf: 'flex-end' }}
          src={message.sender_avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(message.sender_name || 'U')}&size=56&background=FF6B35&color=fff`}
          alt={message.sender_name}
        />
      )}

      <div className={[styles.bubble, isOwn ? styles.own : styles.other].join(' ')}>
        {!isOwn && message.sender_name && (
          <span className={styles.senderName}>{message.sender_name}</span>
        )}

        {isLocation ? (
          <a
            className={styles.locationLink}
            href={`https://maps.google.com/?q=${message.content}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            📍 Shared location
          </a>
        ) : (
          <p className={styles.text}>{message.content}</p>
        )}

        <span className={styles.time}>{formatTime(message.created_at)}</span>
      </div>
    </div>
  )
}
