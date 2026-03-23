import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getAllReports, verifyReport, rejectReport, closeReport, reworkReport } from '../../api'

function AdminDashboard() {
  const navigate = useNavigate()
  const [reports, setReports] = useState([])
  const [loading, setLoading] = useState(true)
  const user = JSON.parse(localStorage.getItem('user'))

  useEffect(() => {
    fetchReports()
  }, [])

  const fetchReports = async () => {
    try {
      const res = await getAllReports()
      setReports(res.data)
    } catch (error) {
      console.error('Error fetching reports:', error)
    }
    setLoading(false)
  }

  const handleVerify = async (id) => {
    try {
      await verifyReport(id)
      fetchReports() // refresh list
    } catch (error) {
      console.error('Error verifying report:', error)
    }
  }

  const handleReject = async (id) => {
    try {
      await rejectReport(id)
      fetchReports()
    } catch (error) {
      console.error('Error rejecting report:', error)
    }
  }

  const handleClose = async (id) => {
    try {
      await closeReport(id)
      fetchReports()
    } catch (error) {
      console.error('Error closing report:', error)
    }
  }

  const handleRework = async (id) => {
  try {
    await reworkReport(id)
    fetchReports()
  } catch (error) {
    console.error('Error requesting rework:', error)
  }
}

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    navigate('/')
  }

  const getStatusColor = (status) => {
    if (status === "pending") return "bg-yellow-100 text-yellow-700"
    if (status === "verified") return "bg-blue-100 text-blue-700"
    if (status === "assigned") return "bg-purple-100 text-purple-700"
    if (status === "completed") return "bg-green-100 text-green-700"
    if (status === "rejected") return "bg-red-100 text-red-700"
    if (status === "closed") return "bg-gray-100 text-gray-700"
    return "bg-gray-100 text-gray-700"
  }

  const pendingCount = reports.filter(r => r.status === "pending").length
  const assignedCount = reports.filter(r => r.status === "assigned").length
  const completedCount = reports.filter(r => r.status === "completed" || r.status === "closed").length

  return (
    <div className="min-h-screen bg-gray-100">

      {/* Navbar */}
      <div className="bg-red-700 text-white px-6 py-4 flex justify-between items-center shadow-md">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🚧</span>
          <h1 className="text-xl font-bold">Road Nirmaan — Admin</h1>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm">🛡️ {user?.name}</span>
          <button
            onClick={handleLogout}
            className="bg-white text-red-700 text-sm font-semibold px-4 py-1 rounded-lg hover:bg-gray-100"
          >
            Logout
          </button>
        </div>
      </div>

      <div className="max-w-5xl mx-auto p-6">

        {/* Welcome */}
        {/* Welcome */}
<div className="bg-white rounded-2xl shadow p-6 mb-6 flex justify-between items-center">
  <div>
    <h2 className="text-2xl font-bold text-gray-800">Admin Dashboard 🛡️</h2>
    <p className="text-gray-500 mt-1">Manage and verify pothole reports</p>
  </div>
  <button
    onClick={() => navigate('/admin/add-contractor')}
    className="bg-red-600 hover:bg-red-700 text-white font-semibold px-6 py-3 rounded-xl transition"
  >
    + Add Contractor
  </button>
</div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-2xl shadow p-4 text-center">
            <p className="text-3xl font-bold text-yellow-500">{pendingCount}</p>
            <p className="text-gray-500 text-sm mt-1">Pending</p>
          </div>
          <div className="bg-white rounded-2xl shadow p-4 text-center">
            <p className="text-3xl font-bold text-purple-500">{assignedCount}</p>
            <p className="text-gray-500 text-sm mt-1">Assigned</p>
          </div>
          <div className="bg-white rounded-2xl shadow p-4 text-center">
            <p className="text-3xl font-bold text-green-500">{completedCount}</p>
            <p className="text-gray-500 text-sm mt-1">Completed</p>
          </div>
        </div>

        {/* Reports List */}
        <div className="bg-white rounded-2xl shadow p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4">All Reports</h3>

          {loading ? (
            <p className="text-gray-400 text-center py-8">Loading reports...</p>
          ) : reports.length === 0 ? (
            <p className="text-gray-400 text-center py-8">No reports yet!</p>
          ) : (
            <div className="flex flex-col gap-4">
              {reports.map((report) => (
                <div
                  key={report._id}
                  className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <p className="font-semibold text-gray-800">{report.description}</p>
                      <p className="text-gray-500 text-sm mt-1">
                        📍 {report.location?.address}
                      </p>
                      <p className="text-gray-400 text-xs mt-1">
                        📅 {new Date(report.createdAt).toLocaleDateString()} &nbsp;|&nbsp;
                        👤 {report.userId?.name || 'Unknown'}
                      </p>

                      {/* Photo */}
                      {report.photo && (
                        <img
                          src={report.photo}
                          alt="pothole"
                          className="mt-2 w-32 h-24 object-cover rounded-lg border border-gray-200"
                        />
                      )}
                    </div>
                    <span className={`text-sm font-semibold px-3 py-1 rounded-full ml-4 ${getStatusColor(report.status)}`}>
                      {report.status.toUpperCase()}
                    </span>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3 mt-4 flex-wrap">

                    {/* Pending actions */}
                    {report.status === "pending" && (
                      <>
                        <button
                          onClick={() => handleVerify(report._id)}
                          className="bg-green-500 hover:bg-green-600 text-white text-sm font-semibold px-4 py-2 rounded-lg transition"
                        >
                          ✅ Verify
                        </button>
                        <button
                          onClick={() => handleReject(report._id)}
                          className="bg-red-500 hover:bg-red-600 text-white text-sm font-semibold px-4 py-2 rounded-lg transition"
                        >
                          ❌ Reject
                        </button>
                      </>
                    )}

                    {/* Verified actions */}
                    {report.status === "verified" && (
                      <button
                        onClick={() => navigate(`/admin/assign?reportId=${report._id}`)}
                        className="bg-blue-500 hover:bg-blue-600 text-white text-sm font-semibold px-4 py-2 rounded-lg transition"
                      >
                        🔨 Assign Contractor
                      </button>
                    )}

                    {/* Completed actions */}
                    {report.status === "completed" && (
                      <>
                        <button
                          onClick={() => handleClose(report._id)}
                          className="bg-green-500 hover:bg-green-600 text-white text-sm font-semibold px-4 py-2 rounded-lg transition"
                        >
                          ✅ Approve Completion
                        </button>
                        <button
                           onClick={() => handleRework(report._id)}
                          className="bg-red-500 hover:bg-red-600 text-white text-sm font-semibold px-4 py-2 rounded-lg transition"
                        >
                          🔄 Request Rework
                        </button>

                        {/* Show completion photo */}
                        {report.completionPhoto && (
                          <img
                            src={report.completionPhoto}
                            alt="completion"
                            className="mt-2 w-32 h-24 object-cover rounded-lg border border-gray-200"
                          />
                        )}
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard