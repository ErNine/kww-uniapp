<template>
  <view class="page">
    <view class="nav" :style="{ paddingTop: statusBarHeight + 'px' }">
      <view class="nav-inner">
        <view class="nav-left" @click="goBack">
          <image class="back-icon" src="/static/detail/icon-back.png" mode="aspectFit" />
        </view>
        <text class="nav-title">坑位详情</text>
        <view class="nav-right">
          <image class="nav-icon" src="/static/detail/icon-fav.png" mode="aspectFit" />
          <image class="nav-icon" src="/static/detail/icon-share.png" mode="aspectFit" />
        </view>
      </view>
    </view>

    <scroll-view class="scroll" scroll-y :show-scrollbar="false">
      <!-- Banner -->
      <view class="banner-wrap">
        <swiper class="banner-swiper" circular :indicator-dots="false" @change="onBannerChange">
          <swiper-item v-for="(img, idx) in banners" :key="idx">
            <image class="banner-img" :src="img" mode="aspectFill" />
          </swiper-item>
        </swiper>
        <view class="banner-page">
          <text class="banner-page-text">{{ bannerIndex + 1 }}/{{ banners.length }}</text>
        </view>
      </view>

      <!-- 标题价格 -->
      <view class="title-block">
        <view class="title-row">
          <view class="title-left">
            <text class="title">{{ detail.title }}</text>
            <text class="subtitle">{{ detail.subtitle }}</text>
          </view>
          <view class="price-box">
            <view class="price-row">
              <text class="yen">¥</text>
              <text class="price">{{ detail.price }}</text>
              <text class="price-suffix">起</text>
            </view>
            <image class="star-icon" src="/static/detail/icon-fav.png" mode="aspectFit" />
          </view>
        </view>
      </view>

      <!-- 坑位商卡片 -->
      <view class="merchant-card">
        <view class="merchant-top">
          <image class="merchant-avatar" :src="detail.merchant.avatar" mode="aspectFill" />
          <view class="merchant-info">
            <view class="merchant-name-row">
              <text class="merchant-name">{{ detail.merchant.name }}</text>
              <view class="auth-tag">
                <text class="auth-tag-text">企业认证</text>
              </view>
            </view>
            <view class="company-row">
              <text class="company">{{ detail.merchant.company }}</text>
              <image class="chevron-sm" src="/static/detail/icon-chevron-sm.png" mode="aspectFit" />
            </view>
          </view>
          <view class="enter-btn" @click="openShop">
            <text class="enter-text">进店看看</text>
            <image class="chevron" src="/static/detail/icon-chevron.png" mode="aspectFit" />
          </view>
        </view>
        <view class="merchant-stats">
          <view class="m-stat">
            <image class="m-stat-icon" src="/static/detail/icon-bag.png" mode="aspectFit" />
            <view class="m-stat-texts">
              <text class="m-stat-val">{{ detail.merchant.slots }}</text>
              <text class="m-stat-key">在售坑位</text>
            </view>
          </view>
          <view class="m-divider" />
          <view class="m-stat">
            <image class="m-stat-icon shield" src="/static/detail/icon-shield.png" mode="aspectFit" />
            <view class="m-stat-texts">
              <text class="m-stat-val">{{ detail.merchant.deposit }}</text>
              <text class="m-stat-key">保证金额度</text>
            </view>
          </view>
          <view class="m-divider" />
          <view class="m-stat">
            <image class="m-stat-icon" src="/static/detail/icon-like.png" mode="aspectFit" />
            <view class="m-stat-texts">
              <text class="m-stat-val">{{ detail.merchant.likes }}</text>
              <text class="m-stat-key">点赞数</text>
            </view>
          </view>
        </view>
      </view>

      <!-- 介绍 Tabs -->
      <view class="intro-card">
        <view class="tabs">
          <view
            v-for="(tab, idx) in tabs"
            :key="tab"
            class="tab-item"
            @click="tabIndex = idx"
          >
            <text class="tab-text" :class="{ active: tabIndex === idx }">{{ tab }}</text>
            <view v-if="tabIndex === idx" class="tab-line" />
          </view>
        </view>

        <text class="intro-desc">{{ detail.intro }}</text>

        <scroll-view class="tag-scroll" scroll-x :show-scrollbar="false">
          <view class="tag-row">
            <view v-for="tag in featureTags" :key="tag.name" class="feature-tag">
              <image class="feature-icon" :src="tag.icon" mode="aspectFit" />
              <text class="feature-text">{{ tag.name }}</text>
            </view>
          </view>
        </scroll-view>

        <view class="spec-table">
          <view v-for="(row, idx) in specRows" :key="row.label" class="spec-row">
            <view class="spec-left">
              <image class="spec-icon" :src="row.icon" mode="aspectFit" />
              <text class="spec-label">{{ row.label }}</text>
            </view>
            <text class="spec-value">{{ row.value }}</text>
            <view v-if="idx < specRows.length - 1" class="spec-line" />
          </view>
        </view>
      </view>

      <view class="scroll-pad" />
    </scroll-view>

    <!-- 底部操作栏 -->
    <view class="bottom-bar" :style="{ paddingBottom: safeBottom + 'px' }">
      <view class="bottom-actions">
        <view class="side-action">
          <image class="side-icon" src="/static/detail/icon-service.png" mode="aspectFit" />
          <text class="side-text">客服</text>
        </view>
        <view class="side-action" @click="openShop">
          <image class="side-icon" src="/static/detail/icon-store.png" mode="aspectFit" />
          <text class="side-text">店铺</text>
        </view>
        <view class="btn-sell">
          <text class="btn-sell-text">卖同款</text>
        </view>
        <view class="btn-buy">
          <text class="btn-buy-text">立即购买</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { onLoad } from '@dcloudio/uni-app'

