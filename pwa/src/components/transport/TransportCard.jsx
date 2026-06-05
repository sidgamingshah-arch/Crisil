import { useTranslation } from 'react-i18next'
import styles from './TransportCard.module.css'

const TRANSPORT_ICONS = {
  taxi: '🚕',
  bus: '🚌',
  minivan: '🚐',
  private_car: '🚗',
  tuk_tuk: '🛺',
}

function formatTime(iso) {
  return new Intl.DateTimeFormat(undefined, {
    weekday: 'short',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(iso))
}

export function TransportCard({ request, onJoin, onViewDetails }) {
  const { t } = useTranslation()
  const seatsLeft = request.seats_available
  const isFull = seatsLeft <= 0

  return (
    <article className={styles.card} onClick={() => onViewDetails?.(request)}>
      <div className={styles.header}>
        <span className={styles.typeIcon}>
          {TRANSPORT_ICONS[request.transport_type] || '🚗'}
        </span>
        <div className={styles.route}>
          <span className={styles.destination}>{request.destination_name}</span>
          <span className={styles.time}>{formatTime(request.departure_time)}</span>
        </div>
        <div className={styles.priceWrap}>
          <span className={styles.price}>
            {request.currency_code || 'USD'} {Number(request.price_per_person).toFixed(0)}
          </span>
          <span className={styles.perPerson}>{t('transport.per_person')}</span>
        </div>
      </div>

      <div className={styles.footer}>
        <div className={styles.organizer}>
          <img
            className="avatar"
            style={{ width: 28, height: 28 }}
            src={request.organizer_avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(request.organizer_name || 'U')}&size=56&background=0066FF&color=fff`}
            alt={request.organizer_name}
          />
          <span className={styles.organizerName}>{request.organizer_name}</span>
          {request.organizer_rating && (
            <span className={styles.rating}>
              <span className="stars">★</span> {Number(request.organizer_rating).toFixed(1)}
            </span>
          )}
        </div>

        <div className={styles.seats}>
          <span className={[styles.seatsBadge, isFull ? styles.full : ''].join(' ')}>
            {isFull
              ? t('transport.full')
              : t('transport.seats_left', { count: seatsLeft })}
          </span>
          {!isFull && (
            <button
              className={styles.joinBtn}
              onClick={(e) => { e.stopPropagation(); onJoin?.(request) }}
              aria-label={t('transport.join')}
            >
              {t('transport.join')}
            </button>
          )}
        </div>
      </div>
    </article>
  )
}
