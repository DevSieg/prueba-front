<template>
  <div class="space-y-8">

    <div class="flex items-start justify-between gap-4">
      <div>
        <h1 class="font-display font-bold text-3xl text-white tracking-tight">Productos</h1>
        <p class="text-white/40 text-sm mt-1">Administra el inventario de tu tienda</p>
      </div>
      <button @click="openCreate" class="btn-primary flex items-center gap-2">
        <span class="text-lg leading-none">+</span> Nuevo producto
      </button>
    </div>

    <!-- Stats -->
    <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <div class="card text-center">
        <p class="text-4xl font-display font-bold text-brand-400">{{ productos.length }}</p>
        <p class="text-white/40 text-xs mt-1 uppercase tracking-wider">Total productos</p>
      </div>
      <div class="card text-center">
        <p class="text-4xl font-display font-bold text-emerald-400">{{ totalStock }}</p>
        <p class="text-white/40 text-xs mt-1 uppercase tracking-wider">Unidades en stock</p>
      </div>
      <div class="card text-center">
        <p class="text-4xl font-display font-bold text-amber-400">S/ {{ avgPrice }}</p>
        <p class="text-white/40 text-xs mt-1 uppercase tracking-wider">Precio promedio</p>
      </div>
    </div>

    <!-- Filtros -->
    <div class="flex flex-wrap items-center gap-3">
      <input v-model="search" placeholder="Buscar producto…" class="input-sm w-56" />
      <select v-model="filterCategoria" class="input-sm w-44">
        <option value="">Todas las categorías</option>
        <option v-for="cat in catStore.categorias" :key="cat.id" :value="cat.id">
          {{ cat.nombre }}
        </option>
      </select>
    </div>

    <!-- Tabla -->
    <div class="card overflow-hidden p-0">
      <div class="overflow-x-auto">
        <table class="w-full text-sm">
          <thead>
            <tr class="border-b border-white/10 text-white/40 text-xs uppercase tracking-wider">
              <th class="text-left px-6 py-3 font-medium">#</th>
              <th class="text-left px-6 py-3 font-medium">Nombre</th>
              <th class="text-left px-6 py-3 font-medium">Categoría</th>
              <th class="text-right px-6 py-3 font-medium">Precio</th>
              <th class="text-right px-6 py-3 font-medium">Stock</th>
              <th class="text-right px-6 py-3 font-medium">Acciones</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-white/5">
            <TableStatus
              :status="store.status"
              :empty="filteredProductos.length === 0 && store.status === 'success'"
              :cols="6"
              empty-icon="📦"
              empty-text="No hay productos registrados."
              @retry="store.fetchProductos()"
            />
            <tr v-for="prod in filteredProductos" :key="prod.id"
              class="hover:bg-white/5 transition-colors">
              <td class="px-6 py-4 text-white/30 font-mono text-xs">{{ prod.id }}</td>
              <td class="px-6 py-4">
                <p class="text-white font-medium">{{ prod.nombre }}</p>
                <p class="text-white/40 text-xs truncate max-w-xs">{{ prod.descripcion }}</p>
              </td>
              <td class="px-6 py-4">
                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-brand-500/15 text-brand-300 border border-brand-500/20">
                  {{ getCatNombre(prod.categoria_id) }}
                </span>
              </td>
              <td class="px-6 py-4 text-right text-emerald-400 font-mono font-medium">
                S/ {{ Number(prod.precio).toFixed(2) }}
              </td>
              <td class="px-6 py-4 text-right">
                <span class="font-mono font-medium"
                  :class="prod.stock > 10 ? 'text-white' : prod.stock > 0 ? 'text-amber-400' : 'text-red-400'">
                  {{ prod.stock }}
                </span>
              </td>
              <td class="px-6 py-4">
                <div class="flex items-center justify-end gap-2">
                  <button @click="openEdit(prod)" class="icon-btn text-brand-400 hover:text-brand-300">✎</button>
                  <button @click="promptDelete(prod)" class="icon-btn text-red-400 hover:text-red-300">✕</button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>

  <!-- Modal Crear / Editar -->
  <AppModal v-model="showModal" :title="isEditing ? 'Editar producto' : 'Nuevo producto'" size="lg">
    <form @submit.prevent="handleSubmit" class="space-y-5">
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div class="sm:col-span-2">
          <FormField v-model="form.nombre" label="Nombre del producto"
            placeholder="Ej: Laptop HP 15…" required :error="errors.nombre" @blur="validateField('nombre')" />
        </div>
        <div class="sm:col-span-2">
          <FormField v-model="form.descripcion" label="Descripción"
            placeholder="Describe el producto…" tag="textarea" :rows="3"
            required :error="errors.descripcion" @blur="validateField('descripcion')" />
        </div>
        <FormField v-model="form.precio" label="Precio (S/)" placeholder="0.00"
          type="number" required :error="errors.precio" @blur="validateField('precio')" />
        <FormField v-model="form.stock" label="Stock (unidades)" placeholder="0"
          type="number" required :error="errors.stock" @blur="validateField('stock')" />
        <div class="sm:col-span-2">
          <FormField v-model="form.categoria_id" label="Categoría" tag="select" 
            placeholder="Selecciona una categoría" required
            :error="errors.categoria_id" @blur="validateField('categoria_id')">
            <option v-for="cat in catStore.categorias" :key="cat.id" :value="String(cat.id)" style="color:black;">
              {{ cat.nombre }}
            </option>
          </FormField>
          <p v-if="catStore.categorias.length === 0" class="text-xs text-amber-400 mt-1.5 flex items-center gap-1">
            <span>⚠</span> No hay categorías.
            <router-link to="/categorias" class="underline hover:text-amber-300">Crea una primero</router-link>
          </p>
        </div>
      </div>

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
import { useProductosService }  from '../../services/producto-service.js'
import { useCategoriasService } from '../../services/categoria-service.js'
import { useForm, r }         from '../../composables/useForm'
import AppModal     from '../../components/AppModal.vue'
import FormField    from '../../components/FormFields.vue'
import TableStatus  from '../../components/TableStatus.vue'
import ConfirmModal from '../../components/ConfirmModal.vue'

