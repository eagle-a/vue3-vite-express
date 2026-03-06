<template>
    <div class="FlashConfig">
        <div class="m-4">
            <p class="md-4 ela-text">选择目标芯片</p>
            <div class="select-container mt-2">
                <select v-model="targetDeviceString" class="select-field" @change="onDeviceChange">
                    <option value="">搜索芯片型号</option>
                    <option v-for="vendor in deviceIndexOption" :key="vendor.value">
                        {{ vendor.label }}
                    </option>
                </select>
            </div>
        </div>
        <div class="m-4">
            <p class="md-4 ela-text">最大时钟频率</p>
            <div class="select-container mt-2">
                <select v-model="clockValue" class="select-field">
                    <option v-for="option in clockOptions" :key="option.value" :value="option.value">
                        {{ option.label }}
                    </option>
                </select>
            </div>
        </div>
        <div class="mb-2 flex items-center text-sm">
            <div class="radio-group ml-4">
                <label class="radio-label">
                    <input v-model="downloadOption.erase" type="radio" value="full">
                    <span>全片擦除</span>
                </label>
                <label class="radio-label">
                    <input v-model="downloadOption.erase" type="radio" value="part">
                    <span>部分擦除</span>
                </label>
                <label class="radio-label">
                    <input v-model="downloadOption.erase" type="radio" value="none">
                    <span>不擦除</span>
                </label>
            </div>
        </div>

        <div class="mb-2 flex items-center text-sm ml-4">
            <label class="checkbox-label">
                <input v-model="downloadOption.program" type="checkbox">
                <span>编程</span>
            </label>
            <label class="checkbox-label">
                <input v-model="downloadOption.verify" type="checkbox">
                <span>校验</span>
            </label>
        </div>
        <div class="mb-2 flex items-center text-sm ml-4">
            <label class="checkbox-label">
                <input v-model="downloadOption.resetAfterDownload" type="checkbox">
                <span>下载后复位</span>
            </label>
        </div>
    </div>
</template>

<script setup lang="ts">
import deviceIndexOption from '@device/deviceIndex.json'
import { useStorage } from '@vueuse/core'
import { onMounted, ref, watch } from 'vue'
import { algorithmBin, algorithmInfo, downloadOption, memInfo } from './dap/config'

const targetDevice = useStorage('target-device', [])
const targetDeviceString = ref('')
const clockValue = ref(downloadOption.value.clock)

watch(clockValue, (val) => {
    downloadOption.value.clock = val
})

async function getFile(addr: string, isBin: boolean) {
    try {
        const response = await fetch(addr, { cache: 'default' })
        if (!response.ok) {
            return null
        }

        if (isBin) {
            const buffer = await response.arrayBuffer()
            return new Uint8Array(buffer)
        }
        else {
            return await response.json()
        }
    }
    catch (error) {
        return null
    }
}

async function updateAlgo() {
    // 简化实现，实际项目中可能需要更复杂的逻辑
    if (!targetDevice.value || targetDevice.value.length === 0) {
        return
    }

    // 这里需要根据实际的deviceIndexOption结构来实现
    // 暂时简化处理
    const [vendorName, seriesName] = targetDevice.value
    const base = `/${vendorName}/${seriesName}/`

    // 假设默认算法文件
    const algoJsonPath = `${base}default.json`
    const algoBinPath = `${base}default.bin`

    algorithmInfo.value = await getFile(algoJsonPath, false)
    algorithmBin.value = await getFile(algoBinPath, true)

    memInfo.value = {
        ram: { start: 0x20000000, size: 0x10000 },
        rom: { start: 0x08000000, size: 0x100000 },
    }
}

async function onDeviceChange() {
    // 这里需要根据选择的设备字符串更新targetDevice
    // 暂时简化处理
    if (targetDeviceString.value) {
        const vendor = deviceIndexOption.find(v => v.label === targetDeviceString.value)
        if (vendor) {
            targetDevice.value = [vendor.value, '']
            await updateAlgo()
        }
    }
}

onMounted(async () => {
    await updateAlgo()
})

const clockOptions = [
    {
        value: 10000000,
        label: '10MHz',
    },
    {
        value: 5000000,
        label: '5MHz',
    },
    {
        value: 1000000,
        label: '1MHz',
    },
    {
        value: 500000,
        label: '500kHz',
    },
    {
        value: 200000,
        label: '200kHz',
    },
    {
        value: 100000,
        label: '100kHz',
    },
    {
        value: 50000,
        label: '50kHz',
    },
    {
        value: 20000,
        label: '20kHz',
    },
    {
        value: 10000,
        label: '10kHz',
    },
    {
        value: 5000,
        label: '5kHz',
    },
]
</script>

<style scoped>
.FlashConfig {
    padding: 16px;
}

.m-4 {
    margin: 16px;
}

.md-4 {
    margin-bottom: 16px;
}

.mt-2 {
    margin-top: 8px;
}

.mb-2 {
    margin-bottom: 8px;
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

.ela-text {
    font-size: 14px;
    color: #333;
    font-weight: 500;
}

.select-container {
    width: 100%;
}

.select-field {
    width: 100%;
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

.radio-group {
    display: flex;
    gap: 24px;
    flex-wrap: wrap;
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

.checkbox-label {
    display: flex;
    align-items: center;
    gap: 8px;
    cursor: pointer;
    font-size: 14px;
    color: #333;
    margin-right: 24px;

    input[type="checkbox"] {
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
</style>
