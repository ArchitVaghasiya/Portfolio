import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { User } from '../models/User.js'
import { isDbConnected } from '../config/db.js'

const JWT_SECRET = process.env.JWT_SECRET || 'dev_jwt_secret_university_itue301'

// In-memory fallback users if MongoDB is offline
const inMemoryUsers = []

// Practical 7: User Registration
export const registerUser = async (req, res, next) => {
  try {
    const { name, email, password } = req.body

    // Validation
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Name, email, and password are required fields.',
      })
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        error: 'Password must be at least 6 characters long.',
      })
    }

    // Step 3: Hash password with bcrypt before saving
    const saltRounds = 10
    const hashedPassword = await bcrypt.hash(password, saltRounds)

    let createdUser

    if (isDbConnected()) {
      const existing = await User.findOne({ email: email.toLowerCase() })
      if (existing) {
        return res.status(400).json({
          success: false,
          error: 'An account with this email already exists.',
        })
      }

      createdUser = await User.create({
        name: name.trim(),
        email: email.toLowerCase().trim(),
        password: hashedPassword,
      })
    } else {
      const existing = inMemoryUsers.find((u) => u.email === email.toLowerCase().trim())
      if (existing) {
        return res.status(400).json({
          success: false,
          error: 'An account with this email already exists.',
        })
      }

      createdUser = {
        _id: String(Date.now()),
        name: name.trim(),
        email: email.toLowerCase().trim(),
        password: hashedPassword,
        createdAt: new Date().toISOString(),
      }
      inMemoryUsers.push(createdUser)
    }

    return res.status(201).json({
      success: true,
      message: 'User registered successfully!',
      user: {
        id: createdUser._id,
        name: createdUser.name,
        email: createdUser.email,
      },
    })
  } catch (error) {
    next(error)
  }
}

// Practical 7: User Login
export const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Email and password are required.',
      })
    }

    let user

    if (isDbConnected()) {
      user = await User.findOne({ email: email.toLowerCase().trim() })
    } else {
      user = inMemoryUsers.find((u) => u.email === email.toLowerCase().trim())
    }

    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'Invalid email or password.',
      })
    }

    // Step 4: Compare hashed password using bcrypt.compare
    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        error: 'Invalid email or password.',
      })
    }

    // Generate JWT token with 1 hour expiration
    const token = jwt.sign(
      { id: user._id, email: user.email, name: user.name },
      JWT_SECRET,
      { expiresIn: '1h' },
    )

    return res.json({
      success: true,
      message: 'Login successful!',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    })
  } catch (error) {
    next(error)
  }
}

// Practical 7 Supplementary: /me endpoint
export const getCurrentUser = (req, res) => {
  res.json({
    success: true,
    user: req.user,
  })
}
