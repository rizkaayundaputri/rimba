<script setup>
import { ref, computed, onMounted , nextTick} from 'vue'
import { useModuleStore } from '@/stores/moduleStore'
import Swal from 'sweetalert2'

// PrimeVue
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Button from 'primevue/button'
import Dialog from 'primevue/dialog'
import InputText from 'primevue/inputtext'
import Dropdown from 'primevue/dropdown'
import Checkbox from 'primevue/checkbox'


const isSubmitting = ref(false)

// ======================
// STORE
// ======================
const moduleStore = useModuleStore()
const modules = computed(() => moduleStore.modules)

// ======================
// STATE
// ======================
const detailVisible = ref(false)
const formVisible = ref(false)
const formMode = ref('create')
const selectedModule = ref(null)

// ======================
// FORM DATA
// ======================
const formData = ref({
  code: '',
  name: '',
  routeName: '',
  icon: '',
  order: 0,
  parentId: null,
  isActive: true
})

// ======================
// PARENT OPTIONS
// ======================
const parentOptions = computed(() => [
  { label: 'None (Root Module)', value: null },
  ...modules.value
    .filter(
      m =>
        !m.parentId &&
        (formMode.value === 'create' || m.id !== selectedModule.value?.id)
    )
    .map(m => ({ label: m.name, value: m.id }))
])

// ======================
// LIFECYCLE
// ======================
onMounted(() => {
  moduleStore.fetchModules()
})

// ======================
// DIALOG HANDLER
// ======================
function openDetail(module) {
  selectedModule.value = module
  detailVisible.value = true
}

function openCreateDialog() {
  formMode.value = 'create'
  selectedModule.value = null
  formData.value = {
    code: '',
    name: '',
    routeName: '',
    icon: '',
    order: 0,
    parentId: null,
    isActive: true
  }
  formVisible.value = true
}

function openEditDialog(module) {
  formMode.value = 'edit'
  selectedModule.value = module
  formData.value = {
    code: module.code,
    name: module.name,
    routeName: module.routeName || '',
    icon: module.icon || '',
    order: module.order,
    parentId: module.parentId,
    isActive: module.isActive
  }
  formVisible.value = true
}

// ======================
// SUBMIT FORM 
// ======================
async function handleSubmit() {
  if (isSubmitting.value) return

  if (!formData.value.code || !formData.value.name) {
    Swal.fire({
      icon: 'error',
      title: 'Validation Error',
      text: 'Code and Name are required!',
      zIndex: 3000
    })
    return
  }

  try {
    isSubmitting.value = true

    if (formMode.value === 'create') {
       await moduleStore.createModule(formData.value)
    } else {
      await moduleStore.updateModule(
        selectedModule.value.id,
        formData.value
      )
    }

      formVisible.value = false
      await nextTick()

      Swal.fire({
        icon: 'success',
        title: 'Success!',
        text: 'Data berhasil disimpan',
        timer: 2000,
        showConfirmButton: false,
        zIndex: 3000
      })
    }finally {
    isSubmitting.value = false
  }
}

// ======================
// DELETE
// ======================
async function handleDelete(module) {
  const confirm = await Swal.fire({
    title: 'Are you sure?',
    html: `Delete <b>${module.name}</b>?`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#dc3545',
    zIndex: 3000
  })

  if (confirm.isConfirmed) {
    const result = await moduleStore.deleteModule(module.id)
    if (result.success) {
      Swal.fire({
        icon: 'success',
        title: 'Deleted!',
        text: result.message,
        timer: 2000,
        showConfirmButton: false
      })
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: result.message
      })
    }
  }
}
</script>

<template>
  <div class="card">
    <!-- ADD -->
    <Button
      label="Add Module"
      icon="pi pi-plus"
      class="mb-3"
      @click="openCreateDialog"
    />

    <!-- TABLE -->
    <DataTable :value="modules" stripedRows>
      <Column header="No">
        <template #body="{ index }">{{ index + 1 }}</template>
      </Column>

      <Column field="name" header="Module Name" />
      <Column field="code" header="Code" />

      <Column header="Status">
        <template #body="{ data }">
          <span :class="data.isActive ? 'badge-active' : 'badge-inactive'">
            {{ data.isActive ? 'Active' : 'Inactive' }}
          </span>
        </template>
      </Column>

      <Column header="Actions">
        <template #body="{ data }">
          <div class="action-buttons">
            <Button icon="pi pi-eye" rounded severity="success" @click="openDetail(data)" />
            <Button icon="pi pi-pencil" rounded severity="success" @click="openEditDialog(data)" />
            <Button icon="pi pi-trash" rounded severity="danger" @click="handleDelete(data)" />
          </div>
        </template>
      </Column>
    </DataTable>

    <!-- DETAIL DIALOG -->
    <Dialog
      v-model:visible="detailVisible"
      modal
      appendTo="body"
      :baseZIndex="1000"
      header="Module Detail"
      style="width: 25rem"
    >
      <div v-if="selectedModule">
        <p><b>Name:</b> {{ selectedModule.name }}</p>
        <p><b>Code:</b> {{ selectedModule.code }}</p>
        <p><b>Route:</b> {{ selectedModule.routeName || '-' }}</p>
        <p><b>Order:</b> {{ selectedModule.order }}</p>
        <p><b>Parent:</b> {{ selectedModule.parentId ?? '-' }}</p>
        <p><b>Status:</b> {{ selectedModule.isActive ? 'Active' : 'Inactive' }}</p>
      </div>
      <template #footer>
        <Button label="Close" @click="detailVisible = false" />
      </template>
    </Dialog>

    <!-- FORM DIALOG -->
    <Dialog
      v-model:visible="formVisible"
      modal
      appendTo="body"
      :baseZIndex="1000"
      :header="formMode === 'create' ? 'Add Module' : 'Edit Module'"
      style="width: 30rem"
    >
      <div class="form-grid">
        <div class="field">
          <label>Code</label>
          <InputText v-model="formData.code" />
        </div>

        <div class="field">
          <label>Name</label>
          <InputText v-model="formData.name" />
        </div>

        <div class="field">
          <label>Route Name</label>
          <InputText v-model="formData.routeName" />
        </div>

        <div class="field">
          <label>Icon</label>
          <InputText v-model="formData.icon" />
        </div>

        <div class="field">
          <label>Order</label>
          <InputText type="number" v-model="formData.order" />
        </div>

        <div class="field">
          <label>Parent</label>
          <Dropdown
            v-model="formData.parentId"
            :options="parentOptions"
            optionLabel="label"
            optionValue="value"
            placeholder="Select Parent"
          />
        </div>

        <div class="field checkbox">
          <Checkbox v-model="formData.isActive" binary />
          <label>Active</label>
        </div>
      </div>

      <template #footer>
        <Button label="Cancel" severity="secondary" @click="formVisible = false" />
        <Button
        label="Save"
        icon="pi pi-check"
        :loading="isSubmitting"
        @click="handleSubmit"
      />
      </template>
    </Dialog>
  </div>
</template>

<style scoped>
.card {
  background: white;
  padding: 24px;
  border-radius: 12px;
}

.action-buttons {
  display: flex;
  gap: 10px;
}

.badge-active {
  background: #d1fae5;
  color: #065f46;
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 12px;
}

.badge-inactive {
  background: #fee2e2;
  color: #991b1b;
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 12px;
}

.form-grid {
  display: grid;
  gap: 14px;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.checkbox {
  flex-direction: row;
  align-items: center;
  gap: 10px;
}

:deep(.swal-high-zindex) {
  z-index: 10000 !important;
}
</style>
