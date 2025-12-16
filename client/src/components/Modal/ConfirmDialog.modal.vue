<!-- Komponen ini adalah Confirm Dialog reusable:

Dikontrol dari parent pakai v-model:visible

Bisa kirim confirm / cancel event

Aman dipakai ganti SweetAlert confirm -->

<!-- Alurnya: parent klik delete -> visible: true -> dialog tampil-> User klik Confirm / Cancel -> emit event ke parent -> Dialog ditutup --> 

<script setup>
import { computed } from 'vue'
import Dialog from 'primevue/dialog'
import Button from 'primevue/button'

//Props = data dari parent ke dialog
const props = defineProps({
  visible: {  //Status buka/tutup dialog
    type: Boolean,
    default: false
  },
  title: {
    type: String,
    default: 'Confirm'
  },
  message: {
    type: String,
    required: true
  },
  confirmText: {
    type: String,
    default: 'Confirm'
  },
  cancelText: {
    type: String,
    default: 'Cancel'
  },
  confirmButtonColor: {
    type: String,
    default: 'danger'
  }
})

const emit = defineEmits(['update:visible', 'confirm', 'cancel'])  //EMIT EVENT (CHILD → PARENT), update:visible → wajib agar v-model bisa jalan

const isVisible = computed({  //Computed biar bisa two-way binding v-model  <ConfirmDialog v-model:visible="showConfirm" />
  get: () => props.visible,
  set: (value) => emit('update:visible', value)
})

function handleConfirm() { 
  emit('confirm')   // kasih tahu parent: USER CONFIRM
  isVisible.value = false  // tutup dialog Parent bisa eksekusi delete
}

function handleCancel() {
  emit('cancel') 
  isVisible.value = false
}
</script>

<template>
  <!-- 
  v-model:visible → terhubung ke computed tadi 
  modal → lock background
  Header -> dinamis
  :closable="true" → bisa ditutup klik X
  autofocus → UX bagus
  -->
  <Dialog
    v-model:visible="isVisible"
    modal
    :header="title"
    :style="{ width: '400px' }"
    :closable="true"
  >
    <div class="confirm-content">
      <i class="pi pi-exclamation-triangle" style="color: #f59e0b; font-size: 3rem;"></i>
      <div class="confirm-message" v-html="message"></div>
    </div>

    <template #footer>
      <Button
        :label="cancelText"
        severity="secondary"
        @click="handleCancel"
      />
      <Button
        :label="confirmText"
        :severity="confirmButtonColor"
        @click="handleConfirm"
        autofocus
      />
    </template>
  </Dialog>
</template>

<style scoped>
.confirm-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  padding: 1rem 0;
}

.confirm-message {
  text-align: center;
  font-size: 1rem;
  color: #374151;
}
</style>
