<script setup lang="ts">
import {
  GALGAME_RESOURCE_TYPE_ICON_MAP,
  GALGAME_RESOURCE_PLATFORM_ICON_MAP
} from '~/constants/galgameResource'
import {
  KUN_GALGAME_RESOURCE_TYPE_MAP,
  KUN_GALGAME_RESOURCE_LANGUAGE_MAP,
  KUN_GALGAME_RESOURCE_PLATFORM_MAP
} from '~/constants/galgame'
import type {
  GalgameResource,
  GalgameResourceDetails
} from '~/types/api/galgame-resource'

const props = defineProps<{
  link: GalgameResource
  refresh: () => void
}>()

const details = ref<GalgameResourceDetails>()
const { id } = usePersistUserStore()
const { rewriteResourceId } = storeToRefs(useTempGalgameResourceStore())
const isFetching = ref(false)

const handleGetDetail = async (galgameResourceId: number) => {
  if (details.value) {
    return
  }
  isFetching.value = true
  const result = await $fetch(`/api/galgame/${props.link.galgameId}/resource`, {
    query: { galgameResourceId },
    method: 'GET',
    ...kungalgameResponseHandler
  })
  isFetching.value = false

  if (result) {
    details.value = result
  }
}

const handleMarkValid = async (
  galgameId: number,
  galgameResourceId: number
) => {
  const res = await useComponentMessageStore().alert(
    '您确定重新标记资源链接有效吗？',
    '若您修复了资源链接，您可以重新标记资源链接有效。'
  )
  if (!res) {
    return
  }

  const result = await $fetch(`/api/galgame/${galgameId}/resource/valid`, {
    method: 'PUT',
    body: { galgameResourceId },
    watch: false,
    ...kungalgameResponseHandler
  })

  if (result) {
    useMessage(10548, 'success')
    props.refresh()
  }
}

watch(
  () => [rewriteResourceId.value, props.link],
  () => {
    details.value = undefined
  }
)
</script>

<template>
  <div class="space-y-2">
    <div class="flex flex-wrap items-center justify-between space-y-2">
      <div class="flex flex-wrap items-center gap-1 rounded-lg">
        <KunBadge color="primary">
          <KunIcon :name="GALGAME_RESOURCE_TYPE_ICON_MAP[link.type]" />
          {{ KUN_GALGAME_RESOURCE_TYPE_MAP[link.type] }}
        </KunBadge>
        <KunBadge color="warning">
          <KunIcon name="lucide:database" />
          {{ link.size }}
        </KunBadge>
        <KunBadge color="success">
          <KunIcon :name="GALGAME_RESOURCE_PLATFORM_ICON_MAP[link.platform]" />
          {{ KUN_GALGAME_RESOURCE_PLATFORM_MAP[link.platform] }}
        </KunBadge>
        <KunBadge color="secondary">
          {{ KUN_GALGAME_RESOURCE_LANGUAGE_MAP[link.language] }}
        </KunBadge>
      </div>

      <div class="ml-auto flex items-center gap-1">
        <KunButton
          :is-icon-only="true"
          variant="light"
          color="default"
          rounded="full"
          v-if="details"
          @click="details = undefined"
        >
          <KunIcon name="lucide:x" />
        </KunButton>

        <KunButton
          size="sm"
          v-if="id === link.user.id && link.status === 1"
          @click="handleMarkValid(link.galgameId, link.id)"
          :loading="isFetching"
        >
          重新标记有效
        </KunButton>
        <KunButton
          size="sm"
          variant="flat"
          v-if="!details && link.id !== rewriteResourceId"
          @click="handleGetDetail(link.id)"
          :loading="isFetching"
        >
          获取链接
        </KunButton>

        <GalgameResourceLike
          v-if="id !== link.user.id"
          :galgame-id="link.galgameId"
          :galgame-resource-id="link.id"
          :target-user-id="link.user.id"
          :is-liked="link.isLiked"
          :like-count="link.likeCount"
        />

        <KunTooltip text="举报违规">
          <KunButton
            :is-icon-only="true"
            color="danger"
            variant="light"
            v-if="id !== link.user.id"
            href="/report"
          >
            <KunIcon name="lucide:triangle-alert" />
          </KunButton>
        </KunTooltip>

        <KunTooltip
          position="left"
          :text="link.status ? '链接过期' : '链接有效'"
        >
          <div
            :class="
              cn(
                'h-3 w-3 shrink-0 rounded-full',
                link.status ? 'bg-danger' : 'bg-success'
              )
            "
          />
        </KunTooltip>
      </div>
    </div>

    <GalgameResourceDetails
      v-if="details"
      :details="details"
      :refresh="refresh"
    />

    <KunDivider margin="0 0 17px 0" />
  </div>
</template>
