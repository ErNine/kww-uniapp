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
        <text class="nav-title">{{ title }}</text>
        <view class="nav-right" />
      </view>
    </view>

    <scroll-view
      class="scroll"
      scroll-y
      :show-scrollbar="false"
      :scroll-into-view="scrollInto"
    >
      <view v-if="!messages.length" class="empty">
        <text class="empty-text">{{ hint }}</text>
      </view>
      <view
        v-for="item in messages"
        :id="'m-' + item.id"
        :key="item.id"
        class="bubble-row"
        :class="item.side === 'right' ? 'right' : 'left'"
      >
        <view class="bubble">
          <text class="bubble-text">{{ item.content }}</text>
        </view>
      </view>
      <view id="bottom-anchor" class="bottom-anchor" />
    </scroll-view>

    <view class="composer" :style="{ paddingBottom: Math.max(safeBottom, 12) + 'px' }">
      <input
        class="input"
        v-model="draft"
        confirm-type="send"
        placeholder="输入留言…"
        placeholder-class="ph"
        @confirm="send"
      />
      <view class="send" @tap="send">
        <text class="send-text">发送</text>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { onUnmounted, ref } from 'vue'
import { onHide, onLoad, onShow } from '@dcloudio/uni-app'
import { useNavBar } from '@/composables/useNavBar'
import { messageApi, type MessageItem } from '@/api'
import { HALL_POLL_INTERVAL_MS } from '@/config/env'

const { statusBarHeight, navBarHeight, menuRight, safeBottom } = useNavBar()

const threadId = ref('')
const title = ref('会话')
const messages = ref<MessageItem[]>([])
const draft = ref('')
const hint = ref('留言将通过轮询同步，非实时 IM')
const scrollInto = ref('')
let timer: ReturnType<typeof setInterval> | null = null

onLoad((q) => {
  threadId.value = q?.id ? String(q.id) : ''
  title.value = q?.title ? decodeURIComponent(String(q.title)) : '会话'
})

onShow(() => {
  refresh(true)
  startPoll()
})
onHide(() => stopPoll())
onUnmounted(() => stopPoll())

function goBack() {
  uni.navigateBack({ fail: () => uni.navigateTo({ url: '/pages/message/list' }) })
}

const lastMsgId = ref(0)

async function refresh(reset = false) {
  if (!threadId.value) {
    hint.value = '缺少会话 ID'
    return
  }
  const query: { after_id?: number; limit?: number } = { limit: 100 }
  if (!reset && lastMsgId.value > 0) query.after_id = lastMsgId.value
  const list = await messageApi.messagesSilent(threadId.value, query)
  if (list) {
    if (reset || !lastMsgId.value) messages.value = list
    else {
      const exist = new Set(messages.value.map((m) => String(m.id)))
      const appended = list.filter((m) => !exist.has(String(m.id)))
      if (appended.length) messages.value = [...messages.value, ...appended]
    }
    const maxId = list.reduce((m, cur) => Math.max(m, Number(cur.id) || 0), lastMsgId.value)
    if (maxId > lastMsgId.value) lastMsgId.value = maxId
    scrollInto.value = 'bottom-anchor'
  } else if (reset) {
    hint.value = '留言接口暂未就绪'
  }
}

function startPoll() {
  stopPoll()
  timer = setInterval(() => {
    void refresh(false)
  }, HALL_POLL_INTERVAL_MS)
}

function stopPoll() {
  if (timer) {
    clearInterval(timer)
    timer = null
  }
}

async function send() {
  const content = draft.value.trim()
  if (!content) return
  if (!threadId.value) {
    uni.showToast({ title: '会话无效', icon: 'none' })
    return
  }
  try {
    const msg = await messageApi.send(threadId.value, { content })
    draft.value = ''
    messages.value = [...messages.value, msg]
    const idNum = Number(msg.id) || 0
    if (idNum > lastMsgId.value) lastMsgId.value = idNum
    scrollInto.value = 'bottom-anchor'
  } catch {
    uni.showToast({ title: '发送失败，接口暂未就绪', icon: 'none' })
  }
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
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.scroll {
  flex: 1;
  height: 0;
  padding: 24rpx;
  box-sizing: border-box;
}
.bubble-row {
  display: flex;
  margin-bottom: 20rpx;
}
.bubble-row.left {
  justify-content: flex-start;
}
.bubble-row.right {
  justify-content: flex-end;
}
.bubble {
  max-width: 70%;
  padding: 18rpx 24rpx;
  border-radius: 18rpx;
  background: #fff;
}
.bubble-row.right .bubble {
  background: #104ffb;
}
.bubble-text {
  font-size: 28rpx;
  color: #1a1a1a;
  line-height: 1.5;
}
.bubble-row.right .bubble-text {
  color: #fff;
}
.empty {
  padding: 120rpx 0;
  text-align: center;
}
.empty-text {
  font-size: 26rpx;
  color: #9aa3b2;
}
.bottom-anchor {
  height: 1px;
}
.composer {
  display: flex;
  align-items: center;
  gap: 16rpx;
  padding: 16rpx 24rpx;
  background: #fff;
  border-top: 1rpx solid #f0f1f5;
}
.input {
  flex: 1;
  height: 72rpx;
  background: #f3f5f9;
  border-radius: 36rpx;
  padding: 0 28rpx;
  font-size: 28rpx;
}
.ph {
  color: #9aa3b2;
}
.send {
  padding: 0 8rpx;
}
.send-text {
  font-size: 28rpx;
  color: #104ffb;
  font-weight: 600;
}
</style>
