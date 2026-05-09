<template>
  <Teleport to="body">
    <Transition name="modal">
      <div
        v-if="modelValue"
        class="fixed inset-0 z-[9990] flex items-center justify-center p-4"
        @click.self="$emit('update:modelValue', false)"
      >
        <div class="absolute inset-0 bg-black/60 backdrop-blur-sm" />

        <Transition name="modal-content" appear>
          <div
            v-if="modelValue"
            class="relative z-10 w-full bg-surface-50 border border-white/10 rounded-3xl shadow-2xl overflow-hidden"
            :class="{ 'max-w-sm': size==='sm', 'max-w-lg': size==='md', 'max-w-2xl': size==='lg' }"
          >
            <div class="flex items-center justify-between px-6 py-5 border-b border-white/10">
              <h2 class="font-display font-bold text-lg text-white">{{ title }}</h2>
              <button
                @click="$emit('update:modelValue', false)"
                class="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center
                       justify-center text-white/50 hover:text-white transition-all text-sm"
              >✕</button>
            </div>

            <div class="px-6 py-5"><slot /></div>
            <div v-if="$slots.footer" class="px-6 pb-5"><slot name="footer" /></div>
          </div>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
defineProps({
  modelValue: Boolean,
  title: { type: String, default: '' },
  size:  { type: String, default: 'md' },
})
defineEmits(['update:modelValue'])
</script>