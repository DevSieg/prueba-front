<template>
  <div class="space-y-8">

    <div class="flex items-start justify-between gap-4">
      <div>
        <h1 class="font-display font-bold text-3xl text-white tracking-tight">Categorías</h1>
        <p class="text-white/40 text-sm mt-1">Gestiona las categorías del catálogo</p>
      </div>
      <button @click="openCreate" class="btn-primary flex items-center gap-2">
        <span class="text-lg leading-none">+</span> Nueva categoría
      </button>
    </div>

    <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <div class="card text-center">
        <p class="text-4xl font-display font-bold text-brand-400">{{ categorias.length }}</p>
        <p class="text-white/40 text-xs mt-1 uppercase tracking-wider">Total categorías</p>
      </div>
    </div>

    <div class="card overflow-hidden p-0">
      <div class="px-6 py-4 border-b border-white/10 flex items-center justify-between gap-4">
        <h2 class="font-display font-semibold text-white/80">Listado</h2>
        <input v-model="search" placeholder="Buscar…" class="input-sm w-56" />
      </div>

      <div class="overflow-x-auto">
        <table class="w-full text-sm">
          <thead>
            <tr class="border-b border-white/10 text-white/40 text-xs uppercase tracking-wider">
              <th class="text-left px-6 py-3 font-medium">#</th>
              <th class="text-left px-6 py-3 font-medium">Nombre</th>
              <th class="text-left px-6 py-3 font-medium">Creado</th>
              <th class="text-right px-6 py-3 font-medium">Acciones</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-white/5">
            <TableStatus
              :status="store.status"
              :empty="filteredCategorias.length === 0 && store.status === 'success'"
              :cols="4"
              empty-icon="🏷"
              empty-text="No hay categorías registradas."
              @retry="store.fetchCategorias()"
            />
            <tr v-for="cat in filteredCategorias" :key="cat.id"
              class="hover:bg-white/5 transition-colors">
              <td class="px-6 py-4 text-white/30 font-mono text-xs">{{ cat.id ?? '-' }}</td>
              <td class="px-6 py-4 text-white font-medium">{{ cat.nombre }}</td>
              <td class="px-6 py-4 text-white/40 text-xs">{{ formatDate(cat.created_at) }}</td>
              <td class="px-6 py-4">
                <div class="flex items-center justify-end gap-2">
                  <button @click="openEdit(cat)" class="icon-btn text-brand-400 hover:text-brand-300">✎</button>
                  <button @click="promptDelete(cat)" class="icon-btn text-red-400 hover:text-red-300">✕</button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>

  <!-- Modal Crear / Editar -->
  <AppModal v-model="showModal" :title="isEditing ? 'Editar categoría' : 'Nueva categoría'">
    <form @submit.prevent="handleSubmit" class="space-y-5">
      <FormField
        v-model="form.nombre"
        label="Nombre"
        placeholder="Ej: Electrónica, Ropa…"
        required
        :error="errors.nombre"
        @blur="validateField('nombre')"
      />
      <div class="flex gap-3 pt-2">
        <button type="button" @click="showModal = false" class="btn-cancel flex-1">Cancelar</button>
        <button type="submit" :disabled="submitting" class="btn-primary flex-1 flex items-center justify-center gap-2">
          <span v-if="submitting" class="spinner" />
          {{ submitting ? 'Guardando...' : (isEditing ? 'Actualizar' : 'Crear') }}
        </button>
      </div>
    </form>
  </AppModal>

  <!-- Modal Confirmar eliminación -->
  <ConfirmModal
    v-model="showDeleteModal"
    :message="`¿Eliminar &quot;${toDelete?.nombre}&quot;?`"
    :loading="deleting"
    @confirm="handleDelete"
  />
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useCategoriasService } from '../../services/categoria-service.js'
import { useForm, r }         from '../../composables/useForm'
import { useUiStore }          from '../../stores/ui'
import AppModal     from '../../components/AppModal.vue'
import FormField    from '../../components/FormFields.vue'
import TableStatus  from '../../components/TableStatus.vue'
import ConfirmModal from '../../components/ConfirmModal.vue'

const store = useCategoriasService()
const ui    = useUiStore()

const showModal       = ref(false)
const showDeleteModal = ref(false)
const isEditing       = ref(false)
const editId          = ref(null)
const toDelete        = ref(null)
const submitting      = ref(false)
const deleting        = ref(false)
const search          = ref('')

const { form, errors, validateField, validate, reset, fill } = useForm(
  { nombre: '' },
  { nombre: [r.required('Nombre'), r.minLen(2), r.maxLen(100)] }
)

const categorias = computed(() => Array.isArray(store.categorias) ? store.categorias : [])
const filteredCategorias = computed(() => {
  const list = categorias.value
  const q = search.value.toLowerCase()
  return q ? list.filter(c => c.nombre.toLowerCase().includes(q)) : list
})

function openCreate() {
  isEditing.value = false; editId.value = null
  reset(); showModal.value = true
}
function openEdit(cat) {
  isEditing.value = true; editId.value = cat.id
  fill({ nombre: cat.nombre }); showModal.value = true
}
function promptDelete(cat) {
  toDelete.value = cat; showDeleteModal.value = true
}

async function handleSubmit() {
  if (!validate()) return
  submitting.value = true
  try {
    if (isEditing.value) {
      await store.updateCategoria(editId.value, { nombre: form.nombre })
      ui.toast.success('Categoría actualizada correctamente.')
    } else {
      await store.createCategoria({ nombre: form.nombre })
      ui.toast.success('Categoría creada correctamente.')
    }
    await store.fetchCategorias()
    showModal.value = false; reset()
  } finally { submitting.value = false }
}

async function handleDelete() {
  if (!toDelete.value) return
  deleting.value = true
  try {
    await store.deleteCategoria(toDelete.value.id)
    await store.fetchCategorias()
    ui.toast.success('Categoría eliminada correctamente.')
    showDeleteModal.value = false; toDelete.value = null
  } finally { deleting.value = false }
}

function formatDate(d) {
  if (!d) return '—'
  return new Date(d).toLocaleDateString('es-PE', { day:'2-digit', month:'short', year:'numeric' })
}

onMounted(() => store.fetchCategorias())
</script>

<style scoped>
</style>