import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import useDiscoverStore from '../store/discoverStore.js'
import useAuthStore from '../store/authStore.js'
import { useGeolocation } from '../hooks/useGeolocation.js'
import { NearbyMap } from '../components/discover/NearbyMap.jsx'
import { NearbyUserCard } from '../components/discover/NearbyUserCard.jsx'
import { LoadingSpinner } from '../components/ui/LoadingSpinner.jsx'
import styles from './DiscoverPage.module.css'

export default function DiscoverPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const user = useAuthStore((s) => s.user)
  const {
    nearbyUsers,
    userLocation,
    isSharing,
    loading,
    error,
    fetchNearbyUsers,
    fetchDestinations,
    toggleLocationSharing,
    selectedDestination,
    destinations,
    selectDestination,
    clearError,
  } = useDiscoverStore()

  const [destinationQuery, setDestinationQuery] = useState('')
  const [showDestSearch, setShowDestSearch] = useState(false)
  const [selectedUser, setSelectedUser] = useState(null)

  // Starts GPS watch and feeds userLocation into the store
  useGeolocation({ watch: true })

  useEffect(() => {
    fetchDestinations()
  }, [fetchDestinations])

  useEffect(() => {
    if (userLocation) fetchNearbyUsers()
  }, [userLocation, selectedDestination, fetchNearbyUsers])

  useEffect(() => {
    if (destinationQuery.length > 1) fetchDestinations(destinationQuery)
  }, [destinationQuery, fetchDestinations])

  async function handleStartSharing() {
    await toggleLocationSharing()
    if (!isSharing && userLocation) fetchNearbyUsers()
  }

  function handleChat(targetUser) {
    navigate('/chat', { state: { targetUserId: targetUser.id, targetUserName: targetUser.name } })
  }

  return (
    <div className={styles.page}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.titleRow}>
          <h2 className={styles.title}>{t('discover.title')}</h2>
          <button
            className={[styles.shareToggle, isSharing ? styles.sharing : ''].join(' ')}
            onClick={handleStartSharing}
            aria-pressed={isSharing}
          >
            {isSharing ? `📍 ${t('discover.sharing')}` : `🔒 ${t('discover.not_sharing')}`}
          </button>
        </div>

        {/* Destination filter */}
        <div className={styles.destRow}>
          <button
            className={styles.destChip}
            onClick={() => setShowDestSearch((v) => !v)}
          >
            📍 {selectedDestination?.name || t('discover.all_destinations')}
          </button>
          {selectedDestination && (
            <button
              className={styles.clearDest}
              onClick={() => selectDestination(null)}
              aria-label="Clear destination filter"
            >
              ✕
            </button>
          )}
        </div>

        {showDestSearch && (
          <div className={styles.destSearch}>
            <input
              className="input-field"
              placeholder={t('discover.search_destination')}
              value={destinationQuery}
              onChange={(e) => setDestinationQuery(e.target.value)}
              autoFocus
            />
            <div className={styles.destList}>
              {destinations.map((d) => (
                <button
                  key={d.id}
                  className={styles.destItem}
                  onClick={() => {
                    selectDestination(d)
                    setShowDestSearch(false)
                    setDestinationQuery('')
                  }}
                >
                  <span>📍 {d.name}</span>
                  <span className={styles.destCountry}>{d.country}</span>
                </button>
              ))}
              {destinations.length === 0 && destinationQuery.length > 1 && (
                <p className={styles.noResults}>{t('discover.no_destinations')}</p>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Map */}
      <div className={styles.mapContainer}>
        <NearbyMap onUserSelect={setSelectedUser} />

        {!userLocation && (
          <div className={styles.mapOverlay}>
            <p className={styles.gpsHint}>{t('discover.enable_gps')}</p>
          </div>
        )}
      </div>

      {/* Bottom panel — nearby users list */}
      <div className={styles.bottomPanel}>
        <div className={styles.panelHandle} />
        <div className={styles.panelHeader}>
          <h3 className={styles.panelTitle}>
            {t('discover.nearby_travelers', { count: nearbyUsers.length })}
          </h3>
          {loading && <LoadingSpinner size={16} />}
        </div>

        {error && (
          <p className={styles.error} onClick={clearError}>{error}</p>
        )}

        {!loading && nearbyUsers.length === 0 && userLocation && (
          <p className={styles.emptyState}>{t('discover.no_nearby_users')}</p>
        )}

        <div className={styles.userList}>
          {nearbyUsers.map((u) => (
            <NearbyUserCard
              key={u.id}
              user={u}
              onChat={handleChat}
              onViewProfile={(target) => navigate(`/profile/${target.id}`)}
            />
          ))}
        </div>
      </div>

      {/* Selected user bottom sheet */}
      {selectedUser && (
        <>
          <div className="bottom-sheet-overlay" onClick={() => setSelectedUser(null)} />
          <div className="bottom-sheet">
            <div className="bottom-sheet-handle" />
            <NearbyUserCard
              user={selectedUser}
              onChat={() => { handleChat(selectedUser); setSelectedUser(null) }}
              onViewProfile={() => { navigate(`/profile/${selectedUser.id}`); setSelectedUser(null) }}
            />
          </div>
        </>
      )}
    </div>
  )
}
