<script setup lang="ts">
useHead({
  title: `话题分类 - ${kungal.titleShort}`,
  meta: [
    {
      name: 'description',
      content: t('seo.category.description')
    }
  ]
})
</script>

<template>
  <div class="root">
    <Category />
  </div>
</template>

<style lang="scss" scoped>
.root {
  display: flex;
  flex-direction: column;
  height: 100%;
  max-width: 80rem;
  margin: 0 auto;
  color: var(--kungalgame-font-color-3);
}

@media (max-width: 700px) {
  .root {
    margin: 0 5px;
  }
}
</style>
