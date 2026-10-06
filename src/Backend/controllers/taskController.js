// =============================================================================
// TASK CONTROLLER (Business Logic for Tasks)
// =============================================================================
// Contains the functions executed when /api/tasks endpoints are requested.
// Supports both MongoDB (via Mongoose) and an in-memory fallback list.
// =============================================================================

import { Task } from '../models/Task.js'
import { isDbConnected } from '../config/db.js'

// In-memory fallback list: used if MongoDB is not currently running locally
let inMemoryTasks = [
  {
    _id: '1',
    id: '1',
    title: 'Set up React development environment using Vite',
    description: 'Practical 1 component architecture completed with Header, About, Skills, and Footer.',
    completed: true,
    priority: 'high',
    createdAt: new Date().toISOString(),
  },
  {
    _id: '2',
    id: '2',
    title: 'Configure React Router and controlled form state',
    description: 'Practical 2 multi-route navigation and real-time inputs.',
    completed: true,
    priority: 'medium',
    createdAt: new Date().toISOString(),
  },
  {
    _id: '3',
    id: '3',
    title: 'Build RESTful API with Node.js and Express',
    description: 'Practical 4, 5, 6 full-stack integration with clean CRUD endpoints.',
    completed: false,
    priority: 'high',
    createdAt: new Date().toISOString(),
  },
]

// -----------------------------------------------------------------------------
// 1. GET ALL TASKS
// Endpoint: GET /api/tasks
// Status:   200 OK
// -----------------------------------------------------------------------------
export const getAllTasks = async (req, res, next) => {
  try {
    let tasks = []

    // Fetch from MongoDB if connected, otherwise use the in-memory array
    if (isDbConnected()) {
      tasks = await Task.find().sort({ createdAt: -1 })
    } else {
      tasks = [...inMemoryTasks]
    }

    return res.status(200).json({
      success: true,
      count: tasks.length,
      data: tasks,
    })
  } catch (error) {
    next(error) // Passes unhandled errors to the global error handler
  }
}

// -----------------------------------------------------------------------------
// 2. GET TASK BY ID
// Endpoint: GET /api/tasks/:id
// Status:   200 OK or 404 Not Found
// -----------------------------------------------------------------------------
export const getTaskById = async (req, res, next) => {
  try {
    const { id } = req.params

    let task = null
    if (isDbConnected()) {
      task = await Task.findById(id).catch(() => null)
    } else {
      task = inMemoryTasks.find((t) => t._id === id || t.id === id)
    }

    // If no matching task was found, return 404
    if (!task) {
      return res.status(404).json({
        success: false,
        error: `Task with id '${id}' not found.`,
      })
    }

    return res.status(200).json({
      success: true,
      data: task,
    })
  } catch (error) {
    next(error)
  }
}

// -----------------------------------------------------------------------------
// 3. CREATE TASK
// Endpoint: POST /api/tasks
// Status:   201 Created or 400 Bad Request
// -----------------------------------------------------------------------------
export const createTask = async (req, res, next) => {
  try {
    // Step 1: Read input from request body
    const { title, description, priority } = req.body

    // Step 2: Validate required fields
    if (!title || typeof title !== 'string' || !title.trim()) {
      return res.status(400).json({
        success: false,
        error: 'Task title is required.',
      })
    }

    // Step 3: Save to database or memory
    let newTask
    if (isDbConnected()) {
      newTask = await Task.create({
        title: title.trim(),
        description: description?.trim() || '',
        priority: priority || 'medium',
      })
    } else {
      newTask = {
        _id: String(Date.now()),
        id: String(Date.now()),
        title: title.trim(),
        description: description?.trim() || '',
        priority: priority || 'medium',
        completed: false,
        createdAt: new Date().toISOString(),
      }
      inMemoryTasks.unshift(newTask)
    }

    // Step 4: Return 201 Created with the new task data
    return res.status(201).json({
      success: true,
      message: 'Task created successfully',
      data: newTask,
    })
  } catch (error) {
    next(error)
  }
}

// -----------------------------------------------------------------------------
// 4. UPDATE TASK
// Endpoint: PUT /api/tasks/:id
// Status:   200 OK or 404 Not Found
// -----------------------------------------------------------------------------
export const updateTask = async (req, res, next) => {
  try {
    const { id } = req.params
    const updates = req.body

    let updated = null

    // Update in MongoDB
    if (isDbConnected()) {
      updated = await Task.findByIdAndUpdate(id, updates, {
        new: true, // returns the updated document instead of old one
        runValidators: true,
      }).catch(() => null)
    } else {
      // Update in memory
      const idx = inMemoryTasks.findIndex((t) => t._id === id || t.id === id)
      if (idx !== -1) {
        inMemoryTasks[idx] = { ...inMemoryTasks[idx], ...updates }
        updated = inMemoryTasks[idx]
      }
    }

    if (!updated) {
      return res.status(404).json({
        success: false,
        error: `Task with id '${id}' not found.`,
      })
    }

    return res.status(200).json({
      success: true,
      message: 'Task updated successfully',
      data: updated,
    })
  } catch (error) {
    next(error)
  }
}

// -----------------------------------------------------------------------------
// 5. DELETE TASK
// Endpoint: DELETE /api/tasks/:id
// Status:   200 OK or 404 Not Found
// -----------------------------------------------------------------------------
export const deleteTask = async (req, res, next) => {
  try {
    const { id } = req.params
    let deleted = false

    // Delete in MongoDB
    if (isDbConnected()) {
      const result = await Task.findByIdAndDelete(id).catch(() => null)
      deleted = Boolean(result)
    } else {
      // Delete in memory
      const prevLength = inMemoryTasks.length
      inMemoryTasks = inMemoryTasks.filter((t) => t._id !== id && t.id !== id)
      deleted = inMemoryTasks.length < prevLength
    }

    if (!deleted) {
      return res.status(404).json({
        success: false,
        error: `Task with id '${id}' not found.`,
      })
    }

    return res.status(200).json({
      success: true,
      message: 'Task deleted successfully',
      taskId: id,
    })
  } catch (error) {
    next(error)
  }
}
