import { create } from 'zustand'
import api from '../lib/api.js'
import { getSocket } from '../lib/socket.js'

const useActivitiesStore = create((set, get) => ({
  activities: [],
  bookings: {},        // keyed by activity_id
  selectedActivity: null,
  discountPreviews: {}, // keyed by booking_id
  loading: false,
  joining: false,
  error: null,

  async fetchActivities(destinationId) {
    set({ loading: true, error: null })
    try {
      const { data } = await api.get('/activities', {
        params: { destination_id: destinationId },
      })
      set({ activities: data.activities, loading: false })
    } catch (err) {
      set({ error: err.message, loading: false })
    }
  },

  async fetchBookings(activityId) {
    try {
      const { data } = await api.get(`/activities/${activityId}/bookings`)
      set((s) => ({
        bookings: { ...s.bookings, [activityId]: data.bookings },
      }))
    } catch (err) {
      set({ error: err.message })
    }
  },

  async fetchDiscountPreview(bookingId) {
    try {
      const { data } = await api.get(`/activities/bookings/${bookingId}/discount-preview`)
      set((s) => ({
        discountPreviews: { ...s.discountPreviews, [bookingId]: data },
      }))
      return data
    } catch {
      return null
    }
  },

  async createBooking(activityId, scheduledAt) {
    set({ loading: true, error: null })
    try {
      const { data } = await api.post(`/activities/${activityId}/bookings`, {
        scheduled_at: scheduledAt,
      })
      set({ loading: false })
      return data.booking
    } catch (err) {
      set({ error: err.message, loading: false })
      throw err
    }
  },

  async joinBooking(bookingId) {
    set({ joining: true, error: null })
    try {
      const { data } = await api.post(`/activities/bookings/${bookingId}/join`)
      // Fetch updated discount preview after joining
      await get().fetchDiscountPreview(bookingId)
      set({ joining: false })
      return data
    } catch (err) {
      set({ error: err.message, joining: false })
      throw err
    }
  },

  selectActivity(activity) {
    set({ selectedActivity: activity })
  },

  subscribeToSocket() {
    const socket = getSocket()
    if (!socket) return
    socket.on('activity_booking_updated', (data) => {
      // data: { booking_id, current_participants, discount_preview }
      set((s) => ({
        discountPreviews: {
          ...s.discountPreviews,
          [data.booking_id]: data.discount_preview,
        },
      }))
    })
  },

  unsubscribeFromSocket() {
    const socket = getSocket()
    socket?.off('activity_booking_updated')
  },

  clearError: () => set({ error: null }),
}))

export default useActivitiesStore
