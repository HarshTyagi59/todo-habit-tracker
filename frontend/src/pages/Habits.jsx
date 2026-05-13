import { useState, useEffect } from 'react'
import API from '../api/axios'
import toast from 'react-hot-toast'
import { Plus } from 'lucide-react'
import HabitCard from '../components/HabitCard'

const HABIT_COLORS = [
  '#6366f1', '#f59e0b', '#22c55e', '#ef4444',
  '#8b5cf6', '#06b6d4', '#f97316', '#ec4899'
]

// ✅ Shared local date helper
const getLocalDateString = (date = new Date()) => {
  const d = new Date(date)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

const Habits = () => {
  const [habits, setHabits] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState({
    title: '', frequency: 'daily', color: '#6366f1', description: ''
  })

  useEffect(() => {
    fetchHabits()
  }, [])

  const fetchHabits = async () => {
    try {
      const { data } = await API.get('/habits')
      setHabits(data)
    } catch (err) {
      toast.error('Failed to load habits')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const { data } = await API.post('/habits', form)
      setHabits([...habits, data])
      setShowModal(false)
      setForm({ title: '', frequency: 'daily', color: '#6366f1', description: '' })
      toast.success('Habit created! 🔥 Start your streak!')
    } catch (err) {
      toast.error('Failed to create habit')
    }
  }

  const markHabit = async (id) => {
    try {
      const { data } = await API.put(`/habits/${id}/complete`)
      // ✅ Replace entire habit object with fresh data from backend
      setHabits(prev => prev.map(h => h._id === id ? data : h))

      // ✅ Check completion using local date on fresh data
      const today = getLocalDateString()
      const nowCompleted = data.completedDates?.some(
        d => getLocalDateString(d) === today
      )
      toast.success(nowCompleted ? 'Habit marked! Keep it up! 🔥' : 'Habit unmarked')
    } catch (err) {
      toast.error('Something went wrong!')
    }
  }

  const deleteHabit = async (id) => {
    if (!window.confirm('Delete this habit? Your streak will be lost!')) return
    try {
      await API.delete(`/habits/${id}`)
      setHabits(habits.filter(h => h._id !== id))
      toast.success('Habit deleted')
    } catch (err) {
      toast.error('Delete failed')
    }
  }

  // ✅ Stats using local date
  const today = getLocalDateString()
  const totalHabits = habits.length
  const completedToday = habits.filter(h =>
    h.completedDates?.some(d => getLocalDateString(d) === today)
  ).length
  const bestStreak = habits.reduce((max, h) => Math.max(max, h.streak || 0), 0)

  if (loading) return (
    <div style={{ color: 'var(--text-primary)', textAlign: 'center', marginTop: '50px' }}>
      Loading habits...
    </div>
  )

  return (
    <div>
      {/* Header */}
      <div style={{
        display: 'flex', justifyContent: 'space-between',
        alignItems: 'center', marginBottom: '30px'
      }}>
        <div>
          <h1 style={{ color: 'var(--text-primary)', fontSize: '28px', margin: 0 }}>
            My Habits 🔥
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginTop: '4px' }}>
            {completedToday}/{totalHabits} habits done today
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          style={{
            background: 'var(--accent)', color: 'white', border: 'none',
            padding: '12px 20px', borderRadius: '12px', cursor: 'pointer',
            display: 'flex', alignItems: 'center', gap: '8px',
            fontWeight: 600, fontSize: '14px'
          }}
        >
          <Plus size={20} /> Add Habit
        </button>
      </div>

      {/* ✅ Stats Row - now uses local date */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '28px' }}>
        {[
          { label: 'Total Habits', value: totalHabits, color: '#6366f1', emoji: '📋' },
          { label: 'Done Today', value: completedToday, color: '#22c55e', emoji: '✅' },
          { label: 'Remaining', value: totalHabits - completedToday, color: '#f59e0b', emoji: '⏳' },
          { label: 'Best Streak', value: `${bestStreak} 🔥`, color: '#ef4444', emoji: '🏆' },
        ].map(stat => (
          <div key={stat.label} style={{
            flex: 1, background: 'var(--bg-secondary)',
            border: '1px solid var(--border)', borderRadius: '12px',
            padding: '16px', textAlign: 'center'
          }}>
            <div style={{ fontSize: '22px', marginBottom: '4px' }}>{stat.emoji}</div>
            <div style={{ fontSize: '22px', fontWeight: 700, color: stat.color }}>
              {stat.value}
            </div>
            <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '4px' }}>
              {stat.label}
            </div>
          </div>
        ))}
      </div>

      {/* Habits Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
        gap: '16px'
      }}>
        {habits.length > 0 ? (
          habits.map(habit => (
            <HabitCard
              key={habit._id}
              habit={habit}
              onMark={markHabit}
              onDelete={deleteHabit}
            />
          ))
        ) : (
          <div style={{
            gridColumn: '1/-1', textAlign: 'center',
            color: 'var(--text-secondary)', marginTop: '60px'
          }}>
            <div style={{ fontSize: '50px', marginBottom: '16px' }}>🔥</div>
            <div style={{ fontSize: '16px' }}>No habits yet. Build your first streak!</div>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
          background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center',
          justifyContent: 'center', zIndex: 1000, backdropFilter: 'blur(4px)'
        }}>
          <div style={{
            background: 'var(--bg-secondary)', padding: '30px', borderRadius: '20px',
            width: '100%', maxWidth: '440px', border: '1px solid var(--border)',
            margin: '0 16px'
          }}>
            <h2 style={{ color: 'var(--text-primary)', marginBottom: '20px', marginTop: 0 }}>
              New Habit 🔥
            </h2>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

              <input
                placeholder="Habit name (e.g. Morning Run)" required
                value={form.title}
                onChange={e => setForm({ ...form, title: e.target.value })}
                style={{
                  padding: '12px', borderRadius: '8px',
                  border: '1px solid var(--border)', background: 'var(--bg-primary)',
                  color: 'var(--text-primary)', fontSize: '14px', outline: 'none'
                }}
              />

              <input
                placeholder="Description (optional)"
                value={form.description}
                onChange={e => setForm({ ...form, description: e.target.value })}
                style={{
                  padding: '12px', borderRadius: '8px',
                  border: '1px solid var(--border)', background: 'var(--bg-primary)',
                  color: 'var(--text-primary)', fontSize: '14px', outline: 'none'
                }}
              />

              <select
                value={form.frequency}
                onChange={e => setForm({ ...form, frequency: e.target.value })}
                style={{
                  padding: '12px', borderRadius: '8px',
                  border: '1px solid var(--border)', background: 'var(--bg-primary)',
                  color: 'var(--text-primary)', fontSize: '14px', outline: 'none'
                }}
              >
                <option value="daily">📅 Daily</option>
                <option value="weekly">📆 Weekly</option>
              </select>

              {/* Color Picker */}
              <div>
                <div style={{
                  fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '8px'
                }}>
                  Choose Color
                </div>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {HABIT_COLORS.map(color => (
                    <button key={color} type="button"
                      onClick={() => setForm({ ...form, color })}
                      style={{
                        width: '32px', height: '32px', borderRadius: '50%',
                        background: color,
                        border: form.color === color ? '3px solid white' : '2px solid transparent',
                        cursor: 'pointer',
                        outline: form.color === color ? `2px solid ${color}` : 'none'
                      }}
                    />
                  ))}
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px', marginTop: '6px' }}>
                <button type="button" onClick={() => setShowModal(false)} style={{
                  flex: 1, padding: '12px', borderRadius: '8px',
                  border: '1px solid var(--border)', background: 'none',
                  color: 'var(--text-primary)', cursor: 'pointer', fontSize: '14px'
                }}>
                  Cancel
                </button>
                <button type="submit" style={{
                  flex: 1, padding: '12px', borderRadius: '8px',
                  border: 'none', background: 'var(--accent)',
                  color: 'white', fontWeight: 600, cursor: 'pointer', fontSize: '14px'
                }}>
                  Create Habit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default Habits