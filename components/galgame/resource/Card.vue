<script setup lang="ts">
import {
  GALGAME_RESOURCE_TYPE_ICON_MAP,
  GALGAME_RESOURCE_PLATFORM_ICON_MAP
} from '~/constants/galgameResource'
import {
  KUN_GALGAME_RESOURCE_TYPE_MAP,
  KUN_GALGAME_RESOURCE_LANGUAGE_MAP
} from '~/constants/galgame'
import type { GalgameResourceCard } from '~/types/api/galgame-resource'

defineProps<{
  resource: GalgameResourceCard
}>()
</script>

<template>
  <KunCard
    :is-transparent="true"
    :is-hoverable="true"
    :is-pressable="true"
    :to="`/galgame/${resource.galgameId}`"
    :dark-border="true"
  >
    <div class="flex items-center gap-2">
      <div
        class="bg-primary/10 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full"
      >
        <KunIcon
          :name="GALGAME_RESOURCE_PLATFORM_ICON_MAP[resource.platform]"
          class="text-primary h-4 w-4"
        />
      </div>

      <span class="text-default-500 text-sm">
        {{ formatTimeDifference(resource.created) }}
      </span>
    </div>

    <div class="space-y-2">
      <h3 class="hover:text-primary line-clamp-3 break-all transition-colors">
        {{ getPreferredLanguageText(resource.galgameName) }}
      </h3>

      <div class="flex items-center justify-between">
        <div class="text-default-700 flex gap-4 text-sm">
          <span class="flex items-center gap-1">
            <KunIcon
              class="icon"
              :name="GALGAME_RESOURCE_TYPE_ICON_MAP[resource.type]"
            />
            {{ KUN_GALGAME_RESOURCE_TYPE_MAP[resource.type] }}
          </span>

          {{ KUN_GALGAME_RESOURCE_LANGUAGE_MAP[resource.language] }}
        </div>

        <div class="flex items-center gap-2">
          <KunBadge color="warning">
            {{ `资源大小 ${resource.size}` }}
          </KunBadge>

          <KunBadge color="secondary">
            {{ `下载数 ${resource.download}` }}
          </KunBadge>
        </div>
      </div>
    </div>
  </KunCard>
</template>
