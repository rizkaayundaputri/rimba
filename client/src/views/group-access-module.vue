<script setup>
import { ref, computed, onMounted, nextTick } from 'vue'
import Swal from 'sweetalert2'
import http from '@/libraries/http'
import { useGroupAccessModuleStore } from '@/stores/groupAccessModuleStore'

// PrimeVue
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Button from 'primevue/button'
import Dialog from 'primevue/dialog'
import Dropdown from 'primevue/dropdown'
import Checkbox from 'primevue/checkbox'

// ================= STORE =================
const store = useGroupAccessModuleStore()

// ================= DROPDOWN OPTIONS =================
const groupAccessOptions = ref([])
const moduleOptions = ref([])

// ================= STATE =================
const formVisible = ref(false)
const formMode = ref('create')
const selectedItem = ref(null)
const isSubmitting = ref(false)

// ================= FORM DATA =================
const formData = ref({
  groupAccessId: null,
  moduleId: null,
  canCreate: false,
  canRead: true,
  canUpdate: false,
  canDelete: false
})

// ================= TABLE DATA =================
const groupAccessModules = computed(() => store.groupAccessModules)

// ================= FETCH DROPDOWN =================
async function fetchDropdownData() {
  try {
    const [groupRes, moduleRes] = await Promise.all([
      http.get('/group-access'),
      http.get('/module')
    ])

    groupAccessOptions.value = groupRes.data.map(g => ({
      label: g.name,
      value: g.id
    }))

    moduleOptions.value = moduleRes.data.map(m => ({
      label: m.name,
      value: m.id
    }))
  } catch (err) {
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'Failed load dropdown data',
      zIndex: 3000
    })
  }
}

// ================= LIFECYCLE =================
onMounted(async () => {
  await fetchDropdownData()
  await store.fetchGroupAccessModules()
})

// ================= OPEN CREATE =================
function openCreateDialog() {
  formMode.value = 'create'
  selectedItem.value = null
  formData.value = {
    groupAccessId: null,
    moduleId: null,
    canCreate: false,
    canRead: true,
    canUpdate: false,
    canDelete: false
  }
  formVisible.value = true
}

// ================= OPEN EDIT =================
function openEditDialog(row) {
  formMode.value = 'edit'
  selectedItem.value = row

  formData.value = {
    groupAccessId: row.groupAccessId,
    moduleId: row.moduleId,
    canCreate: row.canCreate,
    canRead: row.canRead,
    canUpdate: row.canUpdate,
    canDelete: row.canDelete
  }

  formVisible.value = true
}

// ================= SUBMIT =================
async function handleSubmit() {
  if (isSubmitting.value) return
      // Cegah double submit: jika proses submit sedang berjalan, langsung return
  if (!formData.value.groupAccessId || !formData.value.moduleId) {
       //pastikan user memilih groupAccess & module
    Swal.fire({
      icon: 'error',
      title: 'Validation Error',
      text: 'Group Access & Module wajib dipilih',
      zIndex: 3000
    })
    return
  }

  try {
    isSubmitting.value = true
    // Tandai sedang submit untuk mencegah double submit
    if (formMode.value === 'create') {
      await store.createGroupAccessModule(formData.value)
      //Jika mode create → panggil API create
    } else {
      await store.updateGroupAccessModule(
        selectedItem.value.id,
        formData.value
        // Jika mode edit → panggil API update
      )
    }

    formVisible.value = false
    await nextTick()
      //Tutup form dan tunggu DOM update

    Swal.fire({
      icon: 'success',
      title: 'Success',
      text: 'Data berhasil disimpan',
      timer: 2000,
      showConfirmButton: false,
      zIndex: 3000
    })
  } finally {
    isSubmitting.value = false
    // Reset status submit agar bisa submit lagi
  }
}

// ================= DELETE =================
async function handleDelete(row) {
  const confirm = await Swal.fire({
    title: 'Delete?',
    html: `Hapus akses <b>${row.groupAccessName}</b> - <b>${row.moduleName}</b>?`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#dc3545',
    zIndex: 3000
  })

  if (confirm.isConfirmed) {
    await store.deleteGroupAccessModule(row.id)

    Swal.fire({
      icon: 'success',
      title: 'Deleted',
      timer: 1500,
      showConfirmButton: false,
      zIndex: 3000
    })
  }
}
</script>

<template>
  <div class="card">
    <!-- HEADER -->
    <div class="header">
      <h2>Group Access Module</h2>
      <Button label="Add Access" icon="pi pi-plus" @click="openCreateDialog" />
    </div>

    <!-- TABLE -->
    <DataTable :value="groupAccessModules" stripedRows>
      <Column header="No">
        <template #body="{ index }">{{ index + 1 }}</template>
      </Column>

      <Column field="groupAccessName" header="Group" />
      <Column field="moduleName" header="Module" />

      <Column header="Permissions">
        <template #body="{ data }">
          <!-- buat array, filter nilai true, hitung panjangnya -->
          {{ [data.canCreate, data.canRead, data.canUpdate, data.canDelete].filter(Boolean).length }} 
        </template>
      </Column> 


      <Column header="Actions">
        <template #body="{ data }">
          <div class="action-buttons">
            <Button
              icon="pi pi-pencil"
              rounded
              severity="success"
              @click="openEditDialog(data)"
            />
            <Button
              icon="pi pi-trash"
              rounded
              severity="danger"
              @click="handleDelete(data)"
            />
          </div>
        </template>
      </Column>
    </DataTable>

    <!-- FORM DIALOG -->
    <Dialog
      v-model:visible="formVisible"
      modal
      appendTo="body"
      :header="formMode === 'create' ? 'Add Access' : 'Edit Access'"
      style="width: 30rem"
    >
      <div class="form-grid">
        <div class="field">
          <label>Group Access</label>
          <Dropdown
            v-model="formData.groupAccessId"
            :options="groupAccessOptions"
            optionLabel="label"
            optionValue="value"
            placeholder="Select Group"
          />
        </div>

        <div class="field">
          <label>Module</label>
          <Dropdown
            v-model="formData.moduleId"
            :options="moduleOptions"
            optionLabel="label"
            optionValue="value"
            placeholder="Select Module"
          />
        </div>

        <div class="permissions">
          <Checkbox v-model="formData.canCreate" binary /> Create
          <Checkbox v-model="formData.canRead" binary /> Read
          <Checkbox v-model="formData.canUpdate" binary /> Update
          <Checkbox v-model="formData.canDelete" binary /> Delete
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

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.action-buttons {
  display: flex;
  gap: 10px;
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

.permissions {
  display: flex;
  gap: 12px;
  align-items: center;
}

.perm {
  display: inline-block;
  background: #e5e7eb;
  padding: 2px 6px;
  border-radius: 6px;
  font-size: 12px;
  margin-right: 4px;
}
</style>
