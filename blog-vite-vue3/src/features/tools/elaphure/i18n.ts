import { ref } from 'vue'
import { createI18n } from 'vue-i18n'

// 简单的 i18n 配置，用于 elaphure 组件
export const i18n = createI18n({
    legacy: false,
    locale: 'zh-CN',
    fallbackLocale: 'en-US',
    messages: {
        'zh-CN': {},
        'en-US': {},
    },
})

export const currentLang = ref({
    index: 'zh-CN',
    label: '简体中文',
})

export const SUPPORT_LOCALES = [
    { index: 'zh-CN', text: '简体中文' },
    { index: 'en-US', text: 'English' },
]

export function loadLocaleMessages(i18n: any, locale: string) {
    // 简单实现，实际项目中可以动态加载语言包
    i18n.global.locale.value = locale
}

export function setI18nLanguage(i18n: any, locale: string) {
    i18n.global.locale.value = locale
    document.documentElement.lang = locale
}
