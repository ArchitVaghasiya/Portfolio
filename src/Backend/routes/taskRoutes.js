import { Router } from 'express'
import {
  getAllTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
} from '../controllers/taskController.js'

const router = Router()

// =============================================================================
// TASK RESTful API ROUTES (Practical 4 & 6)
// =============================================================================
// Base URL for these routes: /api/tasks
//
// Method | Endpoint        | Description           | Controller Function
// -------+-----------------+-----------------------+--------------------
// GET    | /api/tasks      | Fetch all tasks       | getAllTasks
// GET    | /api/tasks/:id  | Fetch task by ID      | getTaskById
// POST   | /api/tasks      | Create a new task     | createTask
// PUT    | /api/tasks/:id  | Update a task by ID   | updateTask
// DELETE | /api/tasks/:id  | Delete a task by ID   | deleteTask
// =============================================================================

// 1. READ: Get all tasks
router.get('/', getAllTasks)

// 2. READ: Get a single task by its ID
router.get('/:id', getTaskById)

// 3. CREATE: Add a new task (expects JSON body: { title, description, priority })
router.post('/', createTask)

// 4. UPDATE: Modify an existing task (e.g. toggle completed)
router.put('/:id', updateTask)

// 5. DELETE: Remove a task by its ID
router.delete('/:id', deleteTask)

export default router
