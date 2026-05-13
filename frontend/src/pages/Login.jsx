import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import API from '../api/axios'
import toast from 'react-hot-toast'
import { Flame, Mail, Lock, Eye, EyeOff } from 'lucide-react'

const Login = () => {
  const [form, setForm] = useState({ email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [showPass, setShowPass] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const { data } = await API.post('/auth/login', form)
      login(data)
      toast.success(`Welcome back, ${data.name}! 👋`)
      navigate('/')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  const inputStyle = {
    width: '100%', padding: '12px 16px 12px 44px',
    background: 'var(--bg-primary)', border: '1px solid var(--border)',
    borderRadius: '10px', color: 'var(--text-primary)', fontSize: '14px',
    outline: 'none', transition: 'border 0.2s'
  }

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center',
      justifyContent: 'center', background: 'var(--bg-primary)', padding: '20px'
    }}>
      <div style={{
        width: '100%', maxWidth: '420px',
        background: 'var(--bg-secondary)', borderRadius: '20px',
        padding: '40px', border: '1px solid var(--border)',
        boxShadow: 'var(--shadow)'
      }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{
            background: 'var(--accent)', borderRadius: '16px',
            padding: '14px', display: 'inline-flex', marginBottom: '16px'
          }}>
            <Flame size={28} color="white" />
          </div>
          <h1 style={{ fontSize: '24px', fontWeight: 700, color: 'var(--text-primary)' }}>
            Welcome back
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginTop: '6px' }}>
            Sign in to FocusFlow
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Email */}
          <div style={{ position: 'relative' }}>
            <Mail size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
            <input
              type="email" placeholder="Email address"
              value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
              required style={inputStyle}
            />
          </div>

          {/* Password */}
          <div style={{ position: 'relative' }}>
            <Lock size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
            <input
              type={showPass ? 'text' : 'password'} placeholder="Password"
              value={form.password} onChange={e => setForm({ ...form, password: e.target.value })}
              required style={{ ...inputStyle, paddingRight: '44px' }}
            />
            <button type="button" onClick={() => setShowPass(p => !p)} style={{
              position: 'absolute', right: '14px', top: '50%',
              transform: 'translateY(-50%)', background: 'none',
              border: 'none', color: 'var(--text-secondary)', display: 'flex'
            }}>
              {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>

          {/* Submit */}
          <button type="submit" disabled={loading} style={{
            width: '100%', padding: '13px',
            background: loading ? 'var(--border)' : 'var(--accent)',
            color: 'white', border: 'none', borderRadius: '10px',
            fontSize: '15px', fontWeight: 600, marginTop: '8px',
            transition: 'all 0.2s'
          }}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '24px', color: 'var(--text-secondary)', fontSize: '14px' }}>
          Don't have an account?{' '}
          <Link to="/register" style={{ color: 'var(--accent)', fontWeight: 600, textDecoration: 'none' }}>
            Sign up
          </Link>
        </p>
      </div>
    </div>
  )
}

export default Login