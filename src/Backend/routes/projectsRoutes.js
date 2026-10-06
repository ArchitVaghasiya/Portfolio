import { Router } from 'express'
import { getProjects } from '../controllers/projectsController.js'

const router = Router()

// =============================================================================
// PROJECTS API ROUTES (Practical 3 Integration)
// =============================================================================
// Base URL: /api/projects
// GET /api/projects -> Proxies GitHub API repositories with fallback support
// =============================================================================

router.get('/', getProjects)

export default router
