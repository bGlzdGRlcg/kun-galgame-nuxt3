<script setup lang="ts">
import { userSortItem, userIconMap } from './navSortItem'
import { KUN_RANKING_USER_MAP } from '~/constants/ranking'

const { user } = storeToRefs(useTempRankingStore())
const isAscending = ref(false)

const { data } = await useFetch(`/api/ranking/user`, {
  method: 'GET',
  query: user,
  ...kungalgameResponseHandler
})

const handleClickSortOrder = () => {
  isAscending.value = !isAscending.value
  if (isAscending.value) {
    user.value.sortOrder = 'asc'
  } else {
    user.value.sortOrder = 'desc'
  }
}
</script>

<template>
  <div class="user">
    <div class="title">萌萌用户排行</div>
    <div class="nav">
      <div class="order" @click="handleClickSortOrder">
        <Transition name="order" mode="out-in">
          <div v-if="isAscending">
            <span>升序</span>
            <Icon class="icon" name="lucide:arrow-up" />
          </div>

          <div v-else-if="!isAscending">
            <span>降序</span>
            <Icon class="icon" name="lucide:arrow-down" />
          </div>
        </Transition>
      </div>

      <div class="sort">
        <Icon class="icon" :name="userIconMap[user.sortField]" />
        <span>筛选</span>
        <div class="submenu">
          <div
            class="item"
            v-for="kun in userSortItem"
            :key="kun.index"
            @click="user.sortField = kun.sortField"
          >
            <span><Icon class="icon" :name="kun.icon" /></span>
            <span>{{ KUN_RANKING_USER_MAP[kun.name] }}</span>
          </div>
        </div>
      </div>
    </div>

    <div class="container" v-if="data">
      <RankingKUNGalgamer :field="user.sortField" :users="data" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.user {
  width: 50%;
  height: calc(100% - 50px - 20px - 40px);
}

.title {
  font-size: 27px;
  color: var(--kungalgame-pink-4);
  height: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 20px;
}

.nav {
  height: 40px;
  display: flex;
  justify-content: space-around;
  align-items: center;
  margin-left: 10px;
  border: 1px solid var(--kungalgame-pink-4);
  border-radius: 5px;
}

.order {
  width: 100%;
  height: 100%;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;

  .icon {
    font-size: 22px;
  }

  & > div {
    width: 100%;
    display: flex;
    justify-content: space-around;
    align-items: center;
  }
}

.sort {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: space-around;
  align-items: center;
  cursor: pointer;
  border-left: 1px solid var(--kungalgame-pink-4);
}

.sort:hover .submenu {
  display: flex;
}

.icon {
  color: var(--kungalgame-pink-4);
}

.submenu {
  top: 38px;
  position: absolute;
  width: 100%;
  display: none;
  flex-direction: column;
  border: 1px solid var(--kungalgame-pink-0);

  .item {
    transition: all 0.2s;
    height: 40px;
    display: flex;
    justify-content: space-around;
    align-items: center;

    &:hover {
      background-color: var(--kungalgame-trans-pink-1);
    }
  }
}

.container {
  height: calc(100dvh - 75px - 160px);
  border-top: none;
  display: flex;
  flex-direction: column;
  margin-left: 10px;
  overflow-y: scroll;

  &::-webkit-scrollbar {
    width: 0;
  }
}

.order-enter-active,
.order-leave-active {
  transition: all 0.25s ease-out;
}

.order-enter-from {
  opacity: 0;
  transform: translateY(-30px);
}

.order-leave-to {
  opacity: 0;
  transform: translateY(30px);
}

@media (max-width: 700px) {
  .user {
    width: 100%;
  }

  .title {
    font-size: 23px;
  }
}
</style>
