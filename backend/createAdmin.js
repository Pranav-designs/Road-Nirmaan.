require('dotenv').config()
const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const User = require('./models/User')

const createAdmin = async () => {
  await mongoose.connect(process.env.MONGO_URI)
  console.log('✅ MongoDB Connected!')

  // Delete existing admins first
  await User.deleteMany({ role: 'admin' })

  // Create admin accounts
  const admins = [
    {
      name: 'Admin One',
      email: 'admin@roadnirmaan.com',
      password: 'Admin@123',
      role: 'admin'
    },
    {
      name: 'Admin Two',
      email: 'admin2@roadnirmaan.com',
      password: 'Admin@123',
      role: 'admin'
    }
  ]

  for (const admin of admins) {
    const hashedPassword = await bcrypt.hash(admin.password, 10)
    const user = new User({
      name: admin.name,
      email: admin.email,
      password: hashedPassword,
      role: 'admin'
    })
    await user.save()
    console.log(`✅ Admin created: ${admin.email} / ${admin.password}`)
  }

  mongoose.connection.close()
  console.log('✅ Done!')
}

createAdmin()