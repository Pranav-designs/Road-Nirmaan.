import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { getContractors, assignContractor } from '../../api'

function AssignContractor() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const reportId = searchParams.get('reportId')

  const [contractors, setContractors] = useState([])
  const [selectedContractor, setSelectedContractor] = useState(null)
  const [deadline, setDeadline] = useState('')
  const [loading, setLoading] = useState(true)
  const [assigning, setAssigning] = useState(false)
  const [assigned, setAssigned] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchContractors()
  }, [])

  const fetchContractors = async () => {
    try {
      const res = await getContractors()
      setContractors(res.data)
    } catch (error) {
      console.error('Error fetching contractors:', error)
    }
    setLoading(false)
  }

  const handleAssign = async () => {
    if (!selectedContractor) {
      setError('Please select a contractor!')
      return
    }
    if (!deadline) {
      setError('Please set a deadline!')
      return
    }

    setAssigning(true)
    setError('')

    try {
      await assignContractor(reportId, {
        contractorId: selectedContractor,
        deadline
      })
      setAssigned(true)
    } catch (error) {
      setError('Failed to assign contractor. Try again!')
    }
    setAssigning(false)
  }

  // Success screen
  if (assigned) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-xl p-10 text-center max-w-md">
          <div className="text-7xl mb-4">✅</div>
          <h2 className="text-2xl font-bold text-green-600 mb-2">Contractor Assigned!</h2>
          <p className="text-gray-500 mb-2">
            Contractor has been assigned successfully!
          </p>
          <p className="text-gray-500 mb-6">
            Deadline: <strong>{deadline}</strong>
          </p>
          <button
            onClick={() => navigate('/admin/dashboard')}
            className="bg-red-600 hover:bg-red-700 text-white font-semibold px-6 py-3 rounded-xl"
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

      <div className="max-w-3xl mx-auto p-6">

        {error && (
          <div className="bg-red-100 text-red-600 px-4 py-3 rounded-xl mb-4 text-sm">
            {error}
          </div>
        )}

        {/* Select Contractor */}
        <div className="bg-white rounded-2xl shadow p-6 mb-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4">🔨 Select Contractor</h3>

          {loading ? (
            <p className="text-gray-400 text-center py-4">Loading contractors...</p>
          ) : contractors.length === 0 ? (
            <p className="text-gray-400 text-center py-4">
              No contractors found! Register a contractor account first.
            </p>
          ) : (
            <div className="flex flex-col gap-3">
              {contractors.map((contractor) => (
                <div
                  key={contractor._id}
                  onClick={() => setSelectedContractor(contractor._id)}
                  className={`border-2 rounded-xl p-4 cursor-pointer transition ${
                    selectedContractor === contractor._id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-semibold text-gray-800">{contractor.name}</p>
                      <p className="text-gray-500 text-sm mt-1">
                        📧 {contractor.email}
                      </p>
                      <p className="text-gray-400 text-xs mt-1">
                        Active Tasks: {contractor.activeTasks} &nbsp;|&nbsp;
                        Completed: {contractor.completedTasks}
                      </p>
                    </div>
                    {selectedContractor === contractor._id && (
                      <span className="text-blue-500 text-2xl">✅</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Set Deadline */}
        <div className="bg-white rounded-2xl shadow p-6 mb-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4">📅 Set Deadline</h3>
          <input
            type="date"
            className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-400"
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
            min={new Date().toISOString().split('T')[0]}
          />
        </div>

        {/* Assign Button */}
        <button
          onClick={handleAssign}
          disabled={assigning}
          className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-4 rounded-xl text-lg transition duration-200"
        >
          {assigning ? 'Assigning...' : '🔨 Assign Contractor'}
        </button>

      </div>
    </div>
  )
}

export default AssignContractor