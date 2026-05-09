<template>
  <AppModal :modelValue="modelValue" title="Confirmar eliminación" size="sm"
    @update:modelValue="$emit('update:modelValue', $event)">

    <div class="flex flex-col items-center gap-4 py-2 text-center">
      <div class="w-14 h-14 rounded-full bg-red-500/10 border border-red-500/20
                  flex items-center justify-center text-2xl">🗑</div>
      <div>
        <p class="text-white font-medium">¿Eliminar este registro?</p>
        <p class="text-white/50 text-sm mt-1">{{ message || 'Esta acción no se puede deshacer.' }}</p>
      </div>
    </div>

    <template #footer>
      <div class="flex gap-3 pt-2">
        <button
          @click="$emit('update:modelValue', false)"
          class="flex-1 px-4 py-2.5 rounded-xl border border-white/10 text-white/70
                 hover:bg-white/5 transition-all text-sm font-medium"
        >Cancelar</button>
        <button
          @click="$emit('confirm')"
          :disabled="loading"
          class="flex-1 px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white
                 transition-all text-sm font-medium disabled:opacity-50
                 flex items-center justify-center gap-2"
        >
          <span v-if="loading" class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          {{ loading ? 'Eliminando...' : 'Eliminar' }}
        </button>
      </div>
    </template>
  </AppModal>
</template>

<script setup>
import AppModal from './AppModal.vue'
defineProps({ modelValue: Boolean, message: String, loading: Boolean })
defineEmits(['update:modelValue', 'confirm'])
</script>