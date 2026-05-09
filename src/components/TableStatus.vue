<template>
  <!-- Skeletons de carga -->
  <template v-if="status === 'loading'">
    <tr v-for="n in 4" :key="n">
      <td :colspan="cols" class="px-6 py-4">
        <div class="h-4 bg-white/5 rounded-full animate-pulse w-full" />
      </td>
    </tr>
  </template>

  <!-- Error con retry -->
  <tr v-else-if="status === 'error'">
    <td :colspan="cols" class="px-6 py-10 text-center">
      <div class="flex flex-col items-center gap-2 text-white/40">
        <span class="text-3xl">⚠</span>
        <p class="text-sm">Error al cargar los datos.</p>
        <button @click="$emit('retry')"
          class="text-brand-400 hover:text-brand-300 text-xs underline">
          Reintentar
        </button>
      </div>
    </td>
  </tr>

  <!-- Sin registros -->
  <tr v-else-if="empty">
    <td :colspan="cols" class="px-6 py-12 text-center">
      <div class="flex flex-col items-center gap-2 text-white/30">
        <span class="text-4xl">{{ emptyIcon }}</span>
        <p class="text-sm">{{ emptyText }}</p>
      </div>
    </td>
  </tr>
</template>

<script setup>
defineProps({
  status:    { type: String, default: 'idle' },
  empty:     Boolean,
  cols:      { type: Number, default: 5 },
  emptyIcon: { type: String, default: '📭' },
  emptyText: { type: String, default: 'No hay registros aún.' },
})
defineEmits(['retry'])
</script>