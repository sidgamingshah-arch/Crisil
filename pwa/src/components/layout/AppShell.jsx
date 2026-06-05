import { Outlet } from 'react-router-dom'
import { useEffect } from 'react'
import { InstallBanner } from '../ui/InstallBanner.jsx'
import { BottomNav } from './BottomNav.jsx'
import { connectSocket } from '../../lib/socket.js'
import useDiscoverStore from '../../store/discoverStore.js'
import useTransportStore from '../../store/transportStore.js'
import useActivitiesStore from '../../store/activitiesStore.js'
import useChatStore from '../../store/chatStore.js'
import styles from './AppShell.module.css'

export function AppShell() {
  useEffect(() => {
    let mounted = true

    async function init() {
      try {
        await connectSocket()
        if (!mounted) return
        // Wire up real-time listeners in every store
        useDiscoverStore.getState().subscribeToSocket()
        useTransportStore.getState().subscribeToSocket()
        useActivitiesStore.getState().subscribeToSocket()
        useChatStore.getState().subscribeToSocket()
      } catch (err) {
        console.warn('[AppShell] Socket init failed:', err.message)
      }
    }

    init()

    return () => {
      mounted = false
      useDiscoverStore.getState().unsubscribeFromSocket()
      useTransportStore.getState().unsubscribeFromSocket()
      useActivitiesStore.getState().unsubscribeFromSocket()
      useChatStore.getState().unsubscribeFromSocket()
    }
  }, [])

  return (
    <div className={styles.shell}>
      <InstallBanner />
      <main className={styles.content}>
        <Outlet />
      </main>
      <BottomNav />
    </div>
  )
}
