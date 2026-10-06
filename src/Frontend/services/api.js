// =============================================================================
// FRONTEND API CLIENT SERVICE (Practical 3, 4, 6)
// =============================================================================
// This module contains all functions used by React components to talk to the
// Express backend API (/api/...).
//
// Because Vite proxy is configured, requests to '/api/...' automatically
// route to http://localhost:5000 in development.
// =============================================================================

import { fallbackPortfolio } from '../data/fallbackData.js'

const API_BASE = '/api'

// -----------------------------------------------------------------------------
// 1. PORTFOLIO API (Home page profile & skills)
// -----------------------------------------------------------------------------
export async function fetchPortfolio(signal) {
  try {
    const res = await fetch(`${API_BASE}/portfolio`, { signal })
    if (!res.ok) {
      throw new Error(`Failed to fetch portfolio: ${res.status}`)
    }
    const data = await res.json()
    return data.data || fallbackPortfolio
  } catch (err) {
    if (err.name === 'AbortError') throw err
    // Graceful offline fallback: if backend is stopped, app still displays info
    return fallbackPortfolio
  }
}

// -----------------------------------------------------------------------------
// 2. PROJECTS API (Practical 3 GitHub projects)
// -----------------------------------------------------------------------------
export async function fetchProjects(signal) {
  try {
    const res = await fetch(`${API_BASE}/projects`, { signal })
    if (!res.ok) {
      throw new Error(`Failed to fetch projects: ${res.status}`)
    }
    const data = await res.json()
    return data.data || []
  } catch (err) {
    if (err.name === 'AbortError') throw err
    // If backend is offline, fetch directly from GitHub
    const username = fallbackPortfolio.contact.github
    const ghRes = await fetch(`https://api.github.com/users/${username}/repos?sort=updated`, { signal })
    if (!ghRes.ok) {
      throw new Error('Unable to load GitHub repositories right now.', { cause: err })
    }
    return await ghRes.json()
  }
}

// -----------------------------------------------------------------------------
// 3. CONTACT API (Practical 2 & Backend Contact Form)
// -----------------------------------------------------------------------------
export async function submitContactMessage(payload) {
  try {
    const res = await fetch(`${API_BASE}/contact`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })

    if (!res.ok) {
      const errBody = await res.json().catch(() => ({}))
      throw new Error(errBody.error || `Request failed with status ${res.status}`)
    }

    return await res.json()
  } catch {
    return {
      success: true,
      message: 'Message processed locally (Backend server offline).',
      data: payload,
    }
  }
}

// -----------------------------------------------------------------------------
// 4. TASK CRUD APIs (Practical 6 Full-Stack Integration)
// -----------------------------------------------------------------------------

// READ: Fetch all tasks
export async function fetchTasks(signal) {
  const res = await fetch(`${API_BASE}/tasks`, { signal })
  if (!res.ok) {
    throw new Error('Failed to load tasks from server')
  }
  const data = await res.json()
  return data.data || []
}

// CREATE: Add new task
export async function createTask(task) {
  const res = await fetch(`${API_BASE}/tasks`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(task),
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.error || 'Failed to create task')
  }
  return await res.json()
}

// UPDATE: Modify existing task by ID
export async function updateTask(id, updates) {
  const res = await fetch(`${API_BASE}/tasks/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(updates),
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.error || 'Failed to update task')
  }
  return await res.json()
}

// DELETE: Remove task by ID
export async function deleteTask(id) {
  const res = await fetch(`${API_BASE}/tasks/${id}`, {
    method: 'DELETE',
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.error || 'Failed to delete task')
  }
  return await res.json()
}
