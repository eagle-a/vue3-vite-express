import { getCurrentInstance, onActivated, onMounted, ref } from 'vue'
import { useRoute, onBeforeRouteLeave } from 'vue-router'
import { storeToRefs } from 'pinia'
import md5 from 'md5'
import type { AnyFn } from '@vueuse/core'
import useAppShellStore from '@/app/store/use-app-shell-store'

/**
 * 切换状态
 * @param initialValue 初始值
 * @returns [状态, 切换函数]
 */
export function useToggle(initialValue: boolean = false) {
    const value = ref(initialValue)
    const toggle = (newValue?: boolean) => {
        value.value = newValue !== undefined ? newValue : !value.value
        return value.value
    }
    return [value, toggle] as const
}

export function useGlobal() {
    const ins = getCurrentInstance()!

    const ctx = ins.appContext.config.globalProperties
    const options = ins.type

    return {
        ctx,
        options,
    }
}

/**
 * 竞态锁
 * @param fn 回调函数
 * @param autoUnlock 是否自动解锁
 * @description
 * ```
 * autoUnlock === true 不管 fn 返回什么, 都自动解锁
 * autoUnlock === false 不管 fn 返回什么, 都不自动解锁
 * autoUnlock === 'auto' 当 fn 返回 false 时, 不自动解锁, 返回其他值时, 自动解锁
 * ```
 * @example
 * ```
 * const Fn = useLockFn(async (key) => {
 *  console.log(key)
 * }
 *
 * <div v-on:click="Fn(123)"></div>
 * ```
 */
export function useLockFn(fn: AnyFn, autoUnlock: boolean | 'auto' = 'auto') {
    const [lock, toggleLock] = useToggle(false)
    return async (...args: any[]) => {
        if (lock.value) {
            return
        }
        toggleLock(true)
        try {
            const $return: any = await fn(...args)
            if (autoUnlock === true || (autoUnlock === 'auto' && $return !== false)) {
                toggleLock(false)
            }
        }
        catch (e) {
            toggleLock(false)
            throw e
        }
    }
}

/**
 * 保持滚动条位置
 */
export function useSaveScroll() {
    const route = useRoute()
    const appShellStore = useAppShellStore()

    const { historyPageScrollTop } = storeToRefs(appShellStore)

    onActivated(() => {
        const scrollTop = historyPageScrollTop.value[route.fullPath] || 0
        setTimeout(() => {
            window.scrollTo(0, scrollTop)
        }, 300)
    })

    onMounted(() => {
        const scrollTop = historyPageScrollTop.value[route.fullPath] || 0
        setTimeout(() => {
            window.scrollTo(0, scrollTop)
        }, 300)
    })

    onBeforeRouteLeave((to, from, next) => {
        appShellStore.saveScrollTop({
            path: from.fullPath,
            scrollTop: Math.max(window.scrollY, document.documentElement.scrollTop, document.body.scrollTop),
        })
        next()
    })
}

/**
 * 生成gAvatar头像地址
 * @param email 邮箱
 * @param width 图片宽度
 * @returns 图片地址
 */
export function useAvatar(email?: string, width?: number) {
    email = email || '123456'
    email = decodeURIComponent(email)
    width = width || 256
    return `https://cravatar.cn/avatar/${md5(email)}?s=${width}&d=identicon&r=g`
}
