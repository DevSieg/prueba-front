<template>
  <Teleport to="body">
    <Transition name="fade">
      <div v-if="ui.isLoading" class="fixed inset-0 z-[9998] pointer-events-none">
        <div class="absolute top-0 left-0 right-0 h-[2px] bg-brand-500/30 overflow-hidden">
          <div class="h-full bg-brand-400 animate-loading-bar" />
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { useUiStore } from '../stores/ui'
const ui = useUiStore()
</script>

<style scoped>
@keyframes loading-bar {
  0%   { transform: translateX(-100%); width: 40%; }
  50%  { width: 70%; }
  100% { transform: translateX(200%); width: 40%; }
}
.animate-loading-bar { animation: loading-bar 1.2s ease-in-out infinite; }
.fade-enter-active, .fade-leave-active { transition: opacity 0.2s; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>