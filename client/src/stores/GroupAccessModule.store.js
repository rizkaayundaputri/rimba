import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import http from '@/libraries/http.js'
import Swal from 'sweetalert2'
import { useAuthStore } from './Auth.store'

export const useGroupAccessModuleStore = defineStore('groupAccessModule', () => {
   const groupAccessModules = ref([])

    // Group modules by groupAccessId
  const modulesByGroupAccess = computed(() => { // computed property → otomatis update saat groupAccessModules berubah
    const grouped = {}
    groupAccessModules.value.forEach(gam => { 
      if (!grouped[gam.groupAccessId]) {    // // jika belum ada key untuk groupAccessId ini,buat array kosong sebagai wadah modul
        grouped[gam.groupAccessId] = []   
      }
      grouped[gam.groupAccessId].push(gam)
    })
    return grouped
  })

  // Get modules for specific group access
  const getModulesByGroupAccessId = (groupAccessId) => {
    return groupAccessModules.value.filter(gam => gam.groupAccessId === groupAccessId) // ambil hanya modul yang groupAccessId-nya sama 
  }

  // Check if group has access to module
  const hasModuleAccess = (groupAccessId, moduleId) => {
    return groupAccessModules.value.some(
      gam => gam.groupAccessId === groupAccessId && gam.moduleId === moduleId // cek apakah ada **minimal 1 modul** di groupAccessModules yang memiliki groupAccessId sama dengan parameter `groupAccessId` **dan** moduleId sama dengan parameter `moduleId`
    )
  }

  // Get permissions for specific group-module combination
  const getPermissions = (groupAccessId, moduleId) => {
    const gam = groupAccessModules.value.find(
      item => item.groupAccessId === groupAccessId && item.moduleId === moduleId
      // .find() mengembalikan **elemen pertama** yang cocok, atau undefined kalau tidak ada
    )
    return gam ? {
      canCreate: gam.canCreate,
      canRead: gam.canRead,
      canUpdate: gam.canUpdate,
      canDelete: gam.canDelete
    } : null
  }

  async function fetchGroupAccessModules() { 
    try {
      const res = await http.get('/group-access-module')
      groupAccessModules.value = res.data.sort((a, b) => a.id - b.id)
    } catch (error) {
      Swal.fire({
        title: 'Error!',
        text: error.response.data.message|| 'Server error',
        icon: 'error',
        confirmButtonText: 'Close'
      })   
    }
  }

  // ================= GET OR CREATE GROUP ACCESS =================
  async function getOrCreateGroupAccess(groupName) {
    try {
      // Check if group exists
      const response = await http.get('/group-access')
      const existingGroup = response.data.find(
        g => g.name.toLowerCase() === groupName.toLowerCase()
      )
      
      if (existingGroup) {
        return { success: true, id: existingGroup.id, created: false }
      }
      // Create new group access
      const createRes = await http.post('/group-access', {
        name: groupName,
        description: ''
      })
      
      return { success: true, id: createRes.data.id, created: true }
    } catch (error) {
      console.error('Error in getOrCreateGroupAccess:', error)
      return { 
        success: false, 
        error: error.response?.data?.message || 'Gagal membuat group access'
      }
    }
  }
//==========================================================================
  async function createGroupAccessModule(moduleData) {
    try {
      const response = await http.post('/group-access-module', moduleData)
      await fetchGroupAccessModules()
      
      //  Refresh sidebar - update user permissions
      const authStore = useAuthStore()
      await authStore.fetchUserData()
      
      return { success: true }
    } catch (error) {
      Swal.fire({
        title: 'Error!',
        text: error.response.data.message|| 'Server error',
        icon: 'error',
        confirmButtonText: 'Close'
      })
      return { success: false }
    }
  }

  async function updateGroupAccessModule(id, moduleData) {
    try {
      const response = await http.put(`/group-access-module/${id}`, moduleData)
      await fetchGroupAccessModules()
      
      //  Refresh sidebar - update user permissions
      const authStore = useAuthStore()  // ambil store auth
      await authStore.fetchUserData()  //fetch ulang data user + modules
      
      return { success: true }
    } catch (error) {
      Swal.fire({
        title: 'Error!',
        text: error.response.data.message|| 'Server error',
        icon: 'error',
        confirmButtonText: 'Close'
      })
      return { success: false }
    }
  }

  async function deleteGroupAccessModule(id) {
    try {
      const response = await http.delete(`/group-access-module/${id}`)
      await fetchGroupAccessModules()
      
      //  Refresh sidebar - update user permissions
      const authStore = useAuthStore()
      await authStore.fetchUserData()
      
      return { success: true }
    } catch (error) {
      Swal.fire({
        title: 'Error!',
        text: error.response.data.message|| 'Server error',
        icon: 'error',
        confirmButtonText: 'Close'
      })
      return { success: false }
    }
  }

   function clearState() {
    groupAccessModules.value = []
    loading.value = false
    error.value = null
  }
  
  return {
    // State
    groupAccessModules, 
    // Getters
    modulesByGroupAccess,
    getModulesByGroupAccessId,
    hasModuleAccess,
    getPermissions,
    // Actions
    fetchGroupAccessModules,
    getOrCreateGroupAccess,
    createGroupAccessModule,
    updateGroupAccessModule,
    deleteGroupAccessModule,
    clearState
  }

})