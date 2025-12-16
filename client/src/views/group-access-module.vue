<script setup>
import { ref, computed, onMounted, nextTick } from 'vue'
import http from '@/libraries/http'

// PrimeVue
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Button from 'primevue/button'
import Dialog from 'primevue/dialog'
import Dropdown from 'primevue/dropdown'
import AutoComplete from 'primevue/autocomplete'
import MultiSelect from 'primevue/multiselect'
import Checkbox from 'primevue/checkbox'
import Badge from 'primevue/badge'
import OverlayPanel from 'primevue/overlaypanel'
import InputText from 'primevue/inputtext'

// Custom Components
import AlertDialog from '@/components/Modal/AlertDialog.modal.vue'
import ConfirmDialog from '@/components/Modal/ConfirmDialog.modal.vue'
import { useGroupAccessModuleStore } from '@/stores/GroupAccessModule.store'


// ================= STORE =================
const store = useGroupAccessModuleStore() 

// ================= DROPDOWN OPTIONS =================
const groupAccessOptions = ref([])   // daftar nama group (string[])
const moduleOptions = ref([])         // daftar module (label-value)
const filteredGroupAccess = ref([])    // hasil filter autocomplete

// ================= STATE =================
const formVisible = ref(false)    // buka/tutup dialog
const formMode = ref('create')    //  mode'create' | 'edit'
const selectedItem = ref(null)   // data yg sedang di edit
const isSubmitting = ref(false)  // cegah double submit
const groupAccessInput = ref('')  // input autocomplete group access

// Dialog states
const alertDialog = ref({  //alert dialog state
  visible: false,
  type: 'info',
  title: 'Alert',
  message: ''
})

const confirmDialog = ref({
  visible: false,
  title: 'Confirm',
  message: '',
  onConfirm: null
})

function showAlert(type, title, message, autoClose = 0) {
  alertDialog.value = {
    visible: true,
    type,
    title,
    message,
    autoClose
  }
}

function showConfirm(title, message, onConfirm) { // Simpan onConfirm → dipanggil saat user klik Confirm
  confirmDialog.value = {
    visible: true,
    title,
    message,
    onConfirm
  }
}

// ================= FORM DATA =================
const formData = ref({
  groupAccessId: null,
  moduleIds: [],
  canCreate: false,
  canRead: true,
  canUpdate: false,
  canDelete: false
})

// ================= TABLE DATA =================
const groupAccessModules = computed(() => store.groupAccessModules)

// Group modules by groupAccessId for display
//Kode ini mengubah data akses yang “flat” menjadi data yang terkelompok per Group Access agar mudah ditampilkan, diedit, dan dihapus.
const groupedAccessModules = computed(() => {
  const grouped = {}
  
  groupAccessModules.value.forEach(item => {
    const key = item.groupAccessId //ambilkeynya berdasarkan groupAccessId
    if (!grouped[key]) {  //jika gorupnya belum ada, buat baru
      grouped[key] = {
        groupAccessId: item.groupAccessId,
        groupAccessName: item.groupAccessName,
        modules: [],
        permissions: {
          canCreate: item.canCreate,
          canRead: item.canRead,
          canUpdate: item.canUpdate,
          canDelete: item.canDelete
        },
        ids: [] //berisi ID dari tabel group_access_modules yang ada didalam modules (untuk edit/delete)
      }
    }
    grouped[key].modules.push({ //Tambahkan module ke group
      id: item.moduleId,
      name: item.moduleName,
      accessId: item.id // ID row akses (penting untuk delete/update)
    })
    grouped[key].ids.push(item.id) // Simpan ID akses untuk delete/edit
  })
  
  return Object.values(grouped) // Ubah object menjadi array agar bisa dipakai di DataTable (v-for)
})

const moduleDetailPanel = ref()
const selectedModuleDetail = ref([])

function showModuleDetail(event, modules) { //event: mouse event, modules: array of module objects
  selectedModuleDetail.value = modules //Simpan daftar module ke state reactive
  moduleDetailPanel.value.toggle(event) //buka brosur tepat di tempat user klik
}

