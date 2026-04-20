// pages/AuditLogsPage.jsx
import { useEffect, useState } from 'react'
import { useAuditLogStore } from '../store'
import { useAuthStore } from '../store'
import { formatDistanceToNow } from 'date-fns'
import { CheckCircle, XCircle } from 'lucide-react'

function AuditLogsPage() {
  const { logs, fetchAuditLogs, isLoading } = useAuditLogStore()
  const { user } = useAuthStore()
  const [currentPage, setCurrentPage] = useState(1)
  const [error, setError] = useState('')

  const isAdmin = user?.profile?.role === 'admin'

  useEffect(() => {
    fetchAuditLogs(currentPage)
  }, [currentPage])

  const getAccessTypeIcon = (type) => {
    const icons = {
      'qr_scan': '📱',
      'key_verification': '🔑',
      'direct_access': '👤',
    }
    return icons[type] || '📋'
  }

  const getAccessTypeLabel = (type) => {
    const labels = {
      'qr_scan': 'QR Code Scan',
      'key_verification': 'Access Key Verification',
      'direct_access': 'Direct Access',
    }
    return labels[type] || type
  }

  return (
    <div className="main-content">
      <div className="container">
        <h1>📋 Audit Logs</h1>
        <p style={{ marginTop: '0.5rem', marginBottom: '2rem', color: 'var(--text-light)' }}>
          {isAdmin ? 'All system access logs' : 'Access logs for your documents'}
        </p>

        {error && <div className="alert alert-error" style={{ marginBottom: '1rem' }}><span>❌</span> {error}</div>}

        {isLoading ? (
          <div style={{ textAlign: 'center', padding: '2rem' }}><div className="loader"></div></div>
        ) : logs.length === 0 ? (
          <div className="card" style={{ textAlign: 'center' }}>
            <p style={{ color: 'var(--text-light)' }}>No audit logs yet</p>
          </div>
        ) : (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>User</th>
                  <th>Document</th>
                  <th>Access Type</th>
                  <th>Timestamp</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {logs.map((log) => (
                  <tr key={log.id}>
                    <td style={{ fontWeight: '500' }}>{log.user_name}</td>
                    <td>{log.document_title}</td>
                    <td>
                      <span style={{ marginRight: '0.5rem' }}>{getAccessTypeIcon(log.access_type)}</span>
                      {getAccessTypeLabel(log.access_type)}
                    </td>
                    <td style={{ color: 'var(--text-light)' }}>
                      {formatDistanceToNow(new Date(log.timestamp), { addSuffix: true })}
                    </td>
                    <td>
                      {log.success ? (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--success)' }}>
                          <CheckCircle size={16} />
                          Success
                        </div>
                      ) : (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--danger)' }}>
                          <XCircle size={16} />
                          Failed
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination could be added here */}
      </div>
    </div>
  )
}

export default AuditLogsPage
