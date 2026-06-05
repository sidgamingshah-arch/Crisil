import styles from './LoadingSpinner.module.css'

export function LoadingSpinner({ size = 24, color = 'var(--color-primary)' }) {
  return (
    <span
      className={styles.spinner}
      style={{ width: size, height: size, borderTopColor: color }}
      role="status"
      aria-label="Loading"
    />
  )
}

export function FullPageLoader() {
  return (
    <div className={styles.fullPage}>
      <LoadingSpinner size={40} />
    </div>
  )
}
