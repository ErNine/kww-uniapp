<template>
  <view class="page">
    <!-- 顶栏 -->
    <view class="nav" :style="{ paddingTop: statusBarHeight + 'px' }">
      <view
        class="nav-inner"
        :style="{ height: navBarHeight + 'px', paddingRight: menuRight + 'px' }"
      >
        <view class="nav-left" @click="goHome">
          <text class="back-icon">‹</text>
        </view>
        <text class="nav-title">坑位网-坑位榜</text>
        <view class="nav-right">
          <image class="nav-search" src="/static/home/icon-search-glass.png" mode="aspectFit" />
        </view>
      </view>
    </view>

    <view class="body">
      <!-- 左侧分类 -->
      <scroll-view class="sidebar" scroll-y :show-scrollbar="false">
        <view
          v-for="(cat, idx) in categories"
          :key="cat.name"
          class="side-item"
          :class="{ active: categoryIndex === idx, more: cat.more }"
          @click="categoryIndex = idx"
        >
          <text class="side-icon">{{ cat.icon }}</text>
          <text class="side-text">{{ cat.name }}</text>
          <text v-if="cat.more" class="side-arrow">▾</text>
        </view>
      </scroll-view>

      <!-- 右侧内容 -->
      <scroll-view class="main" scroll-y :show-scrollbar="false">
        <view class="banner">
          <image class="banner-img" src="/static/rank/banner.png" mode="aspectFill" />
        </view>

        <view class="rank-tabs">
          <view
            v-for="(tab, idx) in rankTabs"
            :key="tab.name"
            class="rank-tab"
            :class="{ active: rankTabIndex === idx }"
            @click="rankTabIndex = idx"
          >
            <text class="rank-tab-icon">{{ tab.icon }}</text>
            <text class="rank-tab-text">{{ tab.name }}</text>
          </view>
        </view>

        <view
          v-for="item in rankList"
          :key="item.rank"
          class="rank-item"
          @click="openList(item)"
        >
          <view class="rank-badge" :class="'r' + item.rank">
            <text class="rank-num">{{ item.rank }}</text>
          </view>
          <image class="rank-thumb" :src="item.thumb" mode="aspectFill" />
          <view class="rank-info">
            <text class="rank-name">{{ item.name }}</text>
            <view class="rank-row">
              <text class="price-icon">🪙</text>
              <text class="price">{{ item.price }}</text>
            </view>
            <view class="rank-row">
              <text class="sale-icon">📦</text>
              <text class="sale">在售{{ item.sale }}个</text>
            </view>
          </view>
          <view class="rank-score">
            <view class="stars">
              <text
                v-for="n in 5"
                :key="n"
                class="star"
                :class="{ on: n <= Math.round(item.score) }"
              >★</text>
            </view>
            <text class="score">{{ item.score.toFixed(1) }}</text>
          </view>
        </view>

        <view class="main-bottom" />
      </scroll-view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useNavBar } from '@/composables/useNavBar'

const { statusBarHeight, navBarHeight, menuRight } = useNavBar()
const categoryIndex = ref(0)
const rankTabIndex = ref(0)

const categories = [
  { name: '全部分类', icon: '▦' },
  { name: '电商平台', icon: '🛒' },
  { name: '社交平台', icon: '💬' },
  { name: '生活服务', icon: '🏠' },
  { name: '资讯阅读', icon: '📰' },
  { name: '影音娱乐', icon: '🎬' },
  { name: '企业服务', icon: '🏢' },
  { name: '工具软件', icon: '🛠' },
  { name: '教育学习', icon: '📚' },
  { name: '游戏应用', icon: '🎮' },
  { name: 'AI人工智能', icon: '🤖' },
  { name: '更多分类', icon: '＋', more: true },
]

const rankTabs = [
  { name: '人气榜', icon: '🔥' },
  { name: '评分榜', icon: '⭐' },
  { name: '在售榜', icon: '📊' },
  { name: '新上榜', icon: '🆕' },
]

const thumbs = [
  '/static/rank/thumb-1.png',
  '/static/rank/thumb-2.png',
  '/static/rank/thumb-3.png',
]

const rankList = [
  { rank: 1, name: '多商户商城系统', price: '￥199-899元', sale: 28, score: 4.8, thumb: thumbs[0] },
  { rank: 2, name: '电商小程序系统', price: '￥199-699元', sale: 21, score: 4.7, thumb: thumbs[1] },
  { rank: 3, name: 'B2B2C电商平台', price: '￥299-999元', sale: 18, score: 4.6, thumb: thumbs[2] },
  { rank: 4, name: '社交电商系统', price: '￥199-699元', sale: 16, score: 4.5, thumb: thumbs[0] },
  { rank: 5, name: '跨境电商系统', price: '￥399-699元', sale: 14, score: 4.5, thumb: thumbs[1] },
  { rank: 6, name: '生鲜配送系统', price: '￥199-599元', sale: 13, score: 4.4, thumb: thumbs[2] },
  { rank: 7, name: '会员积分商城', price: '￥199-499元', sale: 12, score: 4.3, thumb: thumbs[0] },
  { rank: 8, name: '直播带货系统', price: '￥299-799元', sale: 11, score: 4.3, thumb: thumbs[1] },
  { rank: 9, name: '批发订货系统', price: '￥199-399元', sale: 10, score: 4.2, thumb: thumbs[2] },
  { rank: 10, name: '二手交易平台', price: '￥199-399元', sale: 9, score: 4.1, thumb: thumbs[0] },
]

