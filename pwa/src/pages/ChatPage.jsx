import { useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { useLocation } from 'react-router-dom'
import useChatStore from '../store/chatStore.js'
import useAuthStore from '../store/authStore.js'
import { MessageBubble } from '../components/chat/MessageBubble.jsx'
import { MessageInput } from '../components/chat/MessageInput.jsx'
import { TypingIndicator } from '../components/chat/TypingIndicator.jsx'
import { LoadingSpinner } from '../components/ui/LoadingSpinner.jsx'
import styles from './ChatPage.module.css'

export default function ChatPage() {
  const { t } = useTranslation()
  const location = useLocation()
  const { user } = useAuthStore()
  const {
    conversations,
    activeConversationId,
    messages,
    typingUsers,
    loading,
    fetchConversations,
    openConversation,
    closeConversation,
  } = useChatStore()

  const messagesEndRef = useRef(null)

  useEffect(() => {
    fetchConversations()
    // If navigated here from Discover with a target user
    if (location.state?.targetUserId) {
      // In production: create or find DM conversation first
    }
    return () => closeConversation()
  }, [])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, activeConversationId])

  const activeMessages = activeConversationId ? (messages[activeConversationId] || []) : []
  const activeConv = conversations.find((c) => c.id === activeConversationId)
  const typingSet = activeConversationId ? typingUsers[activeConversationId] : null
  const typingNames = typingSet ? [...typingSet].map((uid) => {
    const participant = activeConv?.participants?.find((p) => p.firebase_uid === uid)
    return participant?.name || 'Someone'
  }) : []

  // Conversation list view
  if (!activeConversationId) {
    return (
      <div className={styles.page}>
        <div className="page-header">
          <h2 className={styles.title}>{t('chat.title')}</h2>
        </div>

        <div className="page">
          {loading && (
            <div className={styles.loadingState}><LoadingSpinner size={32} /></div>
          )}

          {!loading && conversations.length === 0 && (
            <div className={styles.emptyState}>
              <span>💬</span>
              <p>{t('chat.no_conversations')}</p>
              <span className={styles.emptyHint}>{t('chat.start_hint')}</span>
            </div>
          )}

          <ul className={styles.convList}>
            {conversations.map((conv) => (
              <ConversationItem
                key={conv.id}
                conversation={conv}
                currentUserId={user?.id}
                onOpen={() => openConversation(conv.id)}
              />
            ))}
          </ul>
        </div>
      </div>
    )
  }

  // Active chat room view
  return (
    <div className={styles.chatRoom}>
      <div className={styles.chatHeader}>
        <button
          className={styles.backBtn}
          onClick={closeConversation}
          aria-label={t('common.back')}
        >
          ←
        </button>
        <div className={styles.chatTitle}>
          <strong>{activeConv?.name || t('chat.group_chat')}</strong>
          {activeConv?.participants && (
            <span className={styles.participantCount}>
              {activeConv.participants.length} {t('chat.members')}
            </span>
          )}
        </div>
      </div>

      <div className={styles.messagesList}>
        {activeMessages.map((msg) => (
          <MessageBubble
            key={msg.id}
            message={msg}
            isOwn={msg.sender_id === user?.id}
          />
        ))}
        <TypingIndicator names={typingNames} />
        <div ref={messagesEndRef} />
      </div>

      <MessageInput />
    </div>
  )
}

function ConversationItem({ conversation, currentUserId, onOpen }) {
  const unread = useChatStore((s) => s.unreadCounts[conversation.id] || 0)

  const otherParticipant = conversation.type === 'direct'
    ? conversation.participants?.find((p) => p.id !== currentUserId)
    : null

  const displayName = otherParticipant?.name || conversation.name || 'Chat'
  const avatar = otherParticipant?.avatar_url ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=0066FF&color=fff`

  function formatTime(iso) {
    if (!iso) return ''
    const d = new Date(iso)
    const now = new Date()
    const isToday = d.toDateString() === now.toDateString()
    return isToday
      ? new Intl.DateTimeFormat(undefined, { hour: '2-digit', minute: '2-digit' }).format(d)
      : new Intl.DateTimeFormat(undefined, { month: 'short', day: 'numeric' }).format(d)
  }

  return (
    <li>
      <button className={styles.convItem} onClick={onOpen}>
        <img className="avatar" src={avatar} alt={displayName} />
        <div className={styles.convInfo}>
          <div className={styles.convNameRow}>
            <span className={styles.convName}>{displayName}</span>
            <span className={styles.convTime}>{formatTime(conversation.last_message_at)}</span>
          </div>
          <div className={styles.convPreviewRow}>
            <span className={styles.convPreview}>
              {conversation.last_message || '…'}
            </span>
            {unread > 0 && (
              <span className={styles.unreadBadge}>{unread}</span>
            )}
          </div>
        </div>
      </button>
    </li>
  )
}