const statusBarHeight = ref(20)
const safeBottom = ref(0)
const bannerIndex = ref(0)
const tabIndex = ref(0)

const banners = [
  '/static/detail/banner.png',
  '/static/detail/banner.png',
  '/static/detail/banner.png',
  '/static/detail/banner.png',
  '/static/detail/banner.png',
]

const detail = reactive({
  title: 'EweiShop商城系统坑位',
  subtitle: '开源商城系统，支持多终端覆盖，功能丰富',
  price: '100',
  merchant: {
    name: '软件超人',
    company: '河北微脉云网络科技有限公司',
    avatar: '/static/detail/merchant-avatar.png',
    slots: '1000+',
    deposit: '￥50,000',
    likes: '4.9万',
  },
  intro:
    'EweiShop是一款专注于电商领域的开源商城系统，支持多终端覆盖，功能丰富，二次开发灵活，适用于各类电商场景。',
})

const tabs = ['坑位介绍', '坑位演示', '坑位案例', '用户评价(368)']

const featureTags = [
  { name: '多端适配', icon: '/static/detail/tag-multi.png' },
  { name: '开源系统', icon: '/static/detail/tag-opensource.png' },
  { name: '功能丰富', icon: '/static/detail/tag-feature.png' },
  { name: '二开灵活', icon: '/static/detail/tag-dev.png' },
  { name: '持续更新', icon: '/static/detail/tag-update.png' },
]

const specRows = [
  {
    label: '适用场景',
    value: '电商零售、分销商城、社区团购、跨境电商等',
    icon: '/static/detail/spec-scene.png',
  },
  {
    label: '可用时长',
    value: '12个月起',
    icon: '/static/detail/spec-duration.png',
  },
  {
    label: '更新维护',
    value: '永久免费更新',
    icon: '/static/detail/spec-maintain.png',
  },
  {
    label: '技术支持',
    value: '7x12小时在线支持',
    icon: '/static/detail/spec-support.png',
  },
  {
    label: '数据安全',
    value: '自动备份，安全稳定',
    icon: '/static/detail/spec-security.png',
  },
]

const onBannerChange = (e: { detail: { current: number } }) => {
  bannerIndex.value = e.detail.current
}

const goBack = () => {
  uni.navigateBack({
    fail: () => {
      uni.navigateTo({ url: '/pages/list/list' })
    },
  })
}

const openShop = () => {
  uni.navigateTo({
    url: `/pages/shop/shop?name=${encodeURIComponent(detail.merchant.name)}&avatar=${encodeURIComponent(detail.merchant.avatar)}`,
  })
}

onLoad((query) => {
  if (query?.name) {
    detail.merchant.name = decodeURIComponent(query.name)
  }
  if (query?.avatar) {
    detail.merchant.avatar = decodeURIComponent(query.avatar)
  }
  if (query?.price) {
    detail.price = decodeURIComponent(query.price)
  }
  if (query?.title) {
    detail.title = decodeURIComponent(query.title)
  }
})

