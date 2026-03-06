<template>
    <div class="wordcount-tool">
        <!-- 标题卡片 -->
        <div class="tool-header glass">
            <div class="header-icon">
                <i class="icon icon-text" />
            </div>
            <div class="header-content">
                <h2>字数统计工具</h2>
                <p>智能统计文本字数、字符数、段落数，支持中英文混合统计</p>
            </div>
        </div>

        <!-- 输入区域 -->
        <div class="input-section glass">
            <div class="section-header">
                <h3 class="section-title">
                    <i class="icon icon-input" />
                    输入文本
                </h3>
                <div class="toolbar">
                    <button class="btn btn-icon" title="粘贴" @click="pasteText">
                        <i class="icon icon-paste" />
                    </button>
                    <button class="btn btn-icon" title="清空" @click="clearText">
                        <i class="icon icon-clear" />
                    </button>
                    <button class="btn btn-icon" title="复制" @click="copyText">
                        <i class="icon icon-copy" />
                    </button>
                </div>
            </div>
            <textarea
                v-model="text"
                class="text-input"
                placeholder="在此输入或粘贴文本..."
                @input="updateStats"
            />
            <div class="input-footer">
                <span class="char-count">{{ text.length }} 字符</span>
            </div>
        </div>

        <!-- 统计结果 -->
        <div class="stats-section glass">
            <h3 class="section-title">
                <i class="icon icon-chart" />
                统计结果
            </h3>
            <div class="stats-grid">
                <div class="stat-card">
                    <div class="stat-icon total">
                        <i class="icon icon-abc" />
                    </div>
                    <div class="stat-content">
                        <span class="stat-value">{{ stats.totalChars }}</span>
                        <span class="stat-label">总字符数</span>
                    </div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon chinese">
                        <i class="icon icon-chinese" />
                    </div>
                    <div class="stat-content">
                        <span class="stat-value">{{ stats.chineseChars }}</span>
                        <span class="stat-label">中文字符</span>
                    </div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon english">
                        <i class="icon icon-english" />
                    </div>
                    <div class="stat-content">
                        <span class="stat-value">{{ stats.englishWords }}</span>
                        <span class="stat-label">英文单词</span>
                    </div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon number">
                        <i class="icon icon-number" />
                    </div>
                    <div class="stat-content">
                        <span class="stat-value">{{ stats.numbers }}</span>
                        <span class="stat-label">数字个数</span>
                    </div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon space">
                        <i class="icon icon-space" />
                    </div>
                    <div class="stat-content">
                        <span class="stat-value">{{ stats.spaces }}</span>
                        <span class="stat-label">空格/换行</span>
                    </div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon paragraph">
                        <i class="icon icon-paragraph" />
                    </div>
                    <div class="stat-content">
                        <span class="stat-value">{{ stats.paragraphs }}</span>
                        <span class="stat-label">段落数</span>
                    </div>
                </div>
            </div>

            <!-- 详细分析 -->
            <div class="detail-stats">
                <div class="detail-item">
                    <span class="detail-label">不含空格字符数</span>
                    <span class="detail-value">{{ stats.totalChars - stats.spaces }}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">标点符号数</span>
                    <span class="detail-value">{{ stats.punctuation }}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">行数</span>
                    <span class="detail-value">{{ stats.lines }}</span>
                </div>
            </div>
        </div>

        <!-- 文本分析 -->
        <div v-if="text.length > 0" class="analysis-section glass">
            <h3 class="section-title">
                <i class="icon icon-analytics" />
                文本分析
            </h3>
            <div class="analysis-content">
                <div class="analysis-item">
                    <span class="analysis-label">预估阅读时间</span>
                    <span class="analysis-value">{{ readingTime }} 分钟</span>
                </div>
                <div class="analysis-item">
                    <span class="analysis-label">预估朗读时间</span>
                    <span class="analysis-value">{{ speakingTime }} 分钟</span>
                </div>
                <div class="progress-bar">
                    <div class="progress-label">
                        <span>中文占比</span>
                        <span>{{ chineseRatio }}%</span>
                    </div>
                    <div class="progress-track">
                        <div
                            class="progress-fill"
                            :style="{ width: `${chineseRatio}%` }"
                        />
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'

useHead({
    title: '字数统计工具',
    meta: [
        { name: 'description', content: '智能统计文本字数、字符数、段落数，支持中英文混合统计' },
    ],
})

const text = ref('')

const stats = ref({
    totalChars: 0,
    chineseChars: 0,
    englishWords: 0,
    numbers: 0,
    spaces: 0,
    paragraphs: 0,
    punctuation: 0,
    lines: 0,
})

