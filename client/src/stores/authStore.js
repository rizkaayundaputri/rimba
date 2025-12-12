import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import axios from 'axios'

export const useAuthStore = defineStore('auth', () => {
  
  const user = ref(null)
  const token = ref(localStorage.getItem('token') || null)
  const groupAccess = ref(null)
  const accessibleModules = ref([])
  const isLoading = ref(false)


  const isLoggedIn = computed(() => !!token.value)
  const isAdmin = computed(() => user.value?.role === 'Admin')
  const userRole = computed(() => user.value?.role)
  const groupName = computed(() => groupAccess.value?.name || '')

  
  const sidebarMenus = computed(() => {
    const modules = [...accessibleModules.value]
    const grouped = {}
    
    modules.forEach(module => {
      const parentId = module.parentId || 'root'
      if (!grouped[parentId]) {
        grouped[parentId] = []
      }
      grouped[parentId].push(module)
    })

    const buildTree = (parentId) => {
      const items = grouped[parentId] || []
      return items
        .sort((a, b) => a.order - b.order)
        .map(item => ({
          ...item,
          children: buildTree(item.id)
        }))
    }

    return buildTree('root')
  })


  async function login(email, password) {
    try {
      isLoading.value = true
      const response = await axios.post('http://localhost:3000/login', {
        email,
        password
      })

      token.value = response.data.access_token
      user.value = response.data.user
      
      localStorage.setItem('token', token.value)
      axios.defaults.headers.common['Authorization'] = `Bearer ${token.value}`
      
      await fetchUserData()
      
      return { success: true }
    } catch (error) {
      console.error('Login failed:', error)
      return { 
        success: false, 
        message: error.response?.data?.message || 'Login failed' 
      }
    } finally {
      isLoading.value = false
    }
  }

  async function fetchUserData() {
    try {
      isLoading.value = true
      const response = await axios.get('http://localhost:3000/auth/me')
      
      user.value = response.data.user
      groupAccess.value = response.data.group_access
      accessibleModules.value = response.data.accessible_modules || []
    } catch (error) {
      console.error('Failed to fetch user data:', error)
      if (error.response?.status === 401) {
        logout()
      }
    } finally {
      isLoading.value = false
    }
  }

  function hasModuleAccess(moduleCode) {
    return accessibleModules.value.some(m => m.code === moduleCode)
  }

  function getModulePermissions(moduleCode) {
    const module = accessibleModules.value.find(m => m.code === moduleCode)
    if (!module) return null
    
    return {
      canCreate: module.canCreate,
      canRead: module.canRead,
      canUpdate: module.canUpdate,
      canDelete: module.canDelete
    }
  }

  function logout() {
    user.value = null
    token.value = null
    groupAccess.value = null
    accessibleModules.value = []
    localStorage.removeItem('token')
    delete axios.defaults.headers.common['Authorization']
  }

  function initAuth() {
    if (token.value) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token.value}`
      fetchUserData()
    }
  }

  return {
   
    user,
    token,
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
