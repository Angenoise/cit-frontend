// App.jsx - Main application component with routing
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useEffect } from 'react'
import { useAuthStore } from './store'
import { api } from './utils/api'

// Layout
import Navbar from './components/Navbar'
import Sidebar from './components/Sidebar'
import ProtectedRoute from './components/ProtectedRoute'

// Pages
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import DashboardPage from './pages/DashboardPage'
import CreateDocumentPage from './pages/CreateDocumentPage'
import MyDocumentsPage from './pages/MyDocumentsPage'
import DocumentDetailsPage from './pages/DocumentDetailsPage'
import QRScannerPage from './pages/QRScannerPage'
import AccessKeyVerificationPage from './pages/AccessKeyVerificationPage'
import AdminPanelPage from './pages/AdminPanelPage'
import AuditLogsPage from './pages/AuditLogsPage'

function App() {
  const { isAuthenticated, setUser } = useAuthStore()

  useEffect(() => {
    // Load user data if logged in
    if (isAuthenticated && !useAuthStore.getState().user) {
      api.getCurrentUser()
        .then(user => setUser(user))
        .catch(error => console.error('Failed to load user:', error))
    }
  }, [isAuthenticated, setUser])

  return (
    <BrowserRouter>
      {isAuthenticated && <Navbar />}
      <div style={{ display: 'flex' }}>
        {isAuthenticated && <Sidebar />}
        <div style={{ flex: 1, marginLeft: isAuthenticated ? '250px' : '0' }}>
          <Routes>
            {/* Public routes */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/qr" element={<QRScannerPage />} />

            {/* Protected routes */}
            <Route element={<ProtectedRoute />}>
              <Route path="/" element={<DashboardPage />} />
              <Route path="/documents" element={<MyDocumentsPage />} />
              <Route path="/documents/:id" element={<DocumentDetailsPage />} />
              <Route path="/documents/create" element={<CreateDocumentPage />} />
              <Route path="/access-verification" element={<AccessKeyVerificationPage />} />
              <Route path="/audit-logs" element={<AuditLogsPage />} />
              <Route path="/admin" element={<AdminPanelPage />} />
            </Route>

            {/* Redirect to dashboard */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  )
}

export default App
