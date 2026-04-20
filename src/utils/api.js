// API utility functions
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api'

export const api = {
  getToken: () => localStorage.getItem('token'),
  setToken: (token) => localStorage.setItem('token', token),
  clearToken: () => localStorage.removeItem('token'),

  getHeaders: () => ({
    'Content-Type': 'application/json',
    ...(localStorage.getItem('token') && {
      'Authorization': `Token ${localStorage.getItem('token')}`
    })
  }),

  // Auth endpoints
  register: async (userData) => {
    const response = await fetch(`${API_BASE_URL}/auth/register/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    })
    return response.json()
  },

  login: async (username, password) => {
    const response = await fetch(`${API_BASE_URL}/auth/token/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    })
    return response.json()
  },

  logout: async () => {
    const response = await fetch(`${API_BASE_URL}/auth/logout/`, {
      method: 'POST',
      headers: api.getHeaders(),
    })
    return response.json()
  },

  getCurrentUser: async () => {
    const response = await fetch(`${API_BASE_URL}/auth/me/`, {
      headers: api.getHeaders(),
    })
    if (!response.ok) throw new Error('Failed to fetch current user')
    return response.json()
  },

  // Document endpoints
  getDocuments: async (page = 1) => {
    const response = await fetch(`${API_BASE_URL}/documents/?page=${page}`, {
      headers: api.getHeaders(),
    })
    return response.json()
  },

  getDocument: async (id) => {
    const response = await fetch(`${API_BASE_URL}/documents/${id}/`, {
      headers: api.getHeaders(),
    })
    if (!response.ok) throw new Error('Failed to fetch document')
    return response.json()
  },

  createDocument: async (formData) => {
    const response = await fetch(`${API_BASE_URL}/documents/`, {
      method: 'POST',
      headers: {
        'Authorization': `Token ${api.getToken()}`
      },
      body: formData,
    })
    return response.json()
  },

  updateDocument: async (id, formData) => {
    const response = await fetch(`${API_BASE_URL}/documents/${id}/`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Token ${api.getToken()}`
      },
      body: formData,
    })
    return response.json()
  },

  deleteDocument: async (id) => {
    const response = await fetch(`${API_BASE_URL}/documents/${id}/`, {
      method: 'DELETE',
      headers: api.getHeaders(),
    })
    return response
  },

  getAccessKey: async (id) => {
    const response = await fetch(`${API_BASE_URL}/documents/${id}/get_access_key/`, {
      headers: api.getHeaders(),
    })
    return response.json()
  },

  getQRCode: async (id) => {
    const response = await fetch(`${API_BASE_URL}/documents/${id}/get_qr_code/`, {
      headers: api.getHeaders(),
    })
    return response.json()
  },

  // QR and Access Key
  scanQR: async (encryptedId) => {
    const response = await fetch(`${API_BASE_URL}/qr/scan/`, {
      method: 'POST',
      headers: api.getHeaders(),
      body: JSON.stringify({ encrypted_id: encryptedId }),
    })
    return response.json()
  },

  verifyAccessKey: async (encryptedId, accessKey) => {
    const response = await fetch(`${API_BASE_URL}/access-key/verify/`, {
      method: 'POST',
      headers: api.getHeaders(),
      body: JSON.stringify({
        encrypted_id: encryptedId,
        access_key: accessKey,
      }),
    })
    return response.json()
  },

  // Audit Logs
  getAuditLogs: async (page = 1) => {
    const response = await fetch(`${API_BASE_URL}/audit-logs/?page=${page}`, {
      headers: api.getHeaders(),
    })
    return response.json()
  },

  getDocumentAuditLogs: async (documentId) => {
    const response = await fetch(`${API_BASE_URL}/audit-logs/${documentId}/`, {
      headers: api.getHeaders(),
    })
    return response.json()
  },

  // Admin
  getAdminStats: async () => {
    const response = await fetch(`${API_BASE_URL}/admin/stats/`, {
      headers: api.getHeaders(),
    })
    return response.json()
  },

  getAllUsers: async () => {
    const response = await fetch(`${API_BASE_URL}/admin/users/`, {
      headers: api.getHeaders(),
    })
    return response.json()
  },
}
