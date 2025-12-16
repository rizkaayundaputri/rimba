import { defineStore } from 'pinia'
import { ref, computed, h } from 'vue'
import http from '@/libraries/http'

export const useAuthStore = defineStore('auth', () => {
  
  const user = ref(null)
  const access_token = ref(localStorage.getItem('access_token') || null)
  const groupAccess = ref(null)
  const accessibleModules = ref([])
  const isLoading = ref(false)

  //computed untuk automatik update ketika ada perubahan 
  const isLoggedIn = computed(() => !!access_token.value) //boolean
  const isAdmin = computed(() => user.value?.role === 'Admin')
  const userRole = computed(() => user.value?.role) //isnya sama sama admin dan staff tapi ini berdasarkan database User
  const groupName = computed(() => groupAccess.value?.name || '') //isnya sama sama admin dan staff tapi ini berdasarkan database GroupAccess

 //membangun menu sidebar berdasarkan module yang diakses user-------------------------------------------------------------------- 
  const sidebarMenus = computed(() => {  // computed property untuk menu sidebar
    const modules = Array.isArray(accessibleModules.value) ? [...accessibleModules.value] : []; 
    // ambil data modul dari accessibleModules, pastikan array, buat salinan
    const grouped = {}; 
    modules.forEach(module => {
      const parentId = module.parentId != null ? module.parentId : 'root'; 
      // jika parentId tidak ada, anggap root
      if (!grouped[parentId]) {
        grouped[parentId] = [] // buat array baru jika parentId belum ada
      }
      grouped[parentId].push(module) //masukkan modul ke group sesuai parentId
    })

    const buildTree = (parentId, visited = new Set()) => { 
     // fungsi rekursif untuk membangun tree menu, dengan deteksi loop
      if (visited.has(parentId)) return []; 
      // jika parentId sudah pernah dikunjungi, hentikan rekursi (hindari infinite loop)
      visited.add(parentId); 
      // tandai parentId sudah dikunjungi

      const items = grouped[parentId] || []; 
      // ambil semua modul dengan parentId tertentu
      return items
        .sort((a, b) => (a.order || 0) - (b.order || 0)) 
        // urutkan modul berdasarkan order
        .map(item => ({
          ...item, 
          // copy properti modul
          children: buildTree(item.id, new Set(visited)) 
          // rekursif ambil anak-anak modul, clone visited agar tiap branch aman
        }));
    };

    return buildTree('root'); 
    // mulai membangun tree dari root
  })
  //------------------------------------------------------------------------------------------------------------------------------------

  async function login(email, password) {
    try {
      const response = await http.post('http://localhost:3000/login', {
        email,
        password
      })

      access_token.value = response.data.access_token
      user.value = response.data.user
      
      localStorage.setItem('access_token', access_token.value) 
      http.defaults.headers.common['Authorization'] = `Bearer ${access_token.value}` //otomatis attach token ke header
      
      await fetchUserData()  
      return { success: true }
      
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Login failed' 
      }
    }
  }

  async function fetchUserData() {
    try {
      const response = await http.get('http://localhost:3000/auth/me')
      
      user.value = response.data.user
      groupAccess.value = response.data.group_access
      accessibleModules.value = response.data.accessible_modules || [] 
    } catch (error) {
      if (error.response?.status === 401) {
        logout()
      }
    } 
  }

  function hasModuleAccess(moduleCode) {
    return accessibleModules.value.some(m => m.code === moduleCode) //// cek apakah ada minimal 1 modul di accessibleModules, kondisi: kode modul sama dengan moduleCode yang dicari
  }

  function getModulePermissions(moduleCode) {
     // cari modul di accessibleModules yang memiliki code sama dengan moduleCode
    // .find() mengembalikan **objek modul pertama** yang cocok atau undefined kalau tidak ada
    const module = accessibleModules.value.find(m => m.code === moduleCode)
    
    if (!module) return null
     // jika modul tidak ditemukan → return null (tidak ada akses)
    return {
      canCreate: module.canCreate,
      canRead: module.canRead,
      canUpdate: module.canUpdate,
      canDelete: module.canDelete
    }
    // kembalikan **hak akses CRUD** dari modul yang ditemukan
  }

  function logout() {
    user.value = null  
    access_token.value = null
    groupAccess.value = null
    accessibleModules.value = []
    localStorage.removeItem('access_token')
    delete http.defaults.headers.common['Authorization']
  }

  function initAuth() {
    if (access_token.value) {    // cek apakah ada token tersimpan
      http.defaults.headers.common['Authorization'] = `Bearer ${access_token.value}`
      // set header Authorization default untuk semua request axios
      fetchUserData()
      // ambil data user dari backend (profile, permissions, dll)
    }
  }

  return {
   
    user,
    access_token,
    groupAccess,
    accessibleModules,
    isLoading,

    isLoggedIn,
    isAdmin,
    userRole,
    groupName,
    sidebarMenus,
    
    login,
    fetchUserData,
    hasModuleAccess,
    getModulePermissions,
    logout,
    initAuth
  }
})
