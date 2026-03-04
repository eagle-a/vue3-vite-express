<template>
    <div class="matrix-tool">
        <!-- 标题卡片 -->
        <div class="tool-header glass">
            <div class="header-icon">
                <i class="icon icon-matrix" />
            </div>
            <div class="header-content">
                <h2>三阶矩阵求逆</h2>
                <p>输入 3×3 矩阵，自动计算逆矩阵和行列式</p>
            </div>
        </div>

        <!-- 输入区域 -->
        <div class="input-section glass">
            <h3 class="section-title">
                <i class="icon icon-input" />
                输入矩阵
            </h3>
            <div class="matrix-grid">
                <div v-for="(row, i) in 3" :key="i" class="matrix-row">
                    <div v-for="(col, j) in 3" :key="j" class="matrix-cell">
                        <input
                            v-model="matrix[i][j]"
                            type="number"
                            step="any"
                            :placeholder="`a${i + 1}${j + 1}`"
                            class="matrix-input"
                        />
                    </div>
                </div>
            </div>
            <div class="button-group">
                <button class="btn btn-primary" @click="calculate">
                    <i class="icon icon-calculator" />
                    计算逆矩阵
                </button>
                <button class="btn btn-secondary" @click="clear">
                    <i class="icon icon-clear" />
                    清空
                </button>
                <button class="btn btn-secondary" @click="fillExample">
                    <i class="icon icon-example" />
                    示例
                </button>
            </div>
        </div>

        <!-- 结果区域 -->
        <div v-if="result" class="result-section glass">
            <h3 class="section-title">
                <i class="icon icon-output" />
                计算结果
            </h3>
            
            <!-- 行列式 -->
            <div class="result-item">
                <span class="result-label">行列式 (det):</span>
                <span class="result-value">{{ formatNumber(result.determinant) }}</span>
            </div>

            <!-- 逆矩阵 -->
            <div v-if="result.inverse" class="result-matrix">
                <h4>逆矩阵:</h4>
                <div class="matrix-display">
                    <div v-for="(row, i) in result.inverse" :key="i" class="matrix-row">
                        <div v-for="(val, j) in row" :key="j" class="matrix-cell">
                            <span class="cell-value">{{ formatNumber(val) }}</span>
                        </div>
                    </div>
                </div>
            </div>

            <!-- 提示信息 -->
            <div v-if="result.singular" class="alert alert-warning">
                <i class="icon icon-warning" />
                该矩阵是奇异矩阵（行列式为0），不存在逆矩阵
            </div>
        </div>

        <!-- 计算步骤 -->
        <div v-if="steps.length > 0" class="steps-section glass">
            <h3 class="section-title">
                <i class="icon icon-steps" />
                计算步骤
            </h3>
            <div class="steps-list">
                <div v-for="(step, index) in steps" :key="index" class="step-item">
                    <div class="step-number">{{ index + 1 }}</div>
                    <div class="step-content">{{ step }}</div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

useHead({
    title: '三阶矩阵求逆计算器',
    meta: [
        { name: 'description', content: '在线三阶矩阵求逆计算器，支持分数和整数运算，实时显示计算步骤' },
    ],
})

const matrix = ref([
    ['', '', ''],
    ['', '', ''],
    ['', '', ''],
])

const result = ref<{
    determinant: number | null
    inverse: number[][] | null
    singular: boolean
} | null>(null)

const steps = ref<string[]>([])

function parseMatrix(): number[][] | null {
    const m: number[][] = []
    for (let i = 0; i < 3; i++) {
        const row: number[] = []
        for (let j = 0; j < 3; j++) {
            const val = parseFloat(matrix.value[i][j])
            if (isNaN(val)) {
                alert('请填写完整的矩阵数据')
                return null
            }
            row.push(val)
        }
        m.push(row)
    }
    return m
}

function calculateDeterminant(m: number[][]): number {
    return (
        m[0][0] * (m[1][1] * m[2][2] - m[1][2] * m[2][1]) -
        m[0][1] * (m[1][0] * m[2][2] - m[1][2] * m[2][0]) +
        m[0][2] * (m[1][0] * m[2][1] - m[1][1] * m[2][0])
    )
}

