import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { submitReport } from '../../api'

function ReportPothole() {
  const navigate = useNavigate()

  const [description, setDescription] = useState('')
  const [location, setLocation] = useState({ lat: '', lng: '', address: '' })
  const [photo, setPhoto] = useState(null)
  const [photoPreview, setPhotoPreview] = useState(null)
  const [locationLoading, setLocationLoading] = useState(false)
  const [submitLoading, setSubmitLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')

  // Get GPS location
  const getLocation = () => {
    setLocationLoading(true)
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude
        const lng = position.coords.longitude
        setLocation({
          lat: lat.toFixed(6),
          lng: lng.toFixed(6),
          address: `Lat: ${lat.toFixed(4)}, Lng: ${lng.toFixed(4)}`
        })
        setLocationLoading(false)
      },
      () => {
        alert('Location access denied. Please allow location.')
        setLocationLoading(false)
      }
    )
  }

  // Handle photo upload
  const handlePhoto = (e) => {
    const file = e.target.files[0]
    if (file) {
      setPhoto(file)
      setPhotoPreview(URL.createObjectURL(file))
    }
  }

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!photo) {
      setError('Please upload a photo of the pothole!')
      return
    }
    if (!location.lat) {
      setError('Please get your GPS location!')
      return
    }

    setSubmitLoading(true)

    try {
      // FormData because we are sending a file
      const formData = new FormData()
      formData.append('description', description)
      formData.append('lat', location.lat)
      formData.append('lng', location.lng)
      formData.append('address', location.address)
      formData.append('photo', photo)

      await submitReport(formData)
      setSubmitted(true)

    } catch (err) {
      setError('Failed to submit report. Please try again!')
    }

    setSubmitLoading(false)
  }

  // Success screen
  if (submitted) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-xl p-10 text-center max-w-md">
          <div className="text-7xl mb-4">✅</div>
          <h2 className="text-2xl font-bold text-green-600 mb-2">Report Submitted!</h2>
          <p className="text-gray-500 mb-6">
            Your pothole report has been submitted successfully. Admin will verify it soon.
          </p>
          <button
            onClick={() => navigate('/user/dashboard')}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-xl"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100">

      {/* Navbar */}
      <div className="bg-blue-700 text-white px-6 py-4 flex justify-between items-center shadow-md">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🚧</span>
          <h1 className="text-xl font-bold">Road Nirmaan</h1>
        </div>
        <button
          onClick={() => navigate('/user/dashboard')}
          className="bg-white text-blue-700 text-sm font-semibold px-4 py-1 rounded-lg hover:bg-gray-100"
        >
          ← Back
        </button>
      </div>

      <div className="max-w-2xl mx-auto p-6">
        <div className="bg-white rounded-2xl shadow p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            🕳️ Report a Pothole
          </h2>

          {error && (
            <div className="bg-red-100 text-red-600 px-4 py-3 rounded-xl mb-4 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-6">

            {/* Description */}
            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Description
              </label>
              <textarea
                rows={3}
                placeholder="Describe the pothole (size, depth, danger level...)"
                className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </div>

            {/* GPS Location */}
            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                📍 Location
              </label>
              <div className="flex gap-3">
                <input
                  type="text"
                  placeholder="Click button to get GPS location"
                  className="flex-1 border border-gray-300 rounded-xl px-4 py-3 bg-gray-50 focus:outline-none"
                  value={location.address}
                  readOnly
                />
                <button
                  type="button"
                  onClick={getLocation}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-3 rounded-xl transition"
                >
                  {locationLoading ? '...' : '📍 Get'}
                </button>
              </div>
              {location.lat && (
                <p className="text-green-600 text-sm mt-2">
                  ✅ Location captured: {location.lat}, {location.lng}
                </p>
              )}
            </div>

            {/* Photo Upload */}
            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                📸 Pothole Photo
              </label>
              <input
                type="file"
                accept="image/*"
                capture="environment"
                onChange={handlePhoto}
                className="w-full border border-gray-300 rounded-xl px-4 py-3"
              />
              {photoPreview && (
                <img
                  src={photoPreview}
                  alt="preview"
                  className="mt-3 w-full h-48 object-cover rounded-xl border border-gray-200"
                />
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={submitLoading}
              className="bg-green-600 hover:bg-green-700 text-white font-bold py-4 rounded-xl text-lg transition duration-200"
            >
              {submitLoading ? 'Submitting...' : '🚀 Submit Report'}
            </button>

          </form>
        </div>
      </div>
    </div>
  )
}

export default ReportPothole