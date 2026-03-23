import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getMyReports } from '../../api'

function UserDashboard() {
  const navigate = useNavigate()
  const [reports, setReports] = useState([])
  const [loading, setLoading] = useState(true)
  const user = JSON.parse(localStorage.getItem('user'))

  useEffect(() => {
    fetchReports()
  }, [])

  const fetchReports = async () => {
    try {
      const res = await getMyReports()
      setReports(res.data)
    } catch (error) {
      console.error('Error fetching reports:', error)
    }
    setLoading(false)
  }

  const getStatusColor = (status) => {
    if (status === "pending") return "bg-yellow-100 text-yellow-700"
    if (status === "assigned") return "bg-blue-100 text-blue-700"
    if (status === "completed") return "bg-green-100 text-green-700"
    if (status === "rejected") return "bg-red-100 text-red-700"
    if (status === "closed") return "bg-gray-100 text-gray-700"
    return "bg-gray-100 text-gray-700"
  }

  const pendingCount = reports.filter(r => r.status === "pending").length
  const assignedCount = reports.filter(r => r.status === "assigned").length
  const completedCount = reports.filter(r => r.status === "completed" || r.status === "closed").length

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    navigate('/')
  }

  return (
    <div className="min-h-screen bg-gray-100">

      {/* Navbar */}
      <div className="bg-blue-700 text-white px-6 py-4 flex justify-between items-center shadow-md">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🚧</span>
          <h1 className="text-xl font-bold">Road Nirmaan</h1>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm">👤 {user?.name}</span>
          <button
            onClick={handleLogout}
            className="bg-white text-blue-700 text-sm font-semibold px-4 py-1 rounded-lg hover:bg-gray-100"
          >
            Logout
          </button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-6">

        {/* Welcome */}
        <div className="bg-white rounded-2xl shadow p-6 mb-6 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">
              Welcome, {user?.name}! 👋
            </h2>
            <p className="text-gray-500 mt-1">Track and manage your pothole reports</p>
          </div>
          <button
            onClick={() => navigate('/user/report')}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-xl transition duration-200"
          >
            + Report Pothole
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-2xl shadow p-4 text-center">
            <p className="text-3xl font-bold text-yellow-500">{pendingCount}</p>
            <p className="text-gray-500 text-sm mt-1">Pending</p>
          </div>
          <div className="bg-white rounded-2xl shadow p-4 text-center">
            <p className="text-3xl font-bold text-blue-500">{assignedCount}</p>
            <p className="text-gray-500 text-sm mt-1">In Progress</p>
          </div>
          <div className="bg-white rounded-2xl shadow p-4 text-center">
            <p className="text-3xl font-bold text-green-500">{completedCount}</p>
            <p className="text-gray-500 text-sm mt-1">Completed</p>
          </div>
        </div>

        {/* Reports List */}
        <div className="bg-white rounded-2xl shadow p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4">My Reports</h3>

          {loading ? (
            <p className="text-gray-400 text-center py-8">Loading reports...</p>
          ) : reports.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-400 text-lg">No reports yet!</p>
              <button
                onClick={() => navigate('/user/report')}
                className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-xl hover:bg-blue-700"
              >
                Report your first pothole
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {reports.map((report) => (
                <div
                  key={report._id}
                  className="border border-gray-200 rounded-xl p-4 flex justify-between items-center hover:shadow-md transition"
                >
                  <div>
                    <p className="font-semibold text-gray-800">{report.description}</p>
                    <p className="text-gray-500 text-sm mt-1">
                      📍 {report.location?.address}
                    </p>
                    <p className="text-gray-400 text-xs mt-1">
                      📅 {new Date(report.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <span className={`text-sm font-semibold px-3 py-1 rounded-full ${getStatusColor(report.status)}`}>
                    {report.status.toUpperCase()}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  )
}

export default UserDashboard