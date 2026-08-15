const User = require('../models/User')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const crypto = require('crypto')

// Generate JWT Token helper
const generateToken = id => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' })
}

// @desc    Register a new user
// @route   POST /api/auth/register
exports.registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body

    const normalizedEmail = email?.trim().toLowerCase()

    if (!name?.trim() || !normalizedEmail || !password) {
      return res.status(400).json({
        message: 'Name, email and password are required'
      })
    }

    const userExists = await User.findOne({ email: normalizedEmail })

    if (userExists) {
      return res.status(400).json({
        message: 'User already exists'
      })
    }

    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    const user = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      password: hashedPassword
    })

    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        token: generateToken(user._id)
      })
    } else {
      res.status(400).json({
        message: 'Invalid user data'
      })
    }
  } catch (error) {
    res.status(500).json({
      message: error.message
    })
  }
}

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body

    const normalizedEmail = email?.trim().toLowerCase()

    const user = await User.findOne({
      email: normalizedEmail
    })

    if (user && (await bcrypt.compare(password, user.password))) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        token: generateToken(user._id)
      })
    } else {
      res.status(401).json({
        message: 'Invalid email or password'
      })
    }
  } catch (error) {
    res.status(500).json({
      message: error.message
    })
  }
}

// @desc    Request password reset
// @route   POST /api/auth/forgot-password
exports.forgotPassword = async (req, res) => {
  try {
    const email = req.body.email?.trim().toLowerCase()

    if (!email) {
      return res.status(400).json({
        message: 'Email address is required'
      })
    }

    const user = await User.findOne({ email })

    // Do not reveal whether an email exists in production.
    if (!user) {
      return res.json({
        message:
          'If an account exists with this email, password reset instructions have been generated.'
      })
    }

    // Generate a cryptographically secure token.
    const resetToken = crypto.randomBytes(32).toString('hex')

    // Store only the hash of the token in MongoDB.
    const hashedToken = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex')

    user.resetPasswordToken = hashedToken

    // Token valid for 15 minutes.
    user.resetPasswordExpires = Date.now() + 15 * 60 * 1000

    await user.save()

    const response = {
      message:
        'Password reset instructions have been generated. The reset token is valid for 15 minutes.'
    }

    // Assignment/demo mode:
    // Since no email provider is configured, return the token so
    // the mobile app can continue directly to the reset screen.
    if (process.env.NODE_ENV !== 'production') {
      response.resetToken = resetToken
    }

    return res.json(response)
  } catch (error) {
    console.error('Forgot password error:', error)

    res.status(500).json({
      message: 'Unable to process password reset request'
    })
  }
}

// @desc    Reset password using reset token
// @route   POST /api/auth/reset-password
exports.resetPassword = async (req, res) => {
  try {
    const { token, password } = req.body

    if (!token || !password) {
      return res.status(400).json({
        message: 'Reset token and new password are required'
      })
    }

    if (password.length < 6) {
      return res.status(400).json({
        message: 'Password must be at least 6 characters'
      })
    }

    const hashedToken = crypto.createHash('sha256').update(token).digest('hex')

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: Date.now() }
    })

    if (!user) {
      return res.status(400).json({
        message: 'Invalid or expired reset token'
      })
    }

    const salt = await bcrypt.genSalt(10)
    user.password = await bcrypt.hash(password, salt)

    // Invalidate the reset token after successful use.
    user.resetPasswordToken = null
    user.resetPasswordExpires = null

    await user.save()

    return res.json({
      message: 'Password reset successfully'
    })
  } catch (error) {
    console.error('Reset password error:', error)

    res.status(500).json({
      message: 'Unable to reset password'
    })
  }
}