onMounted(() => {
  const sys = uni.getSystemInfoSync()
  statusBarHeight.value = sys.statusBarHeight || 20
  safeBottom.value = (sys as { safeAreaInsets?: { bottom?: number } }).safeAreaInsets?.bottom || 0
})
</script>

<style scoped>
.page {
  height: 100%;
  background: #f5f6f8;
  display: flex;
  flex-direction: column;
}

.nav {
  background: #f8f8f8;
  flex-shrink: 0;
  z-index: 20;
}

.nav-inner {
  height: 88rpx;
  display: flex;
  align-items: center;
  padding: 0 24rpx;
}

.nav-left {
  width: 72rpx;
  display: flex;
  align-items: center;
}

.back-icon {
  width: 14rpx;
  height: 24rpx;
}

.nav-title {
  flex: 1;
  text-align: center;
  font-size: 32rpx;
  font-weight: 700;
  color: #2f2f30;
}

.nav-right {
  width: 120rpx;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 24rpx;
}

.nav-icon {
  width: 36rpx;
  height: 36rpx;
}

.scroll {
  flex: 1;
  height: 0;
}

.banner-wrap {
  position: relative;
  width: 100%;
  height: 356rpx;
  background: #0a2a6e;
}

.banner-swiper,
.banner-img {
  width: 100%;
  height: 356rpx;
}

.banner-page {
  position: absolute;
  left: 50%;
  bottom: 20rpx;
  transform: translateX(-50%);
  padding: 6rpx 20rpx;
  border-radius: 20rpx;
  background: rgba(0, 0, 0, 0.35);
}

.banner-page-text {
  font-size: 20rpx;
  color: #fff;
}

.title-block {
  background: #fff;
  padding: 28rpx 32rpx 24rpx;
}

.title-row {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16rpx;
}

.title-left {
  flex: 1;
  min-width: 0;
}

.title {
  display: block;
  font-size: 36rpx;
  font-weight: 700;
  color: #1b1c1d;
  line-height: 1.3;
}

.subtitle {
  display: block;
  margin-top: 12rpx;
  font-size: 24rpx;
  color: #8a8d94;
  line-height: 1.4;
}

.price-box {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 8rpx;
  flex-shrink: 0;
}

.price-row {
  display: flex;
  align-items: baseline;
}

.yen {
  font-size: 24rpx;
  color: #fc5f1a;
  font-weight: 600;
}

.price {
  font-size: 44rpx;
  color: #fc5f1a;
  font-weight: 700;
  line-height: 1;
}

.price-suffix {
  font-size: 24rpx;
  color: #8a8d94;
  margin-left: 4rpx;
}

.star-icon {
  width: 24rpx;
  height: 26rpx;
}

.merchant-card {
  margin: 20rpx 24rpx 0;
  padding: 28rpx 24rpx 24rpx;
  background: #111829;
  border: 1rpx solid #3d4250;
  border-radius: 20rpx;
}

.merchant-top {
  display: flex;
  align-items: flex-start;
  gap: 18rpx;
}

.merchant-avatar {
  width: 88rpx;
  height: 88rpx;
  border-radius: 50%;
  flex-shrink: 0;
  background: #1a2235;
}

.merchant-info {
  flex: 1;
  min-width: 0;
}

.merchant-name-row {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 12rpx;
}

.merchant-name {
  font-size: 32rpx;
  font-weight: 700;
  color: #d4d5d8;
}

.auth-tag {
  padding: 4rpx 12rpx;
  border-radius: 8rpx;
  background: #101929;
  border: 1rpx solid #145444;
}

.auth-tag-text {
  font-size: 20rpx;
  color: #24996b;
}

.company-row {
  margin-top: 10rpx;
  display: flex;
  align-items: center;
  gap: 6rpx;
}

.company {
  font-size: 22rpx;
  color: #b5b8bd;
}

.chevron-sm {
  width: 8rpx;
  height: 14rpx;
}

.enter-btn {
  display: flex;
  align-items: center;
  gap: 8rpx;
  padding: 12rpx 22rpx;
  border-radius: 28rpx;
  background: #101828;
  border: 1rpx solid #6d717b;
  flex-shrink: 0;
}

.enter-text {
  font-size: 22rpx;
  color: #b8bbbf;
}

.chevron {
  width: 10rpx;
  height: 16rpx;
}

.merchant-stats {
  margin-top: 28rpx;
  display: flex;
  align-items: center;
}

