<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="modelValue" class="modal-overlay" @click.self="closeModal">
        <GlassPanel class="modal-container" :blur="20" :opacity="0.95">
          <button class="modal-close" @click="closeModal" aria-label="关闭">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>

          <div class="modal-header">
            <h2>{{ isLogin ? '登录' : '注册' }}</h2>
            <p>{{ isLogin ? '欢迎回来' : '创建新账户' }}</p>
          </div>

          <form class="modal-form" @submit.prevent="handleSubmit">
            <div v-if="!isLogin" class="form-group">
              <label for="username">用户名</label>
              <input
                id="username"
                v-model="form.username"
                type="text"
                placeholder="请输入用户名"
                required
              />
            </div>

            <div class="form-group">
              <label for="email">邮箱</label>
              <input
                id="email"
                v-model="form.email"
                type="email"
                placeholder="请输入邮箱"
                required
              />
            </div>

            <div class="form-group">
              <label for="password">密码</label>
              <input
                id="password"
                v-model="form.password"
                type="password"
                placeholder="请输入密码"
                required
              />
            </div>

            <div v-if="!isLogin" class="form-group">
              <label for="confirmPassword">确认密码</label>
              <input
                id="confirmPassword"
                v-model="form.confirmPassword"
                type="password"
                placeholder="请再次输入密码"
                required
              />
            </div>

            <BaseButton type="submit" size="lg" :loading="loading" class="submit-btn">
              {{ isLogin ? '登录' : '注册' }}
            </BaseButton>
          </form>

          <div class="modal-footer">
            <span>{{ isLogin ? '还没有账户？' : '已有账户？' }}</span>
            <button class="switch-btn" @click="toggleMode">
              {{ isLogin ? '立即注册' : '立即登录' }}
            </button>
          </div>
        </GlassPanel>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import GlassPanel from './GlassPanel.vue'
import BaseButton from './BaseButton.vue'

interface Props {
  modelValue: boolean
}

const props = defineProps<Props>()
const emit = defineEmits<{
  'update:modelValue': [value: boolean]
}>()

const isLogin = ref(true)
const loading = ref(false)
const form = reactive({
  username: '',
  email: '',
  password: '',
  confirmPassword: '',
})

const closeModal = () => {
  emit('update:modelValue', false)
}

const toggleMode = () => {
  isLogin.value = !isLogin.value
  resetForm()
}

const resetForm = () => {
  form.username = ''
  form.email = ''
  form.password = ''
  form.confirmPassword = ''
}

const handleSubmit = async () => {
  if (!isLogin.value && form.password !== form.confirmPassword) {
    alert('两次密码输入不一致')
    return
  }

  loading.value = true
  try {
    await new Promise(resolve => setTimeout(resolve, 1500))
    alert(isLogin.value ? '登录成功' : '注册成功')
    closeModal()
  } catch (error) {
    console.error(error)
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  z-index: 2000;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(8px);
}

.modal-container {
  position: relative;
  width: 90%;
  max-width: 420px;
  padding: 40px;
}

.modal-close {
  position: absolute;
  top: 16px;
  right: 16px;
  width: 32px;
  height: 32px;
  padding: 0;
  background: transparent;
  border: none;
  border-radius: 50%;
  cursor: pointer;
  color: var(--color-text-secondary);
  transition: all 0.2s ease;
}

.modal-close:hover {
  background: var(--color-surface-variant);
  color: var(--color-text-primary);
}

.modal-close svg {
  width: 20px;
  height: 20px;
}

.modal-header {
  text-align: center;
  margin-bottom: 32px;
}

.modal-header h2 {
  font-size: 28px;
  font-weight: 600;
  color: var(--color-text-primary);
  margin-bottom: 8px;
}

.modal-header p {
  font-size: 14px;
  color: var(--color-text-secondary);
}

.modal-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-group label {
  font-size: 14px;
  font-weight: 500;
  color: var(--color-text-secondary);
}

.form-group input {
  height: 48px;
  padding: 0 16px;
  font-size: 15px;
  color: var(--color-text-primary);
  background: var(--color-surface);
  border: 1px solid var(--color-surface-variant);
  border-radius: 12px;
  outline: none;
  transition: all 0.2s ease;
}

.form-group input:focus {
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px rgba(168, 168, 168, 0.15);
}

.form-group input::placeholder {
  color: var(--color-text-hint);
}

.submit-btn {
  margin-top: 8px;
  width: 100%;
}

.modal-footer {
  margin-top: 24px;
  text-align: center;
  font-size: 14px;
  color: var(--color-text-secondary);
}

.switch-btn {
  padding: 0;
  background: transparent;
  border: none;
  color: var(--color-primary);
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.switch-btn:hover {
  color: var(--color-primary-dark);
}

.modal-enter-active,
.modal-leave-active {
  transition: all 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-from .modal-container,
.modal-leave-to .modal-container {
  transform: scale(0.9) translateY(20px);
}

[data-theme='dark'] .form-group input:focus {
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px rgba(168, 168, 168, 0.1);
}
</style>