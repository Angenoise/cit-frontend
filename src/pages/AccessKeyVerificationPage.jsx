// pages/AccessKeyVerificationPage.jsx
import { useState } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { api } from '../utils/api'
import { Key } from 'lucide-react'

function AccessKeyVerificationPage() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  
  const encryptedId = searchParams.get('encrypted_id')
  const [accessKey, setAccessKey] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      const response = await api.verifyAccessKey(encryptedId, accessKey)
      // Redirect to document view
      navigate(`/documents/${response.document.id}`)
    } catch (err) {
      setError(err.message || 'Invalid access key')
    } finally {
      setIsLoading(false)
    }
  }

  if (!encryptedId) {
    return (
      <div className="main-content">
        <div className="container">
          <div className="card" style={{ textAlign: 'center', maxWidth: '500px', margin: '2rem auto' }}>
            <p>No document specified</p>
            <button className="btn btn-primary" onClick={() => navigate('/qr')}>← Scan QR Code</button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="main-content">
      <div className="container">
        <div className="card" style={{ maxWidth: '500px', margin: '2rem auto' }}>
          <div className="card-header">
            <h2>
              <Key size={24} style={{ marginRight: '0.5rem' }} />
              Enter Access Key
            </h2>
          </div>

          {error && <div className="alert alert-error" style={{ margin: '1rem' }}><span>❌</span> {error}</div>}

          <form onSubmit={handleSubmit} style={{ padding: '1rem' }}>
            <div className="form-group">
              <label htmlFor="accessKey">Access Key</label>
              <input
                id="accessKey"
                type="password"
                value={accessKey}
                onChange={(e) => setAccessKey(e.target.value)}
                placeholder="Enter the access key provided by the document owner"
                required
                disabled={isLoading}
              />
              <small style={{ color: 'var(--text-light)', marginTop: '0.5rem', display: 'block' }}>
                The owner of this document shared a unique access key with you.
              </small>
            </div>

            <button type="submit" className="btn btn-primary w-full" disabled={isLoading}>
              {isLoading ? 'Verifying...' : 'Verify & Access'}
            </button>

            <button 
              type="button" 
              className="btn btn-secondary w-full" 
              style={{ marginTop: '1rem' }}
              onClick={() => navigate('/qr')}
              disabled={isLoading}
            >
              ← Back
            </button>
          </form>

          <div style={{ padding: '1rem', backgroundColor: 'var(--light-bg)', borderRadius: '0 0 8px 8px' }}>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-light)' }}>
              💡 Don't have the access key? Ask the document owner to share it with you.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AccessKeyVerificationPage
