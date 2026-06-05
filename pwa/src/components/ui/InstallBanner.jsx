import { useTranslation } from 'react-i18next'
import { useInstallPrompt } from '../../hooks/useInstallPrompt.js'
import styles from './InstallBanner.module.css'

export function InstallBanner() {
  const { t } = useTranslation()
  const { canPrompt, showIOSInstructions, isInstalled, promptInstall } = useInstallPrompt()

  if (isInstalled || (!canPrompt && !showIOSInstructions)) return null

  if (showIOSInstructions) {
    return (
      <div className={styles.banner} role="banner">
        <span className={styles.icon}>📲</span>
        <p className={styles.text}>{t('install.ios_hint')}</p>
        <button className={styles.dismiss} aria-label="Dismiss" onClick={() => {}}>✕</button>
      </div>
    )
  }

  return (
    <div className={styles.banner} role="banner">
      <span className={styles.icon}>🧳</span>
      <div className={styles.copy}>
        <strong>{t('install.title')}</strong>
        <span>{t('install.subtitle')}</span>
      </div>
      <button className={styles.installBtn} onClick={promptInstall}>
        {t('install.cta')}
      </button>
    </div>
  )
}
