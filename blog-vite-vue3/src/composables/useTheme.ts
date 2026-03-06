import { ref, computed, watchEffect } from 'vue'

export type ThemeMode = 'light' | 'dark' | 'auto'

const THEME_STORAGE_KEY = 'theme-mode'

export const useTheme = () => {
  const theme = ref<ThemeMode>(
    (localStorage.getItem(THEME_STORAGE_KEY) as ThemeMode) || 'auto'
  )

  const actualTheme = computed(() => {
    if (theme.value === 'auto') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light'
    }
    return theme.value
  })

  const isDark = computed(() => actualTheme.value === 'dark')

  const setTheme = (newTheme: ThemeMode) => {
    theme.value = newTheme
    localStorage.setItem(THEME_STORAGE_KEY, newTheme)
  }

  const toggleTheme = () => {
    const nextTheme: ThemeMode = actualTheme.value === 'dark' ? 'light' : 'dark'
    setTheme(nextTheme)
  }

  watchEffect(() => {
    document.documentElement.setAttribute('data-theme', actualTheme.value)

    const metaThemeColor = document.querySelector('meta[name="theme-color"]')
    if (metaThemeColor) {
      metaThemeColor.setAttribute(
        'content',
        actualTheme.value === 'dark' ? '#000000' : '#FFFFFF'
      )
    }
  })

  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
  const handleMediaChange = () => {
    if (theme.value === 'auto') {
      document.documentElement.setAttribute(
        'data-theme',
        mediaQuery.matches ? 'dark' : 'light'
      )
    }
  }

  mediaQuery.addEventListener('change', handleMediaChange)

  return {
    theme,
    actualTheme,
    isDark,
    setTheme,
    toggleTheme,
  }
}