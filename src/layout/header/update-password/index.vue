<template>
  <div :class="['', 'page-mode h-100 d-flex justify-content-center align-items-center'][mode]">
    <div :class="['', 'pwd-container'][mode]">
      <div v-if="mode === 1"
           class="p-3 fs-4 fw-bold border-bottom"
      >
        {{ title }}
      </div>
      <el-form ref="formRef"
               v-loading="loading"
               :model="formData"
               :rules="rules"
               label-width="100px"
               class="form-box"
               @submit.prevent="onSubmit"
      >
        <el-form-item :label="t('oldPwd')"
                      prop="oldPassword"
                      label-width="80px"
        >
          <el-input v-model="formData.oldPassword"
                    show-password
          />
        </el-form-item>
        <el-form-item :label="t('newPwd')"
                      prop="newPassword"
                      label-width="80px"
        >
          <el-input v-model="formData.newPassword"
                    show-password
          />
        </el-form-item>
        <el-form-item :label="t('confirmPwd')"
                      prop="confirmPassword"
                      label-width="80px"
        >
          <el-input v-model="formData.confirmPassword"
                    show-password
          />
        </el-form-item>
        <el-form-item label=""
                      label-width="80px"
        >
          <el-button native-type="submit"
                     type="success"
          >
            {{ t('ui.confirm') }}
          </el-button>
          <el-button @click="onClose">
            {{ t('ui.cancel') }}
          </el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, inject, ref, onMounted } from 'vue'
import type { PropType } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import type { FormRules } from 'element-plus'
import { useStoreUserInfo } from '@/store/userInfo'
import { updatePassword } from './api'
import doLogout from '../logout/logout'

defineProps({
  // 显示模式： 0 页面（初始修改密码页面）， 1 弹窗修改密码（点击右上角的修改密码）
  mode: {
    type: Number as PropType<0 | 1>,
    default: 1
  }
})

const storeUserInfo = useStoreUserInfo()
const { t } = useI18n()
const route = useRoute()
const title = ref('')
const formRef = ref<any>(null)
const loading = ref(false)
const formData = reactive({
  oldPassword: '',
  newPassword: '',
  confirmPassword: ''
})
// 密码规则：大小写，数字，特殊字符4种任意选三种长度8-16
const reg = /^(?![a-zA-Z]+$)(?![A-Z0-9]+$)(?![A-Z\W_]+$)(?![a-z0-9]+$)(?![a-z\W_]+$)(?![0-9\W_]+$)[a-zA-Z0-9\W_]{8,16}$/
const rules: FormRules = {
  oldPassword: [
    { required: true, message: t('oldPwdRequired'), trigger: 'blur' }
  ],
  newPassword: [
    { required: true, message: t('newPwdRequired'), trigger: 'blur' },
    {
      validator: (rule, value, callback) => {
        if (value === formData.oldPassword) {
          callback(new Error(t('old!=new')))
        } else if (!reg.test(value)) {
          callback(new Error(t('pwdRule')))
        } else {
          callback()
        }
      }
    }
  ],
  confirmPassword: [
    { required: true, message: t('confirmPwdRequired'), trigger: 'blur' },
    {
      validator: (rule, value, callback) => {
        if (value === formData.newPassword) {
          callback()
        } else {
          callback(new Error(t('new!=confirm')))
        }
      }
    }
  ]
}

// 将 dialog-container.vue 中的 show 拿过来，并通过修改值来控制弹窗的关闭
const onClose = inject('close') as (...args: any[]) => {}

const onSubmit = () => {
  formRef.value.validate((valid: boolean) => {
    if (!valid) return
    loading.value = true
    updatePassword({
      userId: storeUserInfo.userInfo!.user_id,
      oldPassword: formData.oldPassword,
      newPassword: formData.newPassword,
      newPassword1: formData.confirmPassword
    }).then(() => {
      onClose?.()
      doLogout()
    }).finally(() => {
      loading.value = false
    })
  })
}

const setTitle = () => {
  const param = (route.params.loginType || localStorage.getItem('loginType')) as '1' | '2'
  const word = [t('firstTimeChangePwd'), t('pwdExpired')]

  if (param) {
    localStorage.setItem('loginType', param)
    title.value = word[+param - 1]
  }
}

onMounted(() => {
  setTitle()
})
</script>

<style lang="scss" scoped>
.page-mode {
  .pwd-container {
    border: 1px #ddd solid;
    border-radius: 5px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
    width: 500px;
  }
  .form-box {
    padding: 1rem 1rem 0;
  }
}
</style>

<i18n lang="yaml">
zh:
  oldPwd: '原密码'
  newPwd: '新密码'
  confirmPwd: '确认密码'
  oldPwdRequired: '原密码不能为空'
  newPwdRequired: '新密码密码不能为空'
  old!=new: '新密码与原密码不能一致'
  pwdRule: '密码规则：大小写，数字，特殊字符4种任意选三种长度8-16'
  confirmPwdRequired: '确认密码密码不能为空'
  new!=confirm: '确认密码与新密码不一致'
  firstTimeChangePwd: '首次登录修改密码'
  pwdExpired: '密码过期，请重新设置密码'
en:
  oldPwd: 'Old password'
  newPwd: 'New password'
  confirmPwd: 'Confirm password'
  oldPwdRequired: 'Old password cannot be empty'
  newPwdRequired: 'New password cannot be empty'
  old!=new: 'New password cannot be the same as old password'
  pwdRule: 'Uppercase, lowercase, numbers, special characters, 4 optional three lengths 8-16'
  confirmPwdRequired: 'Confirm password cannot be empty'
  new!=confirm: 'Confirm password cannot be the same as new password'
  firstTimeChangePwd: 'Change password at first login'
  pwdExpired: 'Password expired, please reset password'
</i18n>
