// Zustand store for state management
import { create } from 'zustand'
import { api } from '../utils/api'

export const useAuthStore = create((set) => ({
  user: null,
  token: localStorage.getItem('token') || null,
  isAuthenticated: !!localStorage.getItem('token'),
  isLoading: false,
  error: null,

  register: async (userData) => {
    set({ isLoading: true, error: null })
    try {
      const response = await api.register(userData)
      if (response.token) {
        api.setToken(response.token)
        set({
          user: response.user,
          token: response.token,
          isAuthenticated: true,
          isLoading: false,
        })
        return response
      } else {
        throw new Error(response.error || 'Registration failed')
      }
    } catch (error) {
      set({ error: error.message, isLoading: false })
      throw error
    }
  },

  login: async (username, password) => {
    set({ isLoading: true, error: null })
    try {
      const response = await api.login(username, password)
      if (response.token) {
        api.setToken(response.token)
        set({
          user: response.user,
          token: response.token,
          isAuthenticated: true,
          isLoading: false,
        })
        return response
      } else {
        throw new Error(response.error || 'Login failed')
      }
    } catch (error) {
      set({ error: error.message, isLoading: false })
      throw error
    }
  },

  logout: async () => {
    try {
      await api.logout()
    } catch (error) {
      console.error('Logout error:', error)
    }
    api.clearToken()
    set({ user: null, token: null, isAuthenticated: false })
  },

  setUser: (user) => set({ user }),
  clearError: () => set({ error: null }),
}))

export const useDocumentStore = create((set, get) => ({
  documents: [],
  document: null,
  isLoading: false,
  error: null,
  totalCount: 0,

  fetchDocuments: async (page = 1) => {
    set({ isLoading: true, error: null })
    try {
      const response = await api.getDocuments(page)
      set({
        documents: response.results || [],
        totalCount: response.count || 0,
        isLoading: false,
      })
      return response
    } catch (error) {
      set({ error: error.message, isLoading: false })
      throw error
    }
  },

  fetchDocument: async (id) => {
    set({ isLoading: true, error: null })
    try {
      const response = await api.getDocument(id)
      set({ document: response, isLoading: false })
      return response
    } catch (error) {
      set({ error: error.message, isLoading: false })
      throw error
    }
  },

  createDocument: async (formData) => {
    set({ isLoading: true, error: null })
    try {
      const response = await api.createDocument(formData)
      set({ isLoading: false })
      // Refresh documents list
      get().fetchDocuments()
      return response
    } catch (error) {
      set({ error: error.message, isLoading: false })
      throw error
    }
  },

  deleteDocument: async (id) => {
    set({ isLoading: true, error: null })
    try {
      await api.deleteDocument(id)
      set({ isLoading: false })
      // Refresh documents list
      get().fetchDocuments()
    } catch (error) {
      set({ error: error.message, isLoading: false })
      throw error
    }
  },

  clearDocument: () => set({ document: null }),
  clearError: () => set({ error: null }),
}))

export const useAuditLogStore = create((set) => ({
  logs: [],
  isLoading: false,
  error: null,
  totalCount: 0,

  fetchAuditLogs: async (page = 1) => {
    set({ isLoading: true, error: null })
    try {
      const response = await api.getAuditLogs(page)
      set({
        logs: response.results || [],
        totalCount: response.count || 0,
        isLoading: false,
      })
      return response
    } catch (error) {
      set({ error: error.message, isLoading: false })
      throw error
    }
  },

  clearError: () => set({ error: null }),
}))
