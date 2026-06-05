import styles from './TypingIndicator.module.css'

export function TypingIndicator({ names = [] }) {
  if (names.length === 0) return null

  const label = names.length === 1
    ? `${names[0]} is typing…`
    : `${names.slice(0, -1).join(', ')} and ${names[names.length - 1]} are typing…`

  return (
    <div className={styles.row} aria-live="polite" aria-atomic="true">
      <div className={styles.dots}>
        <span /><span /><span />
      </div>
      <span className={styles.label}>{label}</span>
    </div>
  )
}
