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

// Helper function to upload to Cloudinary
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

// GET /api/reports
router.get('/', authMiddleware, async (req, res) => {
  try {
    const reports = await Report.find({ userId: req.user.id })
      .sort({ createdAt: -1 })
    res.json(reports)
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
})

// POST /api/reports
router.post('/', authMiddleware, upload.single('photo'), async (req, res) => {
  try {
    const { description, lat, lng, address } = req.body

    if (!req.file) {
      return res.status(400).json({ message: 'Photo is required' })
    }

    // Upload to Cloudinary
    const uploadResult = await uploadToCloudinary(req.file.buffer, 'potholes')
    const photoUrl = uploadResult.secure_url

    const report = new Report({
      userId: req.user.id,
      description,
      photo: photoUrl,
      location: {
        lat: parseFloat(lat),
        lng: parseFloat(lng),
        address
      }
    })

    await report.save()

    res.status(201).json({
      success: true,
      message: 'Report submitted successfully!',
      report
    })

  } catch (error) {
    console.error('Report error:', error)
    res.status(500).json({ message: 'Server error', error: error.message })
  }
})

// GET /api/reports/:id
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const report = await Report.findById(req.params.id)
    if (!report) {
      return res.status(404).json({ message: 'Report not found' })
    }
    res.json(report)
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
})

module.exports = router