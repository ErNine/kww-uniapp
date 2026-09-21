import { TOKEN_STORAGE_KEY, USER_STORAGE_KEY } from '@/config/env'
import type { UserProfile } from './types'

export function getToken(): string {
  try {
    return uni.getStorageSync(TOKEN_STORAGE_KEY) || ''
  } catch {
    return ''
  }
}

export function setToken(token: string) {
  uni.setStorageSync(TOKEN_STORAGE_KEY, token)
}

export function clearToken() {
  try {
    uni.removeStorageSync(TOKEN_STORAGE_KEY)
  } catch {
    // ignore
  }
}

export function getCachedUser(): UserProfile | null {
  try {
    const raw = uni.getStorageSync(USER_STORAGE_KEY)
    if (!raw) return null
    return typeof raw === 'string' ? (JSON.parse(raw) as UserProfile) : (raw as UserProfile)
  } catch {
    return null
  }
}

export function setCachedUser(user: UserProfile | null) {
  if (!user) {
    try {
      uni.removeStorageSync(USER_STORAGE_KEY)
    } catch {
      // ignore
    }
    return
  }
  uni.setStorageSync(USER_STORAGE_KEY, user)
}

export function clearAuth() {
  clearToken()
  setCachedUser(null)
}
