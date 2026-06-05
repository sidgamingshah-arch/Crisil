import { initializeApp } from 'firebase/app'
import { getAuth, GoogleAuthProvider, OAuthProvider } from 'firebase/auth'
import { getMessaging, getToken, onMessage } from 'firebase/messaging'

const firebaseConfig = {
  apiKey:            import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain:        import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId:         import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket:     import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId:             import.meta.env.VITE_FIREBASE_APP_ID,
}

const app = initializeApp(firebaseConfig)

export const auth = getAuth(app)
export const googleProvider = new GoogleAuthProvider()
googleProvider.addScope('email')
googleProvider.addScope('profile')

export const appleProvider = new OAuthProvider('apple.com')
appleProvider.addScope('email')
appleProvider.addScope('name')

let messaging = null
try {
  // Messaging only works in browsers that support it
  messaging = getMessaging(app)
} catch {
  // Safari / non-supporting browsers — silently skip
}

export { messaging }

export async function requestNotificationPermission() {
  if (!messaging) return null
  try {
    const permission = await Notification.requestPermission()
    if (permission !== 'granted') return null
    return await getToken(messaging, {
      vapidKey: import.meta.env.VITE_FIREBASE_VAPID_KEY,
    })
  } catch {
    return null
  }
}

export function onForegroundMessage(callback) {
  if (!messaging) return () => {}
  return onMessage(messaging, callback)
}
