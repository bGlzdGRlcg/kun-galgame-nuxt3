<script setup lang="ts">
import { createWebsiteSchema, updateWebsiteSchema } from '~/validations/website'
import {
  KUN_WEBSITE_CATEGORY_MAP,
  KUN_WEBSITE_LANGUAGE_MAP,
  KUN_WEBSITE_ACG_LIMIT_MAP
} from '~/constants/galgameWebsite'
import type { CreateWebsitePayload, UpdateWebsitePayload } from './types'
import type { KunSelectOption } from '~/components/kun/select/type'

type WebsiteData = CreateWebsitePayload & { websiteId?: number }

const props = defineProps<{
  modelValue: boolean
  initialData?: WebsiteData
}>()

const emits = defineEmits<{
  'update:modelValue': [value: boolean]
  submit: [data: CreateWebsitePayload | UpdateWebsitePayload]
}>()

const categoryOptions: KunSelectOption[] = Object.entries(
  KUN_WEBSITE_CATEGORY_MAP
).map(([value, label], index) => ({ value: index + 1, label }))

const languageOptions: KunSelectOption[] = Object.entries(
  KUN_WEBSITE_LANGUAGE_MAP
).map(([value, label]) => ({ value, label }))

const ageLimitOptions: KunSelectOption[] = Object.entries(
  KUN_WEBSITE_ACG_LIMIT_MAP
).map(([value, label]) => ({ value, label }))

const isModalOpen = computed({
  get: () => props.modelValue,
  set: (value) => emits('update:modelValue', value)
})

const isEditing = computed(() => !!props.initialData?.websiteId)
const newDomain = ref('')

const getInitialFormData = (): WebsiteData => ({
  name: '',
  url: '',
  description: '',
  icon: '',
  language: 'zh-cn',
  age_limit: 'all',
  category_id: 1,
  tag_ids: [],
  domain: [],
  create_time: '',
  ...(props.initialData || {})
})

const formData = reactive<WebsiteData>(getInitialFormData())

const { data, status } = useFetch('/api/website-tag', {
  method: 'GET',
  ...kungalgameResponseHandler
})

watch(
  () => isModalOpen.value,
  (isOpen) => {
    if (isOpen) {
      Object.assign(formData, getInitialFormData())
    }
  }
)

const addDomain = () => {
  if (newDomain.value && !formData.domain?.includes(newDomain.value)) {
    formData.domain?.push(newDomain.value)
    newDomain.value = ''
  }
}

const removeDomain = (index: number) => {
  formData.domain?.splice(index, 1)
}

const handleSubmit = () => {
  const schema = isEditing.value ? updateWebsiteSchema : createWebsiteSchema
  const result = schema.safeParse(formData)

  if (!result.success) {
    const message = JSON.parse(result.error.message)[0]
    useMessage(
      `位置: ${message.path[0]} - 错误提示: ${message.message}`,
      'warn'
    )
    return
  }

  emits('submit', result.data)
  isModalOpen.value = false
}
</script>

<template>
  <KunModal
    :is-dismissable="false"
    v-model:modal-value="isModalOpen"
    inner-class-name="max-w-2xl"
  >
    <form @submit.prevent>
      <h2 class="mb-4 text-xl font-bold">
        {{ isEditing ? '编辑网站' : '创建新网站' }}
      </h2>

      <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
        <KunInput v-model="formData.name" label="网站名称" required />
        <KunInput v-model="formData.icon" label="图标 URL" required />
        <KunInput
          v-model="formData.create_time"
          label="网站创建时间"
          required
        />
        <KunInput
          v-model="formData.url"
          label="网站主域名"
          :placeholder="kungal.domain.main"
          class-name="md:col-span-2"
        />

        <KunTextarea
          v-model="formData.description"
          label="网站介绍"
          required
          auto-grow
          show-char-count
          :maxlength="170"
          class-name="md:col-span-2"
        />

        <KunSelect
          v-model="formData.category_id"
          label="分类"
          :options="categoryOptions"
        />

        <KunSelect
          v-model="formData.language"
          label="语言"
          :options="languageOptions"
        />

        <KunSelect
          v-model="formData.age_limit"
          label="年龄限制"
          :options="ageLimitOptions"
        />

        <div class="md:col-span-2">
          <label class="mb-1 block text-sm font-medium">可用域名 (可选)</label>
          <div class="flex gap-2">
            <KunInput
              v-model="newDomain"
              placeholder="添加其他可用域名"
              class-name="flex-grow"
              @keydown.enter.prevent="addDomain"
            />
            <KunButton
              :is-icon-only="true"
              color="primary"
              @click="addDomain"
              class-name="shrink-0"
            >
              <KunIcon name="lucide:plus" />
            </KunButton>
          </div>
          <div
            v-if="formData.domain && formData.domain.length > 0"
            class="mt-2 flex flex-wrap gap-2"
          >
            <span
              v-for="(domain, index) in formData.domain"
              :key="domain"
              class="bg-default-100 flex items-center rounded-full px-3 py-1 text-sm"
            >
              {{ domain }}
              <button
                type="button"
                class="text-default-500 hover:text-default-700 ml-2"
                @click="removeDomain(index)"
              >
                <KunIcon name="lucide:x" class="h-4 w-4" />
              </button>
            </span>
          </div>
        </div>

        <div v-if="data" class="md:col-span-2">
          <label class="mb-1 block text-sm font-medium">
            标签 (可选, 最多10个)
          </label>
          <div v-if="status === 'pending'">正在加载标签...</div>

          <WebsiteModalTagSelector
            :tags="data"
            :tag-ids="formData.tag_ids"
            @update-ids="(value) => (formData.tag_ids = value)"
          />
        </div>
      </div>

      <div class="mt-6 flex justify-end gap-3">
        <KunButton variant="light" color="danger" @click="isModalOpen = false">
          取消
        </KunButton>
        <KunButton color="primary" @click="handleSubmit">
          {{ isEditing ? '保存更改' : '创建' }}
        </KunButton>
      </div>
    </form>
  </KunModal>
</template>
