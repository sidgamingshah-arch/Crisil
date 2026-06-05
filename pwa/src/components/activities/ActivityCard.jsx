import { useTranslation } from 'react-i18next'
import { DiscountMeter } from './DiscountMeter.jsx'
import styles from './ActivityCard.module.css'

export function ActivityCard({ activity, discountPreview, onJoin, onViewDetails }) {
  const { t } = useTranslation()
  const groupSize = activity.current_participants ?? 0
  const maxSize = activity.max_group_size

  return (
    <article className={styles.card} onClick={() => onViewDetails?.(activity)}>
      {activity.image_url && (
        <img className={styles.image} src={activity.image_url} alt={activity.name} loading="lazy" />
      )}

      <div className={styles.body}>
        <div className={styles.header}>
          <h3 className={styles.name}>{activity.name}</h3>
          <span className={styles.category}>{activity.category}</span>
        </div>

        {activity.description && (
          <p className={styles.description}>{activity.description}</p>
        )}

        {/* Live discount meter — re-renders via Socket.io updates */}
        <DiscountMeter
          preview={discountPreview ?? {
            originalPrice: activity.base_price,
            finalPrice: activity.base_price,
            discountPercent: 0,
            savings: 0,
            currencyCode: activity.currency_code || 'USD',
            currentParticipants: groupSize,
            spotsToNextDiscount:
              activity.discount_tiers?.[0]?.min_participants ?? null,
            nextTier: activity.discount_tiers?.[0] ?? null,
          }}
        />

        <div className={styles.footer}>
          <div className={styles.groupInfo}>
            <span className={styles.groupCount}>
              👥 {groupSize} / {maxSize}
            </span>
            <div className={styles.miniProgress}>
              <div
                className={styles.miniProgressFill}
                style={{ width: `${maxSize > 0 ? (groupSize / maxSize) * 100 : 0}%` }}
              />
            </div>
          </div>

          <button
            className={styles.joinBtn}
            onClick={(e) => { e.stopPropagation(); onJoin?.(activity) }}
            disabled={groupSize >= maxSize}
          >
            {groupSize >= maxSize ? t('activities.full') : t('activities.join')}
          </button>
        </div>
      </div>
    </article>
  )
}
