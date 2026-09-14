<template>
  <view class="page">
    <view class="nav" :style="{ paddingTop: statusBarHeight + 'px' }">
      <view class="nav-inner">
        <view class="nav-left" @click="goBack">
          <image class="back-icon" src="/static/list/icon-back.png" mode="aspectFit" />
        </view>
        <text class="nav-title">坑位网-软件坑位列表</text>
        <view class="nav-right" />
      </view>
    </view>

    <scroll-view class="scroll" scroll-y :show-scrollbar="false">
      <!-- 产品信息 -->
      <view class="product">
        <image class="product-logo" :src="product.logo" mode="aspectFill" />
        <view class="product-body">
          <view class="product-head">
            <view class="product-title-wrap">
              <text class="product-name">{{ product.name }}</text>
              <view class="tag-auth-border">
                <text class="tag-auth-border-text">企业认证</text>
              </view>
            </view>
            <view class="fav">
              <image class="fav-icon" src="/static/list/icon-fav.png" mode="aspectFit" />
              <text class="fav-text">收藏</text>
            </view>
          </view>
          <text class="product-desc">{{ product.desc }}</text>
        </view>
      </view>

      <!-- 统计 -->
      <view class="stat-row">
        <view class="stat-card">
          <view class="stat-num-row">
            <text class="stat-num">{{ product.views }}</text>
            <text class="stat-unit">万</text>
          </view>
          <text class="stat-label">浏览量</text>
          <image class="stat-icon" src="/static/list/icon-eye.png" mode="aspectFit" />
        </view>
        <view class="stat-card">
          <text class="stat-num score">{{ product.score }}</text>
          <view class="stars">
            <image
              v-for="n in 5"
              :key="n"
              class="star"
              :src="`/static/list/star-${n}.png`"
              mode="aspectFit"
            />
          </view>
          <view class="rate-btn">
            <text class="rate-btn-text">未评价</text>
          </view>
        </view>
        <view class="stat-card">
          <view class="stat-num-row">
            <text class="stat-num">{{ product.sellers }}</text>
            <text class="stat-unit">家</text>
          </view>
          <text class="stat-label">在售坑位商</text>
          <image class="stat-icon" src="/static/list/icon-shop.png" mode="aspectFit" />
        </view>
      </view>

      <!-- 价格 + 快捷入口 -->
      <view class="price-card">
        <view class="price-left">
          <view class="price-label-row">
            <text class="price-label">参考价格区间</text>
            <image class="info-icon" src="/static/list/icon-info.png" mode="aspectFit" />
          </view>
          <view class="price-range">
            <text class="yen">¥</text>
            <text class="price-val">{{ product.priceMin }}</text>
            <image class="tilde" src="/static/list/icon-tilde.png" mode="aspectFit" />
            <text class="yen">¥</text>
            <text class="price-val">{{ product.priceMax }}</text>
            <text class="price-unit">/年</text>
          </view>
        </view>
        <view class="quick-links">
          <view class="quick-item kb">
            <image class="quick-icon" src="/static/list/icon-kb.png" mode="aspectFit" />
            <text class="quick-text kb-t">知识库</text>
          </view>
          <view class="quick-item case">
            <image class="quick-icon" src="/static/list/icon-case.png" mode="aspectFit" />
            <text class="quick-text case-t">案例库</text>
          </view>
          <view class="quick-item chat">
            <image class="quick-icon chat-icon" src="/static/list/icon-chat.png" mode="aspectFit" />
            <text class="quick-text chat-t">群聊</text>
          </view>
        </view>
      </view>

      <!-- 排序筛选 -->
      <view class="filter-block">
        <view class="filter-head">
          <text class="filter-title">在售坑位商</text>
          <text class="filter-count">({{ merchants.length }})</text>
          <text class="sort-label">排序：</text>
          <view
            v-for="(tab, idx) in sortTabs"
            :key="tab"
            class="sort-item"
            @click="sortIndex = idx"
          >
            <text class="sort-text" :class="{ active: sortIndex === idx }">{{ tab }}</text>
            <image
              v-if="sortIndex === idx"
              class="sort-arrow"
              src="/static/list/icon-sort-arrow.png"
              mode="aspectFit"
            />
            <view v-if="idx < sortTabs.length - 1" class="sort-divider" />
          </view>
          <view class="filter-btn">
            <view class="filter-vline" />
            <image class="filter-icon" src="/static/list/icon-filter.png" mode="aspectFit" />
            <text class="filter-btn-text">筛选</text>
          </view>
        </view>
        <scroll-view class="chip-scroll" scroll-x :show-scrollbar="false">
          <view class="chip-row">
            <view
              v-for="(chip, idx) in sortChips"
              :key="chip"
              class="chip"
              @click="sortIndex = idx"
            >
              <text class="chip-text">{{ chip }}</text>
              <image class="chip-caret" src="/static/list/icon-caret.png" mode="aspectFit" />
            </view>
          </view>
        </scroll-view>
      </view>

      <!-- 坑位商列表 -->
      <view
        v-for="item in merchants"
        :key="item.name"
        class="merchant"
      >
        <image class="merchant-logo" :src="item.logo" mode="aspectFill" />
        <view class="merchant-main">
          <view class="merchant-top">
            <view class="merchant-name-row">
              <text class="merchant-name">{{ item.name }}</text>
              <view class="tag-auth">
                <text class="tag-auth-text">{{ item.auth }}</text>
              </view>
              <view class="tag-deposit">
                <text class="tag-deposit-text">{{ item.deposit }}</text>
              </view>
            </view>
            <view class="merchant-price">
              <text class="yen sm">¥</text>
              <text class="merchant-price-val">{{ item.price }}</text>
              <text class="price-unit">/年</text>
            </view>
          </view>
          <view class="merchant-bottom">
            <view class="merchant-meta">
              <view class="meta-item">
                <image class="meta-icon" src="/static/list/icon-like.png" mode="aspectFit" />
                <view class="meta-texts">
                  <text class="meta-val">{{ item.likes }}</text>
                  <text class="meta-key">点赞量</text>
                </view>
              </view>
              <view class="meta-divider" />
              <view class="meta-item">
                <image class="meta-icon" src="/static/list/icon-slot.png" mode="aspectFit" />
                <view class="meta-texts">
                  <text class="meta-val">{{ item.slots }}个</text>
                  <text class="meta-key">在售坑位</text>
                </view>
              </view>
              <view class="meta-divider" />
              <view class="meta-item">
                <image class="meta-icon" src="/static/list/icon-clock.png" mode="aspectFit" />
                <view class="meta-texts">
                  <text class="meta-val">{{ item.refresh }}</text>
                  <text class="meta-key">最近刷新</text>
                </view>
              </view>
            </view>
            <view class="consult-btn">
              <text class="consult-text">立即咨询</text>
            </view>
          </view>
        </view>
      </view>

      <view class="footer">
        <text class="footer-text">没有更多了</text>
      </view>
    </scroll-view>
  </view>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { onLoad } from '@dcloudio/uni-app'

