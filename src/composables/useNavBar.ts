import { ref } from 'vue'
import { getNavBarInfo } from '@/utils/navbar'

/** 页面级自定义导航栏适配 */
export function useNavBar() {
  const info = getNavBarInfo()
  return {
    statusBarHeight: ref(info.statusBarHeight),
    navBarHeight: ref(info.navBarHeight),
    menuRight: ref(info.menuRight),
    safeBottom: ref(info.safeBottom),
    windowWidth: ref(info.windowWidth),
    windowHeight: ref(info.windowHeight),
  }
}
