<script setup lang="ts">
import { KUN_REGISTER_FORM_FIELD_MAP } from '~/constants/auth'
import { registerFormItem } from './registerFormItem'
import { checkRegisterForm } from './checkRegister'
import type { Pinia } from 'pinia'

const info = useComponentMessageStore()
const { isShowCapture, isCaptureSuccessful } = storeToRefs(
  useComponentMessageStore()
)

const { checkForm, checkRegister } = checkRegisterForm.asyncData(
  useNuxtApp().$pinia as Pinia
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
    body: registerForm,
    watch: false,
    ...kungalgameResponseHandler
  })

  if (userInfo) {
    info.info(`登陆成功! 欢迎来到 ${kungal.name}`)
    useMessage(10135, 'success')
    usePersistUserStore().setUserInfo(userInfo)
    navigateTo('/')
  }

  isCaptureSuccessful.value = false
}
</script>

<template>
  <div class="register">
    <form class="form" @submit.prevent>
      <NuxtImg
        preload
        src="/placeholder.webp"
        placeholder="/placeholder.webp"
      />

      <div
        class="input-container"
        v-for="item in registerFormItem"
        :key="item.index"
      >
        <label :for="item.value">
          {{ KUN_REGISTER_FORM_FIELD_MAP[item.placeholder] }}
        </label>
        <KunInput
          :id="item.value"
          v-model="registerForm[item.value]"
          :autocomplete="item.autocomplete"
          :type="item.type"
          :class="item.class"
        />
      </div>

      <KunVerificationCode
        @click="handleSendCode"
        class="code"
        :name="registerForm.name"
        :email="registerForm.email"
        to="register"
      />

      <KunCheckBox v-model="isAgree">
        <span>我同意</span>
        <NuxtLink to="/agreement">用户协议</NuxtLink>
        <NuxtLink to="/privacy">隐私政策</NuxtLink>
      </KunCheckBox>

      <KunButton @click="handleRegister">注册</KunButton>
    </form>

    <KunDivider margin="16px 0">
      <span>或</span>
    </KunDivider>

    <div class="more">
      <NuxtLink to="/login">登录</NuxtLink>

      <NuxtLink to="/forgot">忘记密码</NuxtLink>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.register {
  width: 360px;
  padding: 32px;
  margin-bottom: 32px;
  user-select: none;
}

.form {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  height: 100%;
  position: relative;

  img {
    width: 100%;
  }

  .input-container {
    width: 100%;

    label {
      font-size: 14px;
    }
  }

  .kun-input {
    width: 100%;
    margin-bottom: 16px;
    margin-top: 8px;
    padding: 12px;
  }

  .code {
    position: absolute;
    bottom: 94px;
    right: 16px;
  }

  .kun-checkbox {
    display: flex;
    align-items: center;
    font-size: small;
    margin-bottom: 16px;

    a {
      color: var(--kungalgame-blue-5);
      text-decoration: underline;
      text-underline-offset: 3px;
      margin-left: 4px;
    }
  }

  .kun-button {
    width: 100%;
    background-color: var(--kungalgame-blue-5);
    color: var(--kungalgame-white);
    font-size: 16px;
    border-radius: 24px;
    letter-spacing: 1px;
    text-transform: uppercase;
  }
}

.kun-divider {
  span {
    margin: 0 8px;
  }
}

.more {
  display: flex;
  flex-direction: column;

  a {
    margin-bottom: 16px;
    color: var(--kungalgame-blue-5);
    text-decoration: underline;
    text-underline-offset: 3px;
  }
}
</style>