const statusBarHeight = ref(20)
const sortIndex = ref(0)

const product = reactive({
  name: 'Eweishop商城',
  logo: '/static/list/product-logo.png',
  desc: '专注于为开发者提供高效、稳定的商城系统服务\n支持多端小程序、H5、公众号、APP等',
  views: '12.6',
  score: '4.8',
  sellers: 18,
  priceMin: '158',
  priceMax: '299',
})

const sortTabs = ['点赞量', '价格', '保证金', '刷新时间']
const sortChips = ['按点赞量排序', '按价格排序', '按保证金高低排序', '按刷新时间排序']

const merchants = [
  {
    name: '软件超人',
    logo: '/static/list/merchant-1.png',
    auth: '企业认证',
    deposit: '500元保证金',
    likes: 1280,
    slots: 12,
    refresh: '1天内',
    price: '199',
  },
  {
    name: 'Eweishop商城',
    logo: '/static/list/merchant-2.png',
    auth: '企业认证',
    deposit: '800元保证金',
    likes: 860,
    slots: 8,
    refresh: '2天内',
    price: '188',
  },
  {
    name: '坑位联盟',
    logo: '/static/list/merchant-3.png',
    auth: '企业认证',
    deposit: '1000元保证金',
    likes: 620,
    slots: 15,
    refresh: '3天内',
    price: '168',
  },
  {
    name: '迅软科技',
    logo: '/static/list/merchant-4.png',
    auth: '企业认证',
    deposit: '300元保证金',
    likes: 320,
    slots: 6,
    refresh: '1天内',
    price: '158',
  },
]

