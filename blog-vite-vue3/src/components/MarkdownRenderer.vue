<template>
  <div class="markdown-renderer">
    <component :is="renderedContent" />
  </div>
</template>

<script setup lang="ts">
import { computed, h } from 'vue'

interface Props {
  content: string
}

const props = defineProps<Props>()

const renderedContent = computed(() => {
  const html = parseMarkdown(props.content)
  return {
    template: `<div class="markdown-body">${html}</div>`,
  }
})

function parseMarkdown(markdown: string): string {
  let html = markdown

  html = html.replace(/^### (.*$)/gim, '<h3>$1</h3>')
  html = html.replace(/^## (.*$)/gim, '<h2>$1</h2>')
  html = html.replace(/^# (.*$)/gim, '<h1>$1</h1>')

  html = html.replace(/\*\*(.*?)\*\*/gim, '<strong>$1</strong>')
  html = html.replace(/\*(.*?)\*/gim, '<em>$1</em>')

  html = html.replace(/!\[(.*?)\]\((.*?)\)/gim, '<img src="$2" alt="$1" loading="lazy" />')

  html = html.replace(/\[(.*?)\]\((.*?)\)/gim, '<a href="$2" target="_blank" rel="noopener">$1</a>')

  html = html.replace(/`{3}(\w+)?\n([\s\S]*?)`{3}/gim, '<pre><code class="language-$1">$2</code></pre>')
  html = html.replace(/`([^`]+)`/gim, '<code>$1</code>')

  html = html.replace(/^> (.*$)/gim, '<blockquote>$1</blockquote>')

  html = html.replace(/^\* (.*$)/gim, '<li>$1</li>')
  html = html.replace(/(<li>.*<\/li>)/s, '<ul>$1</ul>')

  html = html.replace(/^(\d+)\. (.*$)/gim, '<li>$2</li>')

  html = html.replace(/\n\n/gim, '</p><p>')
  html = html.replace(/\n/gim, '<br />')

  html = `<p>${html}</p>`

  html = html.replace(/<p><\/p>/gim, '')
  html = html.replace(/<p>(<[hulbo])/gim, '$1')
  html = html.replace(/(<\/[hulbo][^>]*>)<\/p>/gim, '$1')

  return html
}
</script>

<style scoped>
.markdown-renderer {
  width: 100%;
}

.markdown-body {
  font-family: Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  font-size: 16px;
  line-height: 1.8;
  color: var(--color-text-primary);
  word-wrap: break-word;
}

.markdown-body :deep(h1),
.markdown-body :deep(h2),
.markdown-body :deep(h3),
.markdown-body :deep(h4),
.markdown-body :deep(h5),
.markdown-body :deep(h6) {
  margin-top: 32px;
  margin-bottom: 16px;
  font-weight: 600;
  line-height: 1.3;
  color: var(--color-text-primary);
}

.markdown-body :deep(h1) {
  font-size: 32px;
}
.markdown-body :deep(h2) {
  font-size: 24px;
}
.markdown-body :deep(h3) {
  font-size: 20px;
}
.markdown-body :deep(h4) {
  font-size: 18px;
}
.markdown-body :deep(h5) {
  font-size: 16px;
}
.markdown-body :deep(h6) {
  font-size: 14px;
}

.markdown-body :deep(p) {
  margin-bottom: 16px;
}

.markdown-body :deep(a) {
  color: var(--color-primary);
  text-decoration: none;
  border-bottom: 1px solid transparent;
  transition: all 0.2s ease;
}

.markdown-body :deep(a:hover) {
  border-bottom-color: var(--color-primary);
  color: var(--color-primary-dark);
}

.markdown-body :deep(img) {
  max-width: 100%;
  height: auto;
  border-radius: 16px;
  margin: 24px 0;
  box-shadow: var(--shadow-md);
}

.markdown-body :deep(code) {
  padding: 2px 8px;
  font-family: 'Fira Code', 'Consolas', monospace;
  font-size: 0.9em;
  background: var(--color-surface-variant);
  color: var(--color-text-primary);
  border-radius: 6px;
}

.markdown-body :deep(pre) {
  margin: 24px 0;
  padding: 20px;
  background: #1a1a1a;
  border-radius: 16px;
  overflow-x: auto;
  box-shadow: var(--shadow-lg);
}

.markdown-body :deep(pre code) {
  padding: 0;
  background: transparent;
  color: #d4d4d4;
}

.markdown-body :deep(blockquote) {
  margin: 24px 0;
  padding: 16px 24px;
  background: var(--color-surface-variant);
  border-left: 3px solid var(--color-primary);
  border-radius: 0 12px 12px 0;
  color: var(--color-text-secondary);
}

.markdown-body :deep(ul),
.markdown-body :deep(ol) {
  margin-bottom: 16px;
  padding-left: 32px;
}

.markdown-body :deep(li) {
  margin-bottom: 8px;
}

.markdown-body :deep(table) {
  width: 100%;
  margin: 24px 0;
  border-collapse: collapse;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: var(--shadow-sm);
}

.markdown-body :deep(th),
.markdown-body :deep(td) {
  padding: 12px 16px;
  text-align: left;
  border-bottom: 1px solid var(--color-surface-variant);
}

.markdown-body :deep(th) {
  background: var(--color-surface-variant);
  font-weight: 600;
  color: var(--color-text-primary);
}

.markdown-body :deep(hr) {
  margin: 32px 0;
  border: none;
  border-top: 1px solid var(--color-surface-variant);
}
</style>