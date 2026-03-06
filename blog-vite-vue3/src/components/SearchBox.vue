<template>
  <div class="search-box" :class="{ focused: isFocused, disabled }">
    <div class="search-icon">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <circle cx="11" cy="11" r="8" />
        <line x1="21" y1="21" x2="16.65" y2="16.65" />
      </svg>
    </div>

    <input
      ref="inputRef"
      v-model="searchValue"
      type="text"
      :placeholder="placeholder"
      :disabled="disabled"
      class="search-input"
      @focus="handleFocus"
      @blur="handleBlur"
      @input="handleInput"
      @keydown.enter="handleSearch"
    />

    <button
      v-if="searchValue && showClear"
      class="clear-button"
      aria-label="清除"
      @click="handleClear"
    >
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <line x1="18" y1="6" x2="6" y2="18" />
        <line x1="6" y1="6" x2="18" y2="18" />
      </svg>
    </button>

    <BaseButton
      v-if="showButton"
      :size="size"
      :loading="loading"
      class="search-button"
      @click="handleSearch"
    >
      搜索
    </BaseButton>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import BaseButton from './BaseButton.vue'

interface Props {
  modelValue?: string
  placeholder?: string
  size?: 'sm' | 'md' | 'lg'
  disabled?: boolean
  showClear?: boolean
  showButton?: boolean
  loading?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: '',
  placeholder: '搜索...',
  size: 'md',
  disabled: false,
  showClear: true,
  showButton: false,
  loading: false,
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
  'search': [value: string]
  'clear': []
}>()

const inputRef = ref<HTMLInputElement>()
const isFocused = ref(false)
const searchValue = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
})

const handleFocus = () => {
  isFocused.value = true
}

const handleBlur = () => {
  isFocused.value = false
}

const handleInput = (event: Event) => {
  const target = event.target as HTMLInputElement
  searchValue.value = target.value
}

const handleSearch = () => {
  if (searchValue.value.trim()) {
    emit('search', searchValue.value.trim())
  }
}

const handleClear = () => {
  searchValue.value = ''
  emit('clear')
  inputRef.value?.focus()
}

const focus = () => {
  inputRef.value?.focus()
}

const blur = () => {
  inputRef.value?.blur()
}

defineExpose({ focus, blur })
</script>

<style scoped>
.search-box {
  display: flex;
  align-items: center;
  background: var(--color-surface);
  border: 1px solid var(--color-surface-variant);
  border-radius: 16px;
  transition: all 0.3s ease;
  overflow: hidden;
}

.search-box.focused {
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px rgba(168, 168, 168, 0.15);
}

.search-box.disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.search-icon {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  padding-left: 16px;
  color: var(--color-text-hint);
}

.search-icon svg {
  width: 20px;
  height: 20px;
}

.search-input {
  flex: 1;
  height: 48px;
  padding: 0 16px;
  font-size: 15px;
  color: var(--color-text-primary);
  background: transparent;
  border: none;
  outline: none;
}

.search-input::placeholder {
  color: var(--color-text-hint);
}

.search-input:disabled {
  cursor: not-allowed;
}

.clear-button {
  flex-shrink: 0;
  width: 24px;
  height: 24px;
  margin-right: 8px;
  padding: 0;
  background: var(--color-surface-variant);
  border: none;
  border-radius: 50%;
  cursor: pointer;
  color: var(--color-text-hint);
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.clear-button:hover {
  background: var(--color-primary);
  color: #000000;
}

.clear-button svg {
  width: 12px;
  height: 12px;
}

.search-button {
  flex-shrink: 0;
  margin-right: 8px;
}

[data-theme='dark'] .search-box.focused {
  box-shadow: 0 0 0 3px rgba(168, 168, 168, 0.1);
}
</style>