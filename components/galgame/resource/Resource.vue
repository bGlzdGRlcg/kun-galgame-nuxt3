<script setup lang="ts">
const route = useRoute()
const gid = computed(() => {
  return parseInt((route.params as { gid: string }).gid)
})

const { isShowPublish, rewriteResourceId } = storeToRefs(
  useTempGalgameResourceStore()
)

const { data, pending, refresh } = await useLazyFetch(
  `/api/galgame/${gid.value}/resource/all`,
  {
    method: 'GET',
    ...kungalgameResponseHandler
  }
)

const handleClickContribute = () => {
  if (!rewriteResourceId.value) {
    isShowPublish.value = !isShowPublish.value
  }
}

watch(
  () => rewriteResourceId.value,
  () => {
    if (rewriteResourceId.value) {
      isShowPublish.value = true
    } else {
      isShowPublish.value = false
    }
  }
)
</script>

<template>
  <div class="resource">
    <KunHeader :size="2">
      <template #header>
        <span>资源链接</span>

        <span class="contribute" @click="handleClickContribute">
          <Icon class="icon" name="lucide:circle-plus" />
        </span>
      </template>
    </KunHeader>

    <div class="note">
      <div>提示: 部分资源链接可能需要网络代理</div>
      <div>
        <span>如果您找不到想要的资源链接, 可以去看看友站</span>
        <a href="https://www.touchgal.io/" target="_blank"> TouchGal</a>
      </div>
    </div>

    <GalgameNull class="null" v-if="!data?.length" />

    <GalgameResourcePublish v-if="isShowPublish" :refresh="refresh" />

    <div v-if="!pending">
      <GalgameResourceLink
        v-for="resource in data"
        :key="resource.grid"
        :link="resource"
        :refresh="refresh"
      />
    </div>
    <KunSkeletonGalgameResource v-if="pending" />
  </div>
</template>

<style lang="scss" scoped>
.resource {
  width: 100%;
  display: flex;
  flex-direction: column;
}

.contribute {
  cursor: pointer;
  margin-left: 17px;
  padding: 3px;
  border-radius: 20px;
  color: var(--kungalgame-blue-5);
}

.note {
  margin-bottom: 17px;
  font-size: small;

  & > div {
    display: block;

    &:first-child {
      color: var(--kungalgame-red-5);
      font-weight: bold;
      font-style: oblique;
    }

    &:last-child {
      margin-top: 5px;
    }
  }

  a {
    font-weight: bold;
    color: var(--kungalgame-blue-5);
    text-decoration: underline;
    text-underline-offset: 3px;
    margin: 0 7px;
  }
}

.null {
  margin-bottom: 17px;
}
</style>
