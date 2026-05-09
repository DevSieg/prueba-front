import { reactive, ref } from 'vue'

export function useForm(initialValues, rules = {}) {
  const form   = reactive({ ...initialValues })
  const errors = reactive({})
  const isSubmitting = ref(false)

  function validateField(field) {
    const fieldRules = rules[field] || []
    for (const rule of fieldRules) {
      const result = rule(form[field])
      if (result !== true) { errors[field] = result; return false }
    }
    delete errors[field]
    return true
  }

  function validate() {
    let valid = true
    for (const field of Object.keys(rules)) {
      if (!validateField(field)) valid = false
    }
    return valid
  }

  function reset() {
    Object.assign(form, initialValues)
    Object.keys(errors).forEach(k => delete errors[k])
  }

  function fill(data) {
    Object.assign(form, data)
    Object.keys(errors).forEach(k => delete errors[k])
  }

  return { form, errors, isSubmitting, validateField, validate, reset, fill }
}

// Reglas reutilizables
export const r = {
  required: (label) => (v) => (v !== null && v !== undefined && String(v).trim() !== '') || `${label} es obligatorio.`,
  minLen:   (n)     => (v) => !v || String(v).length >= n  || `Mínimo ${n} caracteres.`,
  maxLen:   (n)     => (v) => !v || String(v).length <= n  || `Máximo ${n} caracteres.`,
  positive: (label) => (v) => !v || Number(v) > 0           || `${label} debe ser mayor a 0.`,
  integer:  (label) => (v) => !v || Number.isInteger(Number(v)) || `${label} debe ser entero.`,
  minValue: (n)     => (v) => !v || Number(v) >= n          || `El valor mínimo es ${n}.`,
}