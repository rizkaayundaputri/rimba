<script setup>
import { useRouter } from "vue-router"
import { ref, onMounted } from 'vue'

const el = ref("oke")
onMounted(() => { 
  setTimeout(() => {
    el.value = 'ya'
  }, 2000);
  
});

const router = useRouter()

function goToAbout() {
  router.push("/about")
}
</script>

<template>
  <!-- <div ref="el"> -->
    <div>{{el}}</div>
  <div class="card">
    <h1 class="title">Home Page</h1>
    <p class="text">
      Selamat datang! Ini contoh halaman Home dengan tampilan modern.
    </p>

    <button class="btn" @click="goToAbout">
      Pergi ke About (router.push)
    </button>
  </div>
<!-- </div> -->
</template>

<style scoped>
.card {
  background: white;
  padding: 25px;
  border-radius: 14px;
  max-width: 600px;
  margin: auto;
  margin-top: 40px;
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.08);
}

.title {
  margin: 0;
  margin-bottom: 10px;
  font-size: 28px;
  font-weight: 700;
  color: #1a1a1a;
}

.text {
  margin-bottom: 20px;
  font-size: 16px;
  color: #555;
}

.btn {
  background: #42b883;
  color: white;
  padding: 12px 18px;
  border: none;
  border-radius: 10px;
  font-size: 16px;
  cursor: pointer;
  font-weight: 600;
}

.btn:hover {
  background: #369667;
}
</style>