const goBack = () => {
  uni.navigateBack({
    fail: () => {
      uni.switchTab({ url: '/pages/rank/rank' })
    },
  })
}

onLoad((query) => {
  if (query?.name) {
    product.name = decodeURIComponent(query.name)
  }
  if (query?.logo) {
    product.logo = decodeURIComponent(query.logo)
  }
  if (query?.price) {
    const raw = decodeURIComponent(query.price)
    const nums = raw.match(/\d+/g)
    if (nums && nums.length >= 2) {
      product.priceMin = nums[0]
      product.priceMax = nums[1]
    }
  }
})

onMounted(() => {
  const sys = uni.getSystemInfoSync()
  statusBarHeight.value = sys.statusBarHeight || 20
})
</script>

<style scoped>
/* Figma 画布 1152 → rpx: n * 750 / 1152 */
.page {
  min-height: 100%;
  background: #fff;
  display: flex;
  flex-direction: column;
}

.nav {
  background: #fff;
  flex-shrink: 0;
  border-bottom: 1rpx solid #f0f1f5;
}

.nav-inner {
  height: 88rpx;
  display: flex;
  align-items: center;
  padding: 0 24rpx;
}

.nav-left,
.nav-right {
  width: 72rpx;
  display: flex;
  align-items: center;
}

.back-icon {
  width: 14rpx;
  height: 26rpx;
}

.nav-title {
  flex: 1;
  text-align: center;
  font-size: 32rpx;
  font-weight: 700;
  color: #2d2e30;
}

.scroll {
  flex: 1;
  height: 0;
  box-sizing: border-box;
}

.product {
  display: flex;
  gap: 28rpx;
  padding: 20rpx 32rpx 0;
}

.product-logo {
  width: 128rpx;
  height: 136rpx;
  border-radius: 20rpx;
  flex-shrink: 0;
  background: #eef3ff;
}

.product-body {
  flex: 1;
  min-width: 0;
  padding-top: 4rpx;
}

.product-head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12rpx;
}

.product-title-wrap {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 12rpx;
  flex: 1;
  min-width: 0;
}

.product-name {
  font-size: 36rpx;
  font-weight: 700;
  color: #1b1c1d;
  line-height: 1.2;
}

.tag-auth-border {
  padding: 4rpx 12rpx;
  border-radius: 8rpx;
  background: #f6fafe;
  border: 1rpx solid #95bbfd;
}

.tag-auth-border-text {
  font-size: 20rpx;
  color: #478bfb;
  line-height: 1.3;
}

.fav {
  display: flex;
  align-items: center;
  gap: 6rpx;
  flex-shrink: 0;
  padding-top: 8rpx;
}

.fav-icon {
  width: 28rpx;
  height: 28rpx;
}

.fav-text {
  font-size: 24rpx;
  color: #8a8d94;
}

.product-desc {
  margin-top: 12rpx;
  font-size: 24rpx;
  color: #818694;
  line-height: 1.55;
  white-space: pre-line;
}

.stat-row {
  display: flex;
  gap: 16rpx;
  padding: 28rpx 32rpx 0;
}

.stat-card {
  flex: 1;
  background: #fefefe;
  border-radius: 12rpx;
  padding: 24rpx 8rpx 20rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-shadow: 0 0 0 1rpx #f0f1f5;
}

