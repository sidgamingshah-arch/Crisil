import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import useTransportStore from '../store/transportStore.js'
import useDiscoverStore from '../store/discoverStore.js'
import { TransportCard } from '../components/transport/TransportCard.jsx'
import { JoinRequestModal } from '../components/transport/JoinRequestModal.jsx'
import { LoadingSpinner } from '../components/ui/LoadingSpinner.jsx'
import styles from './TransportPage.module.css'

export default function TransportPage() {
  const { t } = useTranslation()
  const { requests, loading, error, fetchNearby, clearError } = useTransportStore()
  const { userLocation, selectedDestination } = useDiscoverStore()
  const [joiningRequest, setJoiningRequest] = useState(null)
  const [showCreate, setShowCreate] = useState(false)

  useEffect(() => {
    if (userLocation) {
      fetchNearby(
        userLocation.latitude,
        userLocation.longitude,
        5000,
        selectedDestination?.id
      )
    }
  }, [userLocation, selectedDestination, fetchNearby])

  return (
    <div className={styles.page}>
      <div className="page-header">
        <div className={styles.headerRow}>
          <div>
            <h2 className={styles.title}>{t('transport.title')}</h2>
            <p className={styles.subtitle}>
              {selectedDestination
                ? `📍 ${selectedDestination.name}`
                : t('transport.subtitle')}
            </p>
          </div>
          <button
            className={styles.createBtn}
            onClick={() => setShowCreate(true)}
          >
            + {t('transport.create')}
          </button>
        </div>
      </div>

      <div className="page">
        {loading && (
          <div className={styles.loadingRow}>
            <LoadingSpinner size={24} />
            <span>{t('common.loading')}</span>
          </div>
        )}

        {error && (
          <div className={styles.errorBanner} onClick={clearError}>
            ⚠️ {error}
          </div>
        )}

        {!loading && requests.length === 0 && (
          <div className={styles.emptyState}>
            <span className={styles.emptyIcon}>🚌</span>
            <p>{t('transport.no_requests')}</p>
            <button
              className="btn-primary"
              style={{ marginTop: 'var(--space-4)', maxWidth: 200 }}
              onClick={() => setShowCreate(true)}
            >
              {t('transport.be_first')}
            </button>
          </div>
        )}

        <div className={styles.list}>
          {requests.map((req) => (
            <TransportCard
              key={req.id}
              request={req}
              onJoin={setJoiningRequest}
              onViewDetails={(r) => setJoiningRequest(r)}
            />
          ))}
        </div>
      </div>

      {joiningRequest && (
        <JoinRequestModal
          request={joiningRequest}
          onClose={() => setJoiningRequest(null)}
          onSuccess={() => {
            setJoiningRequest(null)
            if (userLocation) {
              fetchNearby(userLocation.latitude, userLocation.longitude, 5000, selectedDestination?.id)
            }
          }}
        />
      )}

      {showCreate && (
        <CreateRequestSheet onClose={() => setShowCreate(false)} />
      )}
    </div>
  )
}

// ── Inline create-request bottom sheet ────────────────────────────────────────
function CreateRequestSheet({ onClose }) {
  const { t } = useTranslation()
  const { createRequest, loading } = useTransportStore()
  const { selectedDestination, userLocation } = useDiscoverStore()
  const [form, setForm] = useState({
    destination_id: selectedDestination?.id || '',
    transport_type: 'taxi',
    seats_total: 3,
    price_per_person: '',
    departure_time: '',
  })

  function set(key, value) {
    setForm((f) => ({ ...f, [key]: value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!userLocation) return
    await createRequest({
      ...form,
      pickup_latitude:  userLocation.latitude,
      pickup_longitude: userLocation.longitude,
    })
    onClose()
  }

  return (
    <>
      <div className="bottom-sheet-overlay" onClick={onClose} />
      <div className="bottom-sheet" role="dialog" aria-modal>
        <div className="bottom-sheet-handle" />
        <h3 style={{ marginBottom: 'var(--space-4)', fontWeight: 700, fontSize: 'var(--font-size-lg)' }}>
          {t('transport.create_title')}
        </h3>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
          <select className="input-field" value={form.transport_type} onChange={(e) => set('transport_type', e.target.value)}>
            {['taxi','bus','minivan','private_car','tuk_tuk'].map((v) => (
              <option key={v} value={v}>{v.replace('_',' ')}</option>
            ))}
          </select>
          <input className="input-field" type="number" min="1" max="20" placeholder={t('transport.seats')}
            value={form.seats_total} onChange={(e) => set('seats_total', Number(e.target.value))} required />
          <input className="input-field" type="number" min="0" step="0.01" placeholder={t('transport.price_placeholder')}
            value={form.price_per_person} onChange={(e) => set('price_per_person', e.target.value)} required />
          <input className="input-field" type="datetime-local" value={form.departure_time}
            onChange={(e) => set('departure_time', e.target.value)} required />
          <button className="btn-primary" type="submit" disabled={loading}>
            {loading ? <LoadingSpinner size={20} color="#fff" /> : t('transport.post_request')}
          </button>
          <button className="btn-secondary" type="button" onClick={onClose}>{t('common.cancel')}</button>
        </form>
      </div>
    </>
  )
}
