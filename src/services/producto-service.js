import { defineStore } from 'pinia'
import { ref } from 'vue'
import api from './api'
import { useUiStore } from '../stores/ui'

const unwrapResponse = (payload) => {
  if (payload && typeof payload === 'object' && Object.prototype.hasOwnProperty.call(payload, 'data')) {
    return payload.data
  }
  return payload
}

export const useProductosService = defineStore('productos', () => {
  const ui = useUiStore()
  const productos = ref([])
  const status = ref('idle')

  async function fetchProductos() {
    status.value = 'loading'
    try {
      const { data } = await api.get('/productos')
      productos.value = unwrapResponse(data) ?? []
      status.value = 'success'
    } catch {
      status.value = 'error'
    }
  }

  async function createProducto(payload) {
    const { data } = await api.post('/productos', payload)
    const item = unwrapResponse(data)
    productos.value.unshift(item)
    ui.toast.success('Producto creado correctamente.')
    return item
  }

  async function updateProducto(id, payload) {
    const { data } = await api.put(`/productos/${id}`, payload)
    const item = unwrapResponse(data)
    const idx = productos.value.findIndex(p => p.id === id)
    if (idx !== -1) productos.value[idx] = item
    ui.toast.success('Producto actualizado.')
    return item
  }

  async function deleteProducto(id) {
    await api.delete(`/productos/${id}`)
    productos.value = productos.value.filter(p => p.id !== id)
    ui.toast.success('Producto eliminado.')
  }

  return { productos, status, fetchProductos, createProducto, updateProducto, deleteProducto }
})