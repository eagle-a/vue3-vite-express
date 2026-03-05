# Elaphure DAP 工具页面构建指南

## 概述

Elaphure DAP 是一个在线固件烧录工具，支持通过 WebUSB 或 WebSocket 连接 DAP 设备进行固件烧录。

## 文件结构

```
src/
├── pages/tools/tool-elaphure.vue    # 主页面
├── components/elaphure/
│   ├── DeviceConnect.vue            # 设备连接组件
│   ├── FirmwareUpload.vue           # 固件上传组件
│   ├── FlashConfig.vue              # 烧录配置组件
│   ├── i18n.ts                      # 国际化配置
│   └── dap/
│       ├── config.ts                # 配置和类型定义
│       ├── download.ts              # 烧录核心逻辑
│       ├── log.ts                   # 日志管理
│       ├── preprocess.ts            # 固件预处理
│       └── verify/
│           └── crc.bin              # CRC 校验数据
└── shims.d.ts                       # 类型声明
```

## 核心依赖

```json
{
  "@elaphurelink/dapjs": "^0.1.0",
  "vue": "^3.4.0",
  "element-plus": "^2.7.0"
}
```

## 关键配置

### 1. Vite 别名配置

在 `vite.config.ts` 中添加别名：

```typescript
resolve: {
  alias: {
    '@': path.join(__dirname, './src'),
    '~': path.join(__dirname, './src'),
    '@device': path.join(__dirname, './public/device'),
  },
}
```

### 2. 类型声明

在 `src/shims.d.ts` 中添加 `.bin?uint8array` 导入类型：

```typescript
declare module '*?uint8array' {
    const value: Uint8Array
    export default value
}

declare module '*.bin?uint8array' {
    const value: Uint8Array
    export default value
}
```

## 组件说明

### DeviceConnect.vue

支持两种连接方式：
- **USB 连接**: 使用 WebUSB API，需要 HTTPS 环境
- **远程连接**: 通过 WebSocket 连接远程 DAP 服务器

关键功能：
- 检测浏览器安全上下文 (HTTPS/localhost)
- 设备连接/断开
- 连接状态管理

### FirmwareUpload.vue

固件文件上传组件：
- 支持拖拽上传
- 显示文件名和大小
- 烧录进度显示

### FlashConfig.vue

烧录配置面板：
- 芯片选择 (从 deviceIndex.json 加载)
- 时钟频率设置
- 擦除选项: 全片擦除/部分擦除/不擦除
- 编程/校验/复位选项
- 加载算法 JSON 和 BIN 文件

## 烧录流程

### download.ts 核心函数

```typescript
export async function onDownload() {
  // 1. 检查配置
  if (!algoBin || !algoInfo || !mem) {
    logErr('请先选择目标设备')
    return -1
  }

  // 2. 预处理固件
  const firmware = await firmwarePreprocess(firmwareFile.value)
  if (!firmware) {
    logErr('请先上传固件文件')
    return -1
  }

  // 3. 检查设备连接
  const dap = toRaw(dapContext.value)
  if (!dap) {
    logErr('请先连接设备')
    return -1
  }

  // 4. 执行烧录
  try {
    ret = await flash(algoInfo, algoBin, mem, firmware, option, dap)
  } catch (error) {
    logErr(error.message)
    ret = -1
  }

  return ret
}
```

### 烧录步骤

1. **初始化**: 加载 Flash 算法到目标设备 RAM
2. **擦除**: 根据配置执行全片/部分/不擦除
3. **编程**: 将固件写入 Flash
4. **校验**: 读取并比对写入内容
5. **复位**: 重启目标设备

## 配置类型定义

```typescript
// config.ts
export enum EraseType {
  ERASE_ALL = 0,      // 全片擦除
  ERASE_SECTOR = 1,   // 扇区擦除
  ERASE_NONE = 2,     // 不擦除
}

export interface DapDownloadOption {
  eraseType: EraseType
  program: boolean     // 是否编程
  verify: boolean      // 是否校验
  reset: boolean       // 是否复位
  clock: number        // 时钟频率 (kHz)
}
```

## 日志系统

```typescript
// log.ts
export const dapLogText = ref<string>('')
export const dapProgress = ref<number>(0)

export function log(msg: string)       // 普通日志
export function logSuccess(msg: string) // 成功日志 (绿色)
export function logWarn(msg: string)    // 警告日志 (黄色)
export function logErr(msg: string)     // 错误日志 (红色)
export function updateProgress(pct: number) // 更新进度 0-100
```

## 设备支持

设备信息从 `public/device/deviceIndex.json` 加载，包含：
- 芯片名称
- Flash 算法信息
- 内存映射
- 时钟配置

## 注意事项

1. **HTTPS 要求**: WebUSB 需要 Secure Context (HTTPS 或 localhost)
2. **浏览器支持**: 需要 Chrome/Edge 等支持 WebUSB 的浏览器
3. **固件大小**: 烧录前检查固件是否超出设备容量
4. **CRC 文件**: `dap/verify/crc.bin` 必须存在，用于数据校验

## 调试

在浏览器控制台查看：
- 连接状态: `isDeviceConnect.value`
- 设备上下文: `dapContext.value`
- 烧录日志: `dapLogText.value`
- 烧录进度: `dapProgress.value`

## 常见问题

### 1. crc.bin 404 错误

确保文件存在:
```
src/components/elaphure/dap/verify/crc.bin
```

### 2. onDownload 导出错误

检查 `download.ts` 文件末尾是否正确导出:
```typescript
export async function onDownload() { ... }
```

### 3. USB 连接失败

- 确认使用 HTTPS 或 localhost
- 检查浏览器是否支持 WebUSB
- 确认设备驱动已正确安装