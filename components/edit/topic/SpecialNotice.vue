<script setup lang="ts">
import { useTopicEditorStore } from '~/composables/topic/useTopicEditorStore'
const { section } = useTopicEditorStore()

const isShowSeekGalgameNotice = computed(() =>
  section.value.includes('g-seeking')
)
const isShowRequestHelpNotice = computed(() => section.value.includes('t-help'))

const notices = computed(() => [
  {
    show: isShowSeekGalgameNotice.value,
    icon: 'lucide:search-check',
    title: '寻求 Galgame 资源须知',
    content: [
      '请先使用论坛搜索、搜索引擎（搜索日文原名）进行检索。',
      '请阅读<a href="/topic/1223" target="_blank" class="font-semibold text-blue-500 hover:underline">此话题</a>中提到的资源站列表。',
      '完成上述步骤仍未找到，我们很乐意帮助您。否则，话题可能会被删除。'
    ]
  },
  {
    show: isShowRequestHelpNotice.value,
    icon: 'lucide:help-circle',
    title: '技术求助须知',
    content: [
      '请先尝试自行搜索解决方案。',
      '请阅读<a href="/topic/1483" target="_blank" class="font-semibold text-blue-500 hover:underline">如何提问</a>，清晰地描述您的问题、已做的尝试和结果。',
      '问题描述越清晰，越容易得到帮助。'
    ]
  }
])
</script>

<template>
  <div class="space-y-4">
    <template v-for="(notice, index) in notices" :key="index">
      <Transition
        enter-active-class="transition-all duration-300 ease-out"
        enter-from-class="opacity-0 -translate-y-2"
        enter-to-class="opacity-100 translate-y-0"
      >
        <div
          v-if="notice.show"
          class="bg-warning-50 rounded-r-lg border-l-4 p-4"
          :class="['border-warning-400']"
        >
          <div class="flex items-start gap-3">
            <Icon
              :name="notice.icon"
              class="text-warning-500 mt-0.5 h-6 w-6 flex-shrink-0"
            />
            <div class="flex-grow">
              <h4 class="text-warning-800 font-bold">
                {{ notice.title }}
              </h4>
              <ul
                class="text-warning-700 mt-2 list-inside list-disc space-y-1 text-sm"
              >
                <li
                  v-for="(line, i) in notice.content"
                  :key="i"
                  v-html="line"
                ></li>
              </ul>
            </div>
          </div>
        </div>
      </Transition>
    </template>
  </div>
</template>
