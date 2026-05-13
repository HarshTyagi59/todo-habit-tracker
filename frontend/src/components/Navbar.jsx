import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'
import { Sun, Moon, LogOut, Menu } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

const Navbar = ({ toggleSidebar }) => {
  const { user, logout } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div style={{
      height: '64px', background: 'var(--bg-secondary)',
      borderBottom: '1px solid var(--border)',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '0 24px', position: 'sticky', top: 0, zIndex: 99
    }}>
      <button onClick={toggleSidebar} style={{
        background: 'none', border: 'none', color: 'var(--text-secondary)',
        padding: '8px', borderRadius: '8px', display: 'flex'
      }}>
        <Menu size={20} />
      </button>

      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        {/* Theme Toggle */}
        <button onClick={toggleTheme} style={{
          background: 'var(--bg-hover)', border: 'none', color: 'var(--text-primary)',
          padding: '8px', borderRadius: '8px', display: 'flex', transition: 'all 0.2s'
        }}>
          {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        {/* User Info */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: '10px',
          background: 'var(--bg-hover)', padding: '6px 12px', borderRadius: '10px'
        }}>
          <div style={{
            width: '32px', height: '32px', borderRadius: '50%',
            background: 'var(--accent)', display: 'flex',
            alignItems: 'center', justifyContent: 'center',
            fontWeight: 700, fontSize: '14px', color: 'white'
          }}>
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <span style={{ fontSize: '14px', fontWeight: 500, color: 'var(--text-primary)' }}>
            {user?.name}
          </span>
        </div>

        {/* Logout */}
        <button onClick={handleLogout} style={{
          background: 'none', border: '1px solid var(--border)',
          color: 'var(--text-secondary)', padding: '8px 12px',
          borderRadius: '8px', display: 'flex', alignItems: 'center',
          gap: '6px', fontSize: '13px', transition: 'all 0.2s'
        }}>
          <LogOut size={16} /> Logout
        </button>
      </div>
    </div>
  )
}

export default Navbar