<script setup lang="ts">
const { searchHistory } = storeToRefs(usePersistKUNGalgameSearchStore())
const { keywords } = storeToRefs(useTempSearchStore())

const handleClickHistory = (index: number) => {
  keywords.value = searchHistory.value[index]
}

const clearSearchHistory = () => {
  searchHistory.value = []
}

const handleDeleteHistory = (historyIndex: number) => {
  searchHistory.value.splice(historyIndex, 1)
}
</script>

<template>
  <div class="history">
    <div class="title" v-if="searchHistory.length">
      <span>搜索历史</span>
      <span @click="clearSearchHistory">清除所有历史</span>
    </div>

    <div class="history-container" v-if="searchHistory.length">
      <div
        class="single-history"
        v-for="(history, index) in searchHistory"
        :key="index"
        @click="handleClickHistory(index)"
      >
        <span>{{ history }} </span>
        <span class="delete">
          <Icon
            class="icon"
            @click="handleDeleteHistory(index)"
            name="lucide:x"
          />
        </span>
      </div>
    </div>

    <KunNull :condition="!searchHistory.length" type="null" />
  </div>
</template>

<style lang="scss" scoped>
.history {
  width: 100%;
  margin-top: 17px;
}

.title {
  display: flex;
  justify-content: space-between;

  span {
    font-size: 14px;
    &:nth-child(2) {
      cursor: pointer;

      &:hover {
        color: var(--kungalgame-blue-5);
      }
    }
  }
}

.history-container {
  display: flex;
  flex-direction: column;
  font-size: 13px;
  margin-top: 10px;
}

.single-history {
  width: 100%;
  display: flex;
  justify-content: space-between;
  padding: 7px 17px;
  margin: 2px 0;
  border-radius: 10px;

  &:hover {
    color: var(--kungalgame-blue-5);
    background-color: var(--kungalgame-trans-blue-1);

    .delete {
      display: flex;
    }
  }

  span:nth-child(1) {
    cursor: default;
    position: relative;
    display: flex;
    overflow: hidden;
  }

  span:nth-child(2) {
    width: 17px;
  }
}

.delete {
  font-size: 17px;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  color: var(--kungalgame-font-color-0);
  display: none;
}
</style>
