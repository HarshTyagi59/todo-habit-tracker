import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import { User, Mail, Lock, LogOut, Save, Eye, EyeOff } from 'lucide-react'
import API from '../api/axios'
import toast from 'react-hot-toast'

const Profile = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const [nameForm, setNameForm] = useState({ name: user?.name || '' })
  const [passForm, setPassForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' })
  const [showPass, setShowPass] = useState(false)
  const [loadingName, setLoadingName] = useState(false)
  const [loadingPass, setLoadingPass] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/login')
    toast.success('Logged out successfully!')
  }

  const handleNameUpdate = async (e) => {
    e.preventDefault()
    if (!nameForm.name.trim()) return toast.error('Name cannot be empty')
    setLoadingName(true)
    try {
      await API.put('/auth/profile', { name: nameForm.name })
      toast.success('Name updated successfully! ✅')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed')
    } finally {
      setLoadingName(false)
    }
  }

  const handlePassUpdate = async (e) => {
    e.preventDefault()
    if (passForm.newPassword.length < 6) return toast.error('Password must be at least 6 characters')
    if (passForm.newPassword !== passForm.confirmPassword) return toast.error('Passwords do not match!')
    setLoadingPass(true)
    try {
      await API.put('/auth/password', {
        currentPassword: passForm.currentPassword,
        newPassword: passForm.newPassword
      })
      toast.success('Password updated successfully! 🔐')
      setPassForm({ currentPassword: '', newPassword: '', confirmPassword: '' })
    } catch (err) {
      toast.error(err.response?.data?.message || 'Password update failed')
    } finally {
      setLoadingPass(false)
    }
  }

  const cardStyle = {
    background: 'var(--bg-secondary)',
    border: '1px solid var(--border)',
    borderRadius: '16px', padding: '24px',
    marginBottom: '20px'
  }

  const inputStyle = {
    width: '100%', padding: '12px',
    borderRadius: '8px', border: '1px solid var(--border)',
    background: 'var(--bg-primary)', color: 'var(--text-primary)',
    fontSize: '14px', outline: 'none', boxSizing: 'border-box'
  }

  return (
    <div style={{ maxWidth: '600px' }}>

      {/* Header */}
      <div style={{ marginBottom: '28px' }}>
        <h1 style={{ color: 'var(--text-primary)', fontSize: '26px', margin: 0 }}>
          Profile 👤
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginTop: '6px' }}>
          Manage your account settings
        </p>
      </div>

      {/* Avatar + Info Card */}
      <div style={cardStyle}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          {/* Avatar */}
          <div style={{
            width: '72px', height: '72px', borderRadius: '50%',
            background: 'var(--accent)', display: 'flex',
            alignItems: 'center', justifyContent: 'center',
            fontSize: '28px', fontWeight: 700, color: 'white',
            flexShrink: 0
          }}>
            {user?.name?.charAt(0).toUpperCase()}
          </div>

          <div>
            <h2 style={{ color: 'var(--text-primary)', margin: '0 0 4px', fontSize: '20px' }}>
              {user?.name}
            </h2>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-secondary)', fontSize: '14px' }}>
              <Mail size={14} />
              {user?.email}
            </div>
            <div style={{
              marginTop: '8px', fontSize: '12px', padding: '3px 10px',
              background: 'rgba(99,102,241,0.1)', color: 'var(--accent)',
              borderRadius: '20px', display: 'inline-block',
              border: '1px solid var(--accent)'
            }}>
              ✅ Active Account
            </div>
          </div>
        </div>
      </div>

      {/* Update Name */}
      <div style={cardStyle}>
        <h3 style={{ color: 'var(--text-primary)', margin: '0 0 16px', fontSize: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <User size={18} /> Update Name
        </h3>
        <form onSubmit={handleNameUpdate} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <input
            placeholder="Full Name"
            value={nameForm.name}
            onChange={e => setNameForm({ name: e.target.value })}
            style={inputStyle}
          />
          <button type="submit" disabled={loadingName} style={{
            padding: '12px', borderRadius: '8px', border: 'none',
            background: 'var(--accent)', color: 'white',
            fontWeight: 600, cursor: 'pointer', fontSize: '14px',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px'
          }}>
            <Save size={16} />
            {loadingName ? 'Saving...' : 'Save Name'}
          </button>
        </form>
      </div>

      {/* Update Password */}
      <div style={cardStyle}>
        <h3 style={{ color: 'var(--text-primary)', margin: '0 0 16px', fontSize: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Lock size={18} /> Change Password
        </h3>
        <form onSubmit={handlePassUpdate} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <input
            type="password"
            placeholder="Current Password"
            value={passForm.currentPassword}
            onChange={e => setPassForm({ ...passForm, currentPassword: e.target.value })}
            required style={inputStyle}
          />
          <div style={{ position: 'relative' }}>
            <input
              type={showPass ? 'text' : 'password'}
              placeholder="New Password (min 6 characters)"
              value={passForm.newPassword}
              onChange={e => setPassForm({ ...passForm, newPassword: e.target.value })}
              required style={{ ...inputStyle, paddingRight: '44px' }}
            />
            <button type="button" onClick={() => setShowPass(p => !p)} style={{
              position: 'absolute', right: '12px', top: '50%',
              transform: 'translateY(-50%)', background: 'none',
              border: 'none', cursor: 'pointer', color: 'var(--text-secondary)',
              display: 'flex'
            }}>
              {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          <input
            type="password"
            placeholder="Confirm New Password"
            value={passForm.confirmPassword}
            onChange={e => setPassForm({ ...passForm, confirmPassword: e.target.value })}
            required style={inputStyle}
          />
          <button type="submit" disabled={loadingPass} style={{
            padding: '12px', borderRadius: '8px', border: 'none',
            background: 'var(--accent)', color: 'white',
            fontWeight: 600, cursor: 'pointer', fontSize: '14px',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px'
          }}>
            <Lock size={16} />
            {loadingPass ? 'Updating...' : 'Update Password'}
          </button>
        </form>
      </div>

      {/* Logout */}
      <div style={cardStyle}>
        <h3 style={{ color: '#ef4444', margin: '0 0 12px', fontSize: '16px' }}>
          Danger Zone
        </h3>
        <p style={{ color: 'var(--text-secondary)', fontSize: '13px', marginBottom: '16px' }}>
          You will be logged out of your account.
        </p>
        <button onClick={handleLogout} style={{
          padding: '12px 24px', borderRadius: '8px',
          border: '1px solid #ef4444', background: 'none',
          color: '#ef4444', fontWeight: 600, cursor: 'pointer',
          fontSize: '14px', display: 'flex', alignItems: 'center', gap: '8px'
        }}
          onMouseEnter={e => e.currentTarget.style.background = 'rgba(239,68,68,0.1)'}
          onMouseLeave={e => e.currentTarget.style.background = 'none'}
        >
          <LogOut size={16} /> Logout
        </button>
      </div>
    </div>
  )
}

export default Profile