const express = require('express')
const dotenv = require('dotenv')
const cors = require('cors')
const session = require('express-session')
const passport = require('./config/passport')
const connectDB = require('./config/db')

dotenv.config()
connectDB()

const app = express()

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true
}))
app.use(express.json())
app.use(session({
  secret: process.env.JWT_SECRET,
  resave: false,
  saveUninitialized: false
}))
app.use(passport.initialize())
app.use(passport.session())

// Routes
app.use('/api/auth', require('./routes/auth'))
app.use('/api/reports', require('./routes/reports'))
app.use('/api/admin', require('./routes/admin'))
app.use('/api/contractor', require('./routes/contractor'))

// Test route
app.get('/', (req, res) => {
  res.json({ message: '🚧 Road Nirmaan API is running!' })
})

const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`)
})