<template>
  <el-dropdown-item @click="onLogout">
    {{ t('logout') }}
  </el-dropdown-item>
</template>

<script setup lang="ts">
import { ElMessageBox, ElLoading } from 'element-plus'
import { noop } from '@zh/request'
import { useI18n } from 'vue-i18n'
import doLogout from './logout'

const { t } = useI18n()
const onLogout = () => {
  ElMessageBox.confirm(t('msg'), t('ui.tip'), {
    type: 'info',
    confirmButtonText: t('confirmBtn'),
    cancelButtonText: t('ui.cancel')
  }).then(() => {
    const loading = ElLoading.service({
      lock: true,
      text: t('loggingOut')
    })
    doLogout(() => loading.close())
  }).catch(noop)
}
</script>

<i18n lang="yaml">
zh:
  logout: '退出登陆'
  msg: '退出系统, 是否继续?'
  confirmBtn: '确定退出'
  cancelBtn: '取消'
  loggingOut: '正在退出登陆...'
en:
  logout: 'Logout'
  msg: 'Are you sure to continue to exit the system?'
  confirmBtn: 'Confirm Logout'
  cancelBtn: 'Cancel'
  loggingOut: 'Logging out...'
</i18n>
