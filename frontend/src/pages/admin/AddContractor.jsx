import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

function AddContractor() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: ''
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const token = localStorage.getItem('token')
      await axios.post(
        'http://localhost:5000/api/admin/contractors/create',
        formData,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      )
      setSuccess(true)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create contractor!')
    }
    setLoading(false)
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-xl p-10 text-center max-w-md">
          <div className="text-7xl mb-4">✅</div>
          <h2 className="text-2xl font-bold text-green-600 mb-2">
            Contractor Created!
          </h2>
          <div className="bg-gray-50 rounded-xl p-4 text-left mb-6">
            <p className="text-gray-700 font-semibold mb-2">Login Credentials:</p>
            <p className="text-gray-600 text-sm">📧 Email: <strong>{formData.email}</strong></p>
            <p className="text-gray-600 text-sm">🔑 Password: <strong>{formData.password}</strong></p>
            <p className="text-red-500 text-xs mt-2">
              ⚠️ Share these credentials with the contractor securely!
            </p>
          </div>
          <div className="flex gap-3 justify-center">
            <button
              onClick={() => {
                setSuccess(false)
                setFormData({ name: '', email: '', password: '', phone: '' })
              }}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-xl"
            >
              Add Another
            </button>
            <button
              onClick={() => navigate('/admin/dashboard')}
              className="bg-red-600 hover:bg-red-700 text-white font-semibold px-6 py-3 rounded-xl"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100">

      {/* Navbar */}
      <div className="bg-red-700 text-white px-6 py-4 flex justify-between items-center shadow-md">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🚧</span>
          <h1 className="text-xl font-bold">Road Nirmaan — Admin</h1>
        </div>
        <button
          onClick={() => navigate('/admin/dashboard')}
          className="bg-white text-red-700 text-sm font-semibold px-4 py-1 rounded-lg hover:bg-gray-100"
        >
          ← Back
        </button>
      </div>

      <div className="max-w-2xl mx-auto p-6">
        <div className="bg-white rounded-2xl shadow p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            🔨 Add New Contractor
          </h2>
          <p className="text-gray-500 mb-6">
            Create login credentials for the contractor
          </p>

          {error && (
            <div className="bg-red-100 text-red-600 px-4 py-3 rounded-xl mb-4 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Contractor Name / Company
              </label>
              <input
                type="text"
                placeholder="e.g. Rajesh Construction Co."
                className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-400"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Email
              </label>
              <input
                type="email"
                placeholder="contractor@email.com"
                className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-400"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Phone Number
              </label>
              <input
                type="text"
                placeholder="9876543210"
                className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-400"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Password
              </label>
              <input
                type="text"
                placeholder="Create a password for contractor"
                className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-400"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
              />
              <p className="text-gray-400 text-xs mt-1">
                ⚠️ You will need to share this password with the contractor
              </p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="bg-red-600 hover:bg-red-700 text-white font-bold py-4 rounded-xl text-lg transition duration-200 mt-2"
            >
              {loading ? 'Creating...' : '🔨 Create Contractor Account'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default AddContractor