.m-stat {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 10rpx;
  justify-content: center;
}

.m-stat-icon {
  width: 36rpx;
  height: 34rpx;
  flex-shrink: 0;
}

.m-stat-icon.shield {
  width: 34rpx;
  height: 40rpx;
}

.m-stat-texts {
  display: flex;
  flex-direction: column;
  gap: 4rpx;
}

.m-stat-val {
  font-size: 26rpx;
  color: #cfd0d4;
  font-weight: 600;
}

.m-stat-key {
  font-size: 22rpx;
  color: #a8a9b0;
}

.m-divider {
  width: 1rpx;
  height: 44rpx;
  background: #3d4250;
}

.intro-card {
  margin: 20rpx 24rpx 0;
  padding: 28rpx 24rpx 32rpx;
  background: #fff;
  border-radius: 16rpx;
}

.tabs {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  padding-bottom: 4rpx;
  border-bottom: 1rpx solid #f0f1f5;
}

.tab-item {
  position: relative;
  padding: 8rpx 4rpx 16rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.tab-text {
  font-size: 26rpx;
  font-weight: 700;
  color: #7f7f85;
}

.tab-text.active {
  color: #4184f4;
}

.tab-line {
  position: absolute;
  bottom: 0;
  width: 72rpx;
  height: 4rpx;
  border-radius: 2rpx;
  background: #4184f4;
}

.intro-desc {
  display: block;
  margin-top: 24rpx;
  font-size: 24rpx;
  color: #4f5051;
  line-height: 1.55;
}

.tag-scroll {
  margin-top: 24rpx;
  width: 100%;
  white-space: nowrap;
}

.tag-row {
  display: inline-flex;
  gap: 12rpx;
}

.feature-tag {
  display: inline-flex;
  align-items: center;
  gap: 8rpx;
  padding: 12rpx 16rpx;
  border-radius: 10rpx;
  background: #f7f8f9;
}

.feature-icon {
  width: 28rpx;
  height: 28rpx;
}

.feature-text {
  font-size: 22rpx;
  color: #525253;
}

.spec-table {
  margin-top: 24rpx;
  border-radius: 12rpx;
  overflow: hidden;
  background: #fdfdfd;
  border: 1rpx solid #f0f1f5;
}

.spec-row {
  position: relative;
  display: flex;
  align-items: center;
  min-height: 72rpx;
  padding: 18rpx 20rpx;
}

.spec-left {
  width: 180rpx;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  gap: 12rpx;
  padding: 4rpx 0;
  background: #f7f8fa;
  margin: -18rpx 16rpx -18rpx -20rpx;
  padding-left: 20rpx;
  padding-right: 12rpx;
  align-self: stretch;
}

.spec-icon {
  width: 28rpx;
  height: 28rpx;
  flex-shrink: 0;
}

.spec-label {
  font-size: 24rpx;
  color: #4a4c56;
}

.spec-value {
  flex: 1;
  font-size: 24rpx;
  color: #8f8f94;
  line-height: 1.4;
}

.spec-line {
  position: absolute;
  left: 196rpx;
  right: 20rpx;
  bottom: 0;
  height: 1rpx;
  background: #eeeef0;
}

.scroll-pad {
  height: 180rpx;
}

.bottom-bar {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  background: #fff;
  border-top: 1rpx solid #eceef2;
  z-index: 30;
}

.bottom-actions {
  height: 110rpx;
  padding: 0 20rpx;
  display: flex;
  align-items: center;
  gap: 12rpx;
}

.side-action {
  width: 88rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6rpx;
  flex-shrink: 0;
}

.side-icon {
  width: 40rpx;
  height: 40rpx;
}

.side-text {
  font-size: 20rpx;
  color: #333;
}

.btn-sell {
  flex: 1;
  height: 72rpx;
  border-radius: 36rpx;
  background: #fdfdfd;
  border: 1rpx solid #6e9ae1;
  display: flex;
  align-items: center;
  justify-content: center;
}

.btn-sell-text {
  font-size: 28rpx;
  color: #4e86e0;
  font-weight: 600;
}

.btn-buy {
  flex: 1.1;
  height: 72rpx;
  border-radius: 36rpx;
  background: #0057f7;
  border: 1rpx solid #2e77ee;
  display: flex;
  align-items: center;
  justify-content: center;
}

.btn-buy-text {
  font-size: 28rpx;
  color: #fff;
  font-weight: 600;
}
</style>
