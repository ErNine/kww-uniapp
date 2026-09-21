/**
 * Client API 环境配置
 * 可通过 .env / .env.development / .env.production 的 VITE_API_BASE_URL 切换
 * 默认指向本地后端 /app 前缀（Xasuma Client 场景）
 */

const DEFAULT_BASE_URL = 'http://127.0.0.1:8000/app'

export const API_BASE_URL = (
  (import.meta.env.VITE_API_BASE_URL as string | undefined) ||
  DEFAULT_BASE_URL
).replace(/\/$/, '')

/** 是否启用接口失败时的本地 mock 降级 */
export const ENABLE_MOCK_FALLBACK =
  String(import.meta.env.VITE_ENABLE_MOCK_FALLBACK ?? 'true') !== 'false'

/** 互助大厅 / 私信轮询间隔（毫秒） */
export const HALL_POLL_INTERVAL_MS = Number(
  import.meta.env.VITE_HALL_POLL_INTERVAL_MS ?? 8000,
)

export const TOKEN_STORAGE_KEY = 'kww_client_token'
export const USER_STORAGE_KEY = 'kww_client_user'
export const ROLE_STORAGE_KEY = 'kww_client_role'

/** 模拟登录固定 openid（与后端 MockIdentities 一致） */
export const MOCK_OPENID = {
  user: 'mock_user',
  merchant: 'mock_merchant',
} as const

export type MockRole = keyof typeof MOCK_OPENID
