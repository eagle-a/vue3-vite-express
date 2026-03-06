import path from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'

import type { UserConfigExport } from 'vite'
import { defineConfig, loadEnv } from 'vite'

import vuePlugin from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'

import VueMacros from 'unplugin-vue-macros'

import { viteMockServe } from '@lincy/vite-plugin-mock'
import UnoCSS from 'unocss/vite'

import wasm from 'vite-plugin-wasm'
import topLevelAwait from 'vite-plugin-top-level-await'
import { DynamicPublicDirectory } from 'vite-multiple-assets'
import arraybuffer from 'vite-plugin-arraybuffer'
import Build from './vite.config.build'
import PWA from './vite.config.pwa'
import Components from './vite.config.components'

function charsetRemoval() {
    return {
        postcssPlugin: 'internal:charset-removal',
        AtRule: {
            charset: (atRule: any) => {
                if (atRule.name === 'charset') {
                    atRule.remove()
                }
            },
        },
    }
}

const dirAssets = ['public/device/deviceList']

// https://vitejs.dev/config/
export default defineConfig(({ mode, command }) => {
    const __dirname = path.dirname(fileURLToPath(import.meta.url))

    process.env = { ...process.env, ...loadEnv(mode, process.cwd()) }

    const config: UserConfigExport = {
        base: '/',
        plugins: [
            VueMacros.vite({
                plugins: {
                    vue: vuePlugin({
                        template: {
                            compilerOptions: {
                                isCustomElement: tag => ['def'].includes(tag),
                            },
                        },
                    }),
                    vueJsx: vueJsx(),
                },
            }),
            viteMockServe({
                mockPath: './mock',
                prodEnabled: false,
                watchFiles: false,
                logger: false,
            }),
            ...Components(),
            UnoCSS({}),
            ...PWA(),
            wasm(),
            topLevelAwait(),
            DynamicPublicDirectory(dirAssets),
            arraybuffer(),
        ],
        resolve: {
            alias: {
                '@': path.join(__dirname, './src'),
                '~': path.join(__dirname, './src'),
                '@device': path.join(__dirname, './public/device'),
            },
        },
        ...Build,
        css: {
            postcss: {
                plugins: [charsetRemoval()],
            },
        },
        optimizeDeps: {
            exclude: ['llvm-objcopy-wasm'],
        },
        server: {
            port: 5173,
            proxy: {
                '/api': {
                    target: 'http://localhost:4001',
                    changeOrigin: true,
                },
                '/mockjs': {
                    target: 'http://localhost:4001',
                    changeOrigin: true,
                },
                '/backend': {
                    target: 'http://localhost:4001',
                    changeOrigin: true,
                },
            },
        },
    }
    return config
})
