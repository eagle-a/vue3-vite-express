<template>
    <div class="actions-wrap">
        <a v-if="item.like_status" href="javascript:;" class="action-item active" @click="handleLike">
            <i class="icon icon-action-voteup-active" /><span class="text">{{ item.like }} 赞</span>
        </a>
        <a v-else href="javascript:;" class="action-item" @click="handleLike">
            <i class="icon icon-action-voteup" /><span class="text">{{ item.like }} 赞</span>
        </a>
        <a href="javascript:;" class="action-item">
            <i class="icon icon-action-comment" /><span class="text">{{ item.comment_count }} 评论</span>
        </a>
        <a href="javascript:;" class="action-item action-item-fav">
            <i class="icon icon-action-fav" /><span class="text">{{ item.visit }} 浏览</span>
        </a>
        <a href="javascript:;" class="action-item" @click="handleShare"> <i class="icon icon-action-share" /><span class="text">分享</span> </a>
    </div>
</template>

<script setup lang="ts">
import useClipboard from 'vue-clipboard3'
import type { Article } from '@/types'
import api from '@/api/index-client'

defineOptions({
    name: 'ItemActions',
})

const props = defineProps<{
    item: Article
}>()

const { item } = $(toRefs(props))

const globalStore = useGlobalStore()
const { cookies } = $(toRefs(globalStore))

const frontendArticleStore = useFrontendArticleStore()

const isLogin = $computed(() => !!cookies.user)

const handleLike = useLockFn(async () => {
    if (!isLogin) {
        showMsg('请先登录!')
        globalStore.setLoginModal(true)
        return
    }
    let url = 'frontend/like'
    if (item.like_status) {
        url = 'frontend/unlike'
    }
    const { code, message } = await api.get<'success' | 'error'>(url, { id: item._id })
    if (code === 200) {
        showMsg({ type: 'success', content: message })
        frontendArticleStore.modifyLikeStatus({
            id: item._id,
            status: !item.like_status,
        })
    }
})

function handleShare() {
    const url = `https://www.mmxiaowu.com/article/${item._id}`
    copy(url)
}
// 使用插件
const { toClipboard } = useClipboard()
async function copy(msg) {
    try {
        showMsg({ type: 'success', content: '复制分享链接成功' })
        await toClipboard(msg)
    // 复制成功
    }
    catch (e) {
        showMsg('复制链接失败')
    }
}
</script>
