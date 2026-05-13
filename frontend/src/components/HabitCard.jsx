import { Trash2, Flame, CheckCircle, Circle } from 'lucide-react'

// ✅ Fix: Use local date instead of UTC
const getLocalDateString = (date = new Date()) => {
  const d = new Date(date)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

const HabitCard = ({ habit, onMark, onDelete }) => {
  const today = getLocalDateString()

  // ✅ Fix: Using local date comparison
  const completedToday = habit.completedDates?.some(
    d => getLocalDateString(d) === today
  )

  // Last 7 days using local dates
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date()
    d.setDate(d.getDate() - (6 - i))
    return getLocalDateString(d)
  })

  return (
    <div style={{
      background: 'var(--bg-secondary)',
      border: `1px solid ${completedToday ? 'var(--accent)' : 'var(--border)'}`,
      borderRadius: '14px', padding: '18px',
      transition: 'all 0.2s',
      boxShadow: completedToday ? '0 0 0 1px var(--accent)' : 'none'
    }}>

      {/* Top Row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>

          {/* Color Circle */}
          <div style={{
            width: '44px', height: '44px', borderRadius: '12px',
            background: habit.color || '#6366f1',
            display: 'flex', alignItems: 'center',
            justifyContent: 'center', fontSize: '20px', flexShrink: 0
          }}>
            🔥
          </div>

          <div>
            <div style={{
              fontSize: '16px', fontWeight: 600,
              color: 'var(--text-primary)', marginBottom: '4px'
            }}>
              {habit.title}
            </div>
            <div style={{
              display: 'flex', alignItems: 'center', gap: '6px',
              color: '#f97316', fontSize: '13px', fontWeight: 600
            }}>
              <Flame size={14} />
              {habit.streak || 0} day streak
            </div>
          </div>
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>

          {/* ✅ Fixed Mark Done Button */}
          <button
            onClick={() => onMark(habit._id)}
            style={{
              background: completedToday ? '#22c55e' : 'var(--bg-primary)',
              border: `2px solid ${completedToday ? '#22c55e' : 'var(--border)'}`,
              borderRadius: '10px', padding: '8px 14px',
              cursor: 'pointer',
              color: completedToday ? 'white' : 'var(--text-secondary)',
              fontWeight: 600, fontSize: '13px',
              display: 'flex', alignItems: 'center', gap: '6px',
              transition: 'all 0.2s'
            }}
          >
            {completedToday
              ? <><CheckCircle size={16} /> Done! ✅</>
              : <><Circle size={16} /> Mark Done</>
            }
          </button>

          {/* Delete */}
          <button
            onClick={() => onDelete(habit._id)}
            style={{
              background: 'none', border: 'none', cursor: 'pointer',
              color: '#ef4444', padding: '8px', borderRadius: '8px',
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(239,68,68,0.1)'}
            onMouseLeave={e => e.currentTarget.style.background = 'none'}
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      {/* Description */}
      {habit.description && (
        <div style={{
          marginTop: '10px', fontSize: '13px',
          color: 'var(--text-secondary)', fontStyle: 'italic'
        }}>
          {habit.description}
        </div>
      )}

      {/* Last 7 Days */}
      <div style={{ marginTop: '16px' }}>
        <div style={{
          fontSize: '11px', color: 'var(--text-secondary)',
          marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px'
        }}>
          Last 7 Days
        </div>
        <div style={{ display: 'flex', gap: '6px' }}>
          {last7Days.map(day => {
            const done = habit.completedDates?.some(
              d => getLocalDateString(d) === day
            )
            const isToday = day === today
            const dayLabel = new Date(day + 'T12:00:00')
              .toLocaleDateString('en-US', { weekday: 'short' }).slice(0, 1)

            return (
              <div key={day} style={{
                display: 'flex', flexDirection: 'column',
                alignItems: 'center', gap: '4px'
              }}>
                <div style={{
                  width: '32px', height: '32px', borderRadius: '8px',
                  background: done ? (habit.color || 'var(--accent)') : 'var(--bg-primary)',
                  border: isToday
                    ? `2px solid ${habit.color || 'var(--accent)'}`
                    : '1px solid var(--border)',
                  display: 'flex', alignItems: 'center',
                  justifyContent: 'center', fontSize: '14px',
                  color: done ? 'white' : 'transparent',
                  fontWeight: 700
                }}>
                  {done ? '✓' : ''}
                </div>
                <span style={{
                  fontSize: '10px',
                  color: isToday ? 'var(--accent)' : 'var(--text-secondary)',
                  fontWeight: isToday ? 700 : 400
                }}>
                  {dayLabel}
                </span>
              </div>
            )
          })}
        </div>
      </div>

      {/* Frequency Badge */}
      <div style={{ marginTop: '12px' }}>
        <span style={{
          fontSize: '11px', padding: '3px 10px', borderRadius: '20px',
          background: 'var(--bg-primary)', color: 'var(--text-secondary)',
          border: '1px solid var(--border)', textTransform: 'capitalize'
        }}>
          📅 {habit.frequency} habit
        </span>
      </div>
    </div>
  )
}

export default HabitCard