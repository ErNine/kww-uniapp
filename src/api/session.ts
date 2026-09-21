import { setCachedUser, setToken, getToken, clearAuth, getCachedUser } from './auth'
import { authApi } from './modules'
import type { UserProfile } from './types'

const DEMO_OPENID_KEY = 'kww_demo_openid'

function getOrCreateDemoOpenid(): string {
  try {
    let id = uni.getStorageSync(DEMO_OPENID_KEY)
    if (!id) {
      id = `mp_demo_${Date.now().toString(36)}`
      uni.setStorageSync(DEMO_OPENID_KEY, id)
    }
    return String(id)
  } catch {
    return `mp_demo_${Date.now().toString(36)}`
  }
}

/**
 * 确保已登录。本期后端为简化 openid/mobile 登录，非真实微信换码。
 * 有 token 则拉 /auth/me；否则用本地 demo openid 登录。
 */
export async function ensureLogin(opts?: {
  nickname?: string
  force?: boolean
}): Promise<UserProfile | null> {
  if (!opts?.force && getToken()) {
    const me = await authApi.meSilent()
    if (me) {
      setCachedUser(me)
      return me
    }
    clearAuth()
  }

  try {
    const res = await authApi.login({
      openid: getOrCreateDemoOpenid(),
      nickname: opts?.nickname || '坑位网用户',
    })
    setToken(res.token)
    setCachedUser(res.member)
    return res.member
  } catch {
    return getCachedUser()
  }
}
