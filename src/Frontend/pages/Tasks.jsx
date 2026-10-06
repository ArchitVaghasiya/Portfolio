import { useEffect, useState } from 'react'
import {
  fetchTasks,
  createTask,
  updateTask,
  deleteTask,
} from '../services/api'
import Spinner from '../components/Spinner'
import ErrorMessage from '../components/ErrorMessage'

function Tasks({ isEmbedded = false }) {
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Form state
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [priority, setPriority] = useState('medium')
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Feedback toast state (Practical 6 Supplementary)
  const [toast, setToast] = useState(null)

  // Delete confirmation state (Practical 6 Supplementary)
  const [taskToDelete, setTaskToDelete] = useState(null)

  const showToast = (message, type = 'success') => {
    setToast({ message, type })
    setTimeout(() => setToast(null), 4000)
  }

  useEffect(() => {
    let isMounted = true

    async function load() {
      try {
        const data = await fetchTasks()
        if (isMounted) {
          setTasks(data)
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message || 'Failed to load tasks')
        }
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    load()
    return () => {
      isMounted = false
    }
  }, [])

  // Handle task submission
  async function handleSubmit(e) {
    e.preventDefault()
    if (!title.trim()) return

    setIsSubmitting(true)
    try {
      const created = await createTask({ title, description, priority })
      setTasks((prev) => [created.data || created, ...prev])
      setTitle('')
      setDescription('')
      setPriority('medium')
      showToast('Task created successfully!', 'success')
    } catch (err) {
      showToast(err.message || 'Error creating task', 'error')
    } finally {
      setIsSubmitting(false)
    }
  }

  // Handle toggle completed
  async function handleToggleComplete(task) {
    try {
      const updated = await updateTask(task._id || task.id, {
        completed: !task.completed,
      })
      const updatedData = updated.data || updated
      setTasks((prev) =>
        prev.map((t) => ((t._id || t.id) === (task._id || task.id) ? updatedData : t)),
      )
      showToast(
        updatedData.completed ? 'Task marked as completed' : 'Task marked active',
        'info',
      )
    } catch (err) {
      showToast(err.message || 'Failed to update task', 'error')
    }
  }

  // Confirm delete handler
  async function confirmDelete() {
    if (!taskToDelete) return
    const id = taskToDelete._id || taskToDelete.id
    try {
      await deleteTask(id)
      setTasks((prev) => prev.filter((t) => (t._id || t.id) !== id))
      showToast('Task deleted successfully!', 'success')
    } catch (err) {
      showToast(err.message || 'Failed to delete task', 'error')
    } finally {
      setTaskToDelete(null)
    }
  }

  return (
    <main className="page-content tasks-page">
      <section
        className="section tasks-section"
        {...(!isEmbedded ? { id: 'tasks' } : {})}
        aria-labelledby="tasks-heading"
      >
        <p className="eyebrow">Practical 6 Full-Stack Integration</p>
        <h1 id="tasks-heading" className="page-title">Task Management</h1>

        {/* Toast Notification (Practical 6 Supplementary) */}
        {toast && (
          <div className={`toast toast-${toast.type}`} role="status">
            <span>{toast.message}</span>
            <button type="button" onClick={() => setToast(null)}>×</button>
          </div>
        )}

        {/* Task Creation Form */}
        <form className="task-form glass-panel" onSubmit={handleSubmit}>
          <h2>Create New Task</h2>

          <div className="form-group">
            <label htmlFor="task-title">Title *</label>
            <input
              id="task-title"
              type="text"
              placeholder="e.g. Implement authentication middleware"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="task-desc">Description</label>
            <textarea
              id="task-desc"
              rows="3"
              placeholder="Task details or acceptance criteria…"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label htmlFor="task-priority">Priority</label>
            <select
              id="task-priority"
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>

          <button type="submit" className="submit-btn" disabled={isSubmitting}>
            {isSubmitting ? 'Adding Task…' : 'Add Task'}
          </button>
        </form>

        {/* Task List Section */}
        <div className="task-list-section">
          <h2>Your Tasks ({tasks.length})</h2>

          {loading && <Spinner />}
          {error && <ErrorMessage message={error} />}

          {!loading && tasks.length === 0 && (
            <p className="empty-tasks-msg">No tasks yet. Create your first task above!</p>
          )}

          <div className="task-grid">
            {tasks.map((task) => {
              const id = task._id || task.id
              const displayDate = task.createdAt
                ? new Date(task.createdAt).toLocaleDateString()
                : 'Just now'

              return (
                <article
                  key={id}
                  className={`task-card glass-panel ${task.completed ? 'completed' : ''}`}
                >
                  <div className="task-header">
                    <label className="checkbox-container">
                      <input
                        type="checkbox"
                        checked={Boolean(task.completed)}
                        onChange={() => handleToggleComplete(task)}
                      />
                      <span className="task-name">{task.title}</span>
                    </label>
                    <span className={`priority-badge priority-${task.priority || 'medium'}`}>
                      {task.priority || 'medium'}
                    </span>
                  </div>

                  {task.description && (
                    <p className="task-desc-text">{task.description}</p>
                  )}

                  <div className="task-footer">
                    <small className="task-date">
                      {displayDate}
                    </small>
                    <button
                      type="button"
                      className="delete-task-btn"
                      onClick={() => setTaskToDelete(task)}
                      aria-label={`Delete task ${task.title}`}
                    >
                      🗑️ Delete
                    </button>
                  </div>
                </article>
              )
            })}
          </div>
        </div>

        {/* Confirmation Dialog (Practical 6 Supplementary) */}
        {taskToDelete && (
          <div className="modal-backdrop">
            <div className="modal-content" role="dialog" aria-modal="true">
              <h3>Confirm Deletion</h3>
              <p>
                Are you sure you want to delete task &ldquo;<strong>{taskToDelete.title}</strong>&rdquo;?
              </p>
              <div className="modal-actions">
                <button
                  type="button"
                  className="modal-cancel-btn"
                  onClick={() => setTaskToDelete(null)}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="modal-delete-btn"
                  onClick={confirmDelete}
                >
                  Yes, Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </section>
    </main>
  )
}

export default Tasks
