<template>
  <view class="page">
    <HallHeader
      :status-bar-height="statusBarHeight"
      :nav-bar-height="navBarHeight"
      :menu-right="menuRight"
      @search="onSearch"
      @members="onMembers"
    />

    <HallFilterBar
      :content-options="contentOptions"
      :software-options="softwareOptions"
      v-model:content-value="contentValue"
      v-model:software-value="softwareValue"
      @more="onFilterMore"
    />

    <HallMessageList :messages="messages" />

    <view class="footer">
      <HallQuickActions @expose="onExpose" @announce="onAnnounce" />
      <HallInputBar :badge="dmBadge" @input="openCompose" @dm="onDm" />
    </view>

    <HallComposeSheet
      v-model:show="composeVisible"
      :remain="remainCount"
      @send="onComposeSend"
      @increase="onIncrease"
    />
  </view>
</template>

<script setup lang="ts">
import { onUnmounted, ref, watch } from 'vue'
import { onHide, onShow } from '@dcloudio/uni-app'
import { useNavBar } from '@/composables/useNavBar'
import {
  HallHeader,
  HallFilterBar,
  HallMessageList,
  HallQuickActions,
  HallInputBar,
  HallComposeSheet,
  MOCK_MESSAGES,
} from '@/components/hall'
import type { HallFilterOption, HallMessageItem } from '@/components/hall/types'
import {
  ensureLogin,
  hallApi,
  HallContentType,
  messageApi,
  productApi,
  type HallPostItem,
} from '@/api'
import { HALL_POLL_INTERVAL_MS } from '@/config/env'
import { getCachedUser } from '@/api/auth'

const { statusBarHeight, navBarHeight, menuRight } = useNavBar()

/** 与后端 HallContentType 对齐（value 为数字字符串） */
const contentOptions: HallFilterOption[] = [
  { label: '全部', value: 'all' },
  { label: '问题求助', value: String(HallContentType.Help) },
  { label: '求购', value: String(HallContentType.Buy) },
  { label: '转让', value: String(HallContentType.Transfer) },
  { label: '经验分享', value: String(HallContentType.Share) },
  { label: '其他', value: String(HallContentType.Other) },
]

const softwareOptions = ref<HallFilterOption[]>([{ label: '全部', value: 'all' }])
const contentValue = ref('all')
const softwareValue = ref('all')
const messages = ref<HallMessageItem[]>([...MOCK_MESSAGES])
const dmBadge = ref(0)
const composeVisible = ref(false)
const remainCount = ref(5)
const fromApi = ref(false)
const lastId = ref(0)
let timer: ReturnType<typeof setInterval> | null = null

onShow(() => {
  void bootstrap()
  startPoll()
})
onHide(() => stopPoll())
onUnmounted(() => stopPoll())

watch([contentValue, softwareValue], () => {
  lastId.value = 0
  void refreshPosts(true)
})

function toast(title: string) {
  uni.showToast({ title, icon: 'none' })
}

function onSearch() {
  uni.navigateTo({ url: '/pages/search/search' })
}

function onMembers() {
  toast('成员列表即将开放')
}

function onFilterMore() {
  toast('更多筛选即将开放')
}

function onExpose() {
  toast('曝光台即将开放')
}

function onAnnounce() {
  toast('群公告即将开放')
}

function openCompose() {
  composeVisible.value = true
}

async function onDm() {
  await ensureLogin()
  uni.navigateTo({ url: '/pages/message/list' })
}

function onIncrease() {
  toast('发布额度由平台按日配置')
}

function mapPost(item: HallPostItem): HallMessageItem {
  const me = getCachedUser()
  const isSelf = me && item.member?.id != null && String(item.member.id) === String(me.id)
  if (item.is_system === 1) {
    return {
      id: String(item.id),
      kind: 'system',
      systemParts: [{ text: item.content || '系统消息' }],
    }
  }
  const kind = item.images?.length ? 'image' : 'text'
  return {
    id: String(item.id),
    kind,
    side: isSelf ? 'right' : 'left',
    avatar: item.member?.avatar || item.avatar || '/static/hall/avatar-1.png',
    content: item.content,
    images: item.images,
    meta: item.product?.name
      ? `${item.member?.nickname || ''} · ${item.product.name}`
      : item.member?.nickname || String(item.created_at || ''),
  }
}