.stat-num-row {
  display: flex;
  align-items: baseline;
  gap: 4rpx;
}

.stat-num {
  font-size: 40rpx;
  font-weight: 700;
  color: #181819;
  line-height: 1.1;
}

.stat-num.score {
  font-size: 38rpx;
}

.stat-unit {
  font-size: 24rpx;
  color: #3f3f3f;
  font-weight: 600;
}

.stat-label {
  margin-top: 8rpx;
  font-size: 22rpx;
  color: #91939b;
}

.stat-icon {
  width: 48rpx;
  height: 42rpx;
  margin-top: 16rpx;
}

.stars {
  display: flex;
  gap: 6rpx;
  margin-top: 10rpx;
}

.star {
  width: 22rpx;
  height: 22rpx;
}

.rate-btn {
  margin-top: 12rpx;
  padding: 8rpx 22rpx;
  border-radius: 8rpx;
  background: #fdfdfd;
  border: 1rpx solid #d7d8dc;
}

.rate-btn-text {
  font-size: 20rpx;
  color: #858893;
}

.price-card {
  margin: 24rpx 32rpx 0;
  padding: 28rpx 24rpx;
  background: #fdfdfd;
  border-radius: 12rpx;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16rpx;
  box-shadow: 0 0 0 1rpx #f0f1f5;
}

.price-left {
  flex: 1;
  min-width: 0;
}

.price-label-row {
  display: flex;
  align-items: center;
  gap: 8rpx;
  margin-bottom: 16rpx;
}

.price-label {
  font-size: 26rpx;
  color: #767b87;
}

.info-icon {
  width: 24rpx;
  height: 24rpx;
}

.price-range {
  display: flex;
  align-items: baseline;
  flex-wrap: wrap;
}

.yen {
  font-size: 28rpx;
  color: #fd7b41;
  font-weight: 500;
}

.yen.sm {
  font-size: 24rpx;
  color: #fc5f1a;
}

.price-val {
  font-size: 44rpx;
  color: #fc5f19;
  font-weight: 600;
  line-height: 1;
}

.tilde {
  width: 22rpx;
  height: 8rpx;
  margin: 0 10rpx 8rpx;
}

.price-unit {
  font-size: 24rpx;
  color: #777c8a;
  margin-left: 4rpx;
}

.quick-links {
  display: flex;
  gap: 14rpx;
  flex-shrink: 0;
}

.quick-item {
  width: 84rpx;
  height: 104rpx;
  border-radius: 18rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10rpx;
}

.quick-item.kb {
  background: #f1f5fd;
}

.quick-item.case {
  background: #edf9f7;
}

.quick-item.chat {
  background: #f3f3fc;
}

.quick-icon {
  width: 40rpx;
  height: 48rpx;
}

.chat-icon {
  width: 48rpx;
  height: 40rpx;
}

.quick-text {
  font-size: 22rpx;
}

.kb-t {
  color: #5f6d92;
}

.case-t {
  color: #828c97;
}

.chat-t {
  color: #63698e;
}

.filter-block {
  padding: 32rpx 24rpx 8rpx;
}

.filter-head {
  display: flex;
  align-items: center;
  flex-wrap: nowrap;
  margin-bottom: 20rpx;
  overflow: hidden;
}

.filter-title {
  font-size: 32rpx;
  font-weight: 700;
  color: #2f2f2f;
  flex-shrink: 0;
}

.filter-count {
  font-size: 24rpx;
  color: #696c77;
  font-weight: 300;
  margin-right: 12rpx;
  flex-shrink: 0;
}

.sort-label {
  font-size: 20rpx;
  color: #6a6b71;
  margin-right: 2rpx;
  flex-shrink: 0;
}

.sort-item {
  display: flex;
  align-items: center;
  position: relative;
  padding: 0 10rpx;
  flex-shrink: 0;
}

.sort-text {
  font-size: 24rpx;
  color: #717379;
}

