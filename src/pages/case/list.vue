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
        <text class="nav-title">案例库</text>
        <view class="nav-right" />
      </view>
    </view>

    <scroll-view class="scroll" scroll-y :show-scrollbar="false">
      <view v-if="loading" class="empty">
        <text class="empty-text">加载中…</text>
      </view>
      <view v-else-if="!items.length" class="empty">
        <text class="empty-title">案例库筹备中</text>
        <text class="empty-text">运营案例内容接口就绪后将在此展示</text>
      </view>
      <view v-for="(item, idx) in items" :key="idx" class="card">
        <text class="card-title">{{ item.title || '未命名案例' }}</text>
        <text class="card-desc">{{ item.summary || item.desc || '' }}</text>
      </view>
      <view class="bottom" />
    </scroll-view>
  </view>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useNavBar } from '@/composables/useNavBar'

const { statusBarHeight, navBarHeight, menuRight } = useNavBar()
const loading = ref(false)
const items = ref<Array<Record<string, string>>>([])

onMounted(async () => {
  loading.value = true
  // 案例库接口二期；暂无本地空态
  loading.value = false
  items.value = []
})

function goBack() {
  uni.navigateBack({ fail: () => uni.switchTab({ url: '/pages/index/index' }) })
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
  padding: 24rpx;
  box-sizing: border-box;
}
.card {
  background: #fff;
  border-radius: 20rpx;
  padding: 28rpx;
  margin-bottom: 20rpx;
}
.card-title {
  font-size: 30rpx;
  font-weight: 600;
  color: #1a1a1a;
  display: block;
}
.card-desc {
  margin-top: 12rpx;
  font-size: 26rpx;
  color: #8a91a0;
  line-height: 1.5;
  display: block;
}
.empty {
  padding: 160rpx 40rpx;
  text-align: center;
}
.empty-title {
  font-size: 32rpx;
  color: #1a1a1a;
  font-weight: 600;
  display: block;
  margin-bottom: 16rpx;
}
.empty-text {
  font-size: 26rpx;
  color: #9aa3b2;
  line-height: 1.6;
}
.bottom {
  height: 40rpx;
}
</style>
