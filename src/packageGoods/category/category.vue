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
        <text class="nav-title">管理分类</text>
        <view class="nav-right" />
      </view>
    </view>

    <view class="tip">
      <text class="tip-text">分类由平台后台维护，商家仅可选择使用，不可自建分类树</text>
    </view>

    <scroll-view class="scroll" scroll-y :show-scrollbar="false">
      <view v-if="loading" class="empty">
        <text class="empty-text">加载分类…</text>
      </view>
      <view v-else-if="!allCategories.length" class="empty">
        <text class="empty-text">分类接口暂未就绪</text>
      </view>
      <view v-for="item in allCategories" :key="item.id" class="row">
        <view class="dot" />
        <text class="name">{{ item.name }}</text>
      </view>
      <view class="bottom" />
    </scroll-view>

    <view class="footer" :style="{ paddingBottom: Math.max(safeBottom, 16) + 'px' }">
      <view class="save" @tap="goBack">
        <text class="save-text">知道了</text>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useNavBar } from '@/composables/useNavBar'
import { categoryApi, type CategoryItem } from '@/api'

const { statusBarHeight, navBarHeight, menuRight, safeBottom } = useNavBar()

const loading = ref(false)
const allCategories = ref<CategoryItem[]>([])

onMounted(async () => {
  loading.value = true
  const all = await categoryApi.listSilent()
  loading.value = false
  allCategories.value = all || []
})

function goBack() {
  uni.navigateBack({
    fail: () => uni.navigateTo({ url: '/packageGoods/manage/manage' }),
  })
}
</script>

<style scoped>
.page {
  height: 100%;
  display: flex;
  flex-direction: column;
  background: #fafbfc;
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
.tip {
  margin: 20rpx 24rpx 0;
  padding: 20rpx 24rpx;
  background: #eef4ff;
  border-radius: 16rpx;
}
.tip-text {
  font-size: 24rpx;
  color: #104ffb;
  line-height: 1.5;
}
.scroll {
  flex: 1;
  height: 0;
  margin-top: 16rpx;
  background: #fff;
}
.row {
  display: flex;
  align-items: center;
  gap: 20rpx;
  padding: 28rpx 32rpx;
  border-bottom: 1rpx solid #f2f3f7;
}
.dot {
  width: 12rpx;
  height: 12rpx;
  border-radius: 50%;
  background: #104ffb;
}
.name {
  font-size: 30rpx;
  color: #1a1a1a;
}
.empty {
  padding: 120rpx 0;
  text-align: center;
}
.empty-text {
  font-size: 28rpx;
  color: #9aa3b2;
}
.bottom {
  height: 40rpx;
}
.footer {
  padding: 16rpx 32rpx;
  background: #fff;
}
.save {
  height: 88rpx;
  border-radius: 44rpx;
  background: #104ffb;
  display: flex;
  align-items: center;
  justify-content: center;
}
.save-text {
  color: #fff;
  font-size: 30rpx;
  font-weight: 600;
}
</style>
