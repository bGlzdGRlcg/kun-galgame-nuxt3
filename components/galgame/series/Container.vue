<script setup lang="ts">
import type { UpdateGalgameSeriesPayload } from '../types'

const { data } = await useFetch('/api/galgame-series', {
  method: 'GET',
  ...kungalgameResponseHandler
})

const { role } = usePersistUserStore()

const showSeriesModal = ref(false)

const handleCreateSeries = async (data: UpdateGalgameSeriesPayload) => {
  const result = await $fetch(`/api/galgame-series`, {
    method: 'POST',
    watch: false,
    body: data,
    ...kungalgameResponseHandler
  })

  if (result) {
    useMessage('创建 Galgame 系列成功', 'success')
  }
}
</script>

<template>
  <KunCard
    :is-hoverable="false"
    :is-pressable="false"
    :is-transparent="false"
    content-class="space-y-3"
  >
    <KunHeader
      name="Galgame 系列"
      description="Galgame 全系列所有 Galgame 作品。例如美少女万华镜 1, 2, 3, 4, 5, 雪女, 外传 就是一个 Galgame 系列"
    >
      <template #endContent>
        <KunSettingPanelComponentsNSFW />

        <div class="flex justify-end">
          <KunButton @click="showSeriesModal = true">创建系列</KunButton>
        </div>
      </template>
    </KunHeader>

    <GalgameSeriesModal
      v-model="showSeriesModal"
      :initial-data="{} as UpdateGalgameSeriesPayload"
      @submit="handleCreateSeries"
    />

    <div class="grid grid-cols-1 gap-6 lg:grid-cols-2">
      <GalgameSeriesCard
        v-for="(series, index) in data"
        :key="series.id"
        :style="{ animationDelay: `${index * 50}ms` }"
        :series="series"
      />
    </div>
  </KunCard>
</template>
