import { create } from 'zustand'
import api from '../lib/api.js'
import { getSocket, emitLocationUpdate } from '../lib/socket.js'

const useDiscoverStore = create((set, get) => ({
  nearbyUsers: [],
  destinations: [],
  selectedDestination: null,
  radiusMeters: 2000,
  userLocation: null,
  isSharing: false,
  loading: false,
  error: null,

  setUserLocation(coords) {
    set({ userLocation: coords })
    if (get().isSharing) {
      emitLocationUpdate(coords.latitude, coords.longitude, get().selectedDestination?.id)
    }
  },

  async fetchNearbyUsers() {
    const { userLocation, selectedDestination, radiusMeters } = get()
    if (!userLocation) return
    set({ loading: true, error: null })
    try {
      const { data } = await api.get('/discover/nearby', {
        params: {
          lat: userLocation.latitude,
          lng: userLocation.longitude,
          radius: radiusMeters,
          destination_id: selectedDestination?.id,
        },
      })
      set({ nearbyUsers: data.users, loading: false })
    } catch (err) {
      set({ error: err.message, loading: false })
    }
  },

  async fetchDestinations(query = '') {
    try {
      const { data } = await api.get('/discover/destinations', {
        params: { q: query },
      })
      set({ destinations: data.destinations })
    } catch {
      // non-fatal
    }
  },

  async toggleLocationSharing() {
    const { isSharing, userLocation, selectedDestination } = get()
    const next = !isSharing
    try {
      await api.put('/discover/location', { is_sharing: next })
      set({ isSharing: next })
      if (next && userLocation) {
        emitLocationUpdate(userLocation.latitude, userLocation.longitude, selectedDestination?.id)
      }
    } catch (err) {
      set({ error: err.message })
    }
  },

  selectDestination(destination) {
    set({ selectedDestination: destination })
  },

  setRadius(radiusMeters) {
    set({ radiusMeters })
  },

  // Called by Socket.io locationHandler's nearby_users_update event
  updateNearbyUsersFromSocket(users) {
    set({ nearbyUsers: users })
  },

  subscribeToSocket() {
    const socket = getSocket()
    if (!socket) return
    socket.on('nearby_users_update', (data) => {
      set({ nearbyUsers: data.users })
    })
  },

  unsubscribeFromSocket() {
    const socket = getSocket()
    socket?.off('nearby_users_update')
  },

  clearError: () => set({ error: null }),
}))

export default useDiscoverStore
