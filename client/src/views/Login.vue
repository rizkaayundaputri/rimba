<template>
  <div class="login-container">
    <div class="login-wrapper">
      <Card class="login-card">
        
        <template #title>
          <h4 class="text-center">Login</h4>
        </template>

        <template #content>
          <form @submit.prevent="handleLogin" class="login-form">

    
            <div class="field">
              <label for="email">Email</label>
              <InputText 
                id="email"
                v-model="email" 
                type="email" 
                placeholder="Masukkan email"
                class="w-full"
                required
              />
            </div>

      
            <div class="field">
              <label for="password">Password</label>
              <Password 
                id="password"
                v-model="password" 
                placeholder="Masukkan password"
                :feedback="false"
                class="w-full"
                inputClass="w-full"
                required
              />
            </div>

            <Button 
              type="submit" 
              label="Login" 
              class="w-full"
              severity="primary"
            />

          </form>
        </template>

      </Card>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/Auth.store";
import Swal from "sweetalert2";

const router = useRouter();
const authStore = useAuthStore();
const email = ref("");
const password = ref("");

const handleLogin = async () => {
  try {
    const result = await authStore.login(email.value, password.value);

    if (result.success) {
      Swal.fire({
        icon: "success",
        title: "Login Berhasil",
        text: "Anda akan diarahkan ke halaman utama",
        timer: 1000,
        showConfirmButton: false,
      });

      // Redirect ke route pertama yang accessible atau home
      
      if (authStore.sidebarMenus.length > 0) {
        const firstMenu = authStore.sidebarMenus[0];
        if (firstMenu.routeName) {
          router.push({ name: firstMenu.routeName });
        } else if (firstMenu.children && firstMenu.children.length > 0) {
          router.push({ name: firstMenu.children[0].routeName });
        } else {
          router.push('/');
        }
      } else {
        router.push('/');
      }
    } else {
      Swal.fire({
        title: 'Error!',
        text: result.message || 'Login failed',
        icon: 'error',
        confirmButtonText: 'Close'
      });
    }
  } catch (error) {
    Swal.fire({
      title: 'Error!',
      text: error.message || 'An error occurred',
      icon: 'error',
      confirmButtonText: 'Close'
    });
  } 
};

</script>

<style scoped>
.login-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.login-wrapper {
  width: 100%;
  max-width: 450px;
}

.login-card {
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
}

.text-center {
  text-align: center;
  margin: 0;
  color: #333;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.field label {
  font-weight: 600;
  color: #333;
}

.w-full {
  width: 100%;
}

:deep(.p-password) {
  width: 100%;
}

:deep(.p-password input) {
  width: 100%;
}
</style>
