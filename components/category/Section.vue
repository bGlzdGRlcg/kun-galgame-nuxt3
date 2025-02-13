<script setup lang="ts">
import { KUN_TOPIC_SECTION } from '~/constants/topic'
import type { CategoryResponseData } from '~/types/api/category'

const props = defineProps<{
  sections: CategoryResponseData[]
}>()
</script>

<template>
  <section class="section" v-for="(sec, index) in props.sections" :key="index">
    <div class="section-title">
      <span>
        {{ KUN_TOPIC_SECTION[sec.section] }}
      </span>
    </div>

    <NuxtLink :to="`/section/${sec.section}`" class="content">
      <div class="topic">
        <span @click.prevent="navigateTo(`/topic/${sec.topic.tid}`)">
          {{ sec.topic.title }}
        </span>
        <p>
          {{ `发布于 ${formatTimeDifference(sec.topic.time)}` }}
        </p>
      </div>

      <div class="statistic">
        <div class="count">
          <span>话题数</span>
          <span>{{ formatNumberWithCommas(sec.topics) }}</span>
        </div>

        <div class="views">
          <span>浏览数</span>
          <span>{{ formatNumberWithCommas(sec.views) }}</span>
        </div>
      </div>
    </NuxtLink>
  </section>
</template>

<style lang="scss" scoped>
.section {
  margin-bottom: 20px;

  .section-title {
    transition: transform 0.2s ease;

    span {
      margin-right: 10px;
    }
  }

  &:hover {
    .section-title {
      transform: translateX(20px) translateY(7px);
    }

    .content {
      &::before {
        width: 100%;
        z-index: -1;
        transition: width 0.2s;
        background-color: var(--kungalgame-trans-blue-1);
      }
    }
  }
}

.section-title {
  padding: 5px;
  border-bottom: none;
  filter: drop-shadow(2px 4px 3px var(--kungalgame-trans-blue-4));

  span {
    padding: 2px 27px;
    text-align: center;
    background-color: var(--kungalgame-trans-white-2);
    clip-path: polygon(10% 0%, 90% 0%, 100% 50%, 90% 100%, 10% 100%, 0 50%);
  }
}

.content {
  padding: 10px;
  padding-left: 17px;
  padding-right: 0;
  display: flex;
  justify-content: space-between;
  position: relative;
  color: var(--kungalgame-font-color-3);

  .topic {
    span {
      color: var(--kungalgame-blue-5);

      &:hover {
        text-decoration: underline;
      }
    }

    p {
      font-size: small;
      margin-top: 7px;
      color: var(--kungalgame-font-color-0);
    }
  }

  &::before {
    content: '';
    position: absolute;
    left: 0;
    bottom: 0;
    width: 5px;
    height: 100%;
    background-color: var(--kungalgame-blue-5);
  }
}

.statistic {
  display: flex;
  user-select: none;

  & > div {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    margin-right: 10px;

    span {
      &:first-child {
        color: var(--kungalgame-font-color-0);
        font-size: small;
      }
    }
  }
}
</style>
