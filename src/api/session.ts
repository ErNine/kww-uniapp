import {
  clearAuth,
  getCachedUser,
  getRole,
  getToken,
  isLoggedIn,
  setCachedUser,
  setRole,
  setToken,
  type MockRole,
} from './auth'
import { authApi } from './modules'
import type { MerchantItem, UserProfile } from './types'

export type { MockRole }

const ROLE_LABEL: Record<MockRole, string> = {
  user: '普通用户',
  merchant: '坑位商',
}

export function roleLabel(role?: MockRole | '' | null) {
  if (role === 'merchant') return ROLE_LABEL.merchant
  if (role === 'user') return ROLE_LABEL.user
  return '未登录'
}

function normalizeMember(
  member: UserProfile,
  merchant?: MerchantItem | null,
  role?: string,
): UserProfile {
  const next: UserProfile = { ...member }
  if (role === 'merchant' && merchant) {
    next.merchant = merchant
  } else if (role === 'user') {
    next.merchant = null
  } else if (merchant) {
    next.merchant = merchant
  }
  return next
}

/**
 * 模拟登录：POST /auth/login { identity: user|merchant }
 */
export async function mockLogin(role: MockRole): Promise<UserProfile> {
  const res = await authApi.login({ identity: role })
  setToken(res.token)
  const resolvedRole = (res.role === 'merchant' || res.role === 'user' ? res.role : role) as MockRole
  setRole(resolvedRole)
  const member = normalizeMember(res.member, res.merchant, resolvedRole)
  setCachedUser(member)
  return member
}

/** 刷新当前登录态资料；未登录返回 null */
export async function refreshProfile(): Promise<UserProfile | null> {
  if (!getToken()) return null
  const payload = await authApi.meSilent()
  if (!payload) {
    clearAuth()
    return null
  }

  // 兼容：旧形态直接返回 member；新形态 { role, member, merchant }
  const anyPayload = payload as unknown as Record<string, unknown>
  if (anyPayload.member && typeof anyPayload.member === 'object') {
    const role = (anyPayload.role === 'merchant' || anyPayload.role === 'user'
      ? anyPayload.role
      : undefined) as MockRole | undefined
    const member = normalizeMember(
      anyPayload.member as UserProfile,
      (anyPayload.merchant as MerchantItem | null | undefined) ?? null,
      role,
    )
    if (role) setRole(role)
    setCachedUser(member)
    return member
  }

  const member = payload as unknown as UserProfile
  setCachedUser(member)
  if (!getRole()) setRole(member.merchant?.id ? 'merchant' : 'user')
  return member
}

/**
 * 需要登录时调用。未登录则跳转登录页。
 */
export async function requireAuth(opts?: {
  redirect?: string
  requireMerchant?: boolean
  silent?: boolean
}): Promise<UserProfile | null> {
  if (!isLoggedIn()) {
    if (!opts?.silent) goLoginPage(opts?.redirect, opts?.requireMerchant)
    return null
  }

  const me = (await refreshProfile()) || getCachedUser()
  if (!me) {
    if (!opts?.silent) goLoginPage(opts?.redirect, opts?.requireMerchant)
    return null
  }

  if (opts?.requireMerchant && getRole() !== 'merchant') {
    if (!opts?.silent) {
      uni.showToast({ title: '请切换为坑位商身份', icon: 'none' })
      setTimeout(() => goLoginPage(opts.redirect, true), 400)
    }
    return null
  }

  return me
}

/** @deprecated 兼容旧调用 */
export async function ensureLogin(opts?: {
  nickname?: string
  force?: boolean
  redirect?: string
  requireMerchant?: boolean
}): Promise<UserProfile | null> {
  if (opts?.force) {
    clearAuth()
    goLoginPage(opts.redirect, opts.requireMerchant)
    return null
  }
  return requireAuth({
    redirect: opts?.redirect,
    requireMerchant: opts?.requireMerchant,
  })
}

export function goLoginPage(redirect?: string, requireMerchant?: boolean) {
  const qs = [
    redirect ? `redirect=${encodeURIComponent(redirect)}` : '',
    requireMerchant ? 'require=merchant' : '',
    'switch=1',
  ]
    .filter(Boolean)
    .join('&')
  const url = `/pages/login/login${qs ? `?${qs}` : ''}`
  uni.navigateTo({
    url,
    fail: () => {
      uni.reLaunch({ url })
    },
  })
}

export function logoutToLogin() {
  clearAuth()
  uni.reLaunch({ url: '/pages/login/login' })
}
