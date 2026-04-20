// pages/MyDocumentsPage.jsx
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useDocumentStore } from '../store'
import { FileText, Trash2, Eye } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'

function MyDocumentsPage() {
  const { documents, fetchDocuments, deleteDocument, isLoading } = useDocumentStore()
  const [currentPage, setCurrentPage] = useState(1)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchDocuments(currentPage)
  }, [currentPage])

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this document?')) {
      try {
        await deleteDocument(id)
      } catch (err) {
        setError(err.message)
      }
    }
  }

  return (
    <div className="main-content">
      <div className="container">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h1>My Documents</h1>
          <Link to="/documents/create" className="btn btn-primary">
            ➕ Create New
          </Link>
        </div>

        {error && <div className="alert alert-error" style={{ marginTop: '1rem' }}><span>❌</span> {error}</div>}

        {isLoading ? (
          <div style={{ textAlign: 'center', padding: '2rem' }}><div className="loader"></div></div>
        ) : documents.length === 0 ? (
          <div className="card" style={{ marginTop: '2rem', textAlign: 'center' }}>
            <FileText size={48} style={{ margin: '1rem auto', color: 'var(--text-light)' }} />
            <p>No documents yet. Create your first document!</p>
          </div>
        ) : (
          <div className="table-wrapper" style={{ marginTop: '2rem' }}>
            <table>
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Type</th>
                  <th>Due Date</th>
                  <th>Created</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {documents.map((doc) => (
                  <tr key={doc.id}>
                    <td style={{ fontWeight: '500' }}>{doc.title}</td>
                    <td><span className="badge badge-primary">{doc.document_type}</span></td>
                    <td>{new Date(doc.due_date).toLocaleDateString()}</td>
                    <td style={{ color: 'var(--text-light)' }}>
                      {formatDistanceToNow(new Date(doc.created_at), { addSuffix: true })}
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <Link to={`/documents/${doc.id}`} className="btn btn-small btn-primary">
                          <Eye size={16} /> View
                        </Link>
                        <button 
                          className="btn btn-small btn-danger"
                          onClick={() => handleDelete(doc.id)}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

export default MyDocumentsPage
