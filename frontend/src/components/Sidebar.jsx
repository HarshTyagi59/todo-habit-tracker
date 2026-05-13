import { NavLink } from 'react-router-dom'
import { LayoutDashboard, CheckSquare, Flame, User } from 'lucide-react'

const Sidebar = ({ isOpen }) => {
  const links = [
    { to: '/', icon: <LayoutDashboard size={20} />, label: 'Dashboard' },
    { to: '/tasks', icon: <CheckSquare size={20} />, label: 'Tasks' },
    { to: '/habits', icon: <Flame size={20} />, label: 'Habits' },
    { to: '/profile', icon: <User size={20} />, label: 'Profile' },
  ]

  return (
    <div style={{
      position: 'fixed', left: 0, top: 0, height: '100vh',
      width: '240px', background: 'var(--bg-secondary)',
      borderRight: '1px solid var(--border)', padding: '24px 16px',
      transform: isOpen ? 'translateX(0)' : 'translateX(-100%)',
      transition: 'transform 0.3s', zIndex: 100,
      display: 'flex', flexDirection: 'column', gap: '8px'
    }}>
      {/* Logo */}
      <div style={{ padding: '8px 12px', marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            background: 'var(--accent)', borderRadius: '10px',
            padding: '8px', display: 'flex'
          }}>
            <Flame size={20} color="white" />
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: '16px', color: 'var(--text-primary)' }}>
              FocusFlow
            </div>
            <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
              Todo + Habits
            </div>
          </div>
        </div>
      </div>

      {/* Nav Links */}
      {links.map(link => (
        <NavLink key={link.to} to={link.to} end={link.to === '/'}
          style={({ isActive }) => ({
            display: 'flex', alignItems: 'center', gap: '12px',
            padding: '12px 16px', borderRadius: '10px', textDecoration: 'none',
            color: isActive ? 'white' : 'var(--text-secondary)',
            background: isActive ? 'var(--accent)' : 'transparent',
            fontWeight: isActive ? 600 : 400, fontSize: '14px',
            transition: 'all 0.2s'
          })}>
          {link.icon}
          {link.label}
        </NavLink>
      ))}
    </div>
  )
}

export default Sidebar