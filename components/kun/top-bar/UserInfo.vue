<script setup lang="ts">
const { uid, name, moemoepoint } = storeToRefs(usePersistUserStore())
const { messageStatus } = storeToRefs(useTempSettingStore())
const messageStore = useComponentMessageStore()

const container = ref<HTMLElement>()
const isCheckIn = ref(true)

const isShowMessageDot = computed(() => {
  if (messageStatus.value === 'new') {
    return true
  }
  return false
})

const emits = defineEmits<{
  close: []
}>()

const handlePanelBlur = async () => {
  await new Promise((resolve) => {
    setTimeout(resolve, 107)
  })
  emits('close')
}

const handleCheckIn = async () => {
  isCheckIn.value = true

  const result = await $fetch(`/api/user/check-in`, {
    method: 'POST',
    watch: false,
    ...kungalgameResponseHandler
  })

  moemoepoint.value += result

  if (result === 0) {
    messageStore.info(
      '杂~~~鱼~♡杂鱼~♡ 臭杂鱼♡. 签到成功，您今日什么也没获得...',
      5000
    )
  } else if (result === 7) {
    messageStore.info(
      '杂鱼~♡♡♡♡♡. 签到成功, 您今日好运获得了 7 萌萌点哦!',
      5000
    )
  } else {
    messageStore.info(
      `杂~~~鱼~♡. 签到成功，您今日获得了 ${result} 萌萌点`,
      5000
    )
  }
}

const logOut = async () => {
  const res = await useComponentMessageStore().alert('您确定退出登录吗？')
  if (res) {
    usePersistUserStore().$reset()
    navigateTo('/login')
    useMessage(10110, 'success')
  }
}

onMounted(async () => {
  container.value?.focus()

  const result = await $fetch(`/api/user/status`, {
    method: 'GET',
    watch: false,
    ...kungalgameResponseHandler
  })

  if (result) {
    isCheckIn.value = result.isCheckIn
    moemoepoint.value = result.moemoepoints
  }
})
</script>

<template>
  <div
    ref="container"
    tabindex="-1"
    class="container"
    @blur="handlePanelBlur"
    @mousedown.passive="container?.focus()"
  >
    <span class="triangle1"></span>
    <span class="triangle2"></span>

    <div class="kungalgamer">
      <div class="info">
        <p>{{ name }}</p>
        <p>
          <span><Icon class="icon" name="lucide:lollipop" /></span>
          <span>{{ moemoepoint }}</span>
        </p>
      </div>

      <div class="func">
        <span>
          <NuxtLink :to="`/kungalgamer/${uid}/info`">个人主页</NuxtLink>
        </span>

        <NuxtLink to="/message">
          <span>我的消息</span>
          <span v-if="isShowMessageDot" class="message-dot"></span>
        </NuxtLink>

        <span v-if="!isCheckIn" @click="handleCheckIn">
          <span>每日签到</span>
          <span class="message-dot"></span>
        </span>

        <span @click="logOut">退出登录</span>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.container {
  position: absolute;
  top: 50px;
  right: 80px;
}

.triangle1 {
  position: absolute;
  top: -1px;
  width: 0;
  height: 0;
  border-left: 10px solid transparent;
  border-right: 10px solid transparent;
  border-bottom: 17px solid var(--kungalgame-trans-white-5);
  filter: drop-shadow(0px -1px 1px var(--kungalgame-trans-blue-2));
  z-index: 1;
}

.kungalgamer {
  padding: 10px;
  top: 16px;
  transform: translateX(-43%);
  width: 130px;
  position: absolute;
  display: flex;
  flex-direction: column;
}

.info {
  display: flex;
  flex-direction: column;
  margin-bottom: 5px;

  p {
    display: flex;
    margin-bottom: 5px;
    justify-content: center;
    align-items: center;

    span {
      display: flex;
      justify-content: center;
      align-items: center;
      margin-left: 5px;
      font-weight: bold;
      color: var(--kungalgame-pink-4);

      &:nth-child(1) {
        font-size: 20px;
      }
    }
  }
}

.func {
  & > span,
  a {
    position: relative;
    cursor: pointer;
    color: var(--kungalgame-blue-5);
    height: 30px;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 5px;

    a {
      width: 100%;
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      color: var(--kungalgame-blue-5);
    }

    &:hover {
      background-color: var(--kungalgame-trans-blue-1);
    }
  }
}

.message-dot {
  position: absolute;
  right: 10px;
  top: 10px;
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background-color: var(--kungalgame-pink-4);
}
</style>
