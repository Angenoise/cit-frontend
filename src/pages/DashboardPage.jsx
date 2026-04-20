// pages/DashboardPage.jsx
import { useEffect, useState } from 'react'
import { useAuthStore } from '../store'
import { api } from '../utils/api'
import { BarChart3, FileText, Users, ScrollText } from 'lucide-react'

function DashboardPage() {
  const { user } = useAuthStore()
  const [stats, setStats] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const isAdmin = user?.profile?.role === 'admin'

  useEffect(() => {
    const loadStats = async () => {
      try {
        if (isAdmin) {
          const data = await api.getAdminStats()
          setStats(data)
        }
      } catch (error) {
        console.error('Failed to load stats:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadStats()
  }, [isAdmin])

  return (
    <div className="main-content">
      <div className="container">
        <h1>Welcome, {user?.username}! 👋</h1>
        <p style={{ marginTop: '1rem', marginBottom: '2rem', color: 'var(--text-light)' }}>
          {isAdmin ? 'Administrator Dashboard' : 'Document Tracking Dashboard'}
        </p>

        {isAdmin && stats && (
          <div className="grid">
            <div className="card">
              <div className="card-body">
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <Users size={40} color="var(--primary)" />
                  <div>
                    <p style={{ fontSize: '0.9rem', color: 'var(--text-light)' }}>Total Users</p>
                    <h3 style={{ fontSize: '1.8rem' }}>{stats.total_users}</h3>
                  </div>
                </div>
              </div>
            </div>

            <div className="card">
              <div className="card-body">
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <FileText size={40} color="var(--primary)" />
                  <div>
                    <p style={{ fontSize: '0.9rem', color: 'var(--text-light)' }}>Total Documents</p>
                    <h3 style={{ fontSize: '1.8rem' }}>{stats.total_documents}</h3>
                  </div>
                </div>
              </div>
            </div>

            <div className="card">
              <div className="card-body">
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <ScrollText size={40} color="var(--primary)" />
                  <div>
                    <p style={{ fontSize: '0.9rem', color: 'var(--text-light)' }}>Total Access Logs</p>
                    <h3 style={{ fontSize: '1.8rem' }}>{stats.total_audit_logs}</h3>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="card">
          <div className="card-header">
            <h2>System Overview</h2>
          </div>
          <div className="card-body">
            <h3>About CIT Document Tracker</h3>
            <p style={{ marginTop: '1rem' }}>
              This secure document tracking system uses the International Data Encryption Algorithm (IDEA) to protect document IDs and access.
            </p>
            <ul style={{ marginTop: '1rem', marginLeft: '2rem', lineHeight: '2' }}>
              <li>🔐 IDEA Encryption for Document IDs</li>
              <li>📱 QR Code scanning for secure access</li>
              <li>🔑 Access Keys for document sharing</li>
              <li>📝 Complete audit logging system</li>
              <li>👥 Role-based access control</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DashboardPage
