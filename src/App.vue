<template>
  <LoadingBar />
  <ToastContainer />

  <div class="min-h-screen flex">
    <aside class="w-64 shrink-0 flex flex-col border-r border-white/10 py-8 px-5 sticky top-0 h-screen">
      <div class="flex items-center gap-3 mb-10">
        <div class="w-9 h-9 rounded-xl bg-brand-500 flex items-center justify-center text-white text-sm font-bold">G</div>
        <div>
          <p class="font-display font-bold text-white text-lg leading-tight">Gestión</p>
          <p class="text-brand-400 text-xs tracking-wider uppercase">Panel admin</p>
        </div>
      </div>

      <nav class="flex flex-col gap-1 flex-1">
        <router-link
          v-for="link in navLinks" :key="link.to" :to="link.to"
          class="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all"
          :class="route.path.startsWith(link.to)
            ? 'bg-brand-500/15 text-brand-300 border border-brand-500/20'
            : 'text-white/50 hover:text-white hover:bg-white/5'"
        >
          <span class="text-base">{{ link.icon }}</span>{{ link.label }}
        </router-link>
      </nav>

      <p class="text-xs text-white/20 font-mono">v1.0.0</p>
    </aside>

    <main class="flex-1 overflow-auto">
      <div class="max-w-5xl mx-auto px-8 py-10">
        <Transition name="fade-view" mode="out-in">
          <RouterView />
        </Transition>
      </div>
    </main>
  </div>
</template>

<script setup>
import { useRoute } from 'vue-router'
import LoadingBar     from './components/LoadingBar.vue'
import ToastContainer from './components/ToastContainer.vue'

const route = useRoute()
const navLinks = [
  { to: '/categorias', icon: '🏷', label: 'Categorías' },
  { to: '/productos',  icon: '📦', label: 'Productos'  },
]
</script>

<style>
  .fade-view-enter-active { transition: all 0.25s ease; }
  .fade-view-leave-active { transition: all 0.20s ease; }
  .fade-view-enter-from   { opacity: 0; transform: translateY(8px); }
  .fade-view-leave-to     { opacity: 0; transform: translateY(-4px); }
</style>