const goHome = () => {
  uni.switchTab({ url: '/pages/index/index' })
}

const openList = (item: { name: string; price: string; thumb: string }) => {
  uni.navigateTo({
    url: `/packageGoods/list/list?name=${encodeURIComponent(item.name)}&price=${encodeURIComponent(item.price)}&logo=${encodeURIComponent(item.thumb)}`,
  })
}
</script>

<style scoped>
.page {
  /* #ifdef H5 */
  height: calc(100vh - 50px);
  /* #endif */
  /* #ifndef H5 */
  height: 100%;
  /* #endif */
  background: #fff;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
}

.nav {
  background: #fff;
  border-bottom: 1rpx solid #f0f2f5;
  flex-shrink: 0;
}

.nav-inner {
  display: flex;
  align-items: center;
  padding-left: 24rpx;
  box-sizing: border-box;
}

.nav-left,
.nav-right {
  width: 72rpx;
  display: flex;
  align-items: center;
}

.nav-right {
  justify-content: flex-end;
}

.back-icon {
  font-size: 52rpx;
  color: #333;
  line-height: 1;
  font-weight: 300;
}

.nav-title {
  flex: 1;
  text-align: center;
  font-size: 34rpx;
  font-weight: 700;
  color: #222;
}

.nav-search {
  width: 36rpx;
  height: 36rpx;
}

.body {
  flex: 1;
  min-height: 0;
  display: flex;
  background: #f7f8fa;
}

.sidebar {
  width: 200rpx;
  height: 100%;
  background: #f3f4f6;
  flex-shrink: 0;
}

.side-item {
  min-height: 100rpx;
  padding: 24rpx 10rpx;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 8rpx;
  box-sizing: border-box;
}

.side-item.active {
  background: #eef3ff;
  position: relative;
}

.side-item.active::before {
  content: '';
  position: absolute;
  left: 0;
  top: 24rpx;
  bottom: 24rpx;
  width: 6rpx;
  border-radius: 0 6rpx 6rpx 0;
  background: #104ffb;
}

.side-icon {
  font-size: 26rpx;
  line-height: 1;
  flex-shrink: 0;
}

.side-text {
  font-size: 22rpx;
  color: #666;
  text-align: center;
  line-height: 1.3;
}

.side-item.active .side-text {
  color: #104ffb;
  font-weight: 600;
}

.side-item.more {
  flex-direction: row;
  gap: 4rpx;
}

.side-arrow {
  font-size: 18rpx;
  color: #999;
}

.main {
  flex: 1;
  height: 100%;
  background: #fff;
  min-width: 0;
}

.banner {
  margin: 16rpx 16rpx 0;
  height: 200rpx;
  border-radius: 16rpx;
  overflow: hidden;
  background: #eef3ff;
}

.banner-img {
  width: 100%;
  height: 100%;
}

.rank-tabs {
  display: flex;
  gap: 12rpx;
  padding: 20rpx 16rpx 8rpx;
}

.rank-tab {
  flex: 1;
  height: 60rpx;
  border-radius: 12rpx;
  border: 1rpx solid #e8ebf2;
  background: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4rpx;
}

.rank-tab.active {
  border-color: #104ffb;
  background: #f3f7ff;
}

.rank-tab-icon {
  font-size: 20rpx;
}

.rank-tab-text {
  font-size: 22rpx;
  color: #666;
}

.rank-tab.active .rank-tab-text {
  color: #104ffb;
  font-weight: 600;
}

.rank-item {
  display: flex;
  align-items: center;
  padding: 20rpx 16rpx;
  gap: 14rpx;
  border-bottom: 1rpx solid #f3f4f7;
}

.rank-badge {
  width: 40rpx;
  height: 48rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.rank-num {
  font-size: 28rpx;
  font-weight: 700;
  color: #999;
}

.r1 .rank-num {
  color: #d4a017;
  font-size: 32rpx;
}

.r2 .rank-num {
  color: #9aa3b2;
  font-size: 32rpx;
}

.r3 .rank-num {
  color: #c47a4a;
  font-size: 32rpx;
}

.rank-thumb {
  width: 96rpx;
  height: 96rpx;
  border-radius: 14rpx;
  background: #f5f7fb;
  flex-shrink: 0;
}

.rank-info {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 8rpx;
}

.rank-name {
  font-size: 28rpx;
  font-weight: 700;
  color: #222;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.rank-row {
  display: flex;
  align-items: center;
  gap: 6rpx;
}

.price-icon,
.sale-icon {
  font-size: 20rpx;
  line-height: 1;
}

.price {
  font-size: 22rpx;
  color: #e6a23c;
}

.sale {
  font-size: 22rpx;
  color: #104ffb;
}

.rank-score {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 4rpx;
  flex-shrink: 0;
}

.stars {
  display: flex;
}

.star {
  font-size: 18rpx;
  color: #e5e7eb;
  line-height: 1;
}

.star.on {
  color: #f56c6c;
}

.score {
  font-size: 24rpx;
  color: #f56c6c;
  font-weight: 600;
}

.main-bottom {
  height: 24rpx;
}
</style>
