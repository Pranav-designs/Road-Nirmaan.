import axios from 'axios'

const API = axios.create({
  baseURL: 'http://localhost:5000/api'
})

// Automatically attach token to every request
API.interceptors.request.use((req) => {
  const token = localStorage.getItem('token')
  console.log('Token being sent:', token) // debug
  if (token) {
    req.headers.Authorization = `Bearer ${token}`
  }
  return req
})

// AUTH
export const registerUser = (data) => API.post('/auth/register', data)
export const loginUser = (data) => API.post('/auth/login', data)

// REPORTS
export const getMyReports = () => API.get('/reports')
export const submitReport = (data) => API.post('/reports', data)

// ADMIN
export const getAllReports = () => API.get('/admin/reports')
export const verifyReport = (id) => API.put(`/admin/reports/${id}/verify`)
export const rejectReport = (id) => API.put(`/admin/reports/${id}/reject`)
export const assignContractor = (id, data) => API.put(`/admin/reports/${id}/assign`, data)
export const closeReport = (id) => API.put(`/admin/reports/${id}/close`)
export const reworkReport = (id) => API.put(`/admin/reports/${id}/rework`)
export const getContractors = () => API.get('/admin/contractors')

// CONTRACTOR
export const getMyTasks = () => API.get('/contractor/tasks')
export const completeTask = (id, data) => API.put(`/contractor/tasks/${id}/complete`, data)