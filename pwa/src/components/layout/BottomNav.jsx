import { NavLink } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import useChatStore from '../../store/chatStore.js'
import styles from './BottomNav.module.css'

const NAV_ITEMS = [
  { to: '/discover',    label: 'nav.discover',   icon: '🗺️' },
  { to: '/transport',   label: 'nav.transport',  icon: '🚌' },
  { to: '/activities',  label: 'nav.activities', icon: '🎯' },
  { to: '/chat',        label: 'nav.chat',       icon: '💬', badge: true },
  { to: '/profile',     label: 'nav.profile',    icon: '👤' },
]

export function BottomNav() {
  const { t } = useTranslation()
  const unreadCounts = useChatStore((s) => s.unreadCounts)
  const totalUnread = Object.values(unreadCounts).reduce((sum, n) => sum + n, 0)

  return (
    <nav className={styles.nav} aria-label="Main navigation">
      {NAV_ITEMS.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          className={({ isActive }) =>
            [styles.item, isActive ? styles.active : ''].join(' ')
          }
          aria-label={t(item.label)}
        >
          <span className={styles.iconWrap}>
            {item.icon}
            {item.badge && totalUnread > 0 && (
              <span className={styles.badge}>
                {totalUnread > 99 ? '99+' : totalUnread}
              </span>
            )}
          </span>
          <span className={styles.label}>{t(item.label)}</span>
        </NavLink>
      ))}
    </nav>
  )
}