function calculateInverse(m: number[][], det: number): number[][] {
    const inv: number[][] = [[0, 0, 0], [0, 0, 0], [0, 0, 0]]
    
    // 伴随矩阵 / 行列式
    inv[0][0] = (m[1][1] * m[2][2] - m[1][2] * m[2][1]) / det
    inv[0][1] = (m[0][2] * m[2][1] - m[0][1] * m[2][2]) / det
    inv[0][2] = (m[0][1] * m[1][2] - m[0][2] * m[1][1]) / det
    inv[1][0] = (m[1][2] * m[2][0] - m[1][0] * m[2][2]) / det
    inv[1][1] = (m[0][0] * m[2][2] - m[0][2] * m[2][0]) / det
    inv[1][2] = (m[0][2] * m[1][0] - m[0][0] * m[1][2]) / det
    inv[2][0] = (m[1][0] * m[2][1] - m[1][1] * m[2][0]) / det
    inv[2][1] = (m[0][1] * m[2][0] - m[0][0] * m[2][1]) / det
    inv[2][2] = (m[0][0] * m[1][1] - m[0][1] * m[1][0]) / det
    
    return inv
}

function calculate() {
    const m = parseMatrix()
    if (!m) return

    steps.value = []
    steps.value.push('Step 1: 计算行列式')
    
    const det = calculateDeterminant(m)
    steps.value.push(`det(A) = ${formatNumber(det)}`)

    if (Math.abs(det) < 1e-10) {
        result.value = {
            determinant: det,
            inverse: null,
            singular: true,
        }
        steps.value.push('行列式为0，矩阵是奇异矩阵，不存在逆矩阵')
        return
    }

    steps.value.push('Step 2: 计算伴随矩阵')
    steps.value.push('Step 3: 逆矩阵 = 伴随矩阵 / 行列式')

    const inv = calculateInverse(m, det)
    result.value = {
        determinant: det,
        inverse: inv,
        singular: false,
    }
}

function clear() {
    matrix.value = [['', '', ''], ['', '', ''], ['', '', '']]
    result.value = null
    steps.value = []
}

function fillExample() {
    matrix.value = [
        ['4', '7', '2'],
        ['3', '9', '5'],
        ['8', '1', '6'],
    ]
}

function formatNumber(n: number): string {
    if (n === null || n === undefined) return ''
    const rounded = Math.round(n * 10000) / 10000
    return rounded.toString()
}
</script>

<style scoped lang="scss">
$primary: #6750A4;
$secondary: #625B71;
$surface: #FFFBFE;
$on-surface: #1C1B1F;
$outline: #79747E;
$error: #B3261E;

@mixin glass-effect {
    background: rgba(255, 255, 255, 0.85);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    border: 1px solid rgba(255, 255, 255, 0.6);
}

.matrix-tool {
    animation: fadeIn 0.4s ease;
}

@keyframes fadeIn {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
}

// 头部
.tool-header {
    @include glass-effect;
    border-radius: 20px;
    padding: 24px;
    display: flex;
    align-items: center;
    gap: 20px;
    margin-bottom: 24px;
    box-shadow: 0 4px 20px rgba(103, 80, 164, 0.08);
}

.header-icon {
    width: 64px;
    height: 64px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border-radius: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 32px;
    color: white;
    flex-shrink: 0;
}

.header-content {
    h2 {
        font-size: 22px;
        font-weight: 600;
        color: $on-surface;
        margin: 0 0 6px;
    }

    p {
        font-size: 14px;
        color: $outline;
        margin: 0;
    }
}

// 区块标题
.section-title {
    font-size: 16px;
    font-weight: 500;
    color: $on-surface;
    margin: 0 0 20px;
    display: flex;
    align-items: center;
    gap: 10px;

    i {
        font-size: 20px;
        color: $primary;
    }
}

