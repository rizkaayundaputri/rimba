<script setup>
import { ref, onMounted } from "vue";
import Swal from "sweetalert2";
import http from "@/libraries/http";

const users = ref([]);

const fetchAdmin = async () => {
  try {
    const response = await http.get('/admin', {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('access_token')}`
      }
    });
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

onMounted(() => {
  fetchAdmin();
});


</script>

<template>
  <div class="home-container">
    <div class="card">
      <h1 class="title">Data Admin</h1>
      <p class="text">Selamat datang di sistem manajemen data</p>
      
      <div class="stats">
        <div class="stat-item">
          <span class="stat-label">Total Members:</span>
          <span class="stat-value">{{ users.length }}</span>
        </div>
      </div>

      <div class="members-list">
        <h2>Daftar Member</h2>
        <div 
          v-for="user in users"
          :key="user.id"
          class="member-card"
        >
          <div class="member-info">
            <p class="member-email">{{ user.email }}</p>
            <p class="badge">{{ user.role }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>

</template>


<style scoped>



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

.header-with-button {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 25px;
}

.title {
  margin: 0 0 10px 0;
  font-size: 28px;
  font-weight: 700;
  color: #1a1a1a;
}

.text {
  margin: 0;
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
  margin: 0 0 15px 0;
  font-size: 20px;
  font-weight: 600;
  color: #1a1a1a;
}

.member-card {
  padding: 18px 15px;
  background: #f8f9fa;
  border-radius: 10px;
  margin-bottom: 16px;  
  border: 1px solid #e2e2e2;  ;
}

.member-card:hover {
  background: #e9ecef;
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
  color: #333;
  font-weight: 500;
}

.badge {
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
  background: #e9ecef;
  color: #495057;
  margin: 0;
}
</style>