import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import styles from './DiscountMeter.module.css'

/**
 * Animates the price from its previous value to the new finalPrice,
 * mirroring Flutter's TweenAnimationBuilder<double> on the discount price.
 * Also shows tier progress bar and "X more to next discount" nudge.
 */
export function DiscountMeter({ preview, loading = false }) {
  const { t } = useTranslation()
  const animFrameRef = useRef(null)
  const [displayPrice, setDisplayPrice] = useState(preview?.finalPrice ?? preview?.originalPrice ?? 0)
  const prevPriceRef = useRef(displayPrice)

  useEffect(() => {
    if (!preview) return
    const from = prevPriceRef.current
    const to = preview.finalPrice
    if (from === to) return

    const DURATION = 600
    const start = performance.now()

    function tick(now) {
      const progress = Math.min((now - start) / DURATION, 1)
      // ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3)
      setDisplayPrice(from + (to - from) * eased)
      if (progress < 1) {
        animFrameRef.current = requestAnimationFrame(tick)
      } else {
        prevPriceRef.current = to
      }
    }

    animFrameRef.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(animFrameRef.current)
  }, [preview?.finalPrice])

  if (loading || !preview) {
    return (
      <div className={styles.skeleton}>
        <div className="skeleton" style={{ height: 40, width: 120, borderRadius: 8 }} />
        <div className="skeleton" style={{ height: 12, width: 160, borderRadius: 4, marginTop: 8 }} />
      </div>
    )
  }

  const hasDiscount = preview.discountPercent > 0
  const totalParticipants = preview.currentParticipants ?? 0
  const maxTierMin = preview.nextTier
    ? preview.nextTier.minParticipants
    : (preview.spotsToNextDiscount != null ? totalParticipants + preview.spotsToNextDiscount : totalParticipants)

  const progressPercent = maxTierMin > 0
    ? Math.min((totalParticipants / maxTierMin) * 100, 100)
    : 100

  return (
    <div className={styles.meter}>
      {/* Price display */}
      <div className={styles.priceRow}>
        <span
          className={[styles.price, hasDiscount ? styles.discounted : ''].join(' ')}
          aria-live="polite"
          aria-label={`${preview.currencyCode} ${displayPrice.toFixed(2)}`}
        >
          {preview.currencyCode}&nbsp;{displayPrice.toFixed(2)}
        </span>

        {hasDiscount && (
          <>
            <span className={styles.strikethrough}>
              {preview.currencyCode}&nbsp;{Number(preview.originalPrice).toFixed(2)}
            </span>
            <span className={styles.discountBadge}>−{preview.discountPercent}%</span>
          </>
        )}
      </div>

      {hasDiscount && (
        <span className={styles.savings}>
          {t('activities.you_save', {
            amount: `${preview.currencyCode} ${Number(preview.savings).toFixed(2)}`,
          })}
        </span>
      )}

      {/* Progress bar toward next tier */}
      {preview.spotsToNextDiscount != null && (
        <div className={styles.progressSection}>
          <div className={styles.progressTrack}>
            <div
              className={styles.progressFill}
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <span className={styles.progressLabel}>
            {t('activities.spots_to_discount', { count: preview.spotsToNextDiscount })}
          </span>
        </div>
      )}

      {preview.spotsToNextDiscount === null && hasDiscount && (
        <span className={styles.maxTier}>{t('activities.max_discount_unlocked')}</span>
      )}
    </div>
  )
}
