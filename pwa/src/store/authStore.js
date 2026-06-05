import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import {
  signInWithPopup,
  signOut as firebaseSignOut,
  onAuthStateChanged,
} from 'firebase/auth'
import { auth, googleProvider, appleProvider, requestNotificationPermission } from '../firebase.js'
import api from '../lib/api.js'

const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      firebaseUser: null,
      loading: true,
      error: null,

      init() {
        return new Promise((resolve) => {
          onAuthStateChanged(auth, async (fbUser) => {
            if (fbUser) {
              set({ firebaseUser: fbUser })
              try {
                const { data } = await api.get('/auth/me')
                set({ user: data.user, loading: false })
              } catch {
                // User exists in Firebase but not yet registered in backend
                set({ user: null, loading: false })
              }
            } else {
              set({ user: null, firebaseUser: null, loading: false })
            }
            resolve()
          })
        })
      },

      async signInWithGoogle() {
        set({ error: null })
        try {
          const result = await signInWithPopup(auth, googleProvider)
          const token = await result.user.getIdToken()

          // Register / fetch user in backend
          const { data } = await api.post('/auth/register', {
            firebase_token: token,
            name: result.user.displayName,
            email: result.user.email,
            avatar_url: result.user.photoURL,
          })

          const fcmToken = await requestNotificationPermission()
          if (fcmToken) {
            await api.put('/profiles/me', { fcm_token: fcmToken })
          }

          set({ user: data.user, firebaseUser: result.user })
          return data.user
        } catch (err) {
          set({ error: err.message })
          throw err
        }
      },

      async signInWithApple() {
        set({ error: null })
        try {
          const result = await signInWithPopup(auth, appleProvider)
          const token = await result.user.getIdToken()

          const { data } = await api.post('/auth/register', {
            firebase_token: token,
            name: result.user.displayName || 'Apple User',
            email: result.user.email,
            avatar_url: result.user.photoURL,
          })

          set({ user: data.user, firebaseUser: result.user })
          return data.user
        } catch (err) {
          set({ error: err.message })
          throw err
        }
      },

      async signOut() {
        await firebaseSignOut(auth)
        set({ user: null, firebaseUser: null })
      },

      setError: (error) => set({ error }),
      clearError: () => set({ error: null }),
    }),
    {
      name: 'tourmate-auth',
      partialize: (state) => ({ user: state.user }),
    }
  )
)

export default useAuthStore
