import { io } from 'socket.io-client'
import { auth } from '../firebase.js'

let socket = null

export async function connectSocket() {
  if (socket?.connected) return socket

  const user = auth.currentUser
  if (!user) throw new Error('Must be authenticated before connecting socket')

  const token = await user.getIdToken()

  socket = io(import.meta.env.VITE_WS_URL || window.location.origin, {
    auth: { token },
    transports: ['websocket', 'polling'],
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
  })

  socket.on('connect_error', (err) => {
    console.error('[Socket] connection error:', err.message)
  })

  return socket
}

export function getSocket() {
  return socket
}

export function disconnectSocket() {
  socket?.disconnect()
  socket = null
}

// ── Room helpers ─────────────────────────────────────────────────────────────

export function joinRoom(roomId) {
  socket?.emit('join_room', { room_id: roomId })
}

export function leaveRoom(roomId) {
  socket?.emit('leave_room', { room_id: roomId })
}

// ── Chat helpers ──────────────────────────────────────────────────────────────

export function sendMessage(conversationId, content, type = 'text') {
  socket?.emit('send_message', { conversation_id: conversationId, content, type })
}

export function emitTypingStart(conversationId) {
  socket?.emit('typing_start', { conversation_id: conversationId })
}

export function emitTypingStop(conversationId) {
  socket?.emit('typing_stop', { conversation_id: conversationId })
}

export function emitMessageRead(conversationId) {
  socket?.emit('message_read', { conversation_id: conversationId })
}

// ── Location helpers ──────────────────────────────────────────────────────────

export function emitLocationUpdate(latitude, longitude, destinationId = null) {
  socket?.emit('user_location_update', { latitude, longitude, destination_id: destinationId })
}
