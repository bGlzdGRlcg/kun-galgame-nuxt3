<script setup lang="ts">
import 'animate.css'

const { showKUNGalgamePanel } = storeToRefs(useTempSettingStore())
</script>

<template>
  <div
    class="bg-background z-10 mb-4 flex h-16 shrink-0 items-center justify-between rounded-b-lg px-3"
  >
    <!-- <HomePinned /> -->
    <span>占位文本</span>
    <KunTopBarAvatar />
  </div>

  <div class="settings-panel z-50">
    <Transition
      enter-active-class="animate__animated animate__jackInTheBox animate__faster"
      leave-active-class="animate__animated animate__fadeOutRight animate__faster"
    >
      <KeepAlive>
        <LazyKunSettingPanel
          v-if="showKUNGalgamePanel"
          @close="showKUNGalgamePanel = false"
        />
      </KeepAlive>
    </Transition>
  </div>
</template>
