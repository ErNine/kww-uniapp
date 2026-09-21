<template>
  <view class="hall-header" :style="{ paddingTop: statusBarHeight + 'px' }">
    <view
      class="title-row"
      :style="{ height: navBarHeight + 'px', paddingRight: menuRight + 'px' }"
    >
      <text class="title">互助大厅</text>
    </view>

    <view class="search-row">
      <view class="search-box" @click="$emit('search')">
        <image
          class="search-icon"
          src="/static/hall/icon-search.png"
          mode="aspectFit"
        />
        <text class="search-placeholder">搜索群聊内容</text>
      </view>
      <view class="members" @click="$emit('members')">
        <image
          class="members-icon"
          src="/static/hall/icon-members.png"
          mode="aspectFit"
        />
        <text class="members-text">群成员</text>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
defineProps<{
  statusBarHeight: number
  navBarHeight: number
  menuRight: number
}>()

defineEmits<{
  search: []
  members: []
}>()
</script>

<style scoped>
.hall-header {
  background: #1e67dc;
  padding-bottom: 20rpx;
  box-sizing: border-box;
}

.title-row {
  display: flex;
  align-items: center;
  padding-left: 32rpx;
  box-sizing: border-box;
}

.title {
  font-size: 36rpx;
  font-weight: 700;
  color: #dce8f9;
  line-height: 1.2;
}

.search-row {
  display: flex;
  align-items: center;
  gap: 16rpx;
  padding: 8rpx 28rpx 0;
  box-sizing: border-box;
}

.search-box {
  flex: 1;
  height: 56rpx;
  background: #edf2fb;
  border: 1rpx solid #e2ebfb;
  border-radius: 12rpx;
  display: flex;
  align-items: center;
  padding: 0 20rpx;
  gap: 12rpx;
  box-sizing: border-box;
}

.search-icon {
  width: 28rpx;
  height: 28rpx;
  flex-shrink: 0;
}

.search-placeholder {
  font-size: 28rpx;
  color: #6d7586;
}

.members {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: 80rpx;
  gap: 2rpx;
}

.members-icon {
  width: 40rpx;
  height: 34rpx;
}

.members-text {
  font-size: 22rpx;
  color: #c1d6f5;
  line-height: 1.2;
}
</style>
