<script setup lang="ts">
import { checkReplyPublish } from '../utils/checkReplyPublish'

const route = useRoute()
const tid = computed(() => {
  return parseInt((route.params as { tid: string }).tid)
})

const { isShowAdvance } = storeToRefs(usePersistKUNGalgameTopicStore())
const { isEdit, isReplyRewriting, replyRewrite, tempReply } =
  storeToRefs(useTempReplyStore())
const { replyDraft } = storeToRefs(usePersistKUNGalgameReplyStore())
const isPublishing = ref(false)

const handlePublish = async () => {
  if (!checkReplyPublish(replyDraft.value.tags, replyDraft.value.content)) {
    return
  }

  const res = await useComponentMessageStore().alert('确认发布吗？')
  if (!res) {
    return
  }

  if (isPublishing.value) {
    return
  } else {
    isPublishing.value = true
    useMessage(10201, 'info')
  }
  const reply = await $fetch(`/api/topic/${tid.value}/reply`, {
    method: 'POST',
    body: { ...replyDraft.value, time: Date.now() },
    watch: false,
    ...kungalgameResponseHandler
  })
  isPublishing.value = false

  if (reply) {
    isEdit.value = false
    tempReply.value.push(reply)
    usePersistKUNGalgameReplyStore().resetReplyDraft()
    useMessage(10243, 'success')
  }
}

const handleRewrite = async () => {
  if (
    !checkReplyPublish(
      replyRewrite.value[0].tags,
      replyRewrite.value[0].markdown
    )
  ) {
    return
  }

  const res = await useComponentMessageStore().alert('确定提交吗?')
  if (!res) {
    return
  }

  if (isPublishing.value) {
    return
  } else {
    isPublishing.value = true
    useMessage(10201, 'info')
  }
  const result = await $fetch(`/api/topic/${tid.value}/reply`, {
    method: 'PUT',
    body: {
      rid: replyRewrite.value[0].rid,
      content: replyRewrite.value[0].markdown,
      tags: replyRewrite.value[0].tags,
      edited: Date.now()
    },
    watch: false,
    ...kungalgameResponseHandler
  })
  isPublishing.value = false

  if (result) {
    useMessage(10244, 'success')
    useTempReplyStore().resetRewriteReplyData()
    isShowAdvance.value = false
    isEdit.value = false
  }
}

const handleShowAdvance = () => {
  isShowAdvance.value = !isShowAdvance.value
}
</script>

<template>
  <div class="btn-container">
    <button class="advance-btn" @click="handleShowAdvance">高级选项</button>

    <button v-if="!isReplyRewriting" class="confirm-btn" @click="handlePublish">
      确认发布
    </button>

    <button v-if="isReplyRewriting" class="rewrite-btn" @click="handleRewrite">
      确定编辑
    </button>
  </div>
</template>

<style lang="scss" scoped>
.btn-container {
  padding: 10px;
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;

  button {
    margin: 10px 0;
    height: 40px;
    width: 150px;
    font-size: 17px;
    white-space: nowrap;
    border-radius: 5px;
    overflow: hidden;
    cursor: pointer;
    flex-shrink: 0;
    transition: all 0.2s;

    &:hover {
      color: var(--kungalgame-white);
    }
  }
}

.confirm-btn {
  color: var(--kungalgame-blue-5);
  background-color: transparent;
  border: 1px solid var(--kungalgame-blue-5);

  &:hover {
    background-color: var(--kungalgame-blue-5);
    transition: 0.2s;
  }
}

.rewrite-btn {
  color: var(--kungalgame-red-4);
  background-color: transparent;
  border: 1px solid var(--kungalgame-red-4);

  &:hover {
    background-color: var(--kungalgame-red-4);
    transition: 0.2s;
  }
}

.advance-btn {
  color: var(--kungalgame-purple-4);
  background-color: transparent;
  border: 1px solid var(--kungalgame-purple-4);

  &:hover {
    background-color: var(--kungalgame-purple-4);
    transition: 0.2s;
  }
}

@media (max-width: 700px) {
  .btn-container {
    button {
      margin: 10px 0;
      height: 35px;
      width: 130px;
      font-size: 15px;
    }
  }
}
</style>
