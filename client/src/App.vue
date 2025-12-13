<script setup>
import { useAuthStore } from '@/stores/authStore'
import { useRouter } from 'vue-router'
import { onMounted, ref } from 'vue'
import { initRoutesFromDB } from './router'

const authStore = useAuthStore()
const router = useRouter()
const openSubmenu = ref(null)

onMounted(async() => {
  authStore.initAuth()
  await initRoutesFromDB()  // pastikan semua routes dynamic terdaftar

})

const handleLogout = () => {
  authStore.logout()
  router.push('/login')
}

const toggleSubmenu = (moduleId) => {
  openSubmenu.value = openSubmenu.value === moduleId ? null : moduleId
}

// Cek jika route ada di router
const routeExists = (routeName) => {
  if (!routeName) return false
  try {
    router.resolve({ name: routeName })
    return true
  } catch (e) {
    return false
  }
}
</script>

<template>
  <div id="app" :class="{ 'with-sidebar': authStore.isLoggedIn }">
    <!-- Sidebar - hanya muncul jika sudah login -->
    <aside v-if="authStore.isLoggedIn" class="sidebar">
      <div class="sidebar-header">
        <h2>Dashboard</h2>
        <p class="user-info">{{ authStore.user?.email }}</p>
      </div>

      <nav class="sidebar-nav">
        <ul class="sidebar-menu">
          <!-- Loop modules dari store -->
          <li v-for="module in authStore.sidebarMenus" :key="module.id" class="menu-item">
            <!-- Menu tanpa children -->
            <router-link 
              v-if="routeExists(module.routeName) && (!module.children || module.children.length === 0)" 
              :to="{ name: module.routeName }"
              class="menu-link"
            >
              <i v-if="module.icon" :class="module.icon"></i>
              <span>{{ module.name }}</span>
            </router-link>
            
            <!-- Menu dengan children (collapsible) -->
            <div v-if="module.children && module.children.length > 0" class="menu-group">
              <div class="menu-link parent" @click="toggleSubmenu(module.id)">
                <div class="menu-label">
                  <i v-if="module.icon" :class="module.icon"></i>
                  <span>{{ module.name }}</span>
                </div>
                <i class="chevron" :class="{ 'open': openSubmenu === module.id }">▼</i>
              </div>
              
              <ul class="submenu" v-show="openSubmenu === module.id">
                <li v-for="child in module.children" :key="child.id">
                  <router-link 
                    v-if="routeExists(child.routeName)"
                    :to="{ name: child.routeName }"
                    class="submenu-link"
                  >
                    {{ child.name }}
                  </router-link>
                  <!-- Show as text if route doesn't exist -->
                  <span v-else class="submenu-link disabled">
                    {{ child.name }}
                  </span>
                </li>
              </ul>
            </div>
          </li>
        </ul>
      </nav>
      <div class="sidebar-footer">
        <button @click="handleLogout" class="btn-logout">
          <i class="fa fa-sign-out"></i>
          <span>Logout</span>
        </button>
      </div>
    </aside>

    <main class="main-content">
      <router-view />
    </main>
  </div>
</template>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  background-color: #f5f7fa;
}

#app {
  display: flex;
  min-height: 100vh;
}

#app.with-sidebar {
  display: flex;
}

.sidebar {
  width: 260px;
  background: linear-gradient(180deg, #2c3e50 0%, #34495e 100%);
  color: white;
  display: flex;
  flex-direction: column;
  position: fixed;
  left: 0;
  top: 0;
  height: 100vh;
  box-shadow: 2px 0 10px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  overflow-y: auto;
}

.sidebar::-webkit-scrollbar {
  width: 6px;
}

.sidebar::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.1);
}

.sidebar::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.3);
  border-radius: 3px;
}

.sidebar-header {
  padding: 2rem 1.5rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.sidebar-header h2 {
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
  font-weight: 600;
}

.user-info {
  font-size: 0.85rem;
  color: rgba(255, 255, 255, 0.7);
  margin-top: 0.5rem;
}

.sidebar-nav {
  flex: 1;
  padding: 1rem 0;
  overflow-y: auto;
}

.sidebar-menu {
  list-style: none;
}

.menu-item {
  margin-bottom: 0.25rem;
}

.menu-link {
  display: flex;
  align-items: center;
  padding: 0.875rem 1.5rem;
  color: rgba(255, 255, 255, 0.9);
  text-decoration: none;
  transition: all 0.3s ease;
  cursor: pointer;
}

.menu-link:hover {
  background-color: rgba(255, 255, 255, 0.1);
  color: white;
}

.menu-link.router-link-active {
  background-color: rgba(52, 152, 219, 0.3);
  border-left: 4px solid #3498db;
  color: white;
  font-weight: 600;
}

.menu-link i {
  width: 24px;
  font-size: 1.1rem;
  margin-right: 0.75rem;
}

.menu-link span {
  flex: 1;
}
.menu-group .menu-link.parent {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.menu-label {
  display: flex;
  align-items: center;
  flex: 1;
}

.chevron {
  font-size: 0.7rem;
  transition: transform 0.3s ease;
  color: rgba(255, 255, 255, 0.6);
}

.chevron.open {
  transform: rotate(180deg);
}

.submenu {
  list-style: none;
  background-color: rgba(0, 0, 0, 0.2);
  margin: 0;
  padding: 0;
  overflow: hidden;
  animation: slideDown 0.3s ease;
}

.submenu li {
  margin: 0;
}

.submenu-link {
  display: block;
  padding: 0.75rem 1.5rem 0.75rem 3.5rem;
  color: rgba(255, 255, 255, 0.8);
  text-decoration: none;
  font-size: 0.9rem;
  transition: all 0.3s ease;
}

.submenu-link.disabled {
  cursor: not-allowed;
  opacity: 0.5;
  color: rgba(255, 255, 255, 0.5);
}

.submenu-link:not(.disabled):hover {
  background-color: rgba(255, 255, 255, 0.1);
  color: white;
}

.submenu-link.router-link-active {
  background-color: rgba(52, 152, 219, 0.2);
  color: #3498db;
  font-weight: 600;
}
.sidebar-footer {
  padding: 1.5rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.btn-logout {
  width: 100%;
  background-color: #e74c3c;
  color: white;
  border: none;
  padding: 0.875rem 1rem;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 600;
  font-size: 0.95rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}

.btn-logout:hover {
  background-color: #c0392b;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

.btn-logout:active {
  transform: translateY(0);
}

.main-content {
  flex: 1;
  margin-left: 260px;
  padding: 2rem;
  background-color: #f5f7fa;
  min-height: 100vh;
}

#app:not(.with-sidebar) .main-content {
  margin-left: 0;
}

@keyframes slideDown {
  from {
    max-height: 0;
    opacity: 0;
  }
  to {
    max-height: 500px;
    opacity: 1;
  }
}

@media (max-width: 768px) {
  .sidebar {
    width: 220px;
  }
  
  .main-content {
    margin-left: 220px;
  }
}
</style>
