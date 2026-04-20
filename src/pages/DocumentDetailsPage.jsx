// pages/DocumentDetailsPage.jsx
import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useDocumentStore } from '../store'
import { api } from '../utils/api'
import QRCode from 'qrcode.react'
import { Copy, Download, Lock } from 'lucide-react'

function DocumentDetailsPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { document, fetchDocument, isLoading } = useDocumentStore()
  const [accessKey, setAccessKey] = useState('')
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    fetchDocument(id)
  }, [id])

  useEffect(() => {
    if (document?.is_owner) {
      loadAccessKey()
    }
  }, [document])

  const loadAccessKey = async () => {
    try {
      const data = await api.getAccessKey(id)
      setAccessKey(data.access_key)
    } catch (err) {
      setError('Failed to load access key')
    }
  }

  const copyAccessKey = () => {
    navigator.clipboard.writeText(accessKey)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (isLoading) {
    return <div className="main-content" style={{ textAlign: 'center', padding: '2rem' }}><div className="loader"></div></div>
  }

  if (!document) {
    return (
      <div className="main-content">
        <div className="container">
          <div className="card" style={{ textAlign: 'center' }}>
            <p>Document not found</p>
            <button className="btn btn-primary" onClick={() => navigate('/documents')}>Back to Documents</button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="main-content">
      <div className="container">
        {error && <div className="alert alert-error" style={{ marginBottom: '1rem' }}><span>❌</span> {error}</div>}

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '2rem' }}>
          {/* Document Info */}
          <div className="card">
            <div className="card-header">
              <h2>{document.title}</h2>
            </div>
            <div className="card-body">
              <div style={{ marginBottom: '1.5rem' }}>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-light)', marginBottom: '0.5rem' }}>Description</p>
                <p>{document.description}</p>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
                <div>
                  <p style={{ fontSize: '0.9rem', color: 'var(--text-light)', marginBottom: '0.5rem' }}>Type</p>
                  <span className="badge badge-primary">{document.document_type}</span>
                </div>
                <div>
                  <p style={{ fontSize: '0.9rem', color: 'var(--text-light)', marginBottom: '0.5rem' }}>Owner</p>
                  <p>{document.owner.username}</p>
                </div>
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-light)', marginBottom: '0.5rem' }}>Due Date</p>
                <p>{new Date(document.due_date).toLocaleString()}</p>
              </div>

              {document.remarks && (
                <div>
                  <p style={{ fontSize: '0.9rem', color: 'var(--text-light)', marginBottom: '0.5rem' }}>Remarks</p>
                  <p>{document.remarks}</p>
                </div>
              )}

              {document.file && (
                <div style={{ marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid var(--border)' }}>
                  <a href={document.file} download className="btn btn-secondary btn-small">
                    <Download size={16} /> Download File
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* QR Code and Access Key */}
          {document.is_owner && (
            <div className="card">
              <div className="card-header">
                <h3>Access & Sharing</h3>
              </div>
              <div className="card-body">
                {document.encrypted_id && (
                  <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <p style={{ fontSize: '0.9rem', color: 'var(--text-light)', marginBottom: '1rem' }}>QR Code</p>
                    <div style={{ display: 'inline-block', border: '2px solid var(--border)', borderRadius: '8px', padding: '0.5rem' }}>
                      <QRCode value={`doc:${document.encrypted_id}`} size={128} />
                    </div>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-light)', marginTop: '0.5rem' }}>Scan to access document</p>
                  </div>
                )}

                <div style={{ marginBottom: '1rem' }}>
                  <p style={{ fontSize: '0.9rem', color: 'var(--text-light)', marginBottom: '0.5rem' }}>Access Key</p>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <input type="text" value={accessKey} readOnly style={{ flex: 1 }} />
                    <button className="btn btn-secondary btn-small" onClick={copyAccessKey}>
                      <Copy size={16} />
                    </button>
                  </div>
                  {copied && <small style={{ color: 'var(--success)', marginTop: '0.5rem', display: 'block' }}>✓ Copied!</small>}
                </div>

                <div className="alert alert-info">
                  <span>ℹ️</span>
                  <div>
                    <strong>Sharing Instructions:</strong>
                    <p style={{ marginTop: '0.5rem', fontSize: '0.9rem' }}>
                      Share the Access Key with others to allow them to view this document. They'll need to provide it when accessing via QR code.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {!document.is_owner && !document.can_access && (
          <div className="card" style={{ textAlign: 'center', padding: '2rem' }}>
            <Lock size={48} style={{ margin: '1rem auto', color: 'var(--danger)' }} />
            <h3>Access Required</h3>
            <p style={{ marginTop: '1rem', color: 'var(--text-light)' }}>You need the access key to view this document.</p>
          </div>
        )}

        <button className="btn btn-secondary" onClick={() => navigate('/documents')}>← Back</button>
      </div>
    </div>
  )
}

export default DocumentDetailsPage
