import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'

const routes = [
  {
    path: '/login',
    name: 'login',
    component: () => import('../views/Login.vue'),
    meta: { guest: true } 
  },
  {
    path: '/',
    name: 'home',
    component: () => import('../views/Home.vue'),
    meta: { requiresAuth: true }  
  },
  {
    path: '/admin-list',
    name: 'admin-list',  
    component: () => import('../views/AdminList.vue'),
    meta: { requiresAuth: true, moduleCode: 'ADMIN_LIST' }
  },
  {
    path: '/hobby-list',
    name: 'hobby-list',  
    component: () => import('../views/HobbyPage.vue'),
    meta: { requiresAuth: true, moduleCode: 'HOBBY-LIST' }
  },
  {
    path: '/add-hobby',
    name: 'add-hobby',  
    component: () => import('../views/AddHobbyPage.vue'),
    meta: { requiresAuth: true, moduleCode: 'ADD_HOBBY' }
  },
  {
    path: '/staff-list',
    name: 'staff-list',  
    component: () => import('../views/AllStaffList.vue'),  
    meta: { requiresAuth: true, moduleCode: 'ALLSTAFF_LIST' }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})


router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore()
  const isLoggedIn = authStore.isLoggedIn

  if (to.meta.guest && isLoggedIn) {
    return next({ name: 'home' })
  }

  if (to.meta.requiresAuth && !isLoggedIn) {
    return next({ name: 'login' })
  }

  if (to.meta.moduleCode && isLoggedIn) {
    if (authStore.accessibleModules.length === 0 && authStore.token) {
      await authStore.fetchUserData()
    }

    if (!authStore.hasModuleAccess(to.meta.moduleCode)) {
      return next({ name: 'home' })
    }
  }

  next()
})

export default router
