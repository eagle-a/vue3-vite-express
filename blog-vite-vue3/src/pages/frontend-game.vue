<template>
    <div class="game-container">
        <Navbar>
            <template #brand>
                <span class="brand-logo">湛明博客</span>
            </template>
            <template #menu>
                <router-link to="/" class="nav-link">首页</router-link>
                <router-link to="/about" class="nav-link">关于</router-link>
            </template>
            <template #actions>
                <ThemeToggle />
            </template>
        </Navbar>

        <main class="game-main">
            <div class="game-grid-wrapper">
                <div class="game-grid">
                    <div v-for="(row, ok) in grid" :key="`row-${ok}`" class="grid-row">
                        <div
                            v-for="(cell, ik) in row"
                            :key="`cell-${ik}`"
                            class="grid-cell"
                            :class="{ 
                                'cell-alive': grid[ok][ik],
                                'cell-dead': !grid[ok][ik],
                                'interactive': inputEnabled 
                            }"
                            @mousedown="userInput(ok, ik)"
                        />
                    </div>
                </div>
            </div>

            <div class="game-controls" :class="{ 'controls-hidden': controlsHidden }">
                <GlassPanel class="controls-panel" :blur="20" :opacity="0.9">
                    <div class="controls-header">
                        <h3>Game of Life</h3>
                        <span class="generation-badge">Gen: {{ generation }}</span>
                    </div>
                    
                    <div class="controls-buttons">
                        <BaseButton 
                            :variant="inputEnabled ? 'primary' : 'secondary'" 
                            size="sm"
                            @click="inputEnabled = !inputEnabled"
                        >
                            {{ inputEnabled ? '禁用' : '启用' }}交互
                        </BaseButton>

                        <BaseButton variant="secondary" size="sm" @click="step">
                            单步执行
                        </BaseButton>

                        <BaseButton 
                            :variant="playEnabled ? 'primary' : 'secondary'" 
                            size="sm"
                            @click="togglePlay"
                        >
                            {{ playEnabled ? '暂停' : '播放' }}
                        </BaseButton>
                    </div>
                </GlassPanel>
            </div>

            <div class="game-info">
                <EntityCard :elevation="2" class="info-card">
                    <h2 class="info-title">John Horton Conway's Game of Life</h2>
                    <hr class="info-divider" />
                    <p class="info-description">
                        The Game of Life, also known simply as Life, is a cellular automaton devised by the British mathematician John Horton Conway in 1970. It is a zero-player game, meaning that its evolution is determined by its initial state, requiring no further input. One interacts with the Game of Life by creating an initial configuration and observing how it evolves. It is Turing complete and can simulate a universal constructor or any other Turing machine.
                    </p>
                    <hr class="info-divider" />
                    <p class="info-note">
                        <em>Also, this is my first ever attempt to build a game</em>
                    </p>
                </EntityCard>
            </div>
        </main>

        <BackToTop :visibility-height="100" />
    </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, onUnmounted } from 'vue'
import {
    Navbar,
    ThemeToggle,
    GlassPanel,
    EntityCard,
    BaseButton,
    BackToTop,
} from '@/components'

let cellsX: number = 75
let cellsY: number = 75

const SPEED: number = 25

interface Data {
    controlsHidden: boolean
    inputEnabled: boolean
    playEnabled: boolean
    intervalId: number
    generation: number
    grid: Array<Array<boolean>>
}

const CellState = {
    DEAD: false,
    ALIVE: true,
}

const controlsHidden = ref(false)
const inputEnabled = ref(true)
const playEnabled = ref(false)
const generation = ref(0)
const intervalId = ref(0)
const grid = ref<Array<Array<boolean>>>([])

// 初始化网格
const initGrid = () => {
    cellsX = Math.floor(innerWidth / 16)
    cellsY = Math.floor(innerHeight / 16)
    
    const newGrid: Array<Array<boolean>> = []
    for (let i = 0; i < cellsY; i++) {
        const row = new Array(cellsX).fill(CellState.DEAD)
        for (let j = 0; j < cellsX; j++) {
            if (Math.random() < 0.2) {
                row[j] = !CellState.DEAD
            }
        }
        newGrid.push(row)
    }
    grid.value = newGrid
}

const nullCheck = (y: number | null, x: number | null): boolean | null => {
    return y !== null && x !== null ? grid.value[y][x].valueOf() : null
}

