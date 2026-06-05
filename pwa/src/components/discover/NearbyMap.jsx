import { useCallback } from 'react'
import { GoogleMap, useLoadScript, MarkerF, CircleF } from '@react-google-maps/api'
import useDiscoverStore from '../../store/discoverStore.js'
import styles from './NearbyMap.module.css'
import { LoadingSpinner } from '../ui/LoadingSpinner.jsx'

const MAP_CONTAINER_STYLE = { width: '100%', height: '100%' }

const MAP_OPTIONS = {
  disableDefaultUI: true,
  zoomControl: false,
  gestureHandling: 'greedy',
  styles: [
    { featureType: 'poi', elementType: 'labels', stylers: [{ visibility: 'off' }] },
    { featureType: 'transit', stylers: [{ visibility: 'simplified' }] },
  ],
}

export function NearbyMap({ onUserSelect }) {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '',
    libraries: ['places'],
  })

  const nearbyUsers = useDiscoverStore((s) => s.nearbyUsers)
  const userLocation = useDiscoverStore((s) => s.userLocation)
  const radiusMeters = useDiscoverStore((s) => s.radiusMeters)

  const center = userLocation
    ? { lat: userLocation.latitude, lng: userLocation.longitude }
    : { lat: 48.8566, lng: 2.3522 } // Paris fallback

  const onMapLoad = useCallback(() => {}, [])

  if (loadError) {
    return (
      <div className={styles.error}>
        Map unavailable. Check your API key.
      </div>
    )
  }

  if (!isLoaded) {
    return (
      <div className={styles.loading}>
        <LoadingSpinner size={32} />
      </div>
    )
  }

  return (
    <GoogleMap
      mapContainerStyle={MAP_CONTAINER_STYLE}
      center={center}
      zoom={15}
      options={MAP_OPTIONS}
      onLoad={onMapLoad}
    >
      {/* Self marker */}
      {userLocation && (
        <MarkerF
          position={center}
          icon={{
            path: window.google.maps.SymbolPath.CIRCLE,
            scale: 10,
            fillColor: '#0066FF',
            fillOpacity: 1,
            strokeColor: '#FFFFFF',
            strokeWeight: 3,
          }}
          title="You"
          zIndex={10}
        />
      )}

      {/* Radius circle */}
      {userLocation && (
        <CircleF
          center={center}
          radius={radiusMeters}
          options={{
            strokeColor: '#0066FF',
            strokeOpacity: 0.3,
            strokeWeight: 1,
            fillColor: '#0066FF',
            fillOpacity: 0.06,
          }}
        />
      )}

      {/* Nearby users */}
      {nearbyUsers.map((user) => (
        <MarkerF
          key={user.id}
          position={{ lat: user.latitude, lng: user.longitude }}
          icon={{
            path: window.google.maps.SymbolPath.CIRCLE,
            scale: 8,
            fillColor: '#FF6B35',
            fillOpacity: 1,
            strokeColor: '#FFFFFF',
            strokeWeight: 2,
          }}
          title={user.name}
          onClick={() => onUserSelect?.(user)}
        />
      ))}
    </GoogleMap>
  )
}
