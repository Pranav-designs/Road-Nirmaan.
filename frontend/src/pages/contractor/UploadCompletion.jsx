import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { completeTask } from '../../api'

function UploadCompletion() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const taskId = searchParams.get('taskId')

  const [photo, setPhoto] = useState(null)
  const [photoPreview, setPhotoPreview] = useState(null)
  const [notes, setNotes] = useState('')
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')

  const handlePhoto = (e) => {
    const file = e.target.files[0]
    if (file) {
      setPhoto(file)
      setPhotoPreview(URL.createObjectURL(file))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!photo) {
      setError('Please upload a completion photo!')
      return
    }

    setLoading(true)

    try {
      const formData = new FormData()
      formData.append('photo', photo)
      formData.append('notes', notes)

      await completeTask(taskId, formData)
      setSubmitted(true)

    } catch (err) {
      setError('Failed to submit completion. Please try again!')
    }

    setLoading(false)
  }

  // Success screen
  if (submitted) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-xl p-10 text-center max-w-md">
          <div className="text-7xl mb-4">✅</div>
          <h2 className="text-2xl font-bold text-green-600 mb-2">
            Completion Submitted!
          </h2>
          <p className="text-gray-500 mb-6">
            Your completion photo has been submitted. Admin will verify it soon.
          </p>
          <button
            onClick={() => navigate('/contractor/dashboard')}
            className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold px-6 py-3 rounded-xl"
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
      <div className="bg-yellow-600 text-white px-6 py-4 flex justify-between items-center shadow-md">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🚧</span>
          <h1 className="text-xl font-bold">Road Nirmaan — Contractor</h1>
        </div>
        <button
          onClick={() => navigate('/contractor/dashboard')}
          className="bg-white text-yellow-600 text-sm font-semibold px-4 py-1 rounded-lg hover:bg-gray-100"
        >
          ← Back
        </button>
      </div>

      <div className="max-w-2xl mx-auto p-6">
        <div className="bg-white rounded-2xl shadow p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            📸 Upload Completion Photo
          </h2>

          {error && (
            <div className="bg-red-100 text-red-600 px-4 py-3 rounded-xl mb-4 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-6">

            {/* Photo Upload */}
            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                After Photo (Fixed Road)
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

            {/* Notes */}
            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Work Notes (optional)
              </label>
              <textarea
                rows={3}
                placeholder="Describe the work done..."
                className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="bg-green-600 hover:bg-green-700 text-white font-bold py-4 rounded-xl text-lg transition duration-200"
            >
              {loading ? 'Submitting...' : '✅ Submit Completion'}
            </button>

          </form>
        </div>
      </div>
    </div>
  )
}

export default UploadCompletion