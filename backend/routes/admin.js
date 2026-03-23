const express = require('express')
const router = express.Router()
const Report = require('../models/Report')
const Contractor = require('../models/Contractor')
const User = require('../models/User')
const { authMiddleware, adminOnly } = require('../middleware/authMiddleware')

// GET /api/admin/reports — get all reports
router.get('/reports', authMiddleware, adminOnly, async (req, res) => {
  try {
    const reports = await Report.find()
      .populate('userId', 'name email')
      .populate('contractorId', 'name phone')
      .sort({ createdAt: -1 })
    res.json(reports)
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
})

// PUT /api/admin/reports/:id/verify — verify a report
router.put('/reports/:id/verify', authMiddleware, adminOnly, async (req, res) => {
  try {
    const report = await Report.findById(req.params.id)
    if (!report) {
      return res.status(404).json({ message: 'Report not found' })
    }
    report.status = 'verified'
    await report.save()
    res.json({ success: true, message: 'Report verified!', report })
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
})

// PUT /api/admin/reports/:id/reject — reject a report
router.put('/reports/:id/reject', authMiddleware, adminOnly, async (req, res) => {
  try {
    const report = await Report.findById(req.params.id)
    if (!report) {
      return res.status(404).json({ message: 'Report not found' })
    }
    report.status = 'rejected'
    await report.save()
    res.json({ success: true, message: 'Report rejected!', report })
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
})

// PUT /api/admin/reports/:id/assign — assign contractor
router.put('/reports/:id/assign', authMiddleware, adminOnly, async (req, res) => {
  try {
    const { contractorId, deadline } = req.body

    const report = await Report.findById(req.params.id)
    if (!report) {
      return res.status(404).json({ message: 'Report not found' })
    }

    report.contractorId = contractorId
    report.deadline = new Date(deadline)
    report.status = 'assigned'
    await report.save()

    // Update contractor active tasks
    await Contractor.findByIdAndUpdate(contractorId, {
      $inc: { activeTasks: 1 }
    })

    res.json({ success: true, message: 'Contractor assigned!', report })
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
})

// PUT /api/admin/reports/:id/close — approve completion
router.put('/reports/:id/close', authMiddleware, adminOnly, async (req, res) => {
  try {
    const report = await Report.findById(req.params.id)
    if (!report) {
      return res.status(404).json({ message: 'Report not found' })
    }
    report.status = 'closed'
    await report.save()

    // Update contractor stats
    await Contractor.findByIdAndUpdate(report.contractorId, {
      $inc: { completedTasks: 1, activeTasks: -1 }
    })

    res.json({ success: true, message: 'Report closed!', report })
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
})

// GET /api/admin/contractors — get all contractors
// GET /api/admin/contractors — get all contractors
router.get('/contractors', authMiddleware, adminOnly, async (req, res) => {
  try {
    // Fetch users with contractor role from User model
    const contractors = await User.find({ role: 'contractor' })
    res.json(contractors)
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
})
// PUT /api/admin/reports/:id/rework — request rework
router.put('/reports/:id/rework', authMiddleware, adminOnly, async (req, res) => {
  try {
    const report = await Report.findById(req.params.id)
    if (!report) {
      return res.status(404).json({ message: 'Report not found' })
    }
    report.status = 'rework'
    await report.save()
    res.json({ success: true, message: 'Rework requested!', report })
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
})
// POST /api/admin/contractors/create
router.post('/contractors/create', authMiddleware, adminOnly, async (req, res) => {
  try {
    const { name, email, password, phone } = req.body

    // Check if email exists
    const existing = await User.findOne({ email })
    if (existing) {
      return res.status(400).json({ message: 'Email already exists!' })
    }

    // Hash password
    const bcrypt = require('bcryptjs')
    const hashedPassword = await bcrypt.hash(password, 10)

    // Create contractor
    const contractor = new User({
      name,
      email,
      password: hashedPassword,
      phone,
      role: 'contractor'
    })

    await contractor.save()

    res.status(201).json({
      success: true,
      message: 'Contractor created successfully!',
      contractor: {
        id: contractor._id,
        name: contractor.name,
        email: contractor.email,
        phone: contractor.phone
      }
    })
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
})

module.exports = router