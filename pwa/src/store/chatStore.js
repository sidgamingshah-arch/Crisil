import { create } from 'zustand'
import api from '../lib/api.js'
import { getSocket, sendMessage as socketSendMessage, emitTypingStart, emitTypingStop, emitMessageRead, joinRoom, leaveRoom } from '../lib/socket.js'

const useChatStore = create((set, get) => ({
  conversations: [],
  activeConversationId: null,
  messages: {},        // keyed by conversation_id
  typingUsers: {},     // keyed by conversation_id → Set of user_ids
  unreadCounts: {},    // keyed by conversation_id
  loading: false,
  sendingMessage: false,
  error: null,

  async fetchConversations() {
    set({ loading: true })
    try {
      const { data } = await api.get('/chat')
      set({ conversations: data.conversations, loading: false })
    } catch (err) {
      set({ error: err.message, loading: false })
    }
  },

  async openConversation(conversationId) {
    const prev = get().activeConversationId
    if (prev && prev !== conversationId) {
      leaveRoom(prev)
    }
    set({ activeConversationId: conversationId })
    joinRoom(conversationId)
    emitMessageRead(conversationId)

    if (!get().messages[conversationId]) {
      await get().fetchMessages(conversationId)
    }
  },

  closeConversation() {
    const id = get().activeConversationId
    if (id) leaveRoom(id)
    set({ activeConversationId: null })
  },

  async fetchMessages(conversationId, cursor) {
    try {
      const { data } = await api.get(`/chat/${conversationId}/messages`, {
        params: { cursor, limit: 40 },
      })
      set((s) => ({
        messages: {
          ...s.messages,
          [conversationId]: cursor
            ? [...data.messages, ...(s.messages[conversationId] || [])]
            : data.messages,
        },
      }))
      return data
    } catch (err) {
      set({ error: err.message })
    }
  },

  async sendMessage(content, type = 'text') {
    const conversationId = get().activeConversationId
    if (!conversationId) return
    set({ sendingMessage: true })
    try {
      socketSendMessage(conversationId, content, type)
      // Optimistic local append — socket will echo the real message back
      set({ sendingMessage: false })
    } catch (err) {
      set({ error: err.message, sendingMessage: false })
    }
  },

  notifyTypingStart() {
    const id = get().activeConversationId
    if (id) emitTypingStart(id)
  },

  notifyTypingStop() {
    const id = get().activeConversationId
    if (id) emitTypingStop(id)
  },

  subscribeToSocket() {
    const socket = getSocket()
    if (!socket) return

    socket.on('receive_message', (msg) => {
      set((s) => ({
        messages: {
          ...s.messages,
          [msg.conversation_id]: [
            ...(s.messages[msg.conversation_id] || []),
            msg,
          ],
        },
        unreadCounts: s.activeConversationId === msg.conversation_id
          ? s.unreadCounts
          : {
              ...s.unreadCounts,
              [msg.conversation_id]: (s.unreadCounts[msg.conversation_id] || 0) + 1,
            },
      }))
    })

    socket.on('typing_start', ({ conversation_id, user_id }) => {
      set((s) => {
        const prev = new Set(s.typingUsers[conversation_id] || [])
        prev.add(user_id)
        return { typingUsers: { ...s.typingUsers, [conversation_id]: prev } }
      })
    })

    socket.on('typing_stop', ({ conversation_id, user_id }) => {
      set((s) => {
        const prev = new Set(s.typingUsers[conversation_id] || [])
        prev.delete(user_id)
        return { typingUsers: { ...s.typingUsers, [conversation_id]: prev } }
      })
    })

    socket.on('message_read', ({ conversation_id }) => {
      set((s) => ({
        unreadCounts: { ...s.unreadCounts, [conversation_id]: 0 },
      }))
    })
  },

  unsubscribeFromSocket() {
    const socket = getSocket()
    socket?.off('receive_message')
    socket?.off('typing_start')
    socket?.off('typing_stop')
    socket?.off('message_read')
  },

  clearError: () => set({ error: null }),
}))

export default useChatStore
