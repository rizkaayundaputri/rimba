<script setup>
import { ref, computed } from 'vue'
import Dialog from 'primevue/dialog'
import Button from 'primevue/button'

const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  },
  type: {
    type: String,
    default: 'info', // success, error, warning, info
    validator: (value) => ['success', 'error', 'warning', 'info'].includes(value)
  },
  title: {
    type: String,
    default: 'Alert'
  },
  message: {
    type: String,
    required: true
  },
  showConfirmButton: {
    type: Boolean,
    default: true
  },
  confirmText: {
    type: String,
    default: 'OK'
  },
  autoClose: {
    type: Number,
    default: 0 // 0 means no auto close
  }
})

const emit = defineEmits(['update:visible', 'confirm'])

const isVisible = computed({
  get: () => props.visible,
  set: (value) => emit('update:visible', value)
})

const iconClass = computed(() => {
  switch (props.type) {
    case 'success':
      return 'pi pi-check-circle'
    case 'error':
      return 'pi pi-times-circle'
    case 'warning':
      return 'pi pi-exclamation-triangle'
    default:
      return 'pi pi-info-circle'
  }
})

const iconColor = computed(() => {
  switch (props.type) {
    case 'success':
      return '#22c55e'
    case 'error':
      return '#ef4444'
    case 'warning':
      return '#f59e0b'
    default:
      return '#3b82f6'
  }
})

// Auto close logic
if (props.autoClose > 0) {
  setTimeout(() => {
    isVisible.value = false
  }, props.autoClose)
}

function handleConfirm() {
  emit('confirm')
  isVisible.value = false
}
</script>

<template>
  <Dialog
    v-model:visible="isVisible"
    modal
    :header="title"
    :style="{ width: '400px' }"
    :closable="true"
  >
    <div class="alert-content">
      <i :class="iconClass" :style="{ color: iconColor, fontSize: '3rem' }"></i>
      <p class="alert-message">{{ message }}</p>
    </div>

    <template #footer v-if="showConfirmButton">
      <Button
        :label="confirmText"
        @click="handleConfirm"
        autofocus
      />
    </template>
  </Dialog>
</template>

<style scoped>
.alert-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  padding: 1rem 0;
}

.alert-message {
  text-align: center;
  margin: 0;
  font-size: 1rem;
  color: #374151;
}
</style>
