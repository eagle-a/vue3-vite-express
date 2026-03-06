<template>
    <div class="FirmwareUpload">
        <div
            class="upload-dragger"
            @drop="handleDrop"
            @dragover.prevent
            @click="triggerFileInput"
        >
            <input
                ref="fileInput"
                type="file"
                class="file-input"
                @change="handleFileChange"
            >
            <div class="upload-input">
                <div class="icon-transition">
                    <Transition
                        :duration="400" mode="out-in" leave-active-class="animate__animated animate__flipOutX"
                        enter-active-class="animate__animated animate__flipInX"
                    >
                        <div v-if="!isStart" key="1">
                            <div class="upload-icon">📁</div>
                        </div>
                        <div v-else key="2">
                            <div class="progress-circle">
                                <div class="progress-content">
                                    <span class="progress-text">{{ dapProgress }}%</span>
                                </div>
                            </div>
                        </div>
                    </Transition>
                </div>
                <div class="upload-text">
                    <div v-if="!uploadFile">
                        拖拽文件到此处或 <em>点击上传</em>
                    </div>
                    <div v-else>
                        {{ fileInfoShow }}
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { firmwareFile, isStart } from './dap/config'
import { dapProgress } from './dap/log'

const fileInput = ref<HTMLInputElement>()
const uploadFile = ref<File>()

const fileInfoShow = computed(() => {
    const name = uploadFile.value?.name
    if (name === undefined) {
        return ''
    }

    const size = uploadFile.value?.size
    let sizeStr = ''

    if (size !== undefined) {
        if (size < 1024) {
            sizeStr = `${size} byte`
        }
        else {
            sizeStr = `${Math.floor(size / 1024)} KB`
        }
    }

    return `${name} | ${sizeStr}`
})

function triggerFileInput() {
    fileInput.value?.click()
}

function handleFileChange(event: Event) {
    const target = event.target as HTMLInputElement
    if (target.files && target.files[0]) {
        const file = target.files[0]
        uploadFile.value = file
        firmwareFile.value = file
    }
}

function handleDrop(event: DragEvent) {
    event.preventDefault()
    if (event.dataTransfer && event.dataTransfer.files[0]) {
        const file = event.dataTransfer.files[0]
        uploadFile.value = file
        firmwareFile.value = file
    }
}
</script>

<style>
.FirmwareUpload {
    width: 100%;
}

.upload-dragger {
    border: 2px dashed #d9d9d9;
    border-radius: 8px;
    padding: 30px;
    text-align: center;
    cursor: pointer;
    transition: all 0.3s;
}

.upload-dragger:hover {
    border-color: #409eff;
}

.file-input {
    display: none;
}

.icon-transition {
    display: flex;
    height: 80px;
    justify-content: center;
    align-items: center;
    margin-bottom: 1rem;
}

.upload-icon {
    font-size: 48px;
    color: #909399;
}

.progress-circle {
    width: 100px;
    height: 100px;
    border-radius: 50%;
    border: 4px solid #e6e6e6;
    border-top-color: #409eff;
    display: flex;
    justify-content: center;
    align-items: center;
    animation: spin 1s linear infinite;
}

@keyframes spin {
    to {
        transform: rotate(360deg);
    }
}

.progress-content {
    display: flex;
    flex-direction: column;
    align-items: center;
}

.progress-text {
    font-size: 16px;
    font-weight: bold;
    color: #409eff;
}

.upload-text {
    color: #909399;
}

.upload-text em {
    color: #409eff;
    cursor: pointer;
}
</style>
