<template>
  <Teleport to="body">
    <div class="fixed bottom-6 right-6 z-[9999] flex flex-col gap-3 max-w-sm w-full pointer-events-none">
      <TransitionGroup name="toast" tag="div" class="flex flex-col gap-3">
        <div
          v-for="toast in ui.toasts" :key="toast.id"
          class="pointer-events-auto flex items-start gap-3 rounded-2xl px-4 py-3.5
                 shadow-2xl backdrop-blur-xl border text-sm cursor-pointer select-none"
          :class="toastClass(toast.type)"
          @click="ui.removeToast(toast.id)"
        >
          <span class="mt-0.5 shrink-0">{{ toastIcon(toast.type) }}</span>
          <p class="flex-1 leading-snug">{{ toast.message }}</p>
          <button class="shrink-0 opacity-60 hover:opacity-100 transition-opacity text-xs">✕</button>
        </div>
      </TransitionGroup>
    </div>
  </Teleport>
</template>

<script setup>
import { useUiStore } from '../stores/ui'
const ui = useUiStore()

const toastClass = (type) => ({
  success: 'bg-emerald-950/90 border-emerald-600/40 text-emerald-100',
  error:   'bg-red-950/90    border-red-600/40    text-red-100',
  warning: 'bg-amber-950/90  border-amber-600/40  text-amber-100',
  info:    'bg-brand-900/90  border-brand-600/40  text-brand-100',
}[type] ?? 'bg-surface-50 border-white/10 text-white')

const toastIcon = (type) => ({ success:'✓', error:'✕', warning:'⚠', info:'ℹ' }[type] ?? 'ℹ')
</script>