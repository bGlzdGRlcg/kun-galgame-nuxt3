<script setup lang="ts">
import { onKeyStroke } from '@vueuse/core'
import { KUN_REGISTER_FORM_FIELD_MAP } from '~/constants/auth'
import { registerFormItem } from './registerFormItem'
import { checkForm, checkRegister } from './checkRegister'

const { isShowCapture, isCaptureSuccessful, codeSalt } = storeToRefs(
  useComponentMessageStore()
)

const isSendCode = ref(false)
const isAgree = ref(false)

const registerForm = reactive<Record<string, string>>({
  name: '',
  email: '',
  password: '',
  code: ''
})

const handleSendCode = () => {
  const result = checkForm(
    registerForm.name,
    registerForm.email,
    registerForm.password
  )
  if (!result) {
    return
  }

  if (!isAgree.value) {
    useMessage(10147, 'warn')
    return
  }

  if (!isCaptureSuccessful.value) {
    isShowCapture.value = true
    return
  }
  isSendCode.value = true
}

const handleRegister = async () => {
  if (!checkRegister(isSendCode.value, registerForm.code)) {
    return
  }

  const userInfo = await $fetch('/api/user/register', {
    method: 'POST',
    body: { codeSalt: codeSalt.value, ...registerForm },
    watch: false,
    ...kungalgameResponseHandler
  })

  if (userInfo) {
    codeSalt.value = ''
    useKunLoliInfo(`注册成功! 欢迎来到 ${kungal.name}`)
    usePersistUserStore().setUserInfo(userInfo)
    await navigateTo('/')
  }

  isCaptureSuccessful.value = false
}

onKeyStroke('Enter', async (e) => {
  e.preventDefault()
  await handleRegister()
})
</script>

<template>
  <div class="flex size-full items-center justify-center">
    <KunCard
      :is-transparent="false"
      :is-hoverable="false"
      class-name="w-88 p-8 select-none"
    >
      <form
        class="relative flex h-full flex-col items-center justify-center"
        @submit.prevent
      >
        <KunImage
          preload
          src="/placeholder.webp"
          placeholder="/placeholder.webp"
          class="w-full"
        />

        <div v-for="item in registerFormItem" :key="item.index" class="w-full">
          <label :for="item.value" class="text-sm">
            {{ KUN_REGISTER_FORM_FIELD_MAP[item.placeholder] }}
          </label>
          <KunInput
            :id="item.value"
            v-model="registerForm[item.value]"
            :autocomplete="item.autocomplete"
            :type="item.type"
            :class="cn('mt-2 mb-4 w-full', item.class)"
          />
        </div>

        <KunVerificationCode
          @click="handleSendCode"
          class-name="absolute right-4 bottom-23"
          :name="registerForm.name"
          :email="registerForm.email"
          to="register"
        />

        <KunCheckBox
          v-model="isAgree"
          class-name="mb-4 flex items-center gap-2 text-sm"
        >
          <span>我同意</span>
          <KunLink size="sm" to="/doc/notice/agreement">用户协议</KunLink>
          和
          <KunLink size="sm" to="/doc/notice/privacy">隐私政策</KunLink>
        </KunCheckBox>

        <KunButton
          @click="handleRegister"
          class="bg-primary w-full rounded-[24px] text-base tracking-wider text-white uppercase"
        >
          注册
        </KunButton>
      </form>

      <KunDivider class="my-4">
        <span class="mx-2">或</span>
      </KunDivider>

      <div class="flex flex-col gap-3">
        <KunLink to="/login">登录</KunLink>
        <KunLink to="/forgot">忘记密码</KunLink>
      </div>
    </KunCard>
  </div>
</template>
