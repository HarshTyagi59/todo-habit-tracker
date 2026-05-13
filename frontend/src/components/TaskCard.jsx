import { Trash2, CheckCircle, Circle, Calendar, Tag } from 'lucide-react'

const TaskCard = ({ task, onToggle, onDelete }) => {
  // Priority colors - lowercase keys to match backend
  const priorityColors = {
    high: { bg: '#fee2e2', text: '#ef4444', border: '#fecaca' },
    medium: { bg: '#fef9c3', text: '#ca8a04', border: '#fef08a' },
    low: { bg: '#dcfce7', text: '#16a34a', border: '#bbf7d0' },
  }

  // Check if task is overdue
  const isOverdue = !task.completed && task.dueDate && new Date(task.dueDate) < new Date()

  const pColor = priorityColors[task.priority] || priorityColors.medium

  return (
    <div style={{
      background: 'var(--bg-secondary)',
      border: `1px solid ${isOverdue ? '#ef4444' : 'var(--border)'}`,
      borderRadius: '12px',
      padding: '16px',
      display: 'flex', alignItems: 'center',
      justifyContent: 'space-between',
      gap: '12px', transition: 'all 0.2s',
      opacity: task.completed ? 0.6 : 1,
    }}>

      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1 }}>
        {/* Toggle Button */}
        <button
          onClick={() => onToggle(task._id, !task.completed)}
          style={{
            background: 'none', border: 'none', cursor: 'pointer',
            color: 'var(--accent)', display: 'flex', flexShrink: 0
          }}
        >
          {task.completed ? <CheckCircle size={22} /> : <Circle size={22} />}
        </button>

        {/* Task Info */}
        <div style={{ flex: 1 }}>
          {/* Title */}
          <div style={{
            fontSize: '15px', fontWeight: 500,
            color: 'var(--text-primary)', marginBottom: '6px',
            textDecoration: task.completed ? 'line-through' : 'none'
          }}>
            {task.title}
          </div>

          {/* Tags Row */}
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>

            {/* Priority Tag */}
            <span style={{
              fontSize: '10px', fontWeight: 700, padding: '2px 8px',
              borderRadius: '4px', background: pColor.bg, color: pColor.text,
              border: `1px solid ${pColor.border}`, textTransform: 'uppercase'
            }}>
              {task.priority === 'high' ? '🔴' : task.priority === 'medium' ? '🟡' : '🟢'} {task.priority}
            </span>

            {/* Category Tag */}
            <div style={{
              display: 'flex', alignItems: 'center', gap: '4px',
              color: 'var(--text-secondary)', fontSize: '11px',
              textTransform: 'capitalize'
            }}>
              <Tag size={12} /> {task.category}
            </div>

            {/* Due Date Tag */}
            {task.dueDate && (
              <div style={{
                display: 'flex', alignItems: 'center', gap: '4px',
                color: isOverdue ? '#ef4444' : 'var(--text-secondary)',
                fontSize: '11px', fontWeight: isOverdue ? 600 : 400
              }}>
                <Calendar size={12} />
                {isOverdue ? '⚠️ Overdue · ' : ''}
                {new Date(task.dueDate).toLocaleDateString('en-US', {
                  month: 'short', day: 'numeric', year: 'numeric'
                })}
              </div>
            )}

            {/* Notes indicator */}
            {task.notes && (
              <span style={{
                fontSize: '10px', padding: '2px 8px', borderRadius: '4px',
                background: 'var(--bg-primary)', color: 'var(--text-secondary)',
                border: '1px solid var(--border)'
              }}>
                📝 Note
              </span>
            )}
          </div>

          {/* Show Notes if exist */}
          {task.notes && (
            <div style={{
              marginTop: '8px', fontSize: '12px',
              color: 'var(--text-secondary)', fontStyle: 'italic',
              padding: '6px 10px', background: 'var(--bg-primary)',
              borderRadius: '6px', borderLeft: '3px solid var(--accent)'
            }}>
              {task.notes}
            </div>
          )}
        </div>
      </div>

      {/* Delete Button */}
      <button
        onClick={() => onDelete(task._id)}
        style={{
          background: 'none', border: 'none', cursor: 'pointer',
          color: '#ef4444', padding: '8px', borderRadius: '8px',
          transition: 'background 0.2s', flexShrink: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}
        onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)'}
        onMouseLeave={(e) => e.currentTarget.style.background = 'none'}
      >
        <Trash2 size={18} />
      </button>
    </div>
  )
}

export default TaskCard