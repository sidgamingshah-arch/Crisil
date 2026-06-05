import { useTranslation } from 'react-i18next'
import styles from './NearbyUserCard.module.css'

function formatDistance(meters) {
  if (meters < 1000) return `${Math.round(meters)}m`
  return `${(meters / 1000).toFixed(1)}km`
}

export function NearbyUserCard({ user, onChat, onViewProfile }) {
  const { t } = useTranslation()

  return (
    <div className={styles.card} role="article">
      <button className={styles.avatarBtn} onClick={() => onViewProfile?.(user)} aria-label={`View ${user.name}'s profile`}>
        <img
          className="avatar"
          src={user.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=0066FF&color=fff`}
          alt={user.name}
        />
      </button>

      <div className={styles.info}>
        <div className={styles.nameRow}>
          <span className={styles.name}>{user.name}</span>
          {user.is_verified && <span className={styles.verified} title="Verified">✓</span>}
        </div>

        {user.destination_name && (
          <span className={styles.destination}>📍 {user.destination_name}</span>
        )}

        <div className={styles.meta}>
          {user.rating && (
            <span className={styles.rating}>
              <span className="stars">★</span> {Number(user.rating).toFixed(1)}
            </span>
          )}
          {user.distance_meters != null && (
            <span className={styles.distance}>{formatDistance(user.distance_meters)}</span>
          )}
          {user.languages?.length > 0 && (
            <span className={styles.languages}>{user.languages.slice(0, 2).join(' · ')}</span>
          )}
        </div>
      </div>

      <button
        className={styles.chatBtn}
        onClick={() => onChat?.(user)}
        aria-label={`Chat with ${user.name}`}
      >
        💬
      </button>
    </div>
  )
}
