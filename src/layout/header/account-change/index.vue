<template>
  <el-dropdown-item v-for="(item,index) in userInfoList"
                    :key="index"
                    :disabled="item.isCurrentAccount === 1"
                    @click="changeUsers(item)"
  >
    {{ item.name }}-{{ item.tenantId }}-{{ item.tenantNameAbbreviation }}
  </el-dropdown-item>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { ref } from 'vue'
import FingerprintJS from '@fingerprintjs/fingerprintjs'
import { ElMessageBox } from 'element-plus'
import { useStoreUserInfo } from '@/store/userInfo'
import type { IUserInfo } from '@/store/userInfo'
import { useStoreTabs } from '@/store/tabs'
import { getUserList, changeUser } from './api'
import type { userInfo } from './api'

const router = useRouter()
const userInfoList = ref<userInfo[]>([])
const storeUserInfo = useStoreUserInfo()
let fp = ''

getUserList(storeUserInfo.userInfo!.account).then((res) => {
  userInfoList.value = res
})

FingerprintJS.load().then((el) => {
  el.get().then((d) => {
    fp = d.visitorId
  })
})
// loginType 1:首次登录 2:密码过期
const catchLogin = (res: IUserInfo, loginType: 1|2) => {
  ElMessageBox.alert(`${res.account}-${res.tenant_id}${['', '未登录过', '密码过期'][loginType]}，请修改密码`, {
    confirmButtonText: '确定',
    callback: () => {
      router.push({ name: 'UpdatePassword', params: { loginType } })
    }
  })
}

const changeUsers = (item: userInfo) => {
  const params = { tenantId: item.tenantId, changeAccount: item.account, fp }
  changeUser(params).then((res) => {
    storeUserInfo.updateUserInfo(res)
    storeUserInfo.updateAccessToken(res.access_token)
    useStoreTabs().clearCache()
    if (!res.password_last_update_date) { // 首次登录
      catchLogin(res, 1)
    } else if (res.password_expired) { // 密码过期
      catchLogin(res, 2)
    } else {
      window.location.href = '/'
    }
  })
}
</script>
