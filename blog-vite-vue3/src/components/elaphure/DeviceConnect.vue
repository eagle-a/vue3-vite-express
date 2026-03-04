<template>
  <div class="DeviceConnect">
    <div class="mb-2 flex items-center text-sm">
      <el-radio-group v-model="isRemoteDAP" class="ml-4">
        <el-radio :value="true" size="large">远程 DAP</el-radio>
        <el-radio :value="false" size="large">USB</el-radio>
      </el-radio-group>
    </div>
    <div class="mb-2 flex ml-4">
      <el-input v-if="isRemoteDAP" v-model="dapURI" style="width: 240px" placeholder="dap.local" />
    </div>
    <div class="mb-2 flex ml-4 mt-4">
      <el-button type="primary" :disabled="isDeviceConnect" @click="onDAPConnect">
        {{ isDeviceConnect ? '已连接' : isRemoteDAP ? '连接' : '选择设备' }}
      </el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useStorage } from '@vueuse/core'
import { isDeviceConnect, dapContext, downloadOption } from './dap/config'
import { log, logErr, logSuccess, logWarn } from './dap/log'
import * as dapjs from '@elaphurelink/dapjs'
import { isHttps, isLocalNetwork, redirectToHttp, redirectToHttps } from './composables/site'

const isRemoteDAP = useStorage('remote-dap', false)
const dapURI = useStorage('dap-uri', 'dap.local')

const onDAPConnect = async () => {
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
        filters: [{ vendorId: 0xD28 }]
      })

      transport = new dapjs.WebUSB(device)
    } else {
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
  } catch (err) {
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
  } catch (err) {
    logErr(String(err))
  }
}

</script>