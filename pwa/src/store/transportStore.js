import { create } from 'zustand'
import api from '../lib/api.js'
import { getSocket } from '../lib/socket.js'

const useTransportStore = create((set, get) => ({
  requests: [],
  myRequests: [],
  selectedRequest: null,
  loading: false,
  joining: false,
  error: null,

  async fetchNearby(lat, lng, radiusMeters = 5000, destinationId) {
    set({ loading: true, error: null })
    try {
      const { data } = await api.get('/transport/nearby', {
        params: { lat, lng, radius: radiusMeters, destination_id: destinationId },
      })
      set({ requests: data.requests, loading: false })
    } catch (err) {
      set({ error: err.message, loading: false })
    }
  },

  async fetchMine() {
    try {
      const { data } = await api.get('/transport/mine')
      set({ myRequests: data.requests })
    } catch (err) {
      set({ error: err.message })
    }
  },

  async createRequest(payload) {
    set({ loading: true, error: null })
    try {
      const { data } = await api.post('/transport', payload)
      set((s) => ({ myRequests: [data.request, ...s.myRequests], loading: false }))
      return data.request
    } catch (err) {
      set({ error: err.message, loading: false })
      throw err
    }
  },

  async joinRequest(requestId) {
    set({ joining: true, error: null })
    try {
      const { data } = await api.post(`/transport/${requestId}/join`)
      // Update the local request to reflect new seat count
      set((s) => ({
        requests: s.requests.map((r) =>
          r.id === requestId ? { ...r, seats_available: r.seats_available - 1 } : r
        ),
        joining: false,
      }))
      return data.match
    } catch (err) {
      set({ error: err.message, joining: false })
      throw err
    }
  },

  async leaveRequest(requestId) {
    try {
      await api.delete(`/transport/${requestId}/leave`)
      set((s) => ({
        myRequests: s.myRequests.filter((r) => r.id !== requestId),
      }))
    } catch (err) {
      set({ error: err.message })
      throw err
    }
  },

  selectRequest(request) {
    set({ selectedRequest: request })
  },

  subscribeToSocket() {
    const socket = getSocket()
    if (!socket) return
    socket.on('transport_request_joined', (data) => {
      set((s) => ({
        requests: s.requests.map((r) =>
          r.id === data.request_id
            ? { ...r, seats_available: data.seats_available }
            : r
        ),
      }))
    })
  },

  unsubscribeFromSocket() {
    const socket = getSocket()
    socket?.off('transport_request_joined')
  },

  clearError: () => set({ error: null }),
}))

export default useTransportStore
