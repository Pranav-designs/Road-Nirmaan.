import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { loginUser } from '../api'

function Login() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

 const handleLogin = async (e) => {
  e.preventDefault()
  setLoading(true)
  setError('')
  try {
    const res = await loginUser(formData)
    
    // Debug - check what we receive
    console.log('Full response:', res)
    console.log('Response data:', res.data)
    console.log('Token:', res.data.token)
    console.log('User:', res.data.user)

    const token = res.data.token
    const user = res.data.user

    // Save token and user info
    localStorage.setItem('token', token)
    localStorage.setItem('user', JSON.stringify(user))

    // Verify it was saved
    console.log('Saved token:', localStorage.getItem('token'))

    // Redirect based on role
    if (user.role === 'admin') navigate('/admin/dashboard')
    else if (user.role === 'contractor') navigate('/contractor/dashboard')
    else navigate('/user/dashboard')

  } catch (err) {
    console.log('Login error:', err)
    setError('Invalid email or password!')
  }
  setLoading(false)
}

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 to-blue-600 flex items-center justify-center">
      <div className="bg-white rounded-2xl shadow-2xl p-10 w-full max-w-md text-center">

        {/* Logo */}
        <div className="text-6xl mb-4">🚧</div>
        <h1 className="text-4xl font-bold text-blue-700 mb-2">Road Nirmaan</h1>
        <p className="text-gray-500 mb-8">Report. Verify. Fix. Together.</p>

        {/* Error */}
        {error && (
          <div className="bg-red-100 text-red-600 px-4 py-3 rounded-xl mb-4 text-sm">
            {error}
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleLogin} className="flex flex-col gap-4 text-left">
          <div>
            <label className="block text-gray-700 font-semibold mb-1">Email</label>
            <input
              type="email"
              placeholder="your@email.com"
              className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
          </div>
          {/* Divider */}
<div className="flex items-center gap-3 my-2">
  <hr className="flex-1 border-gray-300" />
  <span className="text-gray-400 text-sm">OR</span>
  <hr className="flex-1 border-gray-300" />
</div>

{/* Google Login */}
<button
  type="button"
  onClick={() => window.location.href = 'http://localhost:5000/api/auth/google'}
  className="w-full flex items-center justify-center gap-3 border-2 border-gray-300 hover:border-gray-400 text-gray-700 font-semibold py-3 rounded-xl transition duration-200"
>
  <img
    src="https://www.google.com/favicon.ico"
    alt="Google"
    className="w-5 h-5"
  />
  Continue with Google
</button>
          <div>
            <label className="block text-gray-700 font-semibold mb-1">Password</label>
            <input
              type="password"
              placeholder="••••••"
              className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition duration-200"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <p className="text-gray-500 text-sm mt-6">
  Don't have an account?{' '}
  <span
    onClick={() => navigate('/register')}
    className="text-blue-600 font-semibold cursor-pointer hover:underline"
  >
    Register here
  </span>
</p>
      </div>
    </div>
  )
}

export default Login