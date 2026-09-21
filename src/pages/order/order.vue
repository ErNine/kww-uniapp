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
import { ref } from 'vue'
import { useNavBar } from '@/composables/useNavBar'
import {
  HallHeader,
  HallFilterBar,
  HallMessageList,
  HallQuickActions,
  HallInputBar,
  HallComposeSheet,
  CONTENT_TYPE_OPTIONS,
  SOFTWARE_OPTIONS,
  MOCK_MESSAGES,
} from '@/components/hall'
import type { HallMessageItem } from '@/components/hall/types'

const { statusBarHeight, navBarHeight, menuRight } = useNavBar()

const contentOptions = CONTENT_TYPE_OPTIONS
const softwareOptions = SOFTWARE_OPTIONS
const contentValue = ref('all')
const softwareValue = ref('all')
const messages = ref<HallMessageItem[]>([...MOCK_MESSAGES])
const dmBadge = ref(12)
const composeVisible = ref(false)
const remainCount = ref(12)

function toast(title: string) {
  uni.showToast({ title, icon: 'none' })
}

function onSearch() {
  toast('搜索群聊内容')
}

function onMembers() {
  toast('群成员')
}

function onFilterMore() {
  toast('更多筛选')
}

function onExpose() {
  toast('曝光台')
}

function onAnnounce() {
  toast('群公告')
}

function openCompose() {
  composeVisible.value = true
}

function onDm() {
  toast('私信')
}

function onIncrease() {
  toast('去增加发布额度')
}

function onComposeSend(payload: {
  contentType: string
  software: string
  content: string
  images: string[]
}) {
  const now = new Date()
  const hh = String(now.getHours()).padStart(2, '0')
  const mm = String(now.getMinutes()).padStart(2, '0')
  const meta = `今天${hh}:${mm}·济南群`

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
  if (remainCount.value > 0) remainCount.value -= 1
  toast('发送成功')
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
