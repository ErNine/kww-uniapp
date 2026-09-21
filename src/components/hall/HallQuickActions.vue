<template>
  <view class="quick-actions">
    <view class="pill expose" @click="$emit('expose')">
      <image class="pill-icon expose-icon" src="/static/hall/icon-expose.png" mode="aspectFit" />
      <text class="pill-text expose-text">曝光台</text>
    </view>
    <view class="pill announce" @click="$emit('announce')">
      <image class="pill-icon announce-icon" src="/static/hall/icon-announce.png" mode="aspectFit" />
      <text class="pill-text announce-text">群公告</text>
    </view>
  </view>
</template>

<script setup lang="ts">
defineEmits<{
  expose: []
  announce: []
}>()
</script>

<style scoped>
.quick-actions {
  display: flex;
  align-items: center;
  gap: 16rpx;
  padding: 0 28rpx 16rpx;
  box-sizing: border-box;
}

.pill {
  height: 52rpx;
  padding: 0 24rpx;
  border-radius: 26rpx;
  display: flex;
  align-items: center;
  gap: 8rpx;
  box-sizing: border-box;
}

.expose {
  background: #f6e8e8;
}

.announce {
  background: #fdfdfd;
  border: 1rpx solid #d6dae0;
}

.pill-icon {
  flex-shrink: 0;
}

.expose-icon {
  width: 18rpx;
  height: 24rpx;
}

.announce-icon {
  width: 26rpx;
  height: 20rpx;
}

.pill-text {
  font-size: 24rpx;
  line-height: 1;
}

.expose-text {
  color: #e3827e;
}

.announce-text {
  color: #a8adb5;
}
</style>
