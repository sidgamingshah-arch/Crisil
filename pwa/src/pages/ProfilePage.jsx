import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useParams, useNavigate } from 'react-router-dom'
import useAuthStore from '../store/authStore.js'
import api from '../lib/api.js'
import styles from './ProfilePage.module.css'

export default function ProfilePage() {
  const { t, i18n } = useTranslation()
  const { id } = useParams()
  const navigate = useNavigate()
  const { user, signOut } = useAuthStore()

  // Own profile when no id param or id matches current user
  const isOwn = !id || id === user?.id?.toString()
  const profile = isOwn ? user : null  // Remote profile fetching omitted for brevity

  const [editMode, setEditMode] = useState(false)
  const [name, setName] = useState(user?.name || '')
  const [bio, setBio] = useState(user?.bio || '')
  const [saving, setSaving] = useState(false)

  async function handleSave() {
    setSaving(true)
    try {
      await api.put('/profiles/me', { name, bio })
      useAuthStore.setState((s) => ({ user: { ...s.user, name, bio } }))
      setEditMode(false)
    } finally {
      setSaving(false)
    }
  }

  async function handleSignOut() {
    await signOut()
    navigate('/login', { replace: true })
  }

  if (!profile) {
    return (
      <div className={styles.page}>
        <div className={styles.empty}>{t('profile.not_found')}</div>
      </div>
    )
  }

  return (
    <div className={styles.page}>
      {/* Hero */}
      <div className={styles.hero}>
        <img
          className={styles.avatar}
          src={profile.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(profile.name)}&size=160&background=0066FF&color=fff`}
          alt={profile.name}
        />

        {editMode ? (
          <input
            className={[styles.nameInput, 'input-field'].join(' ')}
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoFocus
          />
        ) : (
          <h2 className={styles.name}>{profile.name}</h2>
        )}

        {profile.is_verified && (
          <span className={styles.verified}>✓ {t('profile.verified')}</span>
        )}

        <div className={styles.ratingRow}>
          <span className="stars">{'★'.repeat(Math.round(profile.rating || 0))}</span>
          <span className={styles.ratingNum}>{Number(profile.rating || 0).toFixed(1)}</span>
          <span className={styles.ratingCount}>({profile.review_count || 0} {t('profile.reviews')})</span>
        </div>
      </div>

      {/* Bio */}
      <div className={styles.section}>
        {editMode ? (
          <textarea
            className="input-field"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            rows={3}
            placeholder={t('profile.bio_placeholder')}
            style={{ resize: 'none' }}
          />
        ) : (
          <p className={styles.bio}>{profile.bio || t('profile.no_bio')}</p>
        )}
      </div>

      {/* Languages */}
      {profile.languages?.length > 0 && (
        <div className={styles.section}>
          <h4 className={styles.sectionTitle}>{t('profile.languages')}</h4>
          <div className={styles.chips}>
            {profile.languages.map((lang) => (
              <span key={lang} className={styles.chip}>{lang}</span>
            ))}
          </div>
        </div>
      )}

      {/* Stats */}
      <div className={styles.stats}>
        {[
          { label: t('profile.trips'), value: profile.trip_count || 0 },
          { label: t('profile.activities'), value: profile.activity_count || 0 },
          { label: t('profile.member_since'), value: profile.created_at ? new Date(profile.created_at).getFullYear() : '—' },
        ].map((s) => (
          <div key={s.label} className={styles.stat}>
            <strong className={styles.statValue}>{s.value}</strong>
            <span className={styles.statLabel}>{s.label}</span>
          </div>
        ))}
      </div>

      {/* Actions (own profile) */}
      {isOwn && (
        <div className={styles.actions}>
          {editMode ? (
            <>
              <button className="btn-primary" onClick={handleSave} disabled={saving}>
                {saving ? '…' : t('profile.save')}
              </button>
              <button className="btn-secondary" onClick={() => setEditMode(false)}>
                {t('common.cancel')}
              </button>
            </>
          ) : (
            <button className="btn-outline" onClick={() => setEditMode(true)}>
              ✏️ {t('profile.edit')}
            </button>
          )}

          {/* Language switcher */}
          <div className={styles.langRow}>
            <span className={styles.langLabel}>{t('profile.language')}</span>
            <select
              className="input-field"
              style={{ width: 'auto' }}
              value={i18n.language.split('-')[0]}
              onChange={(e) => i18n.changeLanguage(e.target.value)}
            >
              {[
                { code: 'en', label: 'English' },
                { code: 'fr', label: 'Français' },
                { code: 'es', label: 'Español' },
                { code: 'ja', label: '日本語' },
                { code: 'zh', label: '中文' },
              ].map((l) => (
                <option key={l.code} value={l.code}>{l.label}</option>
              ))}
            </select>
          </div>

          <button className={styles.signOutBtn} onClick={handleSignOut}>
            {t('profile.sign_out')}
          </button>
        </div>
      )}
    </div>
  )
}