.sort-text.active {
  color: #4e8dfa;
}

.sort-arrow {
  width: 10rpx;
  height: 18rpx;
  margin-left: 4rpx;
}

.sort-divider {
  position: absolute;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 2rpx;
  height: 28rpx;
  background: #e5e7eb;
}

.filter-btn {
  margin-left: auto;
  display: flex;
  align-items: center;
  gap: 8rpx;
}

.filter-vline {
  width: 2rpx;
  height: 28rpx;
  background: #e5e7eb;
  margin-right: 8rpx;
}

.filter-icon {
  width: 26rpx;
  height: 26rpx;
}

.filter-btn-text {
  font-size: 24rpx;
  color: #71747c;
}

.chip-scroll {
  width: 100%;
  white-space: nowrap;
}

.chip-row {
  display: inline-flex;
  gap: 14rpx;
  padding-bottom: 8rpx;
}

.chip {
  display: inline-flex;
  align-items: center;
  gap: 10rpx;
  padding: 16rpx 22rpx;
  border-radius: 12rpx;
  background: #f3f6fc;
}

.chip-text {
  font-size: 22rpx;
  color: #5e6065;
}

.chip-caret {
  width: 16rpx;
  height: 10rpx;
}

.merchant {
  margin: 16rpx 24rpx 0;
  padding: 28rpx 24rpx;
  background: #fff;
  border-radius: 16rpx;
  box-shadow: 0 0 0 1rpx #eef0f4;
  display: flex;
  gap: 20rpx;
}

.merchant-logo {
  width: 96rpx;
  height: 96rpx;
  border-radius: 50%;
  flex-shrink: 0;
  background: #f5f7fb;
}

.merchant-main {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 18rpx;
}

.merchant-top {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12rpx;
}

.merchant-name-row {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 10rpx;
  flex: 1;
  min-width: 0;
}

.merchant-name {
  font-size: 30rpx;
  font-weight: 700;
  color: #222;
}

.tag-auth {
  padding: 4rpx 12rpx;
  border-radius: 8rpx;
  background: #edf4fe;
}

.tag-auth-text {
  font-size: 18rpx;
  color: #5c98fc;
  line-height: 1.3;
}

.tag-deposit {
  padding: 4rpx 12rpx;
  border-radius: 6rpx;
  background: #fdf7eb;
  border: 1rpx solid #fde3b6;
}

.tag-deposit-text {
  font-size: 18rpx;
  color: #fda35d;
  line-height: 1.3;
}

.merchant-price {
  display: flex;
  align-items: baseline;
  flex-shrink: 0;
}

.merchant-price-val {
  font-size: 36rpx;
  color: #fc5f1a;
  font-weight: 700;
  line-height: 1;
}

.merchant-bottom {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12rpx;
}

.merchant-meta {
  display: flex;
  align-items: center;
  flex: 1;
  min-width: 0;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 8rpx;
  flex: 1;
}

.meta-icon {
  width: 26rpx;
  height: 26rpx;
  flex-shrink: 0;
}

.meta-texts {
  display: flex;
  flex-direction: column;
  gap: 2rpx;
  min-width: 0;
}

.meta-val {
  font-size: 24rpx;
  color: #333;
  font-weight: 600;
}

.meta-key {
  font-size: 20rpx;
  color: #9aa3b2;
}

.meta-divider {
  width: 2rpx;
  height: 40rpx;
  background: #eef0f4;
  margin: 0 6rpx;
  flex-shrink: 0;
}

.consult-btn {
  padding: 14rpx 28rpx;
  border-radius: 10rpx;
  background: #0362fc;
  border: 1rpx solid #1a71f7;
  flex-shrink: 0;
}

.consult-text {
  font-size: 24rpx;
  color: #fff;
  font-weight: 600;
}

.footer {
  padding: 36rpx 0 56rpx;
  display: flex;
  justify-content: center;
}

.footer-text {
  font-size: 24rpx;
  color: #b0b6c3;
}
</style>
