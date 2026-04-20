// pages/AdminPanelPage.jsx
import { useEffect, useState } from 'react'
import { useAuthStore } from '../store'
import { api } from '../utils/api'
import { Users, FileText, BarChart3 } from 'lucide-react'

function AdminPanelPage() {
  const { user } = useAuthStore()
  const [stats, setStats] = useState(null)
  const [users, setUsers] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  const isAdmin = user?.profile?.role === 'admin'

  useEffect(() => {
    if (!isAdmin) {
      return
    }

    const loadData = async () => {
      try {
        const [statsData, usersData] = await Promise.all([
          api.getAdminStats(),
          api.getAllUsers(),
        ])
        setStats(statsData)
        setUsers(usersData.results || [])
      } catch (err) {
        setError(err.message || 'Failed to load admin data')
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [isAdmin])

  if (!isAdmin) {
    return (
      <div className="main-content">
        <div className="container">
          <div className="card" style={{ textAlign: 'center', padding: '2rem' }}>
            <p style={{ color: 'var(--danger)', fontWeight: 'bold' }}>Access Denied</p>
            <p>Only administrators can access this page.</p>
          </div>
        </div>
      </div>
    )
  }

  if (isLoading) {
    return <div className="main-content" style={{ textAlign: 'center', padding: '2rem' }}><div className="loader"></div></div>
  }

  return (
    <div className="main-content">
      <div className="container">
        <h1>👨‍💼 Admin Panel</h1>
        <p style={{ marginTop: '0.5rem', marginBottom: '2rem', color: 'var(--text-light)' }}>
          System statistics and user management
        </p>

        {error && <div className="alert alert-error" style={{ marginBottom: '1rem' }}><span>❌</span> {error}</div>}

        {/* Statistics */}
        {stats && (
          <div className="grid" style={{ marginBottom: '2rem' }}>
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
                  <BarChart3 size={40} color="var(--primary)" />
                  <div>
                    <p style={{ fontSize: '0.9rem', color: 'var(--text-light)' }}>Audit Logs</p>
                    <h3 style={{ fontSize: '1.8rem' }}>{stats.total_audit_logs}</h3>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Documents by Type */}
        {stats?.documents_by_type && stats.documents_by_type.length > 0 && (
          <div className="card" style={{ marginBottom: '2rem' }}>
            <div className="card-header">
              <h2>Documents by Type</h2>
            </div>
            <div className="card-body">
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem' }}>
                {stats.documents_by_type.map((item, idx) => (
                  <div key={idx} style={{ textAlign: 'center', padding: '1rem', backgroundColor: 'var(--light-bg)', borderRadius: '8px' }}>
                    <p style={{ fontSize: '0.9rem', color: 'var(--text-light)' }}>{item.document_type}</p>
                    <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--primary)', marginTop: '0.5rem' }}>{item.count}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Users Table */}
        <div className="card">
          <div className="card-header">
            <h2>Users</h2>
          </div>
          {users.length === 0 ? (
            <div className="card-body" style={{ textAlign: 'center' }}>
              <p style={{ color: 'var(--text-light)' }}>No users found</p>
            </div>
          ) : (
            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>Username</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Name</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u) => (
                    <tr key={u.id}>
                      <td style={{ fontWeight: '500' }}>{u.username}</td>
                      <td>{u.email}</td>
                      <td>
                        <span className={`badge ${u.profile?.role === 'admin' ? 'badge-danger' : 'badge-success'}`}>
                          {u.profile?.role || 'user'}
                        </span>
                      </td>
                      <td>{u.first_name} {u.last_name}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default AdminPanelPage
