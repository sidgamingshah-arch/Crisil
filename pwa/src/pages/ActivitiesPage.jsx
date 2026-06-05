import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import useActivitiesStore from '../store/activitiesStore.js'
import useDiscoverStore from '../store/discoverStore.js'
import { ActivityCard } from '../components/activities/ActivityCard.jsx'
import { DiscountMeter } from '../components/activities/DiscountMeter.jsx'
import { LoadingSpinner } from '../components/ui/LoadingSpinner.jsx'
import styles from './ActivitiesPage.module.css'

export default function ActivitiesPage() {
  const { t } = useTranslation()
  const {
    activities,
    discountPreviews,
    loading,
    joining,
    error,
    fetchActivities,
    joinBooking,
    fetchDiscountPreview,
    clearError,
  } = useActivitiesStore()
  const { selectedDestination } = useDiscoverStore()
  const [detailActivity, setDetailActivity] = useState(null)

  useEffect(() => {
    fetchActivities(selectedDestination?.id)
  }, [selectedDestination, fetchActivities])

  async function handleJoin(activity) {
    // In a real flow we'd show booking selection; simplified here
    setDetailActivity(activity)
  }

  return (
    <div className={styles.page}>
      <div className="page-header">
        <h2 className={styles.title}>{t('activities.title')}</h2>
        {selectedDestination && (
          <p className={styles.subtitle}>📍 {selectedDestination.name}</p>
        )}
        <p className={styles.hint}>{t('activities.group_discount_hint')}</p>
      </div>

      <div className="page">
        {loading && !activities.length && (
          <div className={styles.loadingState}>
            <LoadingSpinner size={32} />
          </div>
        )}

        {error && (
          <div className={styles.errorBanner} onClick={clearError}>⚠️ {error}</div>
        )}

        {!loading && activities.length === 0 && (
          <div className={styles.emptyState}>
            <span>🎯</span>
            <p>{t('activities.no_activities')}</p>
          </div>
        )}

        <div className={styles.grid}>
          {activities.map((act) => (
            <ActivityCard
              key={act.id}
              activity={act}
              discountPreview={discountPreviews[act.current_booking_id]}
              onJoin={() => handleJoin(act)}
              onViewDetails={() => setDetailActivity(act)}
            />
          ))}
        </div>
      </div>

      {detailActivity && (
        <ActivityDetailSheet
          activity={detailActivity}
          discountPreview={discountPreviews[detailActivity.current_booking_id]}
          joining={joining}
          onJoin={async (bookingId) => {
            await joinBooking(bookingId)
            await fetchDiscountPreview(bookingId)
          }}
          onClose={() => setDetailActivity(null)}
        />
      )}
    </div>
  )
}

function ActivityDetailSheet({ activity, discountPreview, joining, onJoin, onClose }) {
  const { t } = useTranslation()

  return (
    <>
      <div className="bottom-sheet-overlay" onClick={onClose} />
      <div className="bottom-sheet" role="dialog" aria-modal>
        <div className="bottom-sheet-handle" />

        {activity.image_url && (
          <img
            className={styles.detailImage}
            src={activity.image_url}
            alt={activity.name}
          />
        )}

        <h2 className={styles.detailName}>{activity.name}</h2>
        {activity.description && (
          <p className={styles.detailDesc}>{activity.description}</p>
        )}

        <div className={styles.detailMeta}>
          <span>👥 {activity.min_group_size}–{activity.max_group_size} {t('activities.participants')}</span>
          {activity.duration_hours && (
            <span>⏱ {activity.duration_hours}h</span>
          )}
        </div>

        {/* Live discount meter */}
        <div className={styles.meterWrap}>
          <DiscountMeter preview={discountPreview} />
        </div>

        <div className={styles.tiers}>
          <p className={styles.tiersTitle}>{t('activities.discount_tiers')}</p>
          {(activity.discount_tiers || []).map((tier) => (
            <div key={tier.min_participants} className={styles.tierRow}>
              <span>{tier.min_participants}+ {t('activities.people')}</span>
              <span className={styles.tierDiscount}>−{tier.discount_percent}%</span>
            </div>
          ))}
        </div>

        <button
          className="btn-primary"
          style={{ marginTop: 'var(--space-4)' }}
          disabled={joining}
          onClick={() => activity.current_booking_id && onJoin(activity.current_booking_id)}
        >
          {joining ? <LoadingSpinner size={20} color="#fff" /> : t('activities.join_group')}
        </button>

        <button className="btn-secondary" style={{ marginTop: 'var(--space-2)' }} onClick={onClose}>
          {t('common.close')}
        </button>
      </div>
    </>
  )
}
