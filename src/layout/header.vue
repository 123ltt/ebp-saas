<template>
  <div class="d-flex align-items-center h-100">
    <template v-if="isVertical">
      <el-button class="border-0 mx-0 el-button-transparent rotate-90"
                 :class="{active:storeAside.collapse}"
                 size="small"
                 :icon="IconHamburgerButton"
                 @click="toggle"
      />
      <TopSearch class="ms-2" />
      <div class="flex-grow-1" />
    </template>
    <Theme />
    <Fullscreen />
    <I18nBtn />
    <el-dropdown trigger="click">
      <el-button class="el-dropdown-link border-0 el-button-transparent"
                 size="small"
      >
        {{ userInfo.userInfo!.nick_name }}
        <el-icon><IconDown /></el-icon>
      </el-button>
      <template #dropdown>
        <el-dropdown-menu>
          <account-change />
          <el-dropdown-item divided
                            @click="editPwd"
          >
            {{ t('changePassword') }}
          </el-dropdown-item>
          <Logout />
        </el-dropdown-menu>
      </template>
    </el-dropdown>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { HamburgerButton as IconHamburgerButton, Down as IconDown } from '@icon-park/vue-next'
import { useStoreAside } from '@/store/aside'
import TopSearch from './header/top-search.vue'
import { useStoreUserInfo } from '@/store/userInfo'
import Theme from './header/theme/index.vue'
import Fullscreen from './header/fullscreen.vue'
import UpdatePassword from './header/update-password/index.vue'
import Logout from './header/logout/index.vue'
import accountChange from './header/account-change/index.vue'
import themes from '@/themes'
import I18nBtn from '@/components/i18n-btn.vue'
import { useI18n } from 'vue-i18n'
import { useInsert } from 'vue-insert-component'

const { t } = useI18n()

const editPwd = () => {
  useInsert({
    title: t('changePassword'),
    component: UpdatePassword,
    props: { mode: 0 },
    width: '460px'
  })
}

const storeAside = useStoreAside()
const toggle = storeAside.toggle
const userInfo = useStoreUserInfo()
const isVertical = computed(() => themes.menuMode.value === 'vertical')
</script>

<i18n lang="yaml">
zh:
  changePassword: '修改密码'
en:
  changePassword: 'Change password'
</i18n>
