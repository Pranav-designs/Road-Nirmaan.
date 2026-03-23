const express = require('express')
const router = express.Router()
const multer = require('multer')
const cloudinary = require('cloudinary').v2
const Report = require('../models/Report')
const { authMiddleware } = require('../middleware/authMiddleware')

// Cloudinary config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
})

// Multer setup
const storage = multer.memoryStorage()
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true)
    } else {
      cb(new Error('Only images allowed!'))
    }
  }
})

// Helper to upload to Cloudinary
const uploadToCloudinary = (buffer, folder) => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload_stream(
      { folder: `road-nirmaan/${folder}` },
      (error, result) => {
        if (error) reject(error)
        else resolve(result)
      }
    ).end(buffer)
  })
}

// GET /api/contractor/tasks
router.get('/tasks', authMiddleware, async (req, res) => {
  try {
    const tasks = await Report.find({ contractorId: req.user.id })
      .populate('userId', 'name email')
      .sort({ createdAt: -1 })
    res.json(tasks)
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
})

// PUT /api/contractor/tasks/:id/complete
router.put('/tasks/:id/complete', authMiddleware, upload.single('photo'), async (req, res) => {
  try {
    const { notes } = req.body

    if (!req.file) {
      return res.status(400).json({ message: 'Completion photo is required' })
    }

    const report = await Report.findById(req.params.id)
    if (!report) {
      return res.status(404).json({ message: 'Task not found' })
    }

    // Upload completion photo to Cloudinary
    const uploadResult = await uploadToCloudinary(req.file.buffer, 'completions')
    const completionPhotoUrl = uploadResult.secure_url

    // Calculate fine if overdue
    const today = new Date()
    const deadline = new Date(report.deadline)
    let fine = 0
    if (today > deadline) {
      const daysOverdue = Math.ceil((today - deadline) / (1000 * 60 * 60 * 24))
      fine = daysOverdue * 500
    }

    report.status = 'completed'
    report.completionPhoto = completionPhotoUrl
    report.completionNotes = notes
    report.completedDate = today
    report.fine = fine

    await report.save()

    res.json({
      success: true,
      message: 'Completion submitted!',
      fine,
      report
    })
  } catch (error) {
    console.error('Completion error:', error)
    res.status(500).json({ message: 'Server error', error: error.message })
  }
})

module.exports = router