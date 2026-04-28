const express = require('express')
const jwt = require('jsonwebtoken')
const User = require('../models/User')
const { sendWelcomeEmail } = require('../utils/mailer')

const router = express.Router()

router.post('/signup', async (req, res) => {
  try {
    const { name, email, password } = req.body
    if (!name || !email || !password)
      return res.status(400).json({ message: 'All fields are required' })

    const existing = await User.findOne({ email })
    if (existing)
      return res.status(409).json({ message: 'Email already registered' })

    const user = new User({ name, email, password })
    await user.save()

    try {
      await sendWelcomeEmail(user.email, user.name)
      console.log(`Welcome email sent to ${user.email}`)
    } catch (emailErr) {
      console.error('Email failed (non-critical):', emailErr.message)
    }

    res.status(201).json({ message: 'Account created successfully' })
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message })
  }
})

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body
    if (!email || !password)
      return res.status(400).json({ message: 'Email and password required' })

    const user = await User.findOne({ email })
    if (!user)
      return res.status(401).json({ message: 'Invalid email or password' })

    const match = await user.comparePassword(password)
    if (!match)
      return res.status(401).json({ message: 'Invalid email or password' })

    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    )

    res.json({ token, user: { name: user.name, email: user.email } })
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message })
  }
})

module.exports = router
