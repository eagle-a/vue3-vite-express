<template>
    <Teleport to="body">
        <Transition name="dialog">
            <div v-if="visible" class="dialog-overlay" @click.self="handleCancel">
                <GlassPanel class="dialog-container" :blur="20" :opacity="0.95">
                    <div class="dialog-header">
                        <h3 v-if="title" class="dialog-title">{{ title }}</h3>
                        <button class="close-button" aria-label="关闭" @click="handleCancel">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <line x1="18" y1="6" x2="6" y2="18" />
                                <line x1="6" y1="6" x2="18" y2="18" />
                            </svg>
                        </button>
                    </div>

                    <div class="dialog-body">
                        <p class="dialog-message">{{ message }}</p>
                    </div>

                    <div class="dialog-footer">
                        <BaseButton variant="secondary" @click="handleCancel">
                            {{ cancelText }}
                        </BaseButton>
                        <BaseButton :variant="confirmVariant" @click="handleConfirm">
                            {{ confirmText }}
                        </BaseButton>
                    </div>
                </GlassPanel>
            </div>
        </Transition>
    </Teleport>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import GlassPanel from './GlassPanel.vue'
import BaseButton from './BaseButton.vue'

interface Props {
    title?: string
    message: string
    confirmText?: string
    cancelText?: string
    type?: 'danger' | 'warning' | 'info'
}

const props = withDefaults(defineProps<Props>(), {
    confirmText: '确定',
    cancelText: '取消',
    type: 'info',
})

const emit = defineEmits<{
    confirm: []
    cancel: []
}>()

const visible = ref(true)

const confirmVariant = computed(() => {
    if (props.type === 'danger')
        return 'primary'
    return 'primary'
})

function handleConfirm() {
    emit('confirm')
    visible.value = false
}

function handleCancel() {
    emit('cancel')
    visible.value = false
}
</script>

<style scoped>
.dialog-overlay {
  position: fixed;
  inset: 0;
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(8px);
}

.dialog-container {
  width: 100%;
  max-width: 480px;
  padding: 24px;
}

.dialog-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
}

.dialog-title {
  font-size: 20px;
  font-weight: 600;
  color: var(--color-text-primary);
  margin: 0;
}

.close-button {
  width: 32px;
  height: 32px;
  padding: 0;
  background: transparent;
  border: none;
  border-radius: 50%;
  cursor: pointer;
  color: var(--color-text-secondary);
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.close-button:hover {
  background: var(--color-surface-variant);
  color: var(--color-text-primary);
}

.close-button svg {
  width: 18px;
  height: 18px;
}

.dialog-body {
  margin-bottom: 24px;
}

.dialog-message {
  font-size: 15px;
  line-height: 1.6;
  color: var(--color-text-secondary);
  margin: 0;
}

.dialog-footer {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
}

.dialog-enter-active,
.dialog-leave-active {
  transition: all 0.3s ease;
}

.dialog-enter-from,
.dialog-leave-to {
  opacity: 0;
}

.dialog-enter-from .dialog-container,
.dialog-leave-to .dialog-container {
  transform: scale(0.9) translateY(20px);
}
</style>
