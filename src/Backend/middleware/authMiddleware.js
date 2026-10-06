import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'

dotenv.config()

const JWT_SECRET = process.env.JWT_SECRET || 'dev_jwt_secret_university_itue301'

// =============================================================================
// JWT AUTHENTICATION MIDDLEWARE (Practical 7)
// =============================================================================
// Intercepts incoming requests to protected routes.
// Expects header: "Authorization: Bearer <token>"
//
// 1. If token is missing -> returns 401 Unauthorized
// 2. If token is invalid or expired -> returns 401 Unauthorized
// 3. If token is valid -> sets req.user and calls next() to proceed
// =============================================================================
export const authenticateToken = (req, res, next) => {
  // Step 1: Read the Authorization header
  const authHeader = req.headers.authorization
  const token = authHeader && authHeader.startsWith('Bearer ')
    ? authHeader.split(' ')[1]
    : null

  // Step 2: Check if token exists
  if (!token) {
    return res.status(401).json({
      success: false,
      error: 'Access denied. No authentication token provided in Authorization header.',
    })
  }

  // Step 3: Verify the token signature and expiration
  try {
    const decoded = jwt.verify(token, JWT_SECRET)
    req.user = decoded // Attach decoded user info ({ id, email, name }) to req
    next()             // Continue to the next controller function
  } catch (err) {
    return res.status(401).json({
      success: false,
      error: 'Invalid or expired token.',
      message: err.message,
    })
  }
}
