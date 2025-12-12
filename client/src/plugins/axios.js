import axios from 'axios'

// Setup base URL
axios.defaults.baseURL = 'http://localhost:3000'

// Request interceptor - auto attach token

//setiap kali axios mau kirim request

// interceptor mengambil token dari localStorage

// lalu memasukkan token itu ke config.headers.Authorization
// mengirim token ke request (itu job frontend)

// membaca localStorage (backend tidak bisa)

// memaksa browser melakukan redirect ke login

axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor - handle 401 unauthorized

//Untuk otomatis logout & redirect ke halaman login ketika backend mengembalikan error 401 (token invalid/expired).

axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired atau invalid
      // localStorage.removeItem('token')
      localStorage.removeItem('access_token')
      delete axios.defaults.headers.common['Authorization']
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export default axios


//Kode ini membuat axios otomatis mengirim token dan otomatis logout kalau token invalid/expired. Ini disebut Request & Response Interceptor.