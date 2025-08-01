<script setup lang="ts">
import { watchDebounced } from '@vueuse/core'
import type { GalgameOfficialItem } from '~/types/api/galgame-official'

const pageData = reactive({
  page: 1,
  limit: 100
})

const { data, status } = await useFetch(`/api/galgame-official`, {
  method: 'GET',
  query: pageData,
  ...kungalgameResponseHandler
})

const searchResult = ref<GalgameOfficialItem[]>([])
const searchQuery = ref('')
const isSearching = ref(false)
const displayOfficials = computed(() =>
  searchQuery.value.trim() ? searchResult.value : data.value!.officials
)

const handleSearch = async () => {
  if (!searchQuery.value.trim()) {
    searchResult.value = []
    return
  }
  isSearching.value = true
  const res = await $fetch(`/api/galgame-official/search`, {
    method: 'GET',
    query: { q: searchQuery.value.split(' ') }
  })
  isSearching.value = false

  searchResult.value = res
}

watchDebounced(
  () => searchQuery.value,
  () => {
    handleSearch()
  },
  { debounce: 500, maxWait: 1000 }
)
</script>

<template>
  <KunCard
    :is-transparent="false"
    :is-hoverable="false"
    :is-pressable="false"
    content-class="space-y-6"
  >
    <KunHeader
      name="Galgame 会社 / 厂商 Wiki"
      description="这里展示了绝大多数 Galgame 的制作厂商 / Galgame 会社, 并有会社别名 (例如 Yuzusoft 的别名为柚子社), 您可以点击会社以查看这个会社制作的所有 Galgame"
    >
      <template #endContent>
        <div>
          <KunInput
            v-model="searchQuery"
            type="text"
            placeholder="搜索会社名称、描述或别名..."
          />

          <div class="text-default-600 mt-4 flex items-center gap-4 text-sm">
            <span v-if="!searchQuery.trim()">
              {{ `总计 ${data?.totalCount || 0} 个会社` }}
            </span>
            <span v-else>{{ `搜索结果: ${searchResult.length} 个会社` }}</span>
          </div>
        </div>
      </template>
    </KunHeader>

    <div
      class="grid grid-cols-2 gap-3 sm:grid-cols-2 sm:gap-3 lg:grid-cols-3 xl:grid-cols-4"
    >
      <GalgameOfficialCard
        v-for="official in displayOfficials"
        :key="official.id"
        :official="official"
      />
    </div>

    <KunNull
      v-if="!isSearching && !displayOfficials.length && searchQuery.trim()"
    />

    <KunLoading v-if="isSearching" />

    <KunPagination
      v-if="data && data.totalCount > pageData.limit && !searchQuery.trim()"
      v-model:current-page="pageData.page"
      :total-page="Math.ceil(data.totalCount / pageData.limit)"
      :is-loading="status === 'pending'"
    />
  </KunCard>
</template>
