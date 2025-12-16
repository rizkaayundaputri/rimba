import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import http from '@/libraries/http.js'
import Swal from 'sweetalert2'

export const useModuleStore = defineStore('module', () => {
  // State
  const modules = ref([])
  // const loading = ref(false)
  // const error = ref(null)

  //----------------------------------------------------------------------------
  //Kode ini mengubah daftar modul datar menjadi struktur hierarki satu level, 
  // di mana setiap modul root memiliki array children dari modul-modul yang punya parentId sama dengan id-nya.
  const hierarchicalModules = computed(() => { 
  // Buat computed property agar otomatis update saat modules.value berubah
      const parents = modules.value.filter(m => !m.parentId) 
      // Ambil semua modul yang tidak punya parent (root modules)

      return parents.map(parent => ({ 
        // Untuk setiap modul root, buat objek baru
        ...parent, 
        // Salin semua properti modul root
        children: modules.value.filter(m => m.parentId === parent.id) 
        // Cari modul yang parentId-nya sama dengan id modul root → dijadikan children
      }))
})

  const activeModules = computed(() => {
    return modules.value.filter(m => m.isActive)
  })

  // Actions
  async function fetchModules() { 
    try {
      const res = await http.get('/module')
      modules.value = res.data
    } catch (error) {
      Swal.fire({
        title: 'Error!',
        text: error.response.data.message|| 'Server error',
        icon: 'error',
        confirmButtonText: 'Close'
      })   
    }
  }
  
  // async function fetchModuleById(id) {
   
  //   try {
  //     const response = await http.get(`/module/${id}`)
  //     modules.value = response.data
  //   } catch (error) {
  //     Swal.fire({
  //       title: 'Error!',
  //       text: error.response.data.message,
  //       icon: 'error',
  //       confirmButtonText: 'Close'
  //     })   
  //   }
  // }

  async function createModule(moduleData) {
    try {
      const response = await http.post('/module', moduleData)
      await fetchModules()
    } catch (error) {
      Swal.fire({
        title: 'Error!',
        text: error.response.data.message|| 'Server error',
        icon: 'error',
        confirmButtonText: 'Close'
      })   
    }
  }

  async function updateModule(id, moduleData) {
   
    try {
      const response = await http.put(`/module/${id}`, moduleData)
      await fetchModules() 
    } catch (error) {
      Swal.fire({
        title: 'Error!',
        text: error.response.data.message|| 'Server error',
        icon: 'error',
        confirmButtonText: 'Close'
      })   
    }
  }

  async function deleteModule(id) {
 
    try {
      const response = await http.delete(`/module/${id}`)
      await fetchModules()
    } catch (error) {
      Swal.fire({
        title: 'Error!',
        text: error.response.data.message|| 'Server error',
        icon: 'error',
        confirmButtonText: 'Close'
      })   
    }
  }

  // async function toggleModuleStatus(id) {
  //   loading.value = true
  //   error.value = null
    
  //   try {
  //     const response = await http.patch(`/modules/${id}/toggle`)
  //     await fetchModules() // Refresh list
  //     return { success: true, message: response.data.message }
  //   } catch (err) {
  //     error.value = err.response?.data?.message || 'Failed to toggle module status'
  //     console.error('Toggle module error:', err)
  //     return { success: false, message: error.value }
  //   } finally {
  //     loading.value = false
  //   }
  // }

  // async function updateModulesOrder(modulesOrder) {
  //   loading.value = true
  //   error.value = null
    
  //   try {
  //     const response = await http.put('/modules/order/bulk', {
  //       modules: modulesOrder
  //     })
  //     await fetchModules() // Refresh list
  //     return { success: true, message: response.data.message }
  //   } catch (err) {
  //     error.value = err.response?.data?.message || 'Failed to update modules order'
  //     console.error('Update order error:', err)
  //     return { success: false, message: error.value }
  //   } finally {
  //     loading.value = false
  //   }
  // }

  return {
    // State
    modules,

    
    // Getters
    hierarchicalModules,
    activeModules,
    
    // Actions
    fetchModules,
    // fetchModuleById,
    createModule,
    updateModule,
    deleteModule,
    // toggleModuleStatus,
    // updateModulesOrder
  }
})