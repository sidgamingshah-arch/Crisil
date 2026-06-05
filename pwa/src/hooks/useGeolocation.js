import { useState, useEffect, useRef } from 'react'
import useDiscoverStore from '../store/discoverStore.js'

const GEO_OPTIONS = {
  enableHighAccuracy: true,
  timeout: 10000,
  maximumAge: 30000,
}

export function useGeolocation({ watch = false } = {}) {
  const [error, setError] = useState(null)
  const watchIdRef = useRef(null)
  const setUserLocation = useDiscoverStore((s) => s.setUserLocation)

  useEffect(() => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser')
      return
    }

    const onSuccess = (pos) => {
      setError(null)
      setUserLocation({
        latitude: pos.coords.latitude,
        longitude: pos.coords.longitude,
        accuracy: pos.coords.accuracy,
      })
    }

    const onError = (err) => {
      setError(err.message)
    }

    if (watch) {
      watchIdRef.current = navigator.geolocation.watchPosition(
        onSuccess,
        onError,
        GEO_OPTIONS
      )
    } else {
      navigator.geolocation.getCurrentPosition(onSuccess, onError, GEO_OPTIONS)
    }

    return () => {
      if (watchIdRef.current != null) {
        navigator.geolocation.clearWatch(watchIdRef.current)
        watchIdRef.current = null
      }
    }
  }, [watch, setUserLocation])

  return { error }
}
