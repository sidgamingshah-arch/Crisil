import { useTranslation } from 'react-i18next'
import useTransportStore from '../../store/transportStore.js'
import { LoadingSpinner } from '../ui/LoadingSpinner.jsx'
import styles from './JoinRequestModal.module.css'

export function JoinRequestModal({ request, onClose, onSuccess }) {
  const { t } = useTranslation()
  const { joinRequest, joining, error } = useTransportStore()

  async function handleJoin() {
    try {
      await joinRequest(request.id)
      onSuccess?.()
      onClose()
    } catch {
      // error is set in store
    }
  }

  return (
    <>
      <div className="bottom-sheet-overlay" onClick={onClose} />
      <div className="bottom-sheet" role="dialog" aria-modal="true" aria-label={t('transport.join_title')}>
        <div className="bottom-sheet-handle" />

        <h3 className={styles.title}>{t('transport.join_title')}</h3>

        <div className={styles.summary}>
          <div className={styles.row}>
            <span>{t('transport.destination')}</span>
            <strong>{request.destination_name}</strong>
          </div>
          <div className={styles.row}>
            <span>{t('transport.departure')}</span>
            <strong>
              {new Intl.DateTimeFormat(undefined, {
                dateStyle: 'medium',
                timeStyle: 'short',
              }).format(new Date(request.departure_time))}
            </strong>
          </div>
          <div className={styles.row}>
            <span>{t('transport.cost')}</span>
            <strong className={styles.price}>
              {request.currency_code || 'USD'} {Number(request.price_per_person).toFixed(2)}
            </strong>
          </div>
          <div className={styles.row}>
            <span>{t('transport.seats_left')}</span>
            <strong>{request.seats_available}</strong>
          </div>
        </div>

        {error && <p className={styles.error}>{error}</p>}

        <button
          className="btn-primary"
          onClick={handleJoin}
          disabled={joining}
          style={{ marginTop: 'var(--space-4)' }}
        >
          {joining ? <LoadingSpinner size={20} color="#fff" /> : t('transport.confirm_join')}
        </button>
        <button className="btn-secondary" onClick={onClose} style={{ marginTop: 'var(--space-2)' }}>
          {t('common.cancel')}
        </button>
      </div>
    </>
  )
}
