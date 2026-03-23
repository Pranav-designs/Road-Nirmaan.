import { useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'

function GoogleSuccess() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  useEffect(() => {
    const token = searchParams.get('token')
    const userStr = searchParams.get('user')

    if (token && userStr) {
      const user = JSON.parse(userStr)
      localStorage.setItem('token', token)
      localStorage.setItem('user', userStr)

      // Redirect based on role
      if (user.role === 'admin') navigate('/admin/dashboard')
      else if (user.role === 'contractor') navigate('/contractor/dashboard')
      else navigate('/user/dashboard')
    } else {
      navigate('/')
    }
  }, [])

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white rounded-2xl shadow p-10 text-center">
        <div className="text-5xl mb-4">⏳</div>
        <p className="text-gray-600 font-semibold">Logging you in...</p>
      </div>
    </div>
  )
}

export default GoogleSuccess