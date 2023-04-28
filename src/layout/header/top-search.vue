<template>
  <el-autocomplete v-model="value"
                   :fetch-suggestions="querySearch"
                   style="max-width:240px"
                   :prefix-icon="IconSearch"
                   :placeholder="t('searchMenu')"
                   @select="handleSelect"
  >
    <template #default="{ item }">
      <div>{{ item['menuName'] }}</div>
    </template>
  </el-autocomplete>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { Search as IconSearch } from '@icon-park/vue-next'
import { useI18n } from 'vue-i18n'
import { useStoreAside } from '@/store/aside'
import * as routers from '@/use/use-router'
import type { IMenuItem } from '@/layout/aside-menu/api'

interface IMenuItemEd {
  path: string;
  menuName: string;
  name: string;
}

const { t } = useI18n()
const value = ref('')
const storeAside = useStoreAside()

const list = computed(() => {
  const arr: IMenuItemEd[] = []
  const recursion = (data: IMenuItem[], pEl: string[] = []) => {
    data.forEach((el) => {
      if (el?.children && el.children.length > 0) {
        recursion(el.children, pEl.concat(el.name))
      } else {
        arr.push({
          path: el.path,
          menuName: pEl.concat(el.name).join('/'),
          name: el.name
        })
      }
    })
    return arr
  }
  return recursion(storeAside.menus)
})

const createFilter = (queryString: string) => (restaurant: IMenuItemEd) => {
  const qs = queryString.toLowerCase()
  if (restaurant.menuName) {
    return restaurant.menuName.toLowerCase().indexOf(qs) > -1 ||
          (qs.length > 2 && restaurant.path.toLowerCase().indexOf(qs) > -1)
  }
  return false
}

const querySearch = (queryString: string, cb: (d: IMenuItemEd[]) => void) => {
  queryString = queryString.trim()
  const restaurants = list.value
  const results = queryString ? restaurants.filter(createFilter(queryString)) : restaurants
  cb(results)
}

const handleSelect = (data: any) => {
  const d = data as IMenuItemEd // ElementPlus 类型有问题
  routers.push(data.path, { title: d.name })
}
</script>

<i18n lang="yaml">
zh:
  searchMenu: '搜索菜单'
en:
  searchMenu: 'Search menu'
</i18n>
