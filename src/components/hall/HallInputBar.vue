<template>
  <view class="input-bar">
    <view class="input-box" @click="$emit('input')">
      <image class="edit-icon" src="/static/hall/icon-edit.png" mode="aspectFit" />
      <text class="placeholder">请输入您的信息</text>
    </view>

    <view class="dm" @click="$emit('dm')">
      <view class="dm-inner">
        <image class="mail-icon" src="/static/hall/icon-mail.png" mode="aspectFit" />
        <text class="dm-text">私信</text>
      </view>
      <view v-if="badge" class="badge">
        <text class="badge-text">{{ badge }}</text>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    badge?: string | number
  }>(),
  {
    badge: '',
  },
)

defineEmits<{
  input: []
  dm: []
}>()
</script>

<style scoped>
.input-bar {
  display: flex;
  align-items: center;
  gap: 16rpx;
  padding: 12rpx 24rpx 20rpx;
  background: #ffffff;
  box-sizing: border-box;
}

.input-box {
  flex: 1;
  height: 72rpx;
  background: #f1f2f6;
  border-radius: 36rpx;
  display: flex;
  align-items: center;
  padding: 0 28rpx;
  gap: 12rpx;
  box-sizing: border-box;
}

.edit-icon {
  width: 24rpx;
  height: 26rpx;
  flex-shrink: 0;
}

.placeholder {
  font-size: 28rpx;
  color: #90959f;
}

.dm {
  position: relative;
  flex-shrink: 0;
}

.dm-inner {
  height: 72rpx;
  min-width: 140rpx;
  padding: 0 24rpx;
  background: #edf4fb;
  border-radius: 36rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10rpx;
  box-sizing: border-box;
}

.mail-icon {
  width: 28rpx;
  height: 22rpx;
  flex-shrink: 0;
}

.dm-text {
  font-size: 28rpx;
  color: #5c95f8;
  line-height: 1;
}

.badge {
  position: absolute;
  top: -8rpx;
  right: -6rpx;
  min-width: 32rpx;
  height: 32rpx;
  padding: 0 8rpx;
  background: #e85c57;
  border-radius: 16rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
}

.badge-text {
  font-size: 18rpx;
  color: #f4cdcc;
  font-weight: 500;
  line-height: 1;
}
</style>
