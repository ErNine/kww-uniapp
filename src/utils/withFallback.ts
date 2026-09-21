import { ENABLE_MOCK_FALLBACK } from '@/config/env'

/**
 * 优先走真实接口；失败且开启降级时返回 fallback。
 * 后端未就绪时页面仍可展示 mock。
 */
export async function withFallback<T>(
  loader: () => Promise<T | null>,
  fallback: T | (() => T),
  opts?: { toastOnFallback?: boolean; fallbackToast?: string },
): Promise<{ data: T; fromApi: boolean }> {
  const remote = await loader()
  if (remote !== null && remote !== undefined) {
    return { data: remote, fromApi: true }
  }
  if (!ENABLE_MOCK_FALLBACK) {
    throw new Error(opts?.fallbackToast || '接口暂不可用')
  }
  if (opts?.toastOnFallback) {
    uni.showToast({
      title: opts.fallbackToast || '暂用本地数据',
      icon: 'none',
      duration: 1500,
    })
  }
  const data = typeof fallback === 'function' ? (fallback as () => T)() : fallback
  return { data, fromApi: false }
}
