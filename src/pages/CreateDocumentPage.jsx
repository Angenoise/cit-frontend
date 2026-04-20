// pages/CreateDocumentPage.jsx
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDocumentStore } from '../store'
import { Plus } from 'lucide-react'

function CreateDocumentPage() {
  const navigate = useNavigate()
  const { createDocument } = useDocumentStore()

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    document_type: 'assignment',
    due_date: '',
    remarks: '',
    file: null,
  })

  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleChange = (e) => {
    const { name, value, files } = e.target
    if (files) {
      setFormData({ ...formData, file: files[0] })
    } else {
      setFormData({ ...formData, [name]: value })
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      const form = new FormData()
      form.append('title', formData.title)
      form.append('description', formData.description)
      form.append('document_type', formData.document_type)
      form.append('due_date', formData.due_date)
      form.append('remarks', formData.remarks)
      if (formData.file) {
        form.append('file', formData.file)
      }

      await createDocument(form)
      navigate('/documents')
    } catch (err) {
      setError(err.message || 'Failed to create document')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="main-content">
      <div className="container">
        <h1>Create New Document</h1>

        <div className="card" style={{ marginTop: '2rem', maxWidth: '700px' }}>
          {error && <div className="alert alert-error"><span>❌</span> {error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="title">Document Title *</label>
              <input
                id="title"
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                disabled={isLoading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="description">Description *</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                disabled={isLoading}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
              <div className="form-group">
                <label htmlFor="document_type">Document Type *</label>
                <select
                  id="document_type"
                  name="document_type"
                  value={formData.document_type}
                  onChange={handleChange}
                  required
                  disabled={isLoading}
                >
                  <option value="assignment">Assignment</option>
                  <option value="project">Project</option>
                  <option value="exam">Exam</option>
                  <option value="syllabus">Syllabus</option>
                  <option value="lecture">Lecture Notes</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="due_date">Due Date *</label>
                <input
                  id="due_date"
                  type="datetime-local"
                  name="due_date"
                  value={formData.due_date}
                  onChange={handleChange}
                  required
                  disabled={isLoading}
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="remarks">Remarks</label>
              <textarea
                id="remarks"
                name="remarks"
                value={formData.remarks}
                onChange={handleChange}
                disabled={isLoading}
                style={{ minHeight: '80px' }}
              />
            </div>

            <div className="form-group">
              <label htmlFor="file">Upload File (PDF, DOCX, Image)</label>
              <input
                id="file"
                type="file"
                name="file"
                onChange={handleChange}
                accept=".pdf,.docx,.doc,.jpg,.jpeg,.png,.gif"
                disabled={isLoading}
              />
            </div>

            <div style={{ display: 'flex', gap: '1rem' }}>
              <button type="submit" className="btn btn-primary" disabled={isLoading}>
                <Plus size={18} />
                {isLoading ? 'Creating...' : 'Create Document'}
              </button>
              <button type="button" className="btn btn-secondary" onClick={() => navigate('/documents')} disabled={isLoading}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default CreateDocumentPage