function updateStats() {
    const t = text.value

    // 总字符
    stats.value.totalChars = t.length

    // 中文字符 (Unicode 范围 \u4e00-\u9fa5)
    const chineseMatches = t.match(/[\u4E00-\u9FA5]/g)
    stats.value.chineseChars = chineseMatches ? chineseMatches.length : 0

    // 英文单词
    const englishMatches = t.match(/[a-z]+/gi)
    stats.value.englishWords = englishMatches ? englishMatches.length : 0

    // 数字
    const numberMatches = t.match(/\d/g)
    stats.value.numbers = numberMatches ? numberMatches.length : 0

    // 空格和换行
    const spaceMatches = t.match(/\s/g)
    stats.value.spaces = spaceMatches ? spaceMatches.length : 0

    // 段落数 (连续换行视为一个段落分隔)
    const paragraphs = t.split(/\n\s*\n/).filter(p => p.trim().length > 0)
    stats.value.paragraphs = paragraphs.length || (t.length > 0 ? 1 : 0)

    // 标点符号
    const punctMatches = t.match(/[，。？！；："'（）【】、.,;:!?()[\]{}]/g)
    stats.value.punctuation = punctMatches ? punctMatches.length : 0

    // 行数
    stats.value.lines = t.length > 0 ? t.split('\n').length : 0
}

const readingTime = computed(() => {
    // 中文阅读速度约 400 字/分钟，英文约 200 词/分钟
    const chineseTime = stats.value.chineseChars / 400
    const englishTime = stats.value.englishWords / 200
    const minutes = chineseTime + englishTime
    return minutes < 1 ? '< 1' : Math.round(minutes)
})

const speakingTime = computed(() => {
    // 中文朗读速度约 150 字/分钟
    const minutes = stats.value.chineseChars / 150
    return minutes < 1 ? '< 1' : Math.round(minutes)
})

const chineseRatio = computed(() => {
    if (stats.value.totalChars === 0)
        return 0
    return Math.round((stats.value.chineseChars / stats.value.totalChars) * 100)
})

function clearText() {
    text.value = ''
    updateStats()
}

async function pasteText() {
    try {
        const clipboardText = await navigator.clipboard.readText()
        text.value = clipboardText
        updateStats()
    }
    catch (err) {
        alert('无法读取剪贴板，请手动粘贴')
    }
}

async function copyText() {
    try {
        await navigator.clipboard.writeText(text.value)
        alert('已复制到剪贴板')
    }
    catch (err) {
        alert('复制失败')
    }
}
</script>

<style scoped lang="scss">
$primary: #6750A4;
$secondary: #625B71;
$surface: #FFFBFE;
$on-surface: #1C1B1F;
$outline: #79747E;

@mixin glass-effect {
    background: rgba(255, 255, 255, 0.85);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    border: 1px solid rgba(255, 255, 255, 0.6);
}

.wordcount-tool {
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
    background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
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
    margin: 0;
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
    padding: 20px;
    margin-bottom: 20px;
}

.section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;
}

.toolbar {
    display: flex;
    gap: 8px;
}

.btn-icon {
    width: 36px;
    height: 36px;
    border: none;
    border-radius: 10px;
    background: rgba($outline, 0.1);
    color: $on-surface;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s ease;

    i {
        font-size: 18px;
    }

    &:hover {
        background: rgba($primary, 0.15);
        color: $primary;
    }
}

.text-input {
    width: 100%;
    min-height: 200px;
    padding: 16px;
    border: 2px solid rgba($outline, 0.15);
    border-radius: 12px;
    font-size: 14px;
    line-height: 1.6;
    resize: vertical;
    background: rgba(255, 255, 255, 0.5);
    color: $on-surface;
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

.input-footer {
    display: flex;
    justify-content: flex-end;
    margin-top: 12px;
}

.char-count {
    font-size: 13px;
    color: $outline;
    font-weight: 500;
}

// 统计区域
.stats-section {
    @include glass-effect;
    border-radius: 20px;
    padding: 24px;
    margin-bottom: 20px;

    .section-title {
        margin-bottom: 20px;
    }
}

.stats-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
    gap: 16px;
    margin-bottom: 24px;
}

.stat-card {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 16px;
    background: rgba(255, 255, 255, 0.6);
    border-radius: 14px;
    transition: transform 0.2s ease;

    &:hover {
        transform: translateY(-2px);
    }
}

.stat-icon {
    width: 44px;
    height: 44px;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 22px;
    color: white;
    flex-shrink: 0;

    &.total { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); }
    &.chinese { background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); }
    &.english { background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%); }
    &.number { background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%); }
    &.space { background: linear-gradient(135deg, #fa709a 0%, #fee140 100%); }
    &.paragraph { background: linear-gradient(135deg, #a8edea 0%, #fed6e3 100%); }
}

.stat-content {
    display: flex;
    flex-direction: column;
}

.stat-value {
    font-size: 24px;
    font-weight: 600;
    color: $on-surface;
    line-height: 1;
}

.stat-label {
    font-size: 12px;
    color: $outline;
    margin-top: 4px;
}

// 详细统计
.detail-stats {
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
    padding-top: 20px;
    border-top: 1px solid rgba($outline, 0.1);
}

.detail-item {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 10px 16px;
    background: rgba($primary, 0.08);
    border-radius: 10px;
}

.detail-label {
    font-size: 13px;
    color: $outline;
}

.detail-value {
    font-size: 14px;
    font-weight: 600;
    color: $primary;
}

// 分析区域
.analysis-section {
    @include glass-effect;
    border-radius: 20px;
    padding: 24px;

    .section-title {
        margin-bottom: 20px;
    }
}

.analysis-content {
    display: flex;
    flex-direction: column;
    gap: 16px;
}

.analysis-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 14px 16px;
    background: rgba($primary, 0.05);
    border-radius: 10px;
}

.analysis-label {
    font-size: 14px;
    color: $outline;
}

.analysis-value {
    font-size: 14px;
    font-weight: 600;
    color: $on-surface;
}

// 进度条
.progress-bar {
    padding: 16px;
    background: rgba($primary, 0.05);
    border-radius: 10px;
}

.progress-label {
    display: flex;
    justify-content: space-between;
    margin-bottom: 10px;
    font-size: 14px;
    color: $outline;
}

.progress-track {
    height: 8px;
    background: rgba($outline, 0.1);
    border-radius: 4px;
    overflow: hidden;
}

.progress-fill {
    height: 100%;
    background: linear-gradient(90deg, $primary, #9C27B0);
    border-radius: 4px;
    transition: width 0.5s ease;
}

// 响应式
@media (max-width: 640px) {
    .tool-header {
        flex-direction: column;
        text-align: center;
    }

    .stats-grid {
        grid-template-columns: repeat(2, 1fr);
    }

    .detail-stats {
        justify-content: center;
    }
}
</style>
