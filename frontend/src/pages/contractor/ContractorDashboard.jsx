import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getMyTasks } from '../../api'

function ContractorDashboard() {
  const navigate = useNavigate()
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const user = JSON.parse(localStorage.getItem('user'))

  useEffect(() => {
    fetchTasks()
  }, [])

  const fetchTasks = async () => {
    try {
      const res = await getMyTasks()
      setTasks(res.data)
    } catch (error) {
      console.error('Error fetching tasks:', error)
    }
    setLoading(false)
  }

  const getDaysRemaining = (deadline) => {
    const today = new Date()
    const deadlineDate = new Date(deadline)
    const diff = Math.ceil((deadlineDate - today) / (1000 * 60 * 60 * 24))
    return diff
  }

  const calculateFine = (deadline) => {
    const days = getDaysRemaining(deadline)
    if (days < 0) return Math.abs(days) * 500
    return 0
  }

  const getStatusColor = (status) => {
    if (status === "assigned") return "bg-yellow-100 text-yellow-700"
    if (status === "completed") return "bg-green-100 text-green-700"
    if (status === "rework") return "bg-red-100 text-red-700"
    if (status === "closed") return "bg-gray-100 text-gray-700"
    return "bg-gray-100 text-gray-700"
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    navigate('/')
  }

  const activeTasks = tasks.filter(t => t.status === "assigned").length
  const completedTasks = tasks.filter(t => t.status === "completed" || t.status === "closed").length
  const totalFine = tasks.reduce((acc, t) => acc + calculateFine(t.deadline), 0)

  return (
    <div className="min-h-screen bg-gray-100">

      {/* Navbar */}
      <div className="bg-yellow-600 text-white px-6 py-4 flex justify-between items-center shadow-md">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🚧</span>
          <h1 className="text-xl font-bold">Road Nirmaan — Contractor</h1>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm">🔨 {user?.name}</span>
          <button
            onClick={handleLogout}
            className="bg-white text-yellow-600 text-sm font-semibold px-4 py-1 rounded-lg hover:bg-gray-100"
          >
            Logout
          </button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-6">

        {/* Welcome */}
        <div className="bg-white rounded-2xl shadow p-6 mb-6">
          <h2 className="text-2xl font-bold text-gray-800">
            Welcome, {user?.name}! 👋
          </h2>
          <p className="text-gray-500 mt-1">Manage your assigned road repair tasks</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-2xl shadow p-4 text-center">
            <p className="text-3xl font-bold text-yellow-500">{activeTasks}</p>
            <p className="text-gray-500 text-sm mt-1">Active Tasks</p>
          </div>
          <div className="bg-white rounded-2xl shadow p-4 text-center">
            <p className="text-3xl font-bold text-green-500">{completedTasks}</p>
            <p className="text-gray-500 text-sm mt-1">Completed</p>
          </div>
          <div className="bg-white rounded-2xl shadow p-4 text-center">
            <p className="text-3xl font-bold text-red-500">₹{totalFine}</p>
            <p className="text-gray-500 text-sm mt-1">Total Fine</p>
          </div>
        </div>

        {/* Tasks List */}
        <div className="bg-white rounded-2xl shadow p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4">My Tasks</h3>

          {loading ? (
            <p className="text-gray-400 text-center py-8">Loading tasks...</p>
          ) : tasks.length === 0 ? (
            <p className="text-gray-400 text-center py-8">
              No tasks assigned yet!
            </p>
          ) : (
            <div className="flex flex-col gap-4">
              {tasks.map((task) => {
                const daysLeft = getDaysRemaining(task.deadline)
                const fine = calculateFine(task.deadline)

                return (
                  <div
                    key={task._id}
                    className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <p className="font-semibold text-gray-800">
                          {task.description}
                        </p>
                        <p className="text-gray-500 text-sm mt-1">
                          📍 {task.location?.address}
                        </p>
                        <p className="text-gray-400 text-xs mt-1">
                          📅 Assigned: {new Date(task.createdAt).toLocaleDateString()} &nbsp;|&nbsp;
                          ⏰ Deadline: {new Date(task.deadline).toLocaleDateString()}
                        </p>

                        {/* Pothole photo */}
                        {task.photo && (
                          <img
                            src={task.photo}
                            alt="pothole"
                            className="mt-2 w-32 h-24 object-cover rounded-lg border border-gray-200"
                          />
                        )}

                        {/* Days remaining or fine */}
                        {task.status === "assigned" && (
                          <div className="mt-2">
                            {daysLeft > 0 ? (
                              <span className="text-blue-600 text-sm font-semibold">
                                ⏳ {daysLeft} days remaining
                              </span>
                            ) : (
                              <span className="text-red-600 text-sm font-semibold">
                                ⚠️ Overdue by {Math.abs(daysLeft)} days — Fine: ₹{fine}
                              </span>
                            )}
                          </div>
                        )}
                      </div>

                      <span className={`text-sm font-semibold px-3 py-1 rounded-full ml-4 ${getStatusColor(task.status)}`}>
                        {task.status.toUpperCase()}
                      </span>
                    </div>

                    {/* Upload button */}
                    {(task.status === "assigned" || task.status === "rework") && (
  <button
    onClick={() => navigate(`/contractor/upload?taskId=${task._id}`)}
    className={`mt-4 text-white text-sm font-semibold px-4 py-2 rounded-lg transition ${
      task.status === "rework"
        ? "bg-red-500 hover:bg-red-600"
        : "bg-yellow-500 hover:bg-yellow-600"
    }`}
  >
    {task.status === "rework" ? "🔄 Resubmit Completion Photo" : "📸 Upload Completion Photo"}
  </button>
)}
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ContractorDashboard