// 输入区域
.input-section {
    @include glass-effect;
    border-radius: 20px;
    padding: 24px;
    margin-bottom: 20px;
}

.matrix-grid {
    display: flex;
    flex-direction: column;
    gap: 12px;
    align-items: center;
    margin-bottom: 24px;
}

.matrix-row {
    display: flex;
    gap: 12px;
}

.matrix-cell {
    width: 80px;
    height: 56px;
}

.matrix-input {
    width: 100%;
    height: 100%;
    border: 2px solid rgba($outline, 0.2);
    border-radius: 12px;
    text-align: center;
    font-size: 18px;
    font-weight: 500;
    color: $on-surface;
    background: rgba(255, 255, 255, 0.5);
    transition: all 0.2s ease;

    &:focus {
        outline: none;
        border-color: $primary;
        background: white;
        box-shadow: 0 0 0 4px rgba($primary, 0.1);
    }

    &::placeholder {
        color: rgba($outline, 0.5);
    }
}

.button-group {
    display: flex;
    gap: 12px;
    justify-content: center;
    flex-wrap: wrap;
}

.btn {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 12px 24px;
    border-radius: 12px;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    border: none;
    transition: all 0.3s ease;

    i {
        font-size: 18px;
    }

    &:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    }

    &:active {
        transform: translateY(0);
    }
}

.btn-primary {
    background: $primary;
    color: white;
}

.btn-secondary {
    background: rgba($outline, 0.1);
    color: $on-surface;

    &:hover {
        background: rgba($outline, 0.2);
    }
}

// 结果区域
.result-section {
    @include glass-effect;
    border-radius: 20px;
    padding: 24px;
    margin-bottom: 20px;
}

.result-item {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 16px;
    background: rgba($primary, 0.08);
    border-radius: 12px;
    margin-bottom: 20px;
}

.result-label {
    font-size: 14px;
    color: $outline;
    font-weight: 500;
}

.result-value {
    font-size: 18px;
    font-weight: 600;
    color: $primary;
    font-family: 'Courier New', monospace;
}

.result-matrix {
    h4 {
        font-size: 14px;
        color: $outline;
        margin: 0 0 16px;
    }
}

.matrix-display {
    display: flex;
    flex-direction: column;
    gap: 10px;
    align-items: center;
    padding: 20px;
    background: rgba($primary, 0.05);
    border-radius: 12px;

    .matrix-cell {
        width: 100px;
        height: 48px;
        display: flex;
        align-items: center;
        justify-content: center;
        background: white;
        border-radius: 8px;
        border: 1px solid rgba($outline, 0.1);
    }

    .cell-value {
        font-size: 16px;
        font-weight: 500;
        color: $on-surface;
        font-family: 'Courier New', monospace;
    }
}

// 警告提示
.alert {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 16px;
    border-radius: 12px;
    margin-top: 16px;
    font-size: 14px;

    i {
        font-size: 20px;
    }
}

.alert-warning {
    background: rgba($error, 0.1);
    color: $error;
}

// 步骤区域
.steps-section {
    @include glass-effect;
    border-radius: 20px;
    padding: 24px;
}

.steps-list {
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.step-item {
    display: flex;
    align-items: flex-start;
    gap: 16px;
    padding: 16px;
    background: rgba($primary, 0.05);
    border-radius: 12px;
}

.step-number {
    width: 28px;
    height: 28px;
    background: $primary;
    color: white;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 13px;
    font-weight: 600;
    flex-shrink: 0;
}

.step-content {
    font-size: 14px;
    color: $on-surface;
    line-height: 1.6;
    padding-top: 4px;
}

// 响应式
@media (max-width: 640px) {
    .tool-header {
        flex-direction: column;
        text-align: center;
    }

    .matrix-cell {
        width: 64px;
        height: 48px;
    }

    .matrix-input {
        font-size: 16px;
    }

    .button-group {
        flex-direction: column;
    }

    .btn {
        width: 100%;
        justify-content: center;
    }

    .matrix-display .matrix-cell {
        width: 80px;
    }
}
</style>
