import axios from 'axios';

const http = axios.create({
  baseURL: 'http://localhost:3000',
  timeout: 5000,
});

//Interceptor ini bertugas “menyuntikkan” token login ke setiap request sebelum dikirim ke backend.
http.interceptors.request.use(
  (config) => { //Function sebelum request dikirim
    const access_token = localStorage.getItem('access_token') //Ambil access_token dari localStorage didapat saat login
    if (access_token) {
      config.headers.Authorization = `Bearer ${access_token}` // Sisipkan token ke header Authorization
    }
    return config
  },
  (error) => {
    return Promise.reject(error) // Tolak promise dan teruskan error ke pemanggil biasanya ke catch block
  }
)

// Response interceptor - handle 401 unauthorized

//Untuk otomatis logout & redirect ke halaman login ketika backend mengembalikan error 401 (token invalid/expired).
http.interceptors.response.use(
  (response) => response, /// Kalau response normal (200, 201, dll) → langsung diteruskan ke pemanggil (.then)
  (error) => {
    if (error.response?.status === 401) { //check error statusnya 401 bukan?
      // Token expired atau invalid
      // localStorage.removeItem('token')
      localStorage.removeItem('access_token') // Hapus token dari localStorage
      delete http.defaults.headers.common['Authorization'] // Hapus header Authorization di axios instance
      // Redirect to login page
      window.location.href = '/login'
    }
    return Promise.reject(error) //kirim error ke pemanggil (.catch block)
  }
)



export default http;