const neighbours = (outerKey: number, innerKey: number): number => {
    const leftX = innerKey - 1 < 0 ? null : innerKey - 1
    const rightX = innerKey + 1 >= grid.value[outerKey].length ? null : innerKey + 1
    const centerX = innerKey
    const centerY = outerKey
    const topY = outerKey - 1 < 0 ? null : outerKey - 1
    const bottomY = outerKey + 1 >= grid.value.length ? null : outerKey + 1

    return [
        nullCheck(topY, leftX),
        nullCheck(topY, centerX),
        nullCheck(topY, rightX),
        nullCheck(centerY, leftX),
        nullCheck(centerY, rightX),
        nullCheck(bottomY, leftX),
        nullCheck(bottomY, centerX),
        nullCheck(bottomY, rightX),
    ].filter(x => x).length
}

const userInput = (ok: number, ik: number): void => {
    if (inputEnabled.value) {
        grid.value = grid.value.map((row, a_ok) => {
            return a_ok === ok ? row.map((cell, a_ik) => {
                return a_ik === ik ? !cell : cell
            }) : row
        })
    }
}

const step = (): void => {
    generation.value++
    grid.value = grid.value.map((row, ok) => {
        return row.map((cell, ik) => {
            if (neighbours(ok, ik) === 3) {
                return CellState.ALIVE
            }
            if (neighbours(ok, ik) <= 1) {
                return CellState.DEAD
            }
            if (neighbours(ok, ik) >= 4) {
                return CellState.DEAD
            }
            return cell
        })
    })
}

const togglePlay = (): void => {
    if (playEnabled.value) {
        clearInterval(intervalId.value)
    }
    else {
        intervalId.value = setInterval(step, SPEED)
    }
    playEnabled.value = !playEnabled.value
}

const toggleIcon = (): void => {
    controlsHidden.value = window.pageYOffset > 150
}

onMounted(() => {
    initGrid()
    window.addEventListener('scroll', toggleIcon)
})

onUnmounted(() => {
    window.removeEventListener('scroll', toggleIcon)
    if (intervalId.value) {
        clearInterval(intervalId.value)
    }
})

const headTitle = ref('Game of Life - 湛明')
useHead({
    title: headTitle,
    meta: [
        {
            name: 'description',
            content: 'John Horton Conway\'s Game of Life',
        },
    ],
})
</script>

<style scoped>
.game-container {
    min-height: 100vh;
    background: var(--color-background);
}

.game-main {
    padding-top: 60px;
}

.game-grid-wrapper {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: -1;
    background: linear-gradient(135deg, #e0e0e0 0%, #f5f5f5 100%);
}

[data-theme='dark'] .game-grid-wrapper {
    background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
}

.game-grid {
    display: flex;
    flex-direction: column;
    gap: 1px;
}

.grid-row {
    display: flex;
    gap: 1px;
}

.grid-cell {
    width: 14px;
    height: 14px;
    transition: all 0.15s ease;
}

.cell-alive {
    background: var(--color-primary-light);
    box-shadow: inset 0 0 4px rgba(168, 168, 168, 0.5);
}

.cell-dead {
    background: rgba(255, 255, 255, 0.3);
}

[data-theme='dark'] .cell-dead {
    background: rgba(0, 0, 0, 0.3);
}

.grid-cell.interactive {
    cursor: pointer;
}

.grid-cell.interactive:hover {
    transform: scale(1.2);
}

.game-controls {
    position: fixed;
    bottom: 24px;
    right: 24px;
    opacity: 0.5;
    transition: all 0.3s ease;
    z-index: 100;
}

.game-controls:hover {
    opacity: 1;
}

.game-controls.controls-hidden {
    opacity: 0;
    pointer-events: none;
}

.controls-panel {
    padding: 20px;
    min-width: 200px;
}

.controls-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;
}

.controls-header h3 {
    font-size: 16px;
    font-weight: 600;
    color: var(--color-text-primary);
    margin: 0;
}

.generation-badge {
    padding: 4px 12px;
    background: var(--color-primary);
    color: #000000;
    border-radius: 12px;
    font-size: 12px;
    font-weight: 600;
}

.controls-buttons {
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.game-info {
    position: relative;
    z-index: 10;
    margin-top: 100vh;
    padding: 40px 24px;
}

.info-card {
    padding: 32px;
}

.info-title {
    font-size: 28px;
    font-weight: 700;
    color: var(--color-text-primary);
    margin: 0 0 16px 0;
    text-align: center;
}

.info-divider {
    border: none;
    border-top: 1px solid var(--color-surface-variant);
    margin: 16px 0;
}

.info-description {
    font-size: 15px;
    line-height: 1.6;
    color: var(--color-text-secondary);
    margin: 0;
}

.info-note {
    font-size: 13px;
    color: var(--color-text-hint);
    margin: 0;
    font-style: italic;
}

@media (max-width: 768px) {
    .game-controls {
        bottom: 16px;
        right: 16px;
    }

    .controls-panel {
        min-width: 160px;
    }

    .info-title {
        font-size: 22px;
    }
}
</style>