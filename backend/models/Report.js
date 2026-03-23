const mongoose = require('mongoose')

const ReportSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  description: {
    type: String,
    required: true
  },
  photo: {
    type: String,  // cloudinary URL
    required: true
  },
  location: {
    lat: Number,
    lng: Number,
    address: String
  },
  status: {
    type: String,
    enum: ['pending', 'verified', 'assigned', 'completed', 'rejected', 'closed', 'rework'],
    default: 'pending'
  },
  contractorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Contractor'
  },
  deadline: {
    type: Date
  },
  completionPhoto: {
    type: String   // cloudinary URL after fix
  },
  completionNotes: {
    type: String
  },
  completedDate: {
    type: Date
  },
  fine: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
})

module.exports = mongoose.model('Report', ReportSchema)