import {
  TOKEN_STORAGE_KEY,
  USER_STORAGE_KEY,
  ROLE_STORAGE_KEY,
  type MockRole,
} from '@/config/env'
import type { UserProfile } from './types'

export type { MockRole }

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

export function getRole(): MockRole | '' {
  try {
    const role = uni.getStorageSync(ROLE_STORAGE_KEY)
    return role === 'user' || role === 'merchant' ? role : ''
  } catch {
    return ''
  }
}

export function setRole(role: MockRole | null) {
  if (!role) {
    try {
      uni.removeStorageSync(ROLE_STORAGE_KEY)
    } catch {
      // ignore
    }
    return
  }
  uni.setStorageSync(ROLE_STORAGE_KEY, role)
}

export function isLoggedIn(): boolean {
  return Boolean(getToken())
}

export function clearAuth() {
  clearToken()
  setCachedUser(null)
  setRole(null)
}
