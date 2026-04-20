// components/Sidebar.jsx
import { Link, useLocation } from 'react-router-dom'
import { useAuthStore } from '../store'
import { 
  Home, FileText, Plus, BarChart3, ScrollText, Shield, QrCode 
} from 'lucide-react'

function Sidebar() {
  const location = useLocation()
  const { user } = useAuthStore()
  const isAdmin = user?.profile?.role === 'admin'

  const isActive = (path) => location.pathname === path ? 'active' : ''

  return (
    <aside className="sidebar">
      <nav className="sidebar-menu">
        <Link to="/" className={`${isActive('/')}`}>
          <Home size={20} />
          Dashboard
        </Link>
        <Link to="/documents" className={`${isActive('/documents')}`}>
          <FileText size={20} />
          My Documents
        </Link>
        <Link to="/documents/create" className={`${isActive('/documents/create')}`}>
          <Plus size={20} />
          Create Document
        </Link>
        <Link to="/qr" className={`${isActive('/qr')}`}>
          <QrCode size={20} />
          Scan QR Code
        </Link>
        <Link to="/audit-logs" className={`${isActive('/audit-logs')}`}>
          <ScrollText size={20} />
          Audit Logs
        </Link>
        {isAdmin && (
          <Link to="/admin" className={`${isActive('/admin')}`}>
            <Shield size={20} />
            Admin Panel
          </Link>
        )}
      </nav>
    </aside>
  )
}

export default Sidebar
