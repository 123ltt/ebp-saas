<template>
  <el-row justify="center"
          class="h-100 align-items-center"
  >
    <el-col :sm="24"
            :md="18"
            :lg="12"
            :xl="10"
    >
      <el-card shadow="always"
               :body-style="{padding:0,height:'100%'}"
               class="container mx-1"
      >
        <div class="d-flex flex-stretch h-100">
          <div class="w-50 d-flex-column align-items-center justify-content-center hidden-xs-only bg-primary text-white">
            <div>
              <IconAcceleration :stroke-width="1"
                                size="16rem"
                                theme="two-tone"
                                :fill="['var(--el-color-primary-light-8)', 'var(--el-color-primary-light-2)']"
              />
            </div>
            <h2 class="fs-2 mt-0">
              {{ t(title) }}
            </h2>
          </div>
          <div class="flex-grow-1 p-4 right d-flex align-items-center justify-content-center">
            <div class="w-100">
              <div class="fs-3 mb-4 text-center position-relative">
                <span>{{ isMinScreen ? t(title) : t('title') }}</span>
                <I18nBtn class="position-absolute end-0" />
              </div>
              <el-form ref="formRef"
                       :model="formModel"
                       status-icon
                       :rules="rules"
                       @submit.prevent="onSubmit"
              >
                <el-form-item prop="tenantId">
                  <el-input v-model="formModel.tenantId"
                            :prefix-icon="IconIdCardH"
                            :placeholder="placeholder.tenantId"
                            size="large"
                  />
                </el-form-item>
                <el-form-item prop="username">
                  <el-input v-model="formModel.username"
                            :prefix-icon="IconUser"
                            :placeholder="placeholder.username"
                            size="large"
                  />
                </el-form-item>
                <el-form-item prop="password">
                  <el-input v-model="formModel.password"
                            type="password"
                            :prefix-icon="IconLock"
                            :placeholder="placeholder.password"
                            autocomplete="off"
                            show-password
                            size="large"
                  />
                </el-form-item>
                <el-form-item prop="captcha">
                  <div class="d-flex">
                    <el-input v-model="formModel.captcha"
                              :prefix-icon="IconProtect"
                              :placeholder="placeholder.captcha"
                              size="large"
                    />
                    <img :src="image"
                         height="40"
                         class="ms-2"
                         @click="onRefresh"
                    >
                  </div>
                </el-form-item>
                <el-form-item>
                  <el-button :loading="loading"
                             type="primary"
                             native-type="submit"
                             size="large"
                             class="w-100"
                  >
                    {{ t('loginBtn') }}
                  </el-button>
                </el-form-item>
              </el-form>
            </div>
          </div>
        </div>
      </el-card>
    </el-col>
  </el-row>
</template>

<script setup lang="ts">
import { reactive, ref, computed, onBeforeMount, watch } from 'vue'
import type { ElForm, FormRules, FormItemRule } from 'element-plus'
import { useRouter } from 'vue-router'
import { useMediaQuery, useStorage, useThrottleFn } from '@vueuse/core'
import {
  Acceleration as IconAcceleration, User as IconUser, Lock as IconLock, Protect as IconProtect, IdCardH as IconIdCardH
} from '@icon-park/vue-next'
import { Md5 } from 'ts-md5'
import FingerprintJS from '@fingerprintjs/fingerprintjs'
import { useI18n } from 'vue-i18n'
import { useStoreUserInfo } from '@/store/userInfo'
import { getCaptcha, doLogin } from './api'
import { SITE_NAME } from '@/config'
import I18nBtn from '@/components/i18n-btn.vue'

const storeUserInfo = useStoreUserInfo()
const { t, locale } = useI18n()
const router = useRouter()
const isMinScreen = useMediaQuery('(max-width: 768px)') // 值对应样式 hidden-xs-only
const image = ref('data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7')
const loading = ref(false)
const formRef = ref<InstanceType<typeof ElForm>>()
const title = storeUserInfo.siteName

const placeholder = computed(() => ({
  tenantId: t('tenantId'),
  username: t('account'),
  password: t('password'),
  captcha: t('captcha')
} as const))

const required = (key: keyof typeof placeholder.value): FormItemRule => ({ required: true, message: `${placeholder.value[key]}不能为空`, trigger: 'blur' })

const rules: FormRules = {
  username: [required('username')],
  password: [required('password')],
  captcha: [required('captcha')],
  tenantId: [required('tenantId')]
}

// 缓存用户名在本地
const cacheLoginInfo = useStorage('login', { t: '', u: '' })

const formModel = reactive({
  tenantId: cacheLoginInfo.value.t,
  username: cacheLoginInfo.value.u,
  password: '',
  captcha: '',
  key: '',
  fp: ''
})

const getCaptchaHandle = () => {
  getCaptcha().then((res) => {
    image.value = res.image
    formModel.key = res.key
  })
}

const onRefresh = useThrottleFn(getCaptchaHandle, 300)

const onSubmit = () => {
  if (loading.value) return
      formRef.value!.validate((valid) => {
        if (valid) {
          loading.value = true
          cacheLoginInfo.value = { t: formModel.tenantId, u: formModel.username }
          doLogin({
            tenantId: formModel.tenantId,
            username: formModel.username,
            password: Md5.hashStr(formModel.password),
            fp: formModel.fp
          }, { key: formModel.key, code: formModel.captcha }).then((res) => {
            storeUserInfo.updateUserInfo(res)
            storeUserInfo.updateAccessToken(res.access_token)
            storeUserInfo.updateRefreshAccessToken(res.refresh_token)
            router.replace('/')
          }).catch(() => {}).finally(() => {
            loading.value = false
            formModel.captcha = ''
            onRefresh()
          })
          return true
        }
        return false
      })
}

watch(() => locale.value, () => {
  document.title = t(SITE_NAME)
}, { immediate: true })

FingerprintJS.load().then((fp) => {
  fp.get().then((d) => {
    formModel.fp = d.visitorId
  })
})

getCaptchaHandle()

// 在登录之前清空用户缓存数据
onBeforeMount(() => storeUserInfo.clearUserInfo())
</script>

<style scoped lang="scss">
.container {
  height: 80vh;
  min-height: 300px;
  max-height: 420px;
}
</style>

<i18n lang="yaml">
zh:
  title: '登陆'
  tenantId: '租户ID'
  account: '帐号'
  password: '密码'
  captcha: '验证码'
  loginBtn: '登陆'
en:
  title: 'LOGIN'
  tenantId: 'Tenant ID'
  account: 'Account'
  password: 'Password'
  captcha: 'Captcha'
  loginBtn: 'Login'
</i18n>
