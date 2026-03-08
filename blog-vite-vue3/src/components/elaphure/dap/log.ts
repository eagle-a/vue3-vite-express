import { ref } from 'vue'
import { ElMessage } from 'element-plus'

export const dapLogText = ref<string>('')
export const dapProgress = ref<number>(0)

export type logFunc = (text: string) => void

export function log(text: string) {
  dapLogText.value += `${text}\n`
}

export function logSuccess(text: string) {
  log(text)
  ElMessage({
    message: text,
    type: 'success',
    duration: 1500
  })
}

export function logWarn(text: string) {
  log(text)
  ElMessage({
    message: text,
    type: 'warning',
    duration: 1500
  })
}

export function logErr(text: string) {
  log(text)
  ElMessage({
    message: text,
    type: 'error',
    duration: 1500
  })
}

export function clearLog() {
  dapLogText.value = ''
}

export function updateProgress(num: number) {
  dapProgress.value = num | 0 // Convert to int
}

export class dapLog {
  public static startErase() {
    log('开始擦除...')
  }

  public static failErase() {
    log('擦除失败！')
  }

  public static startProgram() {
    log('开始编程...')
  }

  public static failProgram() {
    log('编程失败！')
  }

  public static startVerify() {
    log('开始校验...')
  }

  public static failVerify() {
    log('校验失败！')
  }

  public static failLoadFile() {
    log('加载文件失败！')
  }

  public static elfDetected() {
    log('检测到 ELF 文件，正在转换...')
  }

  public static failConvert() {
    log('ELF 转换失败！')
  }

  public static successConvert() {
    log('文件转换成功！')
  }

  public static ihexDetected() {
    log('检测到 Intel Hex 文件，正在转换...')
  }

  public static ihexFailConvert() {
    log('Intel Hex 转换失败！')
  }

  public static convertFileSizeInfo(size: number) {
    let sizeStr = ''
    if (size < 1024) {
      sizeStr = `${size} byte`
    } else {
      sizeStr = `${Math.floor(size / 1024)} KB`
    }
    log(`文件大小: ${sizeStr}`)
  }
}
