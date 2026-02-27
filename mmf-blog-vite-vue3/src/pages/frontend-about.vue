<template>
    <div class="main wrap">
        <div class="main-left">
            <div class="card card-answer card-about">
                <div class="answer-content">
                    <div class="article-content">
                        <h3 class="about-title">关于作者</h3>
                        <div class="flex-item">
                            <div class="flex-label">姓名:</div>
                            <div class="flex-content">孙召顺</div>
                        </div>
                        <div class="flex-item">
                            <div class="flex-label">年龄:</div>
                            <div class="flex-content">2004.06</div>
                        </div>
                        <div class="flex-item">
                            <div class="flex-label">职业:</div>
                            <div class="flex-content">student</div>
                        </div>
                        <div class="flex-item">
                            <div class="flex-label">Github:</div>
                            <div class="flex-content"><a href="https://github.com/eagle-a" target="_blank">@eagle-a</a></div>
                        </div>
                        <div class="flex-item">
                            <div class="flex-label">技能:</div>
                            <div class="flex-content">
                                <ul class="about-ul">
                                    <li>自动化</li>
                                    <li>嵌入式软件</li>
                                    <li>linux</li>
                                    <li>网站</li>
                                </ul>
                            </div>
                        </div>
                        <h3 class="about-title">关于网站</h3>
                        <p>
                            源代码:
                            <a href="https://github.com/eagle-a/vue3-vite-docker" target="_blank">vue3-vite-docker</a>
                        </p>
                        <p>clone自<a href="https://github.com/lincenying/mmf-blog-vite-vue3-ssr" target="_blank"> @lincenying</a> </p>
                        <p>本站服务端采用 express + mongoDB 搭建, 客户端采用 Vue3 渲染搭建</p>
                        <p>网站分成前台和后台, 前台采用 SSR 模式渲染, 后台采用 SPA 模式</p>
                        <p>主要功能包括: 管理员, 用户, 分类, 文章, 评论, 文章点赞</p>
                    </div>
                </div>
            </div>
        </div>
        <div class="main-right"><aside-trending :trending="trending" /></div>
    </div>
</template>

<script setup lang="ts">
defineOptions({
    name: 'FrontendAbout',
    asyncData(ctx) {
        const { store, route, api } = ctx
        const frontendArticleStore = useFrontendArticleStore(store)
        return frontendArticleStore.getTrending({ id: route.query.id as string }, api)
    },
})

// pinia 状态管理 ===>
const frontendArticleStore = useFrontendArticleStore()
const { trending } = $(storeToRefs(frontendArticleStore))

onMounted(() => {})

const headTitle = ref('关于 - 湛明')
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
