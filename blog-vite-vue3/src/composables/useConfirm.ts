import { createApp, h } from 'vue'
import ConfirmDialogComponent from '@/components/ConfirmDialog.vue'

export interface ConfirmOptions {
  title?: string
  message: string
  confirmText?: string
  cancelText?: string
  type?: 'danger' | 'warning' | 'info'
}

export const useConfirm = () => {
  const show = (options: ConfirmOptions): Promise<boolean> => {
    return new Promise((resolve) => {
      const div = document.createElement('div')
      document.body.appendChild(div)
      
      const app = createApp(ConfirmDialogComponent, {
        ...options,
        onConfirm: () => {
          resolve(true)
          app.unmount()
          div.remove()
        },
        onCancel: () => {
          resolve(false)
          app.unmount()
          div.remove()
        },
      })
      
      app.mount(div)
    })
  }

  return {
    show,
    confirm: (message: string, title?: string) => show({ message, title }),
    danger: (message: string, title?: string) => show({ message, title, type: 'danger' }),
    warning: (message: string, title?: string) => show({ message, title, type: 'warning' }),
    info: (message: string, title?: string) => show({ message, title, type: 'info' }),
  }
}