import { ref, shallowRef } from 'vue'
import { useStorage } from '@vueuse/core'
import type * as dapjs from '@elaphurelink/dapjs'

export enum EraseType {
    None = 'none',
    Part = 'part',
    Full = 'full',
}

export interface DapDownloadOption {
    clock: number
    erase: EraseType
    program: boolean
    verify: boolean
    resetAfterDownload: boolean
}

export const downloadOption = useStorage<DapDownloadOption>('download-option', {
    clock: 10000000,
    erase: EraseType.Full,
    program: true,
    verify: true,
    resetAfterDownload: true,
})
export const firmwareFile = ref<File>()
export const algorithmBin = ref<Uint8Array>()
export const algorithmInfo = ref<AlgorithmJson>()
export const memInfo = ref<DeviceMemInfo>()

export const isDeviceConnect = ref<boolean>(false)
export const isStart = ref<boolean>(false)
export const dapContext = shallowRef<dapjs.CortexM>()

export interface Sector {
    szSector: number
    AddrSector: number
}

export interface DeviceDescription {
    Vers: number
    DevName: string
    DevType: number
    DevAdr: number
    szDev: number
    szPage: number
    Res: number
    valEmpty: number
    toProg: number
    toErase: number
    sectors: Sector[]
}

export interface AlgorithmJson {
    initAddr: number
    unInitAddr: number
    eraseChipAddr: number | null // optional
    eraseSectorAddr: number
    programPageAddr: number
    staticBase: number
    descAddr: number
    descSize: number
    devDesc: DeviceDescription
}

export interface DeviceAlgorithm {
    default: string
    name: string
    start: string
    size: string
}

export interface DeviceMem {
    start: string
    size: string
}

export interface DeviceListInfo {
    value: string
    label: string
    algorithm: DeviceAlgorithm[]
    ram: DeviceMem
    rom: DeviceMem
}

export interface DeviceMemInfo {
    ram: DeviceMem
    rom: DeviceMem
}
