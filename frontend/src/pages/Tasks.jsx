import { useState, useEffect } from 'react'
import API from '../api/axios'
import toast from 'react-hot-toast'
import { Plus, Search } from 'lucide-react'
import TaskCard from '../components/TaskCard'

const Tasks = () => {
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [search, setSearch] = useState('')
  const [form, setForm] = useState({
    title: '', priority: 'medium', category: 'personal', dueDate: '', notes: ''
  })

  useEffect(() => {
    fetchTasks()
  }, [])

  const fetchTasks = async () => {
    try {
      const { data } = await API.get('/tasks')
      setTasks(data)
    } catch (err) {
      toast.error('Failed to load tasks')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const { data } = await API.post('/tasks', form)
      setTasks([...tasks, data])
      setShowModal(false)
      setForm({ title: '', priority: 'medium', category: 'personal', dueDate: '', notes: '' })
      toast.success('Task added successfully! ✅')
    } catch (err) {
      toast.error('Failed to add task')
    }
  }

  const toggleTask = async (id, completed) => {
    try {
      await API.put(`/tasks/${id}`, { completed })
      setTasks(tasks.map(t => t._id === id ? { ...t, completed } : t))
    } catch (err) {
      toast.error('Update failed')
    }
  }

  const deleteTask = async (id) => {
    if (!window.confirm('Delete this task?')) return
    try {
      await API.delete(`/tasks/${id}`)
      setTasks(tasks.filter(t => t._id !== id))
      toast.success('Task deleted')
    } catch (err) {
      toast.error('Delete failed')
    }
  }

  const filteredTasks = tasks.filter(t =>
    t.title.toLowerCase().includes(search.toLowerCase())
  )

  if (loading) return (
    <div style={{ color: 'var(--text-primary)', textAlign: 'center', marginTop: '50px' }}>
      Loading tasks...
    </div>
  )

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <div>
          <h1 style={{ color: 'var(--text-primary)', fontSize: '28px', margin: 0 }}>My Tasks ✅</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginTop: '4px' }}>
            {tasks.filter(t => t.completed).length}/{tasks.length} tasks completed today
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          style={{
            background: 'var(--accent)', color: 'white', border: 'none',
            padding: '12px 20px', borderRadius: '12px', cursor: 'pointer',
            display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 600,
            fontSize: '14px'
          }}
        >
          <Plus size={20} /> Add Task
        </button>
      </div>

      {/* Search */}
      <div style={{ marginBottom: '24px' }}>
        <div style={{ position: 'relative' }}>
          <Search size={18} style={{
            position: 'absolute', left: '12px', top: '50%',
            transform: 'translateY(-50%)', color: 'var(--text-secondary)'
          }} />
          <input
            type="text" placeholder="Search tasks..."
            value={search} onChange={e => setSearch(e.target.value)}
            style={{
              width: '100%', padding: '12px 12px 12px 40px',
              background: 'var(--bg-secondary)', border: '1px solid var(--border)',
              borderRadius: '10px', color: 'var(--text-primary)',
              outline: 'none', fontSize: '14px', boxSizing: 'border-box'
            }}
          />
        </div>
      </div>

      {/* Stats Row */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '24px' }}>
        {[
          { label: 'Total', value: tasks.length, color: '#6366f1' },
          { label: 'Completed', value: tasks.filter(t => t.completed).length, color: '#22c55e' },
          { label: 'Pending', value: tasks.filter(t => !t.completed).length, color: '#f59e0b' },
          { label: 'High Priority', value: tasks.filter(t => t.priority === 'high').length, color: '#ef4444' },
        ].map(stat => (
          <div key={stat.label} style={{
            flex: 1, background: 'var(--bg-secondary)', border: '1px solid var(--border)',
            borderRadius: '12px', padding: '16px', textAlign: 'center'
          }}>
            <div style={{ fontSize: '24px', fontWeight: 700, color: stat.color }}>{stat.value}</div>
            <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px' }}>{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Task List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {filteredTasks.length > 0 ? (
          filteredTasks.map(task => (
            <TaskCard key={task._id} task={task} onToggle={toggleTask} onDelete={deleteTask} />
          ))
        ) : (
          <div style={{
            textAlign: 'center', color: 'var(--text-secondary)',
            marginTop: '60px', fontSize: '15px'
          }}>
            <div style={{ fontSize: '40px', marginBottom: '12px' }}>✨</div>
            No tasks found. Start by adding one!
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
            width: '100%', maxWidth: '450px', border: '1px solid var(--border)',
            margin: '0 16px'
          }}>
            <h2 style={{ color: 'var(--text-primary)', marginBottom: '20px', marginTop: 0 }}>
              New Task ✅
            </h2>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>

              {/* Title */}
              <input
                placeholder="Task Title *" required
                value={form.title} onChange={e => setForm({ ...form, title: e.target.value })}
                style={{
                  padding: '12px', borderRadius: '8px',
                  border: '1px solid var(--border)', background: 'var(--bg-primary)',
                  color: 'var(--text-primary)', fontSize: '14px', outline: 'none'
                }}
              />

              {/* Priority + Category */}
              <div style={{ display: 'flex', gap: '12px' }}>
                <select
                  value={form.priority} onChange={e => setForm({ ...form, priority: e.target.value })}
                  style={{
                    flex: 1, padding: '12px', borderRadius: '8px',
                    border: '1px solid var(--border)', background: 'var(--bg-primary)',
                    color: 'var(--text-primary)', fontSize: '14px', outline: 'none'
                  }}
                >
                  <option value="high">🔴 High</option>
                  <option value="medium">🟡 Medium</option>
                  <option value="low">🟢 Low</option>
                </select>

                <select
                  value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}
                  style={{
                    flex: 1, padding: '12px', borderRadius: '8px',
                    border: '1px solid var(--border)', background: 'var(--bg-primary)',
                    color: 'var(--text-primary)', fontSize: '14px', outline: 'none'
                  }}
                >
                  <option value="personal">Personal</option>
                  <option value="work">Work</option>
                  <option value="college">College</option>
                  <option value="shopping">Shopping</option>
                </select>
              </div>

              {/* Due Date */}
              <input
                type="date" required
                value={form.dueDate} onChange={e => setForm({ ...form, dueDate: e.target.value })}
                style={{
                  padding: '12px', borderRadius: '8px',
                  border: '1px solid var(--border)', background: 'var(--bg-primary)',
                  color: 'var(--text-primary)', fontSize: '14px', outline: 'none'
                }}
              />

              {/* Notes */}
              <textarea
                placeholder="Notes (optional)"
                value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })}
                style={{
                  padding: '12px', borderRadius: '8px',
                  border: '1px solid var(--border)', background: 'var(--bg-primary)',
                  color: 'var(--text-primary)', fontSize: '14px',
                  height: '80px', resize: 'none', outline: 'none'
                }}
              />

              {/* Buttons */}
              <div style={{ display: 'flex', gap: '12px', marginTop: '6px' }}>
                <button
                  type="button" onClick={() => setShowModal(false)}
                  style={{
                    flex: 1, padding: '12px', borderRadius: '8px',
                    border: '1px solid var(--border)', background: 'none',
                    color: 'var(--text-primary)', cursor: 'pointer', fontSize: '14px'
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{
                    flex: 1, padding: '12px', borderRadius: '8px',
                    border: 'none', background: 'var(--accent)',
                    color: 'white', fontWeight: 600, cursor: 'pointer', fontSize: '14px'
                  }}
                >
                  Create Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default Tasks