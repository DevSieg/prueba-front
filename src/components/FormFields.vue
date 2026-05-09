<template>
  <div class="flex flex-col gap-1.5">
    <label v-if="label" class="text-xs font-medium tracking-wider uppercase text-white/50">
      {{ label }}<span v-if="required" class="text-brand-400 ml-0.5">*</span>
    </label>

    <component
      :is="tag"
      v-bind="inputAttrs"
      :value="modelValue"
      @input="$emit('update:modelValue', $event.target.value)"
      @change="tag === 'select' ? $emit('update:modelValue', $event.target.value) : null"
      @blur="$emit('blur')"
      class="w-full rounded-xl bg-white/5 border px-4 py-2.5 text-sm text-white
             placeholder-white/30 outline-none transition-all
             focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500/60
             disabled:opacity-40 font-body"
      :class="[
        error ? 'border-red-500/60 focus:ring-red-500/30' : 'border-white/10 hover:border-white/20',
        tag === 'select'   ? 'cursor-pointer' : '',
        tag === 'textarea' ? 'resize-none'    : '',
      ]"
    >
      <template v-if="tag === 'select'">
        <option value="" disabled class="bg-surface-50">{{ placeholder || 'Selecciona…' }}</option>
        <slot />
      </template>
    </component>

    <Transition name="err">
      <p v-if="error" class="text-xs text-red-400 flex items-center gap-1">
        <span>⚠</span> {{ error }}
      </p>
    </Transition>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  modelValue:  [String, Number],
  label:       String,
  placeholder: String,
  type:        { type: String, default: 'text' },
  tag:         { type: String, default: 'input' },
  rows:        { type: Number, default: 3 },
  required:    Boolean,
  error:       String,
  disabled:    Boolean,
})
defineEmits(['update:modelValue', 'blur'])

const inputAttrs = computed(() => {
  const a = { placeholder: props.placeholder, disabled: props.disabled }
  if (props.tag === 'input')    a.type = props.type
  if (props.tag === 'textarea') a.rows = props.rows
  return a
})
</script>

<style scoped>
option { background-color: #1a1d27; color: white; }
.err-enter-active { transition: all 0.2s ease; }
.err-leave-active { transition: all 0.15s ease; }
.err-enter-from, .err-leave-to { opacity: 0; transform: translateY(-4px); }
</style>