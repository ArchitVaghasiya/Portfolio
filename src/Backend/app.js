// =============================================================================
// BACKEND EXPRESS APP CONFIGURATION (Express.js)
// =============================================================================
// This module configures the Express app, middleware, database connection,
// and routes. It is exported so it can be run as a standalone server or as a
// serverless function on platforms like Vercel.
// =============================================================================

import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'

// Route Imports
import portfolioRoutes from './routes/portfolioRoutes.js'
import projectsRoutes from './routes/projectsRoutes.js'
import contactRoutes from './routes/contactRoutes.js'
import taskRoutes from './routes/taskRoutes.js'
import authRoutes from './routes/authRoutes.js'

// Database Connection
import { connectDB } from './config/db.js'

// Load environment variables from .env file
dotenv.config()

const app = express()

// -----------------------------------------------------------------------------
// 1. DATABASE INITIALIZATION (Practical 5)
// -----------------------------------------------------------------------------
connectDB()

// -----------------------------------------------------------------------------
// 2. GLOBAL MIDDLEWARE PIPELINE (Practical 4)
// -----------------------------------------------------------------------------

// A. CORS: Allows your React frontend to call this backend API
app.use(cors())

// B. JSON Body Parser: Automatically converts incoming JSON request bodies into req.body
app.use(express.json())

// C. Request Logger: Logs every request method, URL path, and timestamp in console
app.use((req, res, next) => {
  console.log(`[API Request] ${req.method} ${req.originalUrl} - ${new Date().toISOString()}`)
  next()
})

// D. Header Validator: Ensures POST and PUT requests include Content-Type: application/json
app.use((req, res, next) => {
  if (['POST', 'PUT'].includes(req.method)) {
    const contentType = req.headers['content-type']
    if (!contentType || !contentType.includes('application/json')) {
      return res.status(400).json({
        success: false,
        error: 'Content-Type must be application/json for POST and PUT requests.',
      })
    }
  }
  next()
})

// -----------------------------------------------------------------------------
// 3. API ROUTES (Practical 4, 6, 7)
// -----------------------------------------------------------------------------

// Health Check: Test if backend is alive
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'Portfolio & Task Management Full-Stack API',
    timestamp: new Date().toISOString(),
  })
})

// Mount specific resource routers:
app.use('/api/portfolio', portfolioRoutes)  // Profile & skills info
app.use('/api/projects', projectsRoutes)    // GitHub repository viewer
app.use('/api/contact', contactRoutes)      // Contact form submissions
app.use('/api/tasks', taskRoutes)          // Task CRUD operations
app.use('/api/auth', authRoutes)            // User registration & login (JWT)

// -----------------------------------------------------------------------------
// 4. 404 ROUTE NOT FOUND HANDLER (Practical 4 Supplementary)
// -----------------------------------------------------------------------------
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: `Cannot ${req.method} ${req.originalUrl} - Route not found.`,
  })
})

// -----------------------------------------------------------------------------
// 5. GLOBAL ERROR HANDLING MIDDLEWARE (Practical 4)
// -----------------------------------------------------------------------------
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.error('[Server Error]', err.stack || err.message)
  res.status(err.status || 500).json({
    success: false,
    error: 'Something went wrong on the server',
    message: err.message,
  })
})

export default app
