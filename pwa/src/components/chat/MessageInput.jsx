import { useState, useRef, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import useChatStore from '../../store/chatStore.js'
import styles from './MessageInput.module.css'

const TYPING_STOP_DELAY_MS = 2000

export function MessageInput() {
  const { t } = useTranslation()
  const [text, setText] = useState('')
  const { sendMessage, notifyTypingStart, notifyTypingStop } = useChatStore()
  const typingStopTimer = useRef(null)
  const isTyping = useRef(false)

  const triggerTypingStop = useCallback(() => {
    if (isTyping.current) {
      isTyping.current = false
      notifyTypingStop()
    }
  }, [notifyTypingStop])

  function handleChange(e) {
    setText(e.target.value)

    if (!isTyping.current) {
      isTyping.current = true
      notifyTypingStart()
    }

    clearTimeout(typingStopTimer.current)
    typingStopTimer.current = setTimeout(triggerTypingStop, TYPING_STOP_DELAY_MS)
  }

  async function handleSend(e) {
    e?.preventDefault()
    const trimmed = text.trim()
    if (!trimmed) return

    clearTimeout(typingStopTimer.current)
    triggerTypingStop()
    setText('')

    await sendMessage(trimmed)
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <form className={styles.form} onSubmit={handleSend}>
      <textarea
        className={styles.input}
        value={text}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder={t('chat.type_message')}
        rows={1}
        aria-label={t('chat.type_message')}
      />
      <button
        type="submit"
        className={styles.sendBtn}
        disabled={!text.trim()}
        aria-label={t('chat.send')}
      >
        ➤
      </button>
    </form>
  )
}
