import GoogleSuccess from './pages/GoogleSuccess'
import Register from './pages/Register'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import AddContractor from './pages/admin/AddContractor'

// Auth
import Login from './pages/Login'

// User
import UserDashboard from './pages/user/UserDashboard'
import ReportPothole from './pages/user/ReportPothole'

// Admin
import AdminDashboard from './pages/admin/AdminDashboard'
import VerifyReports from './pages/admin/VerifyReports'
import AssignContractor from './pages/admin/AssignContractor'

// Contractor
import ContractorDashboard from './pages/contractor/ContractorDashboard'
import UploadCompletion from './pages/contractor/UploadCompletion'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/register" element={<Register />} />
        {/* Auth */}
        <Route path="/" element={<Login />} />

        {/* User Routes */}
        <Route path="/user/dashboard" element={<UserDashboard />} />
        <Route path="/user/report" element={<ReportPothole />} />

        {/* Admin Routes */}
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/verify" element={<VerifyReports />} />
        <Route path="/admin/assign" element={<AssignContractor />} />

        <Route path="/auth/google/success" element={<GoogleSuccess />} />

        <Route path="/admin/add-contractor" element={<AddContractor />} />

        {/* Contractor Routes */}
        <Route path="/contractor/dashboard" element={<ContractorDashboard />} />
        <Route path="/contractor/upload" element={<UploadCompletion />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App