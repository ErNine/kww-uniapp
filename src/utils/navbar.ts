/** 自定义导航栏机型适配（微信小程序胶囊避让） */

export interface NavBarInfo {
  /** 状态栏高度 px */
  statusBarHeight: number
  /** 导航内容区高度 px（与胶囊垂直对齐） */
  navBarHeight: number
  /** 右侧预留宽度 px（避开微信胶囊） */
  menuRight: number
  /** 底部安全区 px */
  safeBottom: number
  windowWidth: number
  windowHeight: number
}

export function getNavBarInfo(): NavBarInfo {
  const sys = uni.getSystemInfoSync()
  const statusBarHeight = sys.statusBarHeight ?? 20
  const safeBottom = sys.safeAreaInsets?.bottom ?? 0
  const windowWidth = sys.windowWidth ?? 375
  const windowHeight = sys.windowHeight ?? 667

  let navBarHeight = 44
  let menuRight = 12

  // #ifdef MP-WEIXIN
  try {
    const rect = uni.getMenuButtonBoundingClientRect()
    if (rect && typeof rect.width === 'number' && rect.width > 0 && rect.top > 0) {
      navBarHeight = (rect.top - statusBarHeight) * 2 + rect.height
      menuRight = Math.max(windowWidth - rect.left + 4, 12)
    }
  } catch {
    // 部分基础库异常时回退默认值
  }
  // #endif

  return {
    statusBarHeight,
    navBarHeight,
    menuRight,
    safeBottom,
    windowWidth,
    windowHeight,
  }
}
