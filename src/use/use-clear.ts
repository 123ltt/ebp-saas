import { useStoreTabs } from '@/store/tabs'
import { useStoreUserInfo } from '@/store/userInfo'
import { useStoreReady } from '@/store/ready'

export default () => {
  useStoreTabs().clearCache()
  useStoreUserInfo().clearUserInfo()
  useStoreReady().updateReady(false)
}
