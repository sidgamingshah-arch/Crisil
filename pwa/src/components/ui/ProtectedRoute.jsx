import { Navigate, useLocation } from 'react-router-dom'
import useAuthStore from '../../store/authStore.js'
import { FullPageLoader } from './LoadingSpinner.jsx'

export function ProtectedRoute({ children }) {
  const user = useAuthStore((s) => s.user)
  const loading = useAuthStore((s) => s.loading)
  const location = useLocation()

  if (loading) return <FullPageLoader />
  if (!user) return <Navigate to="/login" state={{ from: location }} replace />
  return children
}
