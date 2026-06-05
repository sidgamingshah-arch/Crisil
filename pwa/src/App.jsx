import { Suspense, lazy } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AppShell } from './components/layout/AppShell.jsx'
import { ProtectedRoute } from './components/ui/ProtectedRoute.jsx'
import { FullPageLoader } from './components/ui/LoadingSpinner.jsx'

const LoginPage      = lazy(() => import('./pages/LoginPage.jsx'))
const DiscoverPage   = lazy(() => import('./pages/DiscoverPage.jsx'))
const TransportPage  = lazy(() => import('./pages/TransportPage.jsx'))
const ActivitiesPage = lazy(() => import('./pages/ActivitiesPage.jsx'))
const ChatPage       = lazy(() => import('./pages/ChatPage.jsx'))
const ProfilePage    = lazy(() => import('./pages/ProfilePage.jsx'))

export default function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<FullPageLoader />}>
        <Routes>
          <Route path="/login" element={<LoginPage />} />

          <Route
            element={
              <ProtectedRoute>
                <AppShell />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="/discover" replace />} />
            <Route path="/discover"   element={<DiscoverPage />} />
            <Route path="/transport"  element={<TransportPage />} />
            <Route path="/activities" element={<ActivitiesPage />} />
            <Route path="/chat"       element={<ChatPage />} />
            <Route path="/profile"    element={<ProfilePage />} />
            <Route path="/profile/:id" element={<ProfilePage />} />
          </Route>

          <Route path="*" element={<Navigate to="/discover" replace />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  )
}
