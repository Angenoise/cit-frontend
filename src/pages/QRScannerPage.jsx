// pages/QRScannerPage.jsx
import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../utils/api'
import { QrCode } from 'lucide-react'

function QRScannerPage() {
  const navigate = useNavigate()
  const [encryptedId, setEncryptedId] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const qrInputRef = useRef(null)

  const handleQRInput = async (qrData) => {
    // QR data format: "doc:encrypted_id"
    const match = qrData.match(/doc:(.+)/)
    if (!match) {
      setError('Invalid QR code format')
      return
    }

    const decryptedId = match[1]
    setEncryptedId(decryptedId)
    await processQRData(decryptedId)
  }

  const processQRData = async (id) => {
    setError('')
    setIsLoading(true)

    try {
      const response = await api.scanQR(id)

      if (!response.authenticated) {
        // User not logged in, redirect to login with return
        navigate('/login', { state: { returnTo: `/access-verification?encrypted_id=${id}` } })
      } else if (response.has_access) {
        // User has access, show document
        navigate(`/documents/${response.document.id}`)
      } else {
        // User needs access key
        navigate(`/access-verification?encrypted_id=${id}`)
      }
    } catch (err) {
      setError(err.message || 'Failed to process QR code')
    } finally {
      setIsLoading(false)
    }
  }

  const handleManualSubmit = async (e) => {
    e.preventDefault()
    if (encryptedId.trim()) {
      await processQRData(encryptedId)
    }
  }

  return (
    <div className="main-content">
      <div className="container">
        <h1>📱 Scan QR Code</h1>
        <p style={{ marginTop: '0.5rem', marginBottom: '2rem', color: 'var(--text-light)' }}>
          Scan a document QR code or paste the encrypted ID manually
        </p>

        <div className="card" style={{ maxWidth: '500px' }}>
          {error && <div className="alert alert-error" style={{ marginBottom: '1rem' }}><span>❌</span> {error}</div>}

          <div className="card-body">
            <p style={{ marginBottom: '1rem', color: 'var(--text-light)' }}>
              Position the QR code in front of your camera:
            </p>
            
            {/* Note: For production, integrate a QR scanner library like jsQR or react-qr-reader */}
            <div style={{ 
              backgroundColor: 'var(--light-bg)', 
              border: '2px dashed var(--border)', 
              borderRadius: '8px',
              padding: '2rem',
              textAlign: 'center',
              marginBottom: '1.5rem'
            }}>
              <QrCode size={64} style={{ margin: '0 auto', color: 'var(--text-light)' }} />
              <p style={{ marginTop: '1rem', fontSize: '0.9rem', color: 'var(--text-light)' }}>
                QR Camera (Requires camera library integration)
              </p>
            </div>

            <p style={{ textAlign: 'center', marginBottom: '1.5rem', color: 'var(--text-light)' }}>— or —</p>

            <form onSubmit={handleManualSubmit}>
              <div className="form-group">
                <label htmlFor="encryptedId">Enter Encrypted Document ID</label>
                <textarea
                  ref={qrInputRef}
                  id="encryptedId"
                  value={encryptedId}
                  onChange={(e) => setEncryptedId(e.target.value)}
                  placeholder="Paste the encrypted ID from the QR code"
                  disabled={isLoading}
                  style={{ minHeight: '100px' }}
                />
              </div>

              <button type="submit" className="btn btn-primary w-full" disabled={isLoading || !encryptedId.trim()}>
                {isLoading ? 'Processing...' : 'Access Document'}
              </button>
            </form>
          </div>
        </div>

        <div className="card" style={{ marginTop: '2rem', maxWidth: '500px' }}>
          <div className="card-header">
            <h3>How it works</h3>
          </div>
          <div className="card-body">
            <ol style={{ marginLeft: '1.5rem', lineHeight: '2' }}>
              <li>Scan or paste the QR code data</li>
              <li>If not logged in, you'll be redirected to login</li>
              <li>If you own the document, direct access is granted</li>
              <li>If not owner, you'll need the access key</li>
              <li>All access is logged for security</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  )
}

export default QRScannerPage
