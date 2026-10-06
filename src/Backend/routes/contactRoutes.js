import { Router } from 'express'
import { handleContactMessage, getContactMessages } from '../controllers/contactController.js'

const router = Router()

// =============================================================================
// CONTACT API ROUTES
// =============================================================================
// Base URL: /api/contact
// POST /api/contact -> Submit a new message from the contact form
// GET  /api/contact -> View all submitted messages (admin/debug)
// =============================================================================

router.post('/', handleContactMessage)
router.get('/', getContactMessages)

export default router
