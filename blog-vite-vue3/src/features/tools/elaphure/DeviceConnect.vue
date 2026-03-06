<template>
    <div class="DeviceConnect">
        <div class="mb-2 flex items-center text-sm">
            <div class="radio-group ml-4" :class="{ active: isRemoteDAP }">
                <label class="radio-label">
                    <input v-model="isRemoteDAP" type="radio" :value="true">
                    <span>远程 DAP</span>
                </label>
                <label class="radio-label">
                    <input v-model="isRemoteDAP" type="radio" :value="false">
                    <span>USB</span>
                </label>
            </div>
        </div>
        <div class="mb-2 flex ml-4">
            <input
                v-if="isRemoteDAP"
                v-model="dapURI"
                class="input-field"
                style="width: 240px"
                placeholder="dap.local"
            >
        </div>
        <div class="mb-2 flex ml-4 mt-4">
            <button
                class="btn btn-primary"
                :disabled="isDeviceConnect"
                @click="onDAPConnect"
            >
                {{ isDeviceConnect ? '已连接' : isRemoteDAP ? '连接' : '选择设备' }}
            </button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useStorage } from '@vueuse/core'
import * as dapjs from '@elaphurelink/dapjs'
import { dapContext, downloadOption, isDeviceConnect } from './dap/config'
import { log, logErr, logSuccess, logWarn } from './dap/log'
import { isHttps, isLocalNetwork, redirectToHttp, redirectToHttps } from './composables/site'

const isRemoteDAP = useStorage('remote-dap', false)
const dapURI = useStorage('dap-uri', 'dap.local')

async function onDAPConnect() {
    isDeviceConnect.value = false
    dapContext.value = undefined

    let transport: dapjs.WebUSB | dapjs.WebSocketTransport | null = null

    try {
        if (!isRemoteDAP.value) {
            // Webusb is only available in https security contexts
            if (!isLocalNetwork()) {
                if (!isHttps()) {
                    logWarn('正在重定向到 HTTPS...')
                    redirectToHttps()
                    return
                }
            }

            if (!navigator.usb) {
                logErr('您的浏览器不支持 WebUSB')
                return
            }

            const device = await navigator.usb.requestDevice({
                filters: [{ vendorId: 0xD28 }],
            })

            transport = new dapjs.WebUSB(device)
        }
        else {
            // Remote feature does not support https
            if (!isLocalNetwork()) {
                if (isHttps()) {
                    logWarn('远程功能不支持 HTTPS，正在重定向到 HTTP...')
                    redirectToHttp()
                    return
                }
            }

            const addr = `ws://${dapURI.value}:3240/`
            transport = new dapjs.WebSocketTransport(addr)
        }
    }
    catch (err) {
        log(String(err))
    }

    if (!transport) {
        return
    }

    const clock = downloadOption.value.clock
    let processor: dapjs.CortexM
    try {
        processor = new dapjs.CortexM(transport, 0, clock)
        await processor.connect()
        logSuccess('设备连接成功！')
        dapContext.value = processor
        isDeviceConnect.value = true
    }
    catch (err) {
        logErr(String(err))
    }
}
</script>

<style scoped>
.DeviceConnect {
    padding: 16px;
}

.radio-group {
    display: flex;
    gap: 24px;
}

.radio-label {
    display: flex;
    align-items: center;
    gap: 8px;
    cursor: pointer;
    font-size: 14px;
    color: #333;

    input[type="radio"] {
        width: 16px;
        height: 16px;
        accent-color: #6750A4;
    }

    span {
        transition: color 0.2s ease;
    }

    &:hover span {
        color: #6750A4;
    }
}

.input-field {
    padding: 8px 12px;
    border: 1px solid #d9d9d9;
    border-radius: 4px;
    font-size: 14px;
    transition: all 0.3s ease;

    &:focus {
        outline: none;
        border-color: #6750A4;
        box-shadow: 0 0 0 2px rgba(103, 80, 164, 0.2);
    }
}

.btn {
    padding: 8px 16px;
    border: none;
    border-radius: 4px;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.3s ease;

    &.btn-primary {
        background: #6750A4;
        color: white;

        &:hover:not(:disabled) {
            background: #7B1FA2;
        }

        &:disabled {
            background: rgba(103, 80, 164, 0.5);
            cursor: not-allowed;
        }
    }
}

.mb-2 {
    margin-bottom: 8px;
}

.mt-4 {
    margin-top: 16px;
}

.ml-4 {
    margin-left: 16px;
}

.flex {
    display: flex;
}

.items-center {
    align-items: center;
}

.text-sm {
    font-size: 14px;
}
</style>
