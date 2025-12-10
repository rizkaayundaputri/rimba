<template>
  <div class="login">
    <form @submit.prevent="handleLogin">
      <input v-model="email" type="email" placeholder="Email" />
      <input v-model="password" type="password" placeholder="Password" />
      <button>Login</button>
    </form>
  </div>
</template>

<script setup>
// import { ref } from "vue";

// import Swal from "sweetalert2";

// const email = ref("");
// const password = ref("");

// const handleLogin = async () => {
//   try {
//     const res = await htt.post("http://localhost:3000/login", {
//       email: email.value,
//       password: password.value,
//     });

//     localStorage.setItem("access_token", res.data.acces_token);

//     Swal.fire({
//       icon: "success",
//       title: "Login berhasil!",
//     });

//     window.location.href = "/dashboard";
//   } catch (error) {
//     Swal.fire({
//       icon: "error",
//       title: "Login gagal",
//       text: error.response?.data?.message || "Something went wrong",
//     });
//   }
// };
</script>