async function bootstrap() {
  await ensureLogin()
  const products = await productApi.listSilent({ limit: 20 })
  if (products?.length) {
    softwareOptions.value = [
      { label: '全部', value: 'all' },
      ...products.map((p) => ({ label: p.name, value: String(p.id) })),
    ]
  }
  const quota = await hallApi.quotaSilent()
  if (quota && typeof quota.remaining === 'number') {
    remainCount.value = quota.remaining
  }
  const unread = await messageApi.unreadSilent()
  if (unread && typeof unread.count === 'number') {
    dmBadge.value = unread.count
  }
  await refreshPosts(true)
}

async function refreshPosts(reset = false) {
  const query: {
    after_id?: number
    content_type?: number
    product_id?: number
    limit?: number
  } = { limit: 30 }
  if (!reset && lastId.value > 0) {
    query.after_id = lastId.value
  }
  if (contentValue.value !== 'all') {
    query.content_type = Number(contentValue.value)
  }
  if (softwareValue.value !== 'all') {
    query.product_id = Number(softwareValue.value)
  }

  const list = await hallApi.postsSilent(query)
  if (!list) return

  fromApi.value = true
  const items = Array.isArray(list) ? list : []
  if (reset || !lastId.value) {
    // 首屏：后端无 after_id 时返回分页倒序
    messages.value = items.map(mapPost)
  } else if (items.length) {
    // 增量：按 id 升序追加
    const mapped = items.map(mapPost)
    const exist = new Set(messages.value.map((m) => m.id))
    const appended = mapped.filter((m) => !exist.has(m.id))
    if (appended.length) {
      messages.value = [...messages.value, ...appended]
    }
  }

  const maxId = items.reduce((max, cur) => Math.max(max, Number(cur.id) || 0), lastId.value)
  if (maxId > lastId.value) lastId.value = maxId
}

function startPoll() {
  stopPoll()
  timer = setInterval(() => {
    void refreshPosts(false)
    void messageApi.unreadSilent().then((u) => {
      if (u && typeof u.count === 'number') dmBadge.value = u.count
    })
  }, HALL_POLL_INTERVAL_MS)
}

function stopPoll() {
  if (timer) {
    clearInterval(timer)
    timer = null
  }
}

async function onComposeSend(payload: {
  contentType: string
  software: string
  content: string
  images: string[]
}) {
  const typeMap: Record<string, number> = {
    help: HallContentType.Help,
    buy: HallContentType.Buy,
    transfer: HallContentType.Transfer,
    share: HallContentType.Share,
    other: HallContentType.Other,
  }
  const contentType =
    typeMap[payload.contentType] ||
    (Number(payload.contentType) > 0 ? Number(payload.contentType) : HallContentType.Help)
  const productId =
    payload.software && payload.software !== 'all' && !Number.isNaN(Number(payload.software))
      ? Number(payload.software)
      : undefined

  try {
    await ensureLogin()
    const created = await hallApi.create({
      content_type: contentType,
      product_id: productId,
      content: payload.content,
      images: payload.images,
    })
    messages.value = [...messages.value, mapPost(created)]
    const idNum = Number(created.id) || 0
    if (idNum > lastId.value) lastId.value = idNum
    if (typeof created.quota_remaining === 'number') {
      remainCount.value = created.quota_remaining
    } else {
      remainCount.value = Math.max(remainCount.value - 1, 0)
    }
    return
  } catch {
    // 接口未就绪时本地追加
  }

  const now = new Date()
  const hh = String(now.getHours()).padStart(2, '0')
  const mm = String(now.getMinutes()).padStart(2, '0')
  const meta = `今天${hh}:${mm}·本地`

  let item: HallMessageItem
  if (payload.images.length > 0) {
    item = {
      id: `local-${Date.now()}`,
      kind: 'image',
      side: 'right',
      avatar: '/static/hall/avatar-self.png',
      content: payload.content || undefined,
      images: payload.images,
      meta,
    }
  } else {
    item = {
      id: `local-${Date.now()}`,
      kind: 'text',
      side: 'right',
      avatar: '/static/hall/avatar-self.png',
      content: payload.content,
      meta,
    }
  }
  messages.value = [...messages.value, item]
  remainCount.value = Math.max(remainCount.value - 1, 0)
  if (!fromApi.value) {
    toast('已本地发送，大厅接口就绪后将同步')
  }
}
</script>

<style scoped>
.page {
  height: 100%;
  display: flex;
  flex-direction: column;
  background: #ffffff;
  box-sizing: border-box;
}

.footer {
  flex-shrink: 0;
  background: #ffffff;
  border-top: 1rpx solid #e9ebef;
  padding-top: 16rpx;
  padding-bottom: constant(safe-area-inset-bottom);
  padding-bottom: env(safe-area-inset-bottom);
  box-sizing: border-box;
}
</style>
