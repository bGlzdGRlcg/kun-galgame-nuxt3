<script setup lang="ts">
const route = useRoute()
const section = computed(() => (route.params as { section: string }).section)

const categoryMap: Record<string, string> = {
  g: 'Galgame',
  t: 'Technique',
  o: 'Others'
}

useHead({
  title: `${t('seo.category.title')} - ${kungal.titleShort}`,
  meta: [
    {
      name: 'description',
      content: t(`seo.category.${section.value.toLocaleLowerCase()}`)
    }
  ]
})
</script>

<template>
  <div class="root">
    <div class="title" :class="section[0]">
      <span>{{ $t(`edit.topic.${categoryMap[section[0]]}`) }}</span>
      >
      <span>{{ $t(`edit.topic.section.${section}`) }}</span>
    </div>

    <Section :section="section" />
  </div>
</template>

<style lang="scss" scoped>
.root {
  display: flex;
  flex-direction: column;
  height: 100%;
  min-height: calc(100dvh - 75px);
  max-width: 80rem;
  margin: 0 auto;

  @include kun-blur;
}

.title {
  padding: 17px;
  font-size: 30px;
  color: var(--kungalgame-font-color-0);
  user-select: none;

  span {
    color: var(--kungalgame-font-color-3);

    &:last-child {
      font-size: 22px;
    }
  }
}

@media (max-width: 700px) {
  .root {
    min-height: calc(100dvh - 63px);
    margin: 0 5px;
  }

  .title {
    font-size: 23px;

    span {
      &:last-child {
        font-size: 17px;
      }
    }
  }
}
</style>
