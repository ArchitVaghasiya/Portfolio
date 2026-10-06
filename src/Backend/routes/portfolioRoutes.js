import { Router } from 'express'
import { getPortfolio } from '../controllers/portfolioController.js'

const router = Router()

// =============================================================================
// PORTFOLIO API ROUTES
// =============================================================================
// Base URL: /api/portfolio
// GET /api/portfolio -> Returns student bio, skills, and profile info
// =============================================================================

router.get('/', getPortfolio)

export default router
