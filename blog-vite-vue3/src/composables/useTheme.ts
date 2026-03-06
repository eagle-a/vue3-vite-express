import { computed, ref, watchEffect, onMounted } from 'vue'

export type ThemeMode = 'light' | 'dark' | 'auto'

const THEME_STORAGE_KEY = 'theme-mode'

export function useTheme() {
    const theme = ref<ThemeMode>('light')
    const isClient = ref(false)

    onMounted(() => {
        isClient.value = true
        const storedTheme = localStorage.getItem(THEME_STORAGE_KEY) as ThemeMode
        if (storedTheme) {
            theme.value = storedTheme
        }

        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
        const handleMediaChange = () => {
            if (theme.value === 'auto') {
                document.documentElement.setAttribute(
                    'data-theme',
                    mediaQuery.matches ? 'dark' : 'light',
                )
            }
        }

        mediaQuery.addEventListener('change', handleMediaChange)
    })

    const actualTheme = computed(() => {
        if (!isClient.value) return 'light'
        if (theme.value === 'auto') {
            // 根据实际时间自动切换暗色模式
            const now = new Date()
            const hour = now.getHours()
            // 晚上 18:00 到早上 6:00 使用暗色模式
            if (hour >= 18 || hour < 6) {
                return 'dark'
            }
            // 其他时间使用系统偏好设置
            return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
        }
        return theme.value
    })

    const isDark = computed(() => actualTheme.value === 'dark')

    const setTheme = (newTheme: ThemeMode) => {
        theme.value = newTheme
        if (isClient.value) {
            localStorage.setItem(THEME_STORAGE_KEY, newTheme)
        }
    }

    const toggleTheme = () => {
        const nextTheme: ThemeMode = actualTheme.value === 'dark' ? 'light' : 'dark'
        setTheme(nextTheme)
    }

    watchEffect(() => {
        if (!isClient.value) return
        document.documentElement.setAttribute('data-theme', actualTheme.value)

        const metaThemeColor = document.querySelector('meta[name="theme-color"]')
        if (metaThemeColor) {
            metaThemeColor.setAttribute(
                'content',
                actualTheme.value === 'dark' ? '#000000' : '#FFFFFF',
            )
        }
    })

    return {
        theme,
        actualTheme,
        isDark,
        setTheme,
        toggleTheme,
    }
}
