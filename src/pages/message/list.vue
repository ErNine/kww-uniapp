<template>
  <view class="page">
    <view class="nav" :style="{ paddingTop: statusBarHeight + 'px' }">
      <view
        class="nav-inner"
        :style="{ height: navBarHeight + 'px', paddingRight: menuRight + 'px' }"
      >
        <view class="nav-left" @tap="goBack">
          <text class="back-icon">‹</text>
        </view>
        <text class="nav-title">私信留言</text>
        <view class="nav-right" />
      </view>
    </view>

    <scroll-view
      class="scroll"
      scroll-y
      :show-scrollbar="false"
      @scrolltolower="loadMore"
    >
      <view v-if="loading && !threads.length" class="empty">
        <text class="empty-text">加载中…</text>
      </view>
      <view v-else-if="!threads.length" class="empty">
        <text class="empty-text">{{ emptyText }}</text>
      </view>
      <view
        v-for="item in threads"
        :key="item.id"
        class="row"
        @tap="openThread(item)"
      >
        <image
          class="avatar"
          :src="item.peer_avatar || '/static/hall/avatar-1.png'"
          mode="aspectFill"
        />
        <view class="body">
          <view class="top">
            <text class="name">{{ item.peer_name || item.title || '会话' }}</text>
            <text class="time">{{ formatTime(item.updated_at) }}</text>
          </view>
          <view class="bottom">
            <text class="preview">{{ item.last_message || '暂无消息' }}</text>
            <view v-if="item.unread" class="badge">
              <text class="badge-text">{{ item.unread > 99 ? '99+' : item.unread }}</text>
            </view>
          </view>
        </view>
      </view>
      <view class="bottom-pad" />
    </scroll-view>
  </view>
</template>

<script setup lang="ts">
import { onUnmounted, ref } from 'vue'
import { onHide, onShow } from '@dcloudio/uni-app'
import { useNavBar } from '@/composables/useNavBar'
import { ensureLogin, messageApi, type MessageThreadItem } from '@/api'
import { HALL_POLL_INTERVAL_MS } from '@/config/env'

const { statusBarHeight, navBarHeight, menuRight } = useNavBar()

const threads = ref<MessageThreadItem[]>([])
const loading = ref(false)
const emptyText = ref('暂无私信，可从详情页发起咨询')
let timer: ReturnType<typeof setInterval> | null = null

onShow(() => {
  refresh()
  startPoll()
})

onHide(() => stopPoll())
onUnmounted(() => stopPoll())

function goBack() {
  uni.navigateBack({ fail: () => uni.switchTab({ url: '/pages/order/order' }) })
}

async function refresh() {
  loading.value = true
  await ensureLogin()
  const list = await messageApi.threadsSilent({ page: 1, limit: 50 })
  loading.value = false
  if (list) {
    threads.value = list
  } else {
    threads.value = []
    emptyText.value = '留言服务暂未就绪（轮询接口对接中）'
  }
}

function loadMore() {
  // 首版仅拉第一页；后端分页就绪后再扩展
}

function startPoll() {
  stopPoll()
  timer = setInterval(() => {
    void refreshQuiet()
  }, HALL_POLL_INTERVAL_MS)
}

async function refreshQuiet() {
  const list = await messageApi.threadsSilent({ page: 1, limit: 50 })
  if (list) threads.value = list
}

function stopPoll() {
  if (timer) {
    clearInterval(timer)
    timer = null
  }
}

function openThread(item: MessageThreadItem) {
  uni.navigateTo({
    url: `/pages/message/thread?id=${encodeURIComponent(String(item.id))}&title=${encodeURIComponent(item.peer_name || item.title || '会话')}`,
  })
}

function formatTime(v?: string | number) {
  if (!v) return ''
  if (typeof v === 'string') return v
  const d = new Date(v * (v < 1e12 ? 1000 : 1))
  const hh = String(d.getHours()).padStart(2, '0')
  const mm = String(d.getMinutes()).padStart(2, '0')
  return `${hh}:${mm}`
}
</script>

<style scoped>
.page {
  height: 100%;
  display: flex;
  flex-direction: column;
  background: #f5f7fb;
}
.nav {
  background: #fff;
  flex-shrink: 0;
  border-bottom: 1rpx solid #f0f1f5;
}
.nav-inner {
  display: flex;
  align-items: center;
  padding: 0 24rpx;
  box-sizing: border-box;
}
.nav-left,
.nav-right {
  width: 64rpx;
  height: 64rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}
.back-icon {
  font-size: 48rpx;
  color: #1a1a1a;
  line-height: 1;
}
.nav-title {
  flex: 1;
  text-align: center;
  font-size: 32rpx;
  font-weight: 600;
  color: #1a1a1a;
}
.scroll {
  flex: 1;
  height: 0;
}
.row {
  display: flex;
  align-items: center;
  gap: 20rpx;
  padding: 24rpx 28rpx;
  background: #fff;
  border-bottom: 1rpx solid #f2f3f7;
}
.avatar {
  width: 88rpx;
  height: 88rpx;
  border-radius: 44rpx;
  background: #eef1f6;
  flex-shrink: 0;
}
.body {
  flex: 1;
  min-width: 0;
}
.top,
.bottom {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16rpx;
}
.name {
  font-size: 30rpx;
  color: #1a1a1a;
  font-weight: 600;
}
.time {
  font-size: 22rpx;
  color: #9aa3b2;
  flex-shrink: 0;
}
.preview {
  margin-top: 10rpx;
  font-size: 26rpx;
  color: #8a91a0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  flex: 1;
  min-width: 0;
}
.badge {
  margin-top: 10rpx;
  min-width: 32rpx;
  height: 32rpx;
  padding: 0 8rpx;
  border-radius: 16rpx;
  background: #ff4d4f;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.badge-text {
  font-size: 20rpx;
  color: #fff;
}
.empty {
  padding: 160rpx 40rpx;
  text-align: center;
}
.empty-text {
  font-size: 28rpx;
  color: #9aa3b2;
  line-height: 1.6;
}
.bottom-pad {
  height: 40rpx;
}
</style>
