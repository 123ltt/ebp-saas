import { useStoreTabs } from '@/store/tabs'
import router from '@/router'

interface Data {
  title?: string;
}

export function push (path: string, data: Data = {}) {
  const tabItem = {
    label: data.title ?? '',
    path
  }
  const storeTabs = useStoreTabs()
  storeTabs.addTab(tabItem)
  router.push(path)
}
