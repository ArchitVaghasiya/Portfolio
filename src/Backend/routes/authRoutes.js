import { Router } from 'express'
import { registerUser, loginUser, getCurrentUser } from '../controllers/authController.js'
import { authenticateToken } from '../middleware/authMiddleware.js'

const router = Router()

// =============================================================================
// AUTHENTICATION API ROUTES (Practical 7)
// =============================================================================
// Base URL: /api/auth
//
// Method | Endpoint            | Description                 | Access
// -------+---------------------+-----------------------------+---------
// POST   | /api/auth/register  | Register a new user         | Public
// POST   | /api/auth/login     | Login & obtain JWT token    | Public
// GET    | /api/auth/me        | Get current logged-in user  | Protected (JWT)
// =============================================================================

// Public Routes
router.post('/register', registerUser)
router.post('/login', loginUser)

// Protected Route (Requires Authorization: Bearer <token>)
router.get('/me', authenticateToken, getCurrentUser)

export default router
