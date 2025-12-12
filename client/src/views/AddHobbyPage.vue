<script setup>
import { ref } from "vue";
import Swal from "sweetalert2";
import http from "@/libraries/http";

const name = ref("");
const description = ref("");

const handleSubmit = async () => {
  
  try {
    const res = await http.post("/hobby", {
      name: name.value,
      description: description.value,
    }, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('access_token')}`
      }
    });

    Swal.fire({
      icon: "success",
      title: "Berhasil Menambahkan Hobi",
      timer: 1000,
      showConfirmButton: false,
    });

    name.value = "";
    description.value = "";

  } catch (error) {
    Swal.fire({
      title: 'Error!',
      text: error.response.data.message,
      icon: 'error',
      confirmButtonText: 'Close'
    });
  } 
};

</script>

<template>
  <div class="add-hobby-section">
     

      <form @submit.prevent="handleSubmit" class="hobby-form">
         <h2>Tambah Hobi Baru</h2>
        <div class="form-group">
          <label for="name">Nama</label>
          <input 
            v-model="name" 
            type="text" 
            id="name" 
            placeholder="Masukkan nama"
            required
          />
        </div>

        <div class="form-group">
          <label for="description">Hobbi</label>
          <textarea 
            v-model="description" 
            id="description" 
            placeholder="Masukkan hobi"
            rows="3"
            required
          ></textarea>
        </div>

        <button type="submit" class="submit-btn">
          Tambah Hobi
        </button>
      </form>
    </div>
</template>

<style scoped>
.add-hobby-section {
  min-height: 100vh;         
  display: flex;
  justify-content: center;   
  align-items: center;       
  padding: 0 20px;
}
/* Title */
.add-hobby-section h2 {
  font-size: 22px;
  font-weight: 700;
  margin-bottom: 18px;
  color: #1c1c1c;
  letter-spacing: 0.3px;
}

/* Card Form */
.hobby-form {
  width: 100%;
  max-width: 600px;           
  background: #ffffff;
  padding: 32px;
  border-radius: 18px;
  box-shadow: 0 6px 20px rgba(0,0,0,0.08);
  border: 1px solid #eee;
  transition: 0.25s ease;
}

.hobby-form:hover {
  box-shadow: 0 6px 18px rgba(0,0,0,0.08);
}

/* Group */
.form-group {
  display: flex;
  flex-direction: column;
  margin-bottom: 18px;
}

/* Label */
.form-group label {
  margin-bottom: 6px;
  font-weight: 600;
  color: #333;
  font-size: 14px;
}

/* Input & Textarea */
.form-group input,
.form-group textarea {
  padding: 12px 14px;
  border-radius: 10px;
  border: 1px solid #d0d0d0;
  font-size: 14px;
  background: #fafafa;
  transition: 0.25s ease;
}

.form-group input:focus,
.form-group textarea:focus {
  border-color: #42b883;
  background: #ffffff;
  outline: none;
  box-shadow: 0 0 6px rgba(66,184,131,0.35);
}

/* Submit Button */
.submit-btn {
  width: 100%;
  padding: 14px;
  background: #42b883;
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: 0.25s;
}

.submit-btn:hover {
  background: #3aa46f;
  transform: translateY(-1px);
}

.submit-btn:active {
  transform: scale(0.98);
}
</style>
