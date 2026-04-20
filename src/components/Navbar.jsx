// components/Navbar.jsx
import { Link, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store'
import { LogOut, Menu } from 'lucide-react'

function Navbar() {
  const { user, logout } = useAuthStore()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand">
        📚 CIT Document Tracker
      </Link>
      <div className="flex gap-2">
        <span style={{ marginRight: '2rem' }}>Welcome, {user?.username || 'User'}</span>
        <button className="btn btn-danger btn-small" onClick={handleLogout}>
          <LogOut size={16} />
          Logout
        </button>
      </div>
    </nav>
  )
}

export default Navbar
