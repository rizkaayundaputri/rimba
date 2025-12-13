import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'
import http from '@/libraries/http'


const staticRoutes = [
  {
    path: '/login',
    name: 'login',
    component: () => import('../views/Login.vue'),
    meta: { guest: true }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes: staticRoutes
})

export async function initRoutesFromDB() {
  try {
    const { data } = await http.get('/route') // ambil semua modul aktif
    data
      .filter(m => m.isActive)                 // hanya yang aktif
      .forEach(m => {
        // Cek dulu supaya tidak duplikat
        if (!router.hasRoute(m.routeName)) {
          router.addRoute({
            path: '/' + m.routeName,
            name: m.routeName,
            component: () => import(`../views/${m.routeName}.vue`),
            meta: {
              moduleCode: m.code,
              requiresAuth: true
            }
          })
        }
      })

  } catch (error) {
    console.error('Failed to load routes from DB:', error)
  }
}

router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore()
  const isLoggedIn = authStore.isLoggedIn

    // Guest-only routes
    if (to.meta.guest && isLoggedIn) {
      // Redirect ke modul pertama user, atau login kalau ga ada modul
      const firstModule = authStore.accessibleModules[0]
      if (firstModule) return next({ name: firstModule.routeName })
      return next({ name: 'login' })
    }

    // Protected routes
    if (to.meta.requiresAuth && !isLoggedIn) {
      return next({ name: 'login' })
    }

    // Module-based access
    if (to.meta.moduleCode && isLoggedIn) {
    // Fetch modules jika belum ada
    if (authStore.accessibleModules.length === 0 && authStore.token) {
      await authStore.fetchUserData()
    }

    // Cek permission module
     if (!authStore.hasModuleAccess(to.meta.moduleCode)) {
      // Redirect ke modul pertama user atau login jika tidak ada
      const firstModule = authStore.accessibleModules[0]
      if (firstModule) return next({ name: firstModule.routeName })
      return next({ name: 'login' })
    }
  }

  next()
})








// const routes = [
//   {
//     path: '/login',
//     name: 'login',
//     component: () => import('../views/Login.vue'),
//     meta: { guest: true } // Meta field untuk menandai route ini hanya untuk "guest" (belum login)
//     // Biasanya dipakai di route guard untuk mencegah user yang sudah login membuka halaman login
//   },
//   {
//     path: '/',
//     name: 'home',
//     component: () => import('../views/Home.vue'),
//     meta: { requiresAuth: true }  
//   },
//   {
//     path: '/admin-list',
//     name: 'admin-list',  
//     component: () => import('../views/AdminList.vue'),
//     meta: { requiresAuth: true, moduleCode: 'ADMIN_LIST' }
//   },
//   {
//     path: '/hobby-list',
//     name: 'hobby-list',  
//     component: () => import('../views/HobbyPage.vue'),
//     meta: { requiresAuth: true, moduleCode: 'HOBBY-LIST' }
//   },
//   {
//     path: '/add-hobby',
//     name: 'add-hobby',  
//     component: () => import('../views/AddHobbyPage.vue'),
//     meta: { requiresAuth: true, moduleCode: 'ADD_HOBBY' }
//   },
//   {
//     path: '/staff-list',
//     name: 'staff-list',  
//     component: () => import('../views/AllStaffList.vue'),  
//     meta: { requiresAuth: true, moduleCode: 'ALLSTAFF_LIST' }
//   }
// ]

// const router = createRouter({
//   history: createWebHistory(),
//   routes
// })



// async function initRoutesFromDB() {
//   const { data } = await http.get('/route') // ambil semua modul aktif
//   data
//     .filter(m => m.isActive)                     // hanya yang aktif
//     .forEach(m => {
//       router.addRoute({
//         path: '/' + m.routeName,                 // path dari routeName
//         name: m.routeName,                       // name dari routeName
//         component: () => import(`../views/${m.routeName}.vue`), // harus sesuai nama file
//         meta: {
//           moduleCode: m.code,
//           requiresAuth: true                      // atau sesuaikan sesuai kebutuhan
//         }
//       })
//     })
// }



// router.beforeEach(async (to, from, next) => {   // navigation guard, dijalankan sebelum tiap route
//   const authStore = useAuthStore()
//   const isLoggedIn = authStore.isLoggedIn

//   if (to.meta.guest && isLoggedIn) {  //// jika route hanya untuk guest & user sudah login, ke home
//     return next({ name: 'home' })
//   }

//   if (to.meta.requiresAuth && !isLoggedIn) { // jika route butuh auth & user belum login,ke halaman login
//     return next({ name: 'login' })
//   }

//   if (to.meta.moduleCode && isLoggedIn) {   // jika route punya moduleCode & user sudah login
//     if (authStore.accessibleModules.length === 0 && authStore.token) {
//       await authStore.fetchUserData() // // fetch data user + modules jika belum ada
//     }

//     if (!authStore.hasModuleAccess(to.meta.moduleCode)) {
//       return next({ name: 'home' })   // jika user tidak punya akses module → redirect home
//     }
//   }

//   next()
// })

export default router
