import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

let toastId = 0

export const useUiStore = defineStore('ui', () => {
    const loadingCount = ref(0)
    const isLoading = computed(() => loadingCount.value > 0)
    function startLoading() { loadingCount.value++ }
    function stopLoading() { if (loadingCount.value > 0) loadingCount.value-- }

    const toasts = ref([])

    function showToast({ type = 'info', message, duration = 4000 }) {
        const id = ++toastId
        toasts.value.push({ id, type, message })
        if (duration > 0) setTimeout(() => removeToast(id), duration)
        return id
    }

    function removeToast(id) {
        const idx = toasts.value.findIndex(t => t.id === id)
        if (idx !== -1) toasts.value.splice(idx, 1)
    }

    const toast = {
        success: (message, duration) => showToast({ type: 'success', message, duration }),
        error: (message, duration) => showToast({ type: 'error', message, duration }),
        warning: (message, duration) => showToast({ type: 'warning', message, duration }),
        info: (message, duration) => showToast({ type: 'info', message, duration }),
    }

    return { isLoading, startLoading, stopLoading, toasts, showToast, removeToast, toast }
})