const store    = useProductosService()
const catStore = useCategoriasService()

const showModal       = ref(false)
const showDeleteModal = ref(false)
const isEditing       = ref(false)
const editId          = ref(null)
const toDelete        = ref(null)
const submitting      = ref(false)
const deleting        = ref(false)
const search          = ref('')
const filterCategoria = ref('')

const { form, errors, validateField, validate, reset, fill } = useForm(
  { nombre: '', descripcion: '', precio: '', stock: '', categoria_id: '' },
  {
    nombre:      [r.required('Nombre'),     r.minLen(2), r.maxLen(150)],
    descripcion: [r.required('Descripción'), r.minLen(5)],
    precio:      [r.required('Precio'),     r.positive('El precio')],
    stock:       [r.required('Stock'),      r.minValue(0), r.integer('El stock')],
    categoria_id:[r.required('La categoría')],
  }
)

const productos = computed(() => Array.isArray(store.productos) ? store.productos : [])

const filteredProductos = computed(() => {
  let list = productos.value
  const q  = search.value.toLowerCase()
  if (q) list = list.filter(p => p.nombre.toLowerCase().includes(q) || p.descripcion?.toLowerCase().includes(q))
  if (filterCategoria.value) list = list.filter(p => String(p.categoria_id) === String(filterCategoria.value))
  return list
})

const totalStock = computed(() => productos.value.reduce((s, p) => s + Number(p.stock || 0), 0))
const avgPrice   = computed(() => {
  if (!productos.value.length) return '0.00'
  return (productos.value.reduce((s, p) => s + Number(p.precio || 0), 0) / productos.value.length).toFixed(2)
})

function getCatNombre(id) {
  return catStore.categorias.find(c => String(c.id) === String(id))?.nombre ?? '—'
}

function openCreate() {
  isEditing.value = false; editId.value = null
  reset(); showModal.value = true
}
function openEdit(prod) {
  isEditing.value = true; editId.value = prod.id
  fill({ nombre: prod.nombre, descripcion: prod.descripcion,
         precio: String(prod.precio), stock: String(prod.stock),
         categoria_id: String(prod.categoria_id) })
  showModal.value = true
}
function promptDelete(prod) {
  toDelete.value = prod; showDeleteModal.value = true
}

async function handleSubmit() {
  if (!validate()) return
  submitting.value = true
  try {
    const payload = {
      nombre: form.nombre, descripcion: form.descripcion,
      precio: parseFloat(form.precio), stock: parseInt(form.stock),
      categoria_id: parseInt(form.categoria_id),
    }
    if (isEditing.value) await store.updateProducto(editId.value, payload)
    else                 await store.createProducto(payload)
    showModal.value = false; reset()
  } finally { submitting.value = false }
}

async function handleDelete() {
  if (!toDelete.value) return
  deleting.value = true
  try {
    await store.deleteProducto(toDelete.value.id)
    showDeleteModal.value = false; toDelete.value = null
  } finally { deleting.value = false }
}

onMounted(() => Promise.all([store.fetchProductos(), catStore.fetchCategorias()]))
</script>

<style scoped>
</style>