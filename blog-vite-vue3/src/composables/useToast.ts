import { createApp, h, ref } from 'vue'
import ToastComponent from '@/components/Toast.vue'

export type ToastType = 'success' | 'error' | 'warning' | 'info'

export interface ToastOptions {
  message: string
  type?: ToastType
  duration?: number
}

const toasts = ref<Array<{ id: number; message: string; type: ToastType }>>([])
let toastId = 0

const removeToast = (id: number) => {
  const index = toasts.value.findIndex(t => t.id === id)
  if (index !== -1) {
    toasts.value.splice(index, 1)
  }
}

const show = (message: string, type: ToastType = 'info', duration = 3000) => {
  const id = ++toastId
  toasts.value.push({ id, message, type })
  
  setTimeout(() => {
    removeToast(id)
  }, duration)
  
  return id
}

export const useToast = () => {
  return {
    success: (message: string, duration?: number) => show(message, 'success', duration),
    error: (message: string, duration?: number) => show(message, 'error', duration),
    warning: (message: string, duration?: number) => show(message, 'warning', duration),
    info: (message: string, duration?: number) => show(message, 'info', duration),
    show,
    toasts,
    remove: removeToast,
  }
}