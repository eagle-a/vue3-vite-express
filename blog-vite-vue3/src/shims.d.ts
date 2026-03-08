declare module '@kangc/v-md-editor'
declare module '@kangc/v-md-editor/lib/preview'
declare module '@kangc/v-md-editor/lib/theme/vuepress'
declare module '@kangc/v-md-editor/lib/plugins/line-number/index'

declare module '*?uint8array' {
    const value: Uint8Array
    export default value
}

declare module '*.bin?uint8array' {
    const value: Uint8Array
    export default value
}

interface ImportMetaEnv {
    readonly VITE_APP_ENV: 'development' | 'production' | 'pre-release'
    readonly VITE_APP_API_DOMAIN: string
    readonly VITE_APP_API: string
    // 更多环境变量...
}