// ================= AUTOCOMPLETE =================
function searchGroupAccess(event) {
  // event → object dari PrimeVue AutoComplete
  // event.query → teks yang sedang diketik user di input
  const query = event.query.toLowerCase()
  // Ubah input user ke huruf kecil → biar pencarian TIDAK case-sensitive 
  if (!query) {
    filteredGroupAccess.value = groupAccessOptions.value // Tampilkan SEMUA group access  Tampilkan SEMUA group access
  } else { // Jika user SUDAH mengetik sesuatu
    filteredGroupAccess.value = groupAccessOptions.value.filter(g => 
      g.toLowerCase().includes(query)   // Ambil hanya group access yang: diubah ke lowercase, MENGANDUNG teks query
    )
  }
}
//------------------------create group-------------------
async function quickAddGroup() {
  const groupName = groupAccessInput.value?.trim()  // // Ambil teks dari input AutoComplete, hapus spasi di awal/akhir
  
  if (!groupName) {
    showAlert('error', 'Validation Error', 'Nama group tidak boleh kosong')
    return
  }

  try {
    // Create group immediately
    const createRes = await http.post('/group-access', {
      name: groupName,
      description: ''
    })
    
    // Refresh dropdown options
    await fetchDropdownData()
    
    // Set the newly created group as selected
    formData.value.groupAccessId = createRes.data.id //   // Simpan ID group baru ke formData  → supaya saat submit, group ini yang dipakai
    
    // Close the autocomplete dropdown
    filteredGroupAccess.value = []  //// Kosongkan suggestion agar dropdown tertutup
    
    showAlert('success', 'Success', `Group "${groupName}" berhasil dibuat`, 1500)

  } catch (error) {
    showAlert('error', 'Error', error.response?.data?.message || 'Gagal membuat group')
  }
}

