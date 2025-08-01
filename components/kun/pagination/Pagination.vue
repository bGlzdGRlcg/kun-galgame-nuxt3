<script setup lang="ts">
const props = defineProps<{
  currentPage: number
  totalPage: number
  isLoading?: boolean
}>()

const emit = defineEmits<{
  (e: 'update:currentPage', page: number): void
}>()

const jumpToPage = ref('')
const kunUniqueId = useKunUniqueId('kun-pagination')

const displayedPages = computed(() => {
  const pages: (number | string)[] = []
  const maxVisiblePages = 7

  if (props.totalPage <= maxVisiblePages) {
    return Array.from({ length: props.totalPage }, (_, i) => i + 1)
  }

  pages.push(1)

  if (props.currentPage > 3) {
    pages.push('...')
  }

  let start = Math.max(2, props.currentPage - 1)
  let end = Math.min(props.totalPage - 1, props.currentPage + 1)

  if (props.currentPage <= 3) {
    end = Math.min(props.totalPage - 1, 4)
  }

  if (props.currentPage >= props.totalPage - 2) {
    start = Math.max(2, props.totalPage - 3)
  }

  for (let i = start; i <= end; i++) {
    pages.push(i)
  }

  if (props.currentPage < props.totalPage - 2) {
    pages.push('...')
  }

  pages.push(props.totalPage)

  return pages
})

const handlePageChange = (page: number) => {
  if (props.isLoading || page === props.currentPage) return
  emit('update:currentPage', page)
}

const handleJumpToPage = () => {
  if (props.isLoading) return
  const page = parseInt(jumpToPage.value)
  if (page && page >= 1 && page <= props.totalPage) {
    emit('update:currentPage', page)
    jumpToPage.value = ''
  }
}
</script>

<template>
  <div
    class="flex w-full flex-col items-center justify-between gap-4 sm:flex-row"
  >
    <div class="flex items-center gap-2">
      <KunButton
        :is-icon-only="true"
        variant="light"
        :disabled="isLoading || currentPage === 1"
        @click="handlePageChange(currentPage - 1)"
        :class="{
          'cursor-not-allowed opacity-50': isLoading || currentPage === 1
        }"
      >
        <KunIcon name="lucide:chevron-left" />
      </KunButton>

      <div class="flex items-center gap-1">
        <template v-for="page in displayedPages" :key="page">
          <KunButton
            :variant="currentPage === page ? 'solid' : 'light'"
            size="sm"
            v-if="page !== '...'"
            @click="handlePageChange(Number(page))"
            :disabled="isLoading"
          >
            {{ page }}
          </KunButton>
          <span v-else class="px-2">...</span>
        </template>
      </div>

      <KunButton
        :is-icon-only="true"
        variant="light"
        :disabled="isLoading || currentPage === totalPage"
        @click="handlePageChange(currentPage + 1)"
        :class="{
          'cursor-not-allowed opacity-50':
            isLoading || currentPage === totalPage
        }"
      >
        <KunIcon name="lucide:chevron-right" />
      </KunButton>
    </div>

    <div class="flex items-center gap-2">
      <label :for="kunUniqueId" class="text-sm">跳转到页数</label>
      <input
        :id="kunUniqueId"
        type="number"
        v-model="jumpToPage"
        :disabled="isLoading"
        @keyup.enter="handleJumpToPage"
        min="1"
        :max="totalPage"
        class="focus:ring-primary border-default-300 w-24 rounded-md border px-2 py-1 text-sm focus:ring-1 focus:outline-none"
        :class="{ 'cursor-not-allowed opacity-50': isLoading }"
      />
      <KunButton
        size="sm"
        @click="handleJumpToPage"
        :disabled="isLoading"
        class="bg-primary hover:bg-opacity-90 focus:ring-primary focus:ring-opacity-50 rounded-md px-3 py-1 text-sm text-white focus:ring-2 focus:outline-none"
        :class="{ 'cursor-not-allowed opacity-50': isLoading }"
      >
        跳转
      </KunButton>
    </div>
  </div>
</template>
