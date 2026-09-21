import { API_BASE_URL } from '@/config/env'
import { clearAuth, getToken } from './auth'
import type { ApiResponse } from './types'

export class ApiError extends Error {
  code: number
  statusCode?: number

  constructor(message: string, code = 1, statusCode?: number) {
    super(message)
    this.name = 'ApiError'
    this.code = code
    this.statusCode = statusCode
  }
}

export interface RequestOptions {
  /** 相对 /app 的路径，如 /portal/home */
  url: string
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'
  data?: Record<string, unknown> | unknown
  query?: Record<string, unknown>
  header?: Record<string, string>
  /** 是否携带 Bearer；默认有 token 就带 */
  auth?: boolean
  /** 失败时是否 toast；默认 false（由业务层决定） */
  toast?: boolean
  /** 超时毫秒 */
  timeout?: number
}

function buildUrl(path: string, query?: Record<string, unknown>) {
  const normalized = path.startsWith('/') ? path : `/${path}`
  let url = `${API_BASE_URL}${normalized}`
  if (query && Object.keys(query).length) {
    const qs = Object.entries(query)
      .filter(([, v]) => v !== undefined && v !== null && v !== '')
      .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(String(v))}`)
      .join('&')
    if (qs) url += (url.includes('?') ? '&' : '?') + qs
  }
  return url
}

export function request<T = unknown>(options: RequestOptions): Promise<T> {
  const {
    url,
    method = 'GET',
    data,
    query,
    header = {},
    auth = true,
    toast = false,
    timeout = 15000,
  } = options

  const token = getToken()
  const headers: Record<string, string> = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    ...header,
  }
  if (auth && token) {
    headers.Authorization = `Bearer ${token}`
  }

  return new Promise((resolve, reject) => {
    uni.request({
      url: buildUrl(url, query),
      method,
      data: data as UniApp.RequestOptions['data'],
      header: headers,
      timeout,
      success: (res) => {
        const statusCode = res.statusCode || 0
        const body = res.data as ApiResponse<T> | string | null

        if (statusCode === 401) {
          clearAuth()
          const err = new ApiError('请先登录', 401, statusCode)
          if (toast) uni.showToast({ title: err.message, icon: 'none' })
          reject(err)
          return
        }

        if (statusCode < 200 || statusCode >= 300) {
          const msg =
            typeof body === 'object' && body && 'message' in body
              ? String((body as ApiResponse).message || '请求失败')
              : `网络错误(${statusCode})`
          const err = new ApiError(msg, statusCode, statusCode)
          if (toast) uni.showToast({ title: err.message, icon: 'none' })
          reject(err)
          return
        }

        if (typeof body !== 'object' || body === null) {
          const err = new ApiError('响应格式错误', 1, statusCode)
          if (toast) uni.showToast({ title: err.message, icon: 'none' })
          reject(err)
          return
        }

        const payload = body as ApiResponse<T>
        if (payload.code !== 0 && payload.code !== 200) {
          const err = new ApiError(payload.message || '业务错误', payload.code, statusCode)
          if (toast) uni.showToast({ title: err.message, icon: 'none' })
          reject(err)
          return
        }

        resolve(payload.data)
      },
      fail: (err) => {
        const message = err.errMsg?.includes('timeout')
          ? '请求超时'
          : '网络不可用，请稍后重试'
        const apiErr = new ApiError(message, -1)
        if (toast) uni.showToast({ title: apiErr.message, icon: 'none' })
        reject(apiErr)
      },
    })
  })
}

/** 静默请求：失败返回 null，不抛错（用于页面降级） */
export async function requestSilent<T = unknown>(
  options: RequestOptions,
): Promise<T | null> {
  try {
    return await request<T>(options)
  } catch {
    return null
  }
}

export function get<T = unknown>(
  url: string,
  query?: Record<string, unknown>,
  opts?: Omit<RequestOptions, 'url' | 'method' | 'query'>,
) {
  return request<T>({ url, method: 'GET', query, ...opts })
}

export function post<T = unknown>(
  url: string,
  data?: Record<string, unknown> | unknown,
  opts?: Omit<RequestOptions, 'url' | 'method' | 'data'>,
) {
  return request<T>({ url, method: 'POST', data, ...opts })
}

export function put<T = unknown>(
  url: string,
  data?: Record<string, unknown> | unknown,
  opts?: Omit<RequestOptions, 'url' | 'method' | 'data'>,
) {
  return request<T>({ url, method: 'PUT', data, ...opts })
}

export function del<T = unknown>(
  url: string,
  opts?: Omit<RequestOptions, 'url' | 'method'>,
) {
  return request<T>({ url, method: 'DELETE', ...opts })
}