// ================= FETCH DROPDOWN =================
async function fetchDropdownData() {
  try {
    const [groupRes, moduleRes] = await Promise.all([   //Promise.all → request dijalankan bersamaan lebih cepat
      http.get('/group-access'),
      http.get('/module')
    ])

    groupAccessOptions.value = groupRes.data.map(g => g.name)

    moduleOptions.value = moduleRes.data.map(m => ({
      label: m.name,
      value: m.id
    }))
  } catch (err) {
    showAlert('error', 'Error', 'Failed load dropdown data')
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
  selectedItem.value = null //tidak ada data lama yang dibutuhkan
  groupAccessInput.value = '' 
  formData.value = {
    groupAccessId: null,
    moduleIds: [],
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
  selectedItem.value = row // data yg sedang di edit butuh liat data lama 
  groupAccessInput.value = row.groupAccessName //fetch nama group access

  formData.value = {
    groupAccessId: row.groupAccessId,
    moduleIds: row.modules.map(m => m.id),//hasil: [2, 3, 5], → format WAJIB untuk PrimeVue MultiSelect,format WAJIB untuk PrimeVue MultiSelect
    canCreate: row.permissions.canCreate, //
    canRead: row.permissions.canRead,
    canUpdate: row.permissions.canUpdate,
    canDelete: row.permissions.canDelete
  }

  formVisible.value = true // → semua data sudah siap sebelum dialog muncul
}

// ================= SUBMIT =================
async function handleSubmit() {
  if (isSubmitting.value) return 
  
  // Validate
  const groupName = typeof groupAccessInput.value === 'string' 
    ? groupAccessInput.value.trim() 
    : groupAccessInput.value
    
  if (!groupName || !formData.value.moduleIds || formData.value.moduleIds.length === 0) {
    showAlert('error', 'Validation Error', 'Group Access & Module wajib dipilih')
    return
  }

  try {
    isSubmitting.value = true
    
    // ✅ Get or create group access via store
    const groupResult = await store.getOrCreateGroupAccess(groupName)
    
    if (!groupResult.success) {
      throw new Error(groupResult.error)
    }
    
    const groupAccessId = groupResult.id
    
    // Refresh dropdown if new group was created
    if (groupResult.created) {
      await fetchDropdownData()
    }
    
    if (formMode.value === 'create') {
      // Create multiple entries, one for each selected module
      const promises = formData.value.moduleIds.map(moduleId => 
        store.createGroupAccessModule({
          groupAccessId,
          moduleId,
          canCreate: formData.value.canCreate,
          canRead: formData.value.canRead,
          canUpdate: formData.value.canUpdate,
          canDelete: formData.value.canDelete
        })
      )
      await Promise.all(promises) //Menjalankan banyak async task secara BERSAMAAN, lalu nunggu sampai SEMUANYA selesai
    } else {
      // Edit mode: delete old entries and create new ones
      // 1. Delete all existing entries for this group
      const deletePromises = selectedItem.value.ids.map(id => 
        store.deleteGroupAccessModule(id)
      )
      await Promise.all(deletePromises)
      
      // 2. Create new entries with updated data
      const createPromises = formData.value.moduleIds.map(moduleId => 
        store.createGroupAccessModule({
          groupAccessId,
          moduleId,
          canCreate: formData.value.canCreate,
          canRead: formData.value.canRead,
          canUpdate: formData.value.canUpdate,
          canDelete: formData.value.canDelete
        })
      )
      await Promise.all(createPromises)
    }

    formVisible.value = false
    await nextTick()

    showAlert('success', 'Success', 'Data berhasil disimpan', 2000)
  } catch (error) {
    showAlert('error', 'Error', error.message || 'Gagal menyimpan data')
  } finally {
    isSubmitting.value = false
  }
}

// ================= DELETE =================
function handleDelete(row) {
  const modulesText = row.modules.length === 1 
    ? row.modules[0].name 
    : `${row.modules.length} modules`
    
  showConfirm(
    'Delete?',
    `Hapus akses <b>${row.groupAccessName}</b> (${modulesText})?`,
    async () => {
      try {
        // Delete all module entries for this group access
        const promises = row.ids.map(id => store.deleteGroupAccessModule(id))
        await Promise.all(promises)

        showAlert('success', 'Deleted', 'Data berhasil dihapus', 1500)
      } catch (error) {
        showAlert('error', 'Error', 'Gagal menghapus data')
      }
    }
  )
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
    <DataTable :value="groupedAccessModules" stripedRows>
      <Column header="No">
        <template #body="{ index }">{{ index + 1 }}</template>
      </Column>

      <Column field="groupAccessName" header="Group" />
      
      <Column header="Module">
        <template #body="{ data }">
          <div v-if="data.modules.length === 1">
            {{ data.modules[0].name }}
          </div>
          <div v-else>
            <Badge 
              :value="data.modules.length + ' modules'" 
              severity="info" 
              class="cursor-pointer"
              @click="showModuleDetail($event, data.modules)"
            />
          </div>
        </template>
      </Column>

      <Column header="Permissions">
        <template #body="{ data }">
          {{ [data.permissions.canCreate, data.permissions.canRead, data.permissions.canUpdate, data.permissions.canDelete].filter(Boolean).length }} 
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

    <!-- Module Detail Overlay -->
    <OverlayPanel ref="moduleDetailPanel">
      <div class="module-detail-list">
        <h4 style="margin-top: 0;">Modules:</h4>
        <ul>
          <li v-for="mod in selectedModuleDetail" :key="mod.id">
            {{ mod.name }}
          </li>
        </ul>
      </div>
    </OverlayPanel>

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
          <AutoComplete
            v-model="groupAccessInput"
            :suggestions="filteredGroupAccess"
            @complete="searchGroupAccess"  
            placeholder="Ketik nama group (baru/existing)"
            :forceSelection="false"
            
          >
            <template #empty>
              <div class="autocomplete-empty">
                <span class="empty-text">No results found</span>
                <Button 
                  label="+ Add Group" 
                  size="small"
                  severity="success"
                  text
                  @click="quickAddGroup"
                />
              </div>
            </template>
          </AutoComplete>
          <small class="text-muted">Ketik nama group. Jika belum ada, akan otomatis dibuat saat save.</small>
        </div>

        <div class="field">
          <label>Module</label>
          <MultiSelect
            v-model="formData.moduleIds"
            :options="moduleOptions"
            optionLabel="label"
            optionValue="value"
            placeholder="Select Modules"
            display="chip"
            :maxSelectedLabels="3"
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
    
    <!-- Alert Dialog -->
    <AlertDialog
      v-model:visible="alertDialog.visible"
      :type="alertDialog.type"
      :title="alertDialog.title"
      :message="alertDialog.message"
      :autoClose="alertDialog.autoClose"
    />
    
    <!-- Confirm Dialog -->
    <ConfirmDialog
      v-model:visible="confirmDialog.visible"
      :title="confirmDialog.title"
      :message="confirmDialog.message"
      @confirm="confirmDialog.onConfirm"
    />
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

.cursor-pointer {
  cursor: pointer;
}

.module-detail-list ul {
  list-style-type: none;
  padding-left: 0;
}

.module-detail-list li {
  padding: 6px 0;
  border-bottom: 1px solid #e5e7eb;
}

.module-detail-list li:last-child {
  border-bottom: none;
}

.text-muted {
  color: #6c757d;
  font-size: 12px;
  margin-top: 4px;
  display: block;
}

.autocomplete-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 12px;
}

.autocomplete-empty .empty-text {
  color: #6c757d;
  font-size: 13px;
}
</style>
