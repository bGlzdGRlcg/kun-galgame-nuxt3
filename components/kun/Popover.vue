<script setup lang="ts">
import { useEventListener } from '@vueuse/core'

const props = withDefaults(
  defineProps<{
    position?: 'top-start' | 'top-end' | 'bottom-start' | 'bottom-end'
    innerClass?: string
  }>(),
  {
    position: 'bottom-start',
    innerClass: ''
  }
)

const isOpen = ref(false)
const triggerRef = ref<HTMLElement | null>(null)
const popoverRef = ref<HTMLElement | null>(null)
const popoverId = `kun-popover-${useId()}`

const positionClass = computed(() => {
  switch (props.position) {
    case 'top-start':
      return 'bottom-full left-0 mb-2'
    case 'top-end':
      return 'bottom-full right-0 mb-2'
    case 'bottom-end':
      return 'top-full right-0'
    default:
      return 'top-full left-0'
  }
})

const toggle = () => {
  isOpen.value = !isOpen.value
}

const close = (event: MouseEvent) => {
  if (
    !triggerRef.value?.contains(event.target as Node) &&
    !popoverRef.value?.contains(event.target as Node)
  ) {
    isOpen.value = false
  }
}

useEventListener('keydown', (e: KeyboardEvent) => {
  if (e.key === 'Escape' && isOpen.value) {
    isOpen.value = false
  }
})

useEventListener(document, 'click', close)
</script>

<template>
  <div class="relative z-20 inline-block">
    <div
      ref="triggerRef"
      @click="toggle"
      @keydown.enter="toggle"
      @keydown.space.prevent="toggle"
      tabindex="0"
      role="button"
      aria-label="popover-trigger"
      :aria-expanded="isOpen"
      :aria-controls="popoverId"
    >
      <slot name="trigger" />
    </div>

    <Transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="transform scale-95 opacity-0"
      enter-to-class="transform scale-100 opacity-100"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="transform scale-100 opacity-100"
      leave-to-class="transform scale-95 opacity-0"
    >
      <div
        v-if="isOpen"
        ref="popoverRef"
        :id="popoverId"
        role="dialog"
        :aria-hidden="!isOpen"
        class="absolute z-50 mt-2 rounded-lg border bg-white shadow-lg dark:bg-black"
        :class="cn(positionClass, innerClass)"
        @click.stop
      >
        <slot />
      </div>
    </Transition>
  </div>
</template>
