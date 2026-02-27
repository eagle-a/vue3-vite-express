<template>
    <div class="h-screen w-screen grid fixed top-0 below place-content-center text-center bg-green-400 dark:bg-gray-900 dark:text-gray-100">
        <div class="flex flex-col gap-0.5">
            <div v-for="(row, ok) in grid" :key="`row-${ok}`" class="flex gap-0.5">
                <div
                    v-for="(cell, ik) in row"
                    :key="`cell-${ik}`"
                    class="w-3.5 h-3.5" :class="[{ 'cursor-pointer': inputEnabled }, grid[ok][ik] ? `bg-blue-100 dark:bg-blue-400` : `bg-green-500 dark:bg-gray-700`]"
                    @mousedown="userInput(ok, ik)"
                />
            </div>
        </div>
    </div>

    <div class="fixed bottom-3 right-3 flex flex-col gap-1 opacity-50 hover:opacity-95 transition-all" :class="{ 'opacity-0': controlsHidden }">
        <button class="px-10 py-5 text-xs bg-blue-600 dark:bg-gray-600 text-white" @click="inputEnabled = !inputEnabled">{{ inputEnabled ? `Disable` : `Enable` }} Interaction</button>

        <button class="px-10 py-5 text-xs bg-blue-600 dark:bg-gray-600 text-white" @click="step">Step/Gen: {{ generation }}</button>

        <button class="px-10 py-5 text-xs bg-blue-600 dark:bg-gray-600 text-white" @click="togglePlay">
            {{ playEnabled ? `Pause` : `Play` }}
        </button>
    </div>

    <!-- Content starts here -->

    <div class="p-5 pt-4 mt-screen text-green-500 dark:text-gray-700 bg-white bg-opacity-75 rounded-t-2xl">
        <div class="w-full flex justify-center pb-4">
            <div class="h-1 w-16 rounded bg-green-500 dark:bg-gray-700" />
        </div>

        <div class="text-5xl font-retro">
            John Horton Conway's <br>
            Game of Life
        </div>

        <hr class="my-2">

        <div class="text-sm">
            The Game of Life, also known simply as Life, is a cellular automaton devised by the British mathematician John Horton Conway in 1970. It is a zero-player game, meaning that its evolution
            is determined by its initial state, requiring no further input. One interacts with the Game of Life by creating an initial configuration and observing how it evolves. It is Turing complete
            and can simulate a universal constructor or any other Turing machine.
        </div>

        <hr class="my-2">

        <em class="text-xs">Also, this is my first ever attempt to build a game</em>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

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

export default defineComponent({
    name: 'GoLife',

    data(): Data {
        const grid: Array<Array<boolean>> = []
        for (let i = 0; i < cellsY; i++) {
            const row = new Array(cellsX).fill(CellState.DEAD) // 初始化整行为死亡状态
            for (let j = 0; j < cellsX; j++) {
                // 以一定的概率（比如20%）将单元格设置为活状态
                if (Math.random() < 0.2) {
                    row[j] = !CellState.DEAD // 假设CellState.DEAD是false，则!false为true
                }
            }
            grid.push(row)
        }
        return { controlsHidden: false, inputEnabled: true, playEnabled: false, intervalId: 0, generation: 0, grid }
    },

    beforeCreate(): void {
        // 10 for 2.5 / 16 for 3.5 will make it touch edges without overflow
        cellsX = Math.floor(innerWidth / 16)
        cellsY = Math.floor(innerHeight / 16)
    },

    mounted(): void {
        window.addEventListener('scroll', this.toggleIcon)
    },

    beforeUnmount(): void {
        window.removeEventListener('scroll', this.toggleIcon)
    },

    methods: {
        nullCheck(y: number | null, x: number | null): boolean | null {
            return y !== null && x !== null ? this.grid[y][x].valueOf() : null
        },

        neighbours(outerKey: number, innerKey: number): number {
            const leftX = innerKey - 1 < 0 ? null : innerKey - 1
            const rightX = innerKey + 1 >= this.grid[outerKey].length ? null : innerKey + 1
            const centerX = innerKey
            const centerY = outerKey
            const topY = outerKey - 1 < 0 ? null : outerKey - 1
            const bottomY = outerKey + 1 >= this.grid.length ? null : outerKey + 1

            return [
                this.nullCheck(topY, leftX),
                this.nullCheck(topY, centerX),
                this.nullCheck(topY, rightX),
                this.nullCheck(centerY, leftX),
                // this.nullCheck(centerY, centerX),
                this.nullCheck(centerY, rightX),
                this.nullCheck(bottomY, leftX),
                this.nullCheck(bottomY, centerX),
                this.nullCheck(bottomY, rightX),
            ].filter(x => x).length
        },

        userInput(ok: number, ik: number): void {
            if (this.inputEnabled) {
                this.grid = this.grid.map((row, a_ok) => {
                    return a_ok === ok ? row.map((cell, a_ik) => {
                        return a_ik === ik ? !cell : cell
						  }) : row
                })
            }
        },

        step(): void {
            this.generation++
            this.grid = this.grid.map((row, ok) => {
                return row.map((cell, ik) => {
                    if (this.neighbours(ok, ik) === 3) {
                        // Birth
                        return CellState.ALIVE
                    }
                    if (this.neighbours(ok, ik) <= 1) {
                        // Death by isolation
                        return CellState.DEAD
                    }
                    if (this.neighbours(ok, ik) >= 4) {
                        // Death by overcrowding
                        return CellState.DEAD
                    }
                    return cell
                })
            })
        },

        togglePlay(): void {
            if (this.playEnabled) {
                clearInterval(this.intervalId)
            }
            else {
                this.intervalId = setInterval(this.step, SPEED)
            }

            this.playEnabled = !this.playEnabled
        },

        toggleIcon(): void {
            this.controlsHidden = window.pageYOffset > 150
        },
    },
})
const headTitle = ref('game')
useHead({
    // Can be static or computed
    title: headTitle,
    meta: [
        {
            name: 'description',
            content: headTitle,
        },
    ],
})
</script>

<style lang="scss">
.below {
    z-index: -1;
}
</style>
