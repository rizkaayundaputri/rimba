a<script setup>
import { ref, onMounted, watch } from "vue";
import { useRouter, useRoute } from "vue-router";
import Swal from "sweetalert2";
import http from "@/libraries/http";

const router = useRouter();
const route = useRoute();
const users = ref([]);

const fetchAllStaff = async () => {
  try {
    const response = await http.get('/allstaff', {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('access_token')}`
      }
    });
    console.log("All Staff Response:", response.data);
    users.value = response.data;
  } catch (error) {
    Swal.fire({
      title: 'Error!',
      text: error.response?.data?.message ?? "Terjadi kesalahan",
      icon: 'error',
      confirmButtonText: 'Close'
    })
  }
};

const goToHome = () => {
  router.push("/");    
}

onMounted(() => {
  fetchAllStaff();
});

watch(() => route.path, (newPath) => {
  if (newPath === '/staff-list') {
    fetchAllStaff();
  }
});
</script>

<template>
  <div class="home-container">
    <div class="card">
      <h1 class="title">All Staff List</h1>
      <p class="text">Daftar seluruh staff dalam sistem</p>
      
      <div class="stats">
        <div class="stat-item">
          <span class="stat-label">Total Staff:</span>
          <span class="stat-value">{{ users.length }}</span>
        </div>
      </div>

      <div class="members-list">
        <h2>Daftar Staff</h2>
        <div 
          v-for="user in users"
          :key="user.email"
          class="member-card"
        >
          <div class="member-info">
            <p class="member-email">{{ user.email }}</p>
            <p class="badge">{{ user.role }}</p>
          </div>
        </div>
      </div>
      <button 
        @click="goToHome"
        class="login-button"
      >
        Back to Home
      </button>
    </div>
  </div>
</template>

<style scoped>
.login-button {
  width: 100%;
  padding: 12px;
  font-size: 16px;
  font-weight: 600;
  margin-top: 10px;
  background-color: #42b883;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.login-button:hover {
  background-color: #35a372;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(66, 184, 131, 0.3);
}

.home-container {
  padding: 20px;
  max-width: 800px;
  margin: 0 auto;
}

.card {
  background: white;
  padding: 25px;
  border-radius: 14px;
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.08);
}

.title {
  margin: 0 0 10px 0;
  font-size: 28px;
  font-weight: 700;
  color: #1a1a1a;
}

.text {
  margin: 0 0 20px 0;
  font-size: 16px;
  color: #555;
}

.stats {
  padding: 15px;
  background: #f8f9fa;
  border-radius: 8px;
  margin-bottom: 30px;
}

.stat-item {
  display: flex;
  gap: 10px;
  align-items: center;
}

.stat-label {
  font-size: 16px;
  color: #666;
}

.stat-value {
  font-size: 24px;
  font-weight: 700;
  color: #42b883;
}

.members-list h2 {
  margin-top: 0;
  margin-bottom: 20px;
  font-size: 20px;
  font-weight: 600;
  color: #1a1a1a;
}

.member-card {
  background: #f8f9fa;
  padding: 15px 20px;
  border-radius: 10px;
  margin-bottom: 12px;
  transition: all 0.3s ease;
  border: 2px solid transparent;
}

.member-card:hover {
  background: #e9ecef;
  border-color: #42b883;
  transform: translateX(5px);
}

.member-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.member-email {
  margin: 0;
  font-size: 16px;
  font-weight: 500;
  color: #1a1a1a;
}

.badge {
  padding: 6px 14px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 20px;
  font-size: 13px;
  font-weight: 600;
  margin: 0;
}
</style>
