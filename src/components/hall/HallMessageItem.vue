<template>
  <!-- 系统消息 -->
  <view v-if="item.kind === 'system'" class="system">
    <text
      v-for="(part, idx) in item.systemParts"
      :key="idx"
      class="system-text"
      :class="{ highlight: part.highlight }"
    >{{ part.text }}</text>
  </view>

  <!-- 左右气泡 -->
  <view
    v-else
    class="msg"
    :class="item.side === 'right' ? 'is-right' : 'is-left'"
  >
    <image
      class="avatar"
      :src="item.avatar"
      mode="aspectFill"
    />

    <view class="body">
      <view
        class="bubble"
        :class="[
          item.side === 'right' ? 'bubble-right' : 'bubble-left',
          { 'has-images': item.kind === 'image' },
        ]"
      >
        <!-- 分段文本（含链接，内联混排） -->
        <text
          v-if="item.parts?.length"
          class="msg-text"
          :class="{ self: item.side === 'right' }"
        >
          <text
            v-for="(part, idx) in item.parts"
            :key="idx"
            :class="{
              link: part.link,
              'link-self': part.link && item.side === 'right',
            }"
          >{{ part.text }}</text>
        </text>
        <text
          v-else-if="item.content"
          class="msg-text"
          :class="{ self: item.side === 'right' }"
        >{{ item.content }}</text>

        <view v-if="item.images?.length" class="img-row">
          <view
            v-for="(src, idx) in item.images"
            :key="idx"
            class="img-wrap"
          >
            <image class="img" :src="src" mode="aspectFill" />
            <image
              v-if="idx === 0"
              class="play"
              src="/static/hall/icon-play.png"
              mode="aspectFit"
            />
          </view>
        </view>
      </view>

      <text v-if="item.meta" class="meta">{{ item.meta }}</text>
    </view>
  </view>
</template>

<script setup lang="ts">
import type { HallMessageItem } from './types'

defineProps<{
  item: HallMessageItem
}>()
</script>

<style scoped>
.system {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  padding: 12rpx 48rpx 28rpx;
  box-sizing: border-box;
}

.system-text {
  font-size: 24rpx;
  color: #a1a5ae;
  line-height: 1.4;
}

.system-text.highlight {
  color: #9399a3;
}

.msg {
  display: flex;
  align-items: flex-start;
  padding: 0 28rpx 28rpx;
  box-sizing: border-box;
  gap: 16rpx;
}

.msg.is-right {
  flex-direction: row-reverse;
}

.avatar {
  width: 72rpx;
  height: 72rpx;
  border-radius: 10rpx;
  flex-shrink: 0;
  background: #e8eef8;
}

.body {
  max-width: 520rpx;
  flex: 0 1 auto;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.msg.is-right .body {
  align-items: flex-end;
}

.bubble {
  padding: 20rpx 24rpx;
  box-sizing: border-box;
  border-radius: 14rpx;
  max-width: 100%;
}

.bubble-left {
  background: #f1f2f6;
  border-top-left-radius: 4rpx;
}

.bubble-right {
  background: #2670f0;
  border-top-right-radius: 4rpx;
}

.bubble.has-images {
  max-width: 520rpx;
}

.msg-text {
  font-size: 28rpx;
  color: #55575c;
  line-height: 1.45;
  white-space: pre-wrap;
  word-break: break-all;
}

.msg-text.self {
  color: #ffffff;
}

.link {
  color: #2a71f3;
  text-decoration: underline;
}

.link-self {
  color: #ffffff;
  text-decoration: underline;
}

.img-row {
  display: flex;
  gap: 12rpx;
  margin-top: 16rpx;
}

.img-wrap {
  position: relative;
  width: 160rpx;
  height: 160rpx;
  border-radius: 8rpx;
  overflow: hidden;
  background: #e8e8e8;
}

.img {
  width: 100%;
  height: 100%;
}

.play {
  position: absolute;
  left: 10rpx;
  top: 10rpx;
  width: 32rpx;
  height: 32rpx;
}

.meta {
  margin-top: 10rpx;
  font-size: 22rpx;
  color: #b2b7bf;
  line-height: 1.2;
}
</style>
