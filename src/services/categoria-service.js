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

export const useCategoriasService = defineStore('categorias', () => {
    const ui = useUiStore()
    const categorias = ref([])
    const status = ref('idle') // idle | loading | success | error

    async function fetchCategorias() {
        status.value = 'loading'
        try {
            const { data } = await api.get('/categorias')
            categorias.value = unwrapResponse(data) ?? []
            status.value = 'success'
        } catch {
            status.value = 'error'
        }
    }

    async function createCategoria(payload) {
        const { data } = await api.post('/categorias', payload)
        const item = unwrapResponse(data)
        categorias.value.unshift(item)
        return item
    }

    async function updateCategoria(id, payload) {
        const { data } = await api.put(`/categorias/${id}`, payload)
        const item = unwrapResponse(data)
        const idx = categorias.value.findIndex(c => c.id === id)
        if (idx !== -1) categorias.value[idx] = item
        return item
    }

    async function deleteCategoria(id) {
        await api.delete(`/categorias/${id}`)
        categorias.value = categorias.value.filter(c => c.id !== id)
    }

    return { categorias, status, fetchCategorias, createCategoria, updateCategoria, deleteCategoria }
})