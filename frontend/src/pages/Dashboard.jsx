import { useState, useEffect } from 'react'
import API from '../api/axios'
import { useAuth } from '../context/AuthContext'
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend,
  LineChart, Line
} from 'recharts'

const getLocalDateString = (date = new Date()) => {
  const d = new Date(date)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

const Dashboard = () => {
  const { user } = useAuth()
  const [tasks, setTasks] = useState([])
  const [habits, setHabits] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [taskRes, habitRes] = await Promise.all([
          API.get('/tasks'),
          API.get('/habits')
        ])
        setTasks(taskRes.data)
        setHabits(habitRes.data)
      } catch (err) {
        console.error('Dashboard fetch error', err)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  if (loading) return (
    <div style={{ color: 'var(--text-primary)', textAlign: 'center', marginTop: '80px', fontSize: '16px' }}>
      Loading Dashboard...
    </div>
  )

  // ─── Task Stats ───
  const today = getLocalDateString()
  const totalTasks = tasks.length
  const completedTasks = tasks.filter(t => t.completed).length
  const pendingTasks = tasks.filter(t => !t.completed).length
  const overdueTasks = tasks.filter(t =>
    !t.completed && t.dueDate && new Date(t.dueDate) < new Date()
  ).length

  // ─── Habit Stats ───
  const totalHabits = habits.length
  const completedTodayHabits = habits.filter(h =>
    h.completedDates?.some(d => getLocalDateString(d) === today)
  ).length
  const bestStreak = habits.reduce((max, h) => Math.max(max, h.streak || 0), 0)

  // ─── Pie Chart — Task Priority Distribution ───
  const priorityData = [
    { name: 'High 🔴', value: tasks.filter(t => t.priority === 'high').length, color: '#ef4444' },
    { name: 'Medium 🟡', value: tasks.filter(t => t.priority === 'medium').length, color: '#f59e0b' },
    { name: 'Low 🟢', value: tasks.filter(t => t.priority === 'low').length, color: '#22c55e' },
  ].filter(d => d.value > 0)

  // ─── Pie Chart — Task Category Breakdown ───
  const categoryData = ['work', 'personal', 'college', 'shopping', 'other'].map(cat => ({
    name: cat.charAt(0).toUpperCase() + cat.slice(1),
    value: tasks.filter(t => t.category === cat).length,
  })).filter(d => d.value > 0)
  const CATEGORY_COLORS = ['#6366f1', '#f59e0b', '#22c55e', '#ef4444', '#8b5cf6']

  // ─── Bar Chart — Last 7 Days Tasks Completed ───
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date()
    d.setDate(d.getDate() - (6 - i))
    const dateStr = getLocalDateString(d)
    const label = d.toLocaleDateString('en-US', { weekday: 'short' })
    const completed = tasks.filter(t =>
      t.completed && t.updatedAt && getLocalDateString(t.updatedAt) === dateStr
    ).length
    return { day: label, Completed: completed }
  })

  // ─── Line Chart — Habit Streaks ───
  const habitStreakData = habits.map(h => ({
    name: h.title.length > 10 ? h.title.slice(0, 10) + '...' : h.title,
    Streak: h.streak || 0
  }))

  // ─── Bar Chart — Habit completion this week ───
  const habitWeekData = Array.from({ length: 7 }, (_, i) => {
    const d = new Date()
    d.setDate(d.getDate() - (6 - i))
    const dateStr = getLocalDateString(d)
    const label = d.toLocaleDateString('en-US', { weekday: 'short' })
    const done = habits.filter(h =>
      h.completedDates?.some(cd => getLocalDateString(cd) === dateStr)
    ).length
    return { day: label, Habits: done }
  })

  const cardStyle = {
    background: 'var(--bg-secondary)',
    border: '1px solid var(--border)',
    borderRadius: '16px', padding: '20px'
  }

  return (
    <div>
      {/* Welcome Header */}
      <div style={{ marginBottom: '28px' }}>
        <h1 style={{ color: 'var(--text-primary)', fontSize: '26px', margin: 0 }}>
          Good {new Date().getHours() < 12 ? 'Morning' : new Date().getHours() < 17 ? 'Afternoon' : 'Evening'}, {user?.name?.split(' ')[0]}! 👋
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginTop: '6px' }}>
          {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
        </p>
      </div>

      {/* ── Summary Cards ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '28px' }}>
        {[
          { label: 'Total Tasks', value: totalTasks, color: '#6366f1', emoji: '📋', sub: `${completedTasks} completed` },
          { label: 'Pending Tasks', value: pendingTasks, color: '#f59e0b', emoji: '⏳', sub: `${overdueTasks} overdue` },
          { label: 'Habits Today', value: `${completedTodayHabits}/${totalHabits}`, color: '#22c55e', emoji: '🔥', sub: 'completed today' },
          { label: 'Best Streak', value: `${bestStreak} days`, color: '#ef4444', emoji: '🏆', sub: 'keep it up!' },
        ].map(card => (
          <div key={card.label} style={cardStyle}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <p style={{ margin: 0, fontSize: '13px', color: 'var(--text-secondary)' }}>{card.label}</p>
                <p style={{ margin: '8px 0 4px', fontSize: '28px', fontWeight: 700, color: card.color }}>{card.value}</p>
                <p style={{ margin: 0, fontSize: '12px', color: 'var(--text-secondary)' }}>{card.sub}</p>
              </div>
              <span style={{ fontSize: '32px' }}>{card.emoji}</span>
            </div>
          </div>
        ))}
      </div>

      {/* ── Row 1: Pie Charts ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>

        {/* Priority Pie */}
        <div style={cardStyle}>
          <h3 style={{ color: 'var(--text-primary)', margin: '0 0 20px', fontSize: '16px' }}>
            📊 Task Priority Distribution
          </h3>
          {priorityData.length > 0 ? (
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={priorityData} cx="50%" cy="50%" outerRadius={80}
                  dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  labelLine={false}
                >
                  {priorityData.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: '8px' }}
                  labelStyle={{ color: 'var(--text-primary)' }}
                />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div style={{ textAlign: 'center', color: 'var(--text-secondary)', padding: '60px 0' }}>
              No tasks yet 📋
            </div>
          )}
        </div>

        {/* Category Pie */}
        <div style={cardStyle}>
          <h3 style={{ color: 'var(--text-primary)', margin: '0 0 20px', fontSize: '16px' }}>
            🏷️ Task Category Breakdown
          </h3>
          {categoryData.length > 0 ? (
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={categoryData} cx="50%" cy="50%" innerRadius={50} outerRadius={80}
                  dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  labelLine={false}
                >
                  {categoryData.map((entry, i) => (
                    <Cell key={i} fill={CATEGORY_COLORS[i % CATEGORY_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: '8px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div style={{ textAlign: 'center', color: 'var(--text-secondary)', padding: '60px 0' }}>
              No tasks yet 📋
            </div>
          )}
        </div>
      </div>

      {/* ── Row 2: Bar Charts ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>

        {/* Tasks Completed This Week */}
        <div style={cardStyle}>
          <h3 style={{ color: 'var(--text-primary)', margin: '0 0 20px', fontSize: '16px' }}>
            ✅ Tasks Completed — Last 7 Days
          </h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={last7Days}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="day" tick={{ fill: 'var(--text-secondary)', fontSize: 12 }} />
              <YAxis tick={{ fill: 'var(--text-secondary)', fontSize: 12 }} allowDecimals={false} />
              <Tooltip
                contentStyle={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: '8px' }}
                labelStyle={{ color: 'var(--text-primary)' }}
              />
              <Bar dataKey="Completed" fill="#6366f1" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Habits Done This Week */}
        <div style={cardStyle}>
          <h3 style={{ color: 'var(--text-primary)', margin: '0 0 20px', fontSize: '16px' }}>
            🔥 Habits Completed — Last 7 Days
          </h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={habitWeekData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="day" tick={{ fill: 'var(--text-secondary)', fontSize: 12 }} />
              <YAxis tick={{ fill: 'var(--text-secondary)', fontSize: 12 }} allowDecimals={false} />
              <Tooltip
                contentStyle={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: '8px' }}
                labelStyle={{ color: 'var(--text-primary)' }}
              />
              <Bar dataKey="Habits" fill="#f97316" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ── Row 3: Line Chart + Recent Tasks ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>

        {/* Habit Streak Line Chart */}
        <div style={cardStyle}>
          <h3 style={{ color: 'var(--text-primary)', margin: '0 0 20px', fontSize: '16px' }}>
            📈 Habit Streak Overview
          </h3>
          {habitStreakData.length > 0 ? (
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={habitStreakData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="name" tick={{ fill: 'var(--text-secondary)', fontSize: 11 }} />
                <YAxis tick={{ fill: 'var(--text-secondary)', fontSize: 12 }} allowDecimals={false} />
                <Tooltip
                  contentStyle={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: '8px' }}
                  labelStyle={{ color: 'var(--text-primary)' }}
                />
                <Line type="monotone" dataKey="Streak" stroke="#22c55e"
                  strokeWidth={2} dot={{ fill: '#22c55e', r: 5 }} />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div style={{ textAlign: 'center', color: 'var(--text-secondary)', padding: '60px 0' }}>
              No habits yet 🔥
            </div>
          )}
        </div>

        {/* Recent Tasks */}
        <div style={cardStyle}>
          <h3 style={{ color: 'var(--text-primary)', margin: '0 0 16px', fontSize: '16px' }}>
            🕐 Recent Tasks
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {tasks.slice(0, 5).map(task => (
              <div key={task._id} style={{
                display: 'flex', justifyContent: 'space-between',
                alignItems: 'center', padding: '10px 12px',
                background: 'var(--bg-primary)', borderRadius: '10px',
                border: '1px solid var(--border)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ fontSize: '16px' }}>
                    {task.completed ? '✅' : '⏳'}
                  </span>
                  <span style={{
                    fontSize: '13px', color: 'var(--text-primary)',
                    textDecoration: task.completed ? 'line-through' : 'none',
                    opacity: task.completed ? 0.6 : 1
                  }}>
                    {task.title}
                  </span>
                </div>
                <span style={{
                  fontSize: '10px', fontWeight: 700, padding: '2px 8px',
                  borderRadius: '4px', textTransform: 'uppercase',
                  background: task.priority === 'high' ? '#fee2e2' : task.priority === 'medium' ? '#fef9c3' : '#dcfce7',
                  color: task.priority === 'high' ? '#ef4444' : task.priority === 'medium' ? '#ca8a04' : '#16a34a',
                }}>
                  {task.priority}
                </span>
              </div>
            ))}
            {tasks.length === 0 && (
              <div style={{ textAlign: 'center', color: 'var(--text-secondary)', padding: '30px 0' }}>
                No tasks yet ✨
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Progress Bar Today ── */}
      <div style={cardStyle}>
        <h3 style={{ color: 'var(--text-primary)', margin: '0 0 16px', fontSize: '16px' }}>
          🎯 Today's Overall Progress
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {/* Tasks Progress */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
              <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Tasks Completed</span>
              <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>
                {completedTasks}/{totalTasks}
              </span>
            </div>
            <div style={{ background: 'var(--bg-primary)', borderRadius: '999px', height: '10px', overflow: 'hidden' }}>
              <div style={{
                height: '100%', borderRadius: '999px',
                background: 'linear-gradient(90deg, #6366f1, #8b5cf6)',
                width: totalTasks > 0 ? `${(completedTasks / totalTasks) * 100}%` : '0%',
                transition: 'width 0.5s ease'
              }} />
            </div>
          </div>

          {/* Habits Progress */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
              <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Habits Done Today</span>
              <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>
                {completedTodayHabits}/{totalHabits}
              </span>
            </div>
            <div style={{ background: 'var(--bg-primary)', borderRadius: '999px', height: '10px', overflow: 'hidden' }}>
              <div style={{
                height: '100%', borderRadius: '999px',
                background: 'linear-gradient(90deg, #f97316, #ef4444)',
                width: totalHabits > 0 ? `${(completedTodayHabits / totalHabits) * 100}%` : '0%',
                transition: 'width 0.5s ease'
              }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard