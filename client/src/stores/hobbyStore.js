import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import http from '@/libraries/http'
import Swal from 'sweetalert2'

export const useHobbyStore = defineStore('hobby', () => {
  
  const hobbies = ref([])

  const totalHobbies = computed(() => hobbies.value.length)

  const fetchHobbies = async () => {
  try {
    const response = await http.get('/hobby', {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('access_token')}`
      }
    });
    console.log("TOKEN:", localStorage.getItem("access_token"))
    console.log(response);
    
      hobbies.value = response.data;
      console.log("=== TES: Apakah store berfungsi? ===")

    } catch (error) {
        Swal.fire({
          title: 'Error!',
          text: error.response.data.message,
          icon: 'error',
          confirmButtonText: 'Close'
        })   
     }
    }
    return{
      hobbies,
      totalHobbies,
      fetchHobbies 
    }   
  })
