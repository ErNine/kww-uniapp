<template>
  <view class="page">
    <view class="status-bar" :style="{ height: statusBarHeight + 'px' }" />

    <!-- 顶部：品牌 + 搜索（品牌行右侧避开胶囊） -->
    <view class="header">
      <view
        class="brand-row"
        :style="{ height: navBarHeight + 'px', paddingRight: menuRight + 'px' }"
      >
        <text class="brand">坑位网</text>
      </view>

      <view class="search-row">
        <view class="search-box" @tap="onSearch">
          <image class="search-icon" src="/static/home/icon-search-glass.png" mode="aspectFit" />
          <text class="search-placeholder">搜索坑位、坑位商、行业关键词</text>
        </view>
        <view class="search-btn" @tap="onSearch">
          <text class="search-btn-text">搜索</text>
        </view>
      </view>
    </view>

    <view class="scroll">
      <!-- 公告 -->
      <view class="notice" @tap="onNotice">
        <image class="notice-icon" src="/static/home/icon-notice.png" mode="aspectFit" />
        <text class="notice-label">公告</text>
        <view class="notice-divider" />
        <text class="notice-text">平台严打虚假信息，交易更安全，合作更放心!</text>
        <text class="notice-arrow">›</text>
      </view>

      <!-- Banner -->
      <view class="banner" @tap="goRank">
        <image class="banner-bg" src="/static/home/banner.png" mode="aspectFill" />
        <view class="banner-content">
          <text class="banner-title">找坑位，上坑位网</text>
          <text class="banner-sub">海量优质坑位资源对接平台</text>
          <view class="banner-btn">
            <text class="banner-btn-text">立即查看</text>
          </view>
        </view>
        <view class="banner-dots">
          <view class="dot active" />
          <view class="dot" />
          <view class="dot" />
          <view class="dot" />
          <view class="dot" />
        </view>
      </view>

      <!-- 快捷入口 -->
      <view class="category-row">
        <view
          v-for="item in categories"
          :key="item.name"
          class="category-item"
          @tap="onCategoryTap(item)"
        >
          <image class="category-img" :src="item.icon" mode="aspectFit" />
        </view>
      </view>

      <!-- 双 CTA -->
      <view class="cta-row">
        <image
          class="cta-card"
          src="/static/home/cta-publish.png"
          mode="aspectFill"
          @tap="onPublish"
        />
        <image
          class="cta-card"
          src="/static/home/cta-settle.png"
          mode="aspectFill"
          @tap="onSettle"
        />
      </view>

      <!-- 坑位热榜 -->
      <view class="section card">
        <view class="section-head">
          <text class="section-title">坑位热榜</text>
          <view class="more" @tap="goRank">
            <text class="more-text">查看更多</text>
            <text class="more-arrow">›</text>
          </view>
        </view>
        <view class="hot-grid">
          <view class="hot-col">
            <view class="hot-col-head retail">
              <text class="hot-col-title retail">零售商城</text>
              <text class="hot-col-tag retail">TOP5</text>
            </view>
            <view
              v-for="(item, idx) in retailHot"
              :key="item.name"
              class="hot-item"
              @tap="openGoodsList(item.name)"
            >
              <view class="rank" :class="'rank-' + (idx + 1)">
                <text class="rank-text">{{ idx + 1 }}</text>
              </view>
              <text class="hot-name">{{ item.name }}</text>
              <text class="hot-heat">{{ item.heat }}</text>
            </view>
            <view class="hot-footer" @tap="goRank">
              <text class="hot-footer-text">查看完整榜单</text>
            </view>
          </view>
          <view class="hot-col">
            <view class="hot-col-head food">
              <text class="hot-col-title food">餐饮外卖TOP5</text>
            </view>
            <view
              v-for="(item, idx) in foodHot"
              :key="item.name"
              class="hot-item"
              @tap="openGoodsList(item.name)"
            >
              <view class="rank" :class="'rank-' + (idx + 1)">
                <text class="rank-text">{{ idx + 1 }}</text>
              </view>
              <text class="hot-name">{{ item.name }}</text>
              <text class="hot-heat">{{ item.heat }}</text>
            </view>
            <view class="hot-footer" @tap="goRank">
              <text class="hot-footer-text">查看完整榜单</text>
            </view>
          </view>
        </view>
        <view class="hot-pager">
          <view class="dot active" />
          <view class="dot" />
          <view class="dot" />
          <view class="dot" />
          <view class="dot" />
        </view>
      </view>

      <!-- 坑位商榜单 -->
      <view class="section card">
        <view class="section-head">
          <text class="section-title">坑位商榜单</text>
          <view class="more" @tap="goMerchant">
            <text class="more-text">查看更多</text>
            <text class="more-arrow">›</text>
          </view>
        </view>
        <scroll-view class="filter-scroll" scroll-x :show-scrollbar="false">
          <view class="filter-row">
            <view
              v-for="(tab, idx) in merchantTabs"
              :key="tab"
              class="filter-chip"
              :class="{ active: merchantTabIndex === idx }"
              @click="merchantTabIndex = idx"
            >
              <text
                class="filter-chip-text"
                :class="{ active: merchantTabIndex === idx }"
              >{{ tab }}</text>
            </view>
          </view>
        </scroll-view>
        <view
          v-for="(item, idx) in merchants"
          :key="item.name"
          class="merchant-item"
          @tap="openShop(item)"
        >
          <view class="merchant-rank" :class="'m-rank-' + (idx + 1)">
            <text class="merchant-rank-text">{{ idx + 1 }}</text>
          </view>
          <image class="merchant-logo" :src="item.logo" mode="aspectFill" />
          <view class="merchant-info">
            <view class="merchant-name-row">
              <text class="merchant-name">{{ item.name }}</text>
              <text class="tag">{{ item.auth }}</text>
              <text class="tag">{{ item.deposit }}</text>
            </view>
            <view class="merchant-meta-row">
              <view class="stars">
                <text
                  v-for="n in 5"
                  :key="n"
                  class="star"
                  :class="{ on: n <= Math.round(item.score) }"
                >★</text>
              </view>
              <text class="score">{{ item.score.toFixed(1) }}</text>
              <text class="popularity">人气值{{ item.popularity }}</text>
            </view>
          </view>
          <view class="enter-btn" @tap.stop="openShop(item)">
            <text class="enter-btn-text">进店</text>
          </view>
        </view>
      </view>

      <!-- 新品上市 -->
      <view class="section card">
        <view class="section-head">
          <text class="section-title">新品上市</text>
          <view class="more" @tap="goRank">
            <text class="more-text">查看更多</text>
            <text class="more-arrow">›</text>
          </view>
        </view>
        <view class="timeline">
          <view
            v-for="(point, idx) in timeline"
            :key="point.date"
            class="timeline-point"
            :class="{ active: point.active, last: idx === timeline.length - 1 }"
          >
            <text class="timeline-date">{{ point.date }}</text>
            <view class="timeline-dot" />
            <text class="timeline-status">{{ point.status }}</text>
          </view>
          <view class="timeline-line" />
        </view>
        <view class="new-grid">
          <view
            v-for="item in newProducts"
            :key="item.name"
            class="new-item"
            @tap="openGoodsList(item.name)"
          >
            <image class="new-icon" :src="item.icon" mode="aspectFit" />
            <text class="new-name">{{ item.name }}</text>
            <text class="new-desc">{{ item.desc }}</text>
          </view>
        </view>
      </view>

      <!-- 最新资讯 -->
      <view class="section card news-section">
        <view class="section-head">
          <text class="section-title">最新资讯</text>
          <view class="more" @tap="openNewsList">
            <text class="more-text">查看更多</text>
            <text class="more-arrow">›</text>
          </view>
        </view>
        <scroll-view class="filter-scroll" scroll-x :show-scrollbar="false">
          <view class="filter-row">
            <view
              v-for="(tab, idx) in newsTabs"
              :key="tab"
              class="filter-chip"
              :class="{ active: newsTabIndex === idx }"
              @click="newsTabIndex = idx"
            >
              <text
                class="filter-chip-text"
                :class="{ active: newsTabIndex === idx }"
              >{{ tab }}</text>
            </view>
          </view>
        </scroll-view>
        <view
          v-for="item in filteredNews"
          :key="item.id"
          class="news-item"
          @tap="openNews(item)"
        >
          <view class="news-thumb" :style="{ background: item.gradient }">
            <text class="news-thumb-title">{{ item.thumbTitle }}</text>
          </view>
          <view class="news-body">
            <text class="news-title">{{ item.title }}</text>
            <view class="news-tags">
              <text v-for="tag in item.tags" :key="tag" class="news-tag">{{ tag }}</text>
            </view>
            <view class="news-meta">
              <text class="meta-text">{{ item.source }}</text>
              <text class="meta-text">{{ item.time }}</text>
              <text class="meta-text">{{ item.views }}</text>
            </view>
          </view>
        </view>
      </view>

      <view class="scroll-bottom" />
    </view>
  </view>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useNavBar } from '@/composables/useNavBar'
import { NEWS_LIST, type NewsItem } from '@/pages/news/data'

const { statusBarHeight, navBarHeight, menuRight } = useNavBar()
const merchantTabIndex = ref(0)
const newsTabIndex = ref(0)

type CategoryItem = {
  name: string
  icon: string
  tabUrl?: string
  action?: 'toast'
  toast?: string
}

const categories: CategoryItem[] = [
  { name: '坑位榜', icon: '/static/home/cat-rank.png', tabUrl: '/pages/rank/rank' },
  { name: '坑位商', icon: '/static/home/cat-merchant.png', tabUrl: '/pages/merchant/merchant' },
  { name: '互助大厅', icon: '/static/home/cat-order.png', tabUrl: '/pages/order/order' },
  { name: '案例库', icon: '/static/home/cat-case.png', action: 'toast', toast: '案例库即将上线' },
  { name: '申请收录', icon: '/static/home/cat-apply.png', action: 'toast', toast: '申请收录即将上线' },
]

function onCategoryTap(item: CategoryItem) {
  if (item.tabUrl) {
    uni.switchTab({ url: item.tabUrl })
    return
  }
  if (item.action === 'toast') {
    uni.showToast({ title: item.toast || '敬请期待', icon: 'none' })
  }
}

function goRank() {
  uni.switchTab({ url: '/pages/rank/rank' })
}

function goMerchant() {
  uni.switchTab({ url: '/pages/merchant/merchant' })
}

function onSearch() {
  uni.showToast({ title: '搜索功能即将上线', icon: 'none' })
}

function onNotice() {
  uni.showToast({ title: '平台严打虚假信息，交易更安全', icon: 'none' })
}

function onPublish() {
  uni.navigateTo({ url: '/packageGoods/publish/publish' })
}

function onSettle() {
  uni.showToast({ title: '坑位商入驻即将上线', icon: 'none' })
}

function openGoodsList(name: string) {
  uni.navigateTo({
    url: `/packageGoods/list/list?name=${encodeURIComponent(name)}`,
  })
}

function openShop(item: { name: string; logo: string }) {
  uni.navigateTo({
    url: `/packageGoods/shop/shop?name=${encodeURIComponent(item.name)}&avatar=${encodeURIComponent(item.logo)}`,
  })
}

function openNews(item?: NewsItem) {
  const id = item?.id || NEWS_LIST[0]?.id || '1'
  uni.navigateTo({
    url: `/pages/news/detail?id=${encodeURIComponent(id)}`,
  })
}

function openNewsList() {
  uni.navigateTo({ url: '/pages/news/list' })
}

const retailHot = [
  { name: '多用户商城系统', heat: '9.9w' },
  { name: '社交电商系统', heat: '8.7w' },
  { name: '分销商城系统', heat: '7.1w' },
  { name: '小程序商城', heat: '6.3w' },
  { name: '跨境电商系统', heat: '5.2w' },
]

const foodHot = [
  { name: '外卖跑腿系统', heat: '9.6w' },
  { name: '餐饮点餐系统', heat: '8.2w' },
  { name: '外卖平台系统', heat: '6.7w' },
  { name: '同城配送系统', heat: '5.8w' },
  { name: '智慧餐厅系统', heat: '4.9w' },
]

const merchantTabs = ['人气榜', '销量榜', '好评榜', '保证金榜']

const merchants = [
  {
    name: '云创科技',
    logo: '/static/home/merchant-1.png',
    score: 5.0,
    auth: '个人认证',
    deposit: '保证金￥5000',
    popularity: '9.9w',
  },
  {
    name: '启航软件',
    logo: '/static/home/merchant-2.png',
    score: 4.8,
    auth: '个人认证',
    deposit: '保证金￥5000',
    popularity: '7.8w',
  },
  {
    name: '速达科技',
    logo: '/static/home/merchant-3.png',
    score: 4.7,
    auth: '企业认证',
    deposit: '保证金￥10000',
    popularity: '6.5w',
  },
  {
    name: '优站网络',
    logo: '/static/home/merchant-4.png',
    score: 4.6,
    auth: '个人认证',
    deposit: '保证金￥3000',
    popularity: '5.3w',
  },
  {
    name: '微擎科技',
    logo: '/static/home/merchant-5.png',
    score: 4.5,
    auth: '个人认证',
    deposit: '保证金￥5000',
    popularity: '4.2w',
  },
]

const timeline = [
  { date: '05.20', status: '已上市', active: true },
  { date: '05.27', status: '已上市', active: true },
  { date: '06.03', status: '已上市', active: true },
  { date: '06.10', status: '即将上市', active: false },
]

const newProducts = [
  { name: '多商户商城系统', desc: '零售商城', icon: '/static/home/new-card-1.png' },
  { name: '智能跑腿系统', desc: '跑腿代购', icon: '/static/home/new-card-2.png' },
  { name: '智慧物业系统', desc: '房产物业', icon: '/static/home/new-card-3.png' },
  { name: 'AI智能客服系统', desc: '人工智能', icon: '/static/home/new-card-4.png' },
]

const newsTabs = ['全部', '平台动态', '行业趋势', '坑位干货', '成功案例']
const newsList = NEWS_LIST

const filteredNews = computed(() => {
  const tab = newsTabs[newsTabIndex.value]
  if (!tab || tab === '全部') return newsList
  return newsList.filter((item) => item.tags.includes(tab))
})
</script>

<style scoped>
.page {
  min-height: 100%;
  background: #f5f7fb;
  box-sizing: border-box;
  padding-bottom: constant(safe-area-inset-bottom);
  padding-bottom: env(safe-area-inset-bottom);
}

.status-bar {
  width: 100%;
  background: #fff;
}

.header {
  background: #fff;
  padding: 0 0 20rpx;
  box-sizing: border-box;
}

.brand-row {
  display: flex;
  align-items: center;
  padding-left: 28rpx;
  margin-bottom: 12rpx;
  box-sizing: border-box;
}

.brand {
  font-size: 40rpx;
  font-weight: 700;
  color: #28282a;
  letter-spacing: 1rpx;
}

.search-row {
  display: flex;
  align-items: center;
  gap: 16rpx;
  padding: 0 28rpx;
  box-sizing: border-box;
}

.search-box {
  flex: 1;
  height: 72rpx;
  background: #f2f5f9;
  border-radius: 36rpx;
  display: flex;
  align-items: center;
  padding: 0 28rpx;
  gap: 12rpx;
}

.search-icon {
  width: 28rpx;
  height: 28rpx;
  flex-shrink: 0;
}

.search-placeholder {
  font-size: 26rpx;
  color: #9aa3b2;
}

.search-btn {
  height: 72rpx;
  padding: 0 34rpx;
  background: #104ffb;
  border-radius: 36rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.search-btn-text {
  font-size: 28rpx;
  color: #fff;
  font-weight: 600;
}

.scroll {
  width: 100%;
  box-sizing: border-box;
  padding: 0 24rpx 24rpx;
}

.notice {
  margin-top: 16rpx;
  height: 64rpx;
  background: #f3f7fd;
  border: 1rpx solid #e8eef8;
  border-radius: 16rpx;
  display: flex;
  align-items: center;
  padding: 0 20rpx;
  gap: 10rpx;
}

.notice-icon {
  width: 28rpx;
  height: 28rpx;
  flex-shrink: 0;
}

.notice-label {
  font-size: 24rpx;
  color: #3b3c3c;
  font-weight: 600;
  flex-shrink: 0;
}

.notice-divider {
  width: 2rpx;
  height: 24rpx;
  background: #c5cad3;
  flex-shrink: 0;
}

.notice-text {
  flex: 1;
  font-size: 24rpx;
  color: #4a4b4c;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.notice-arrow {
  font-size: 28rpx;
  color: #9aa3b2;
  flex-shrink: 0;
}

.banner {
  position: relative;
  margin-top: 20rpx;
  height: 300rpx;
  border-radius: 24rpx;
  overflow: hidden;
}

.banner-bg {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
}

.banner-content {
  position: relative;
  z-index: 1;
  padding: 48rpx 40rpx 0;
  display: flex;
  flex-direction: column;
}

.banner-title {
  font-size: 40rpx;
  color: #e6e6eb;
  font-weight: 500;
  margin-bottom: 12rpx;
}

.banner-sub {
  font-size: 24rpx;
  color: #bec0cc;
  margin-bottom: 28rpx;
}

.banner-btn {
  align-self: flex-start;
  background: #104ffb;
  border-radius: 28rpx;
  padding: 12rpx 28rpx;
}

.banner-btn-text {
  font-size: 24rpx;
  color: #fff;
  font-weight: 600;
}

.banner-dots,
.hot-pager {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 20rpx;
  display: flex;
  justify-content: center;
  gap: 10rpx;
  z-index: 1;
}

.hot-pager {
  position: relative;
  bottom: 0;
  margin-top: 16rpx;
}

.dot {
  width: 10rpx;
  height: 10rpx;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.35);
}

.hot-pager .dot {
  background: #d5dae6;
}

.dot.active {
  width: 24rpx;
  border-radius: 6rpx;
  background: #104ffb;
}

.category-row {
  margin-top: 24rpx;
  display: flex;
  justify-content: space-between;
  background: #fff;
  border-radius: 24rpx;
  padding: 24rpx 8rpx 12rpx;
}

.category-item {
  flex: 1;
  display: flex;
  justify-content: center;
}

.category-img {
  width: 120rpx;
  height: 140rpx;
}

.cta-row {
  margin-top: 20rpx;
  display: flex;
  gap: 16rpx;
}

.cta-card {
  flex: 1;
  height: 168rpx;
  border-radius: 20rpx;
}

.section {
  margin-top: 20rpx;
}

.card {
  background: #fefefe;
  border-radius: 24rpx;
  padding: 28rpx 24rpx 24rpx;
  border: 1rpx solid #f7f9fd;
}

.section-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24rpx;
}

.section-title {
  font-size: 32rpx;
  font-weight: 700;
  color: #333;
}

.more {
  display: flex;
  align-items: center;
}

.more-text {
  font-size: 24rpx;
  color: #8a91a0;
}

.more-arrow {
  font-size: 28rpx;
  color: #8a91a0;
  margin-left: 4rpx;
}

.hot-grid {
  display: flex;
  gap: 16rpx;
}

.hot-col {
  flex: 1;
  background: #fdfdfd;
  border-radius: 20rpx;
  overflow: hidden;
  border: 1rpx solid #f3f5f9;
  padding-bottom: 16rpx;
}

.hot-col-head {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8rpx;
  height: 64rpx;
  margin-bottom: 8rpx;
}

.hot-col-head.retail {
  background: #fdf3f2;
}

.hot-col-head.food {
  background: #fdf7f0;
}

.hot-col-title {
  font-size: 26rpx;
  font-weight: 600;
}

.hot-col-title.retail {
  color: #df4a4a;
}

.hot-col-title.food {
  color: #f58f41;
}

.hot-col-tag {
  font-size: 22rpx;
  font-weight: 600;
}

.hot-col-tag.retail {
  color: #e75c5b;
}

.hot-item {
  display: flex;
  align-items: center;
  padding: 14rpx 16rpx;
  gap: 10rpx;
}

.rank {
  width: 36rpx;
  height: 36rpx;
  border-radius: 50%;
  background: #f7f7f7;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.rank-1 {
  background: linear-gradient(180deg, #f6d59a, #e8b45a);
}

.rank-2 {
  background: linear-gradient(180deg, #d8dde6, #b8c0cd);
}

.rank-3 {
  background: linear-gradient(180deg, #f0c4a0, #e09a6a);
}

.rank-text {
  font-size: 20rpx;
  color: #505050;
  font-weight: 700;
}

.rank-1 .rank-text,
.rank-2 .rank-text,
.rank-3 .rank-text {
  color: #fff;
}

.hot-name {
  flex: 1;
  font-size: 24rpx;
  color: #5a5b5f;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.hot-heat {
  font-size: 22rpx;
  color: #8990a1;
  flex-shrink: 0;
}

.hot-footer {
  margin: 8rpx 16rpx 0;
  height: 56rpx;
  border-radius: 28rpx;
  background: #fbfbfc;
  border: 1rpx solid #eaedf5;
  display: flex;
  align-items: center;
  justify-content: center;
}

.hot-footer-text {
  font-size: 22rpx;
  color: #71798d;
}

.filter-scroll {
  width: 100%;
  white-space: nowrap;
  margin-bottom: 8rpx;
}

.filter-row {
  display: inline-flex;
  gap: 16rpx;
  padding-bottom: 8rpx;
}

.filter-chip {
  padding: 12rpx 28rpx;
  border-radius: 28rpx;
  background: #fff;
  border: 1rpx solid #eef1f7;
}

.filter-chip.active {
  background: #104ffb;
  border-color: #1852fb;
}

.filter-chip-text {
  font-size: 24rpx;
  color: #7c8598;
}

.filter-chip-text.active {
  color: #fff;
  font-weight: 600;
}

.merchant-item {
  display: flex;
  align-items: center;
  padding: 24rpx 0;
  border-bottom: 1rpx solid #f0f2f7;
  gap: 16rpx;
}

.merchant-item:last-child {
  border-bottom: none;
  padding-bottom: 8rpx;
}

.merchant-rank {
  width: 44rpx;
  height: 48rpx;
  border-radius: 8rpx;
  background: #f3f0eb;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.m-rank-1 {
  background: linear-gradient(180deg, #f6e0c4, #e8c48a);
}

.m-rank-2 {
  background: linear-gradient(180deg, #e2e6ee, #c5ccd8);
}

.m-rank-3 {
  background: linear-gradient(180deg, #f0d0b0, #dca878);
}

.merchant-rank-text {
  font-size: 24rpx;
  font-weight: 700;
  color: #58544f;
}

.m-rank-1 .merchant-rank-text,
.m-rank-2 .merchant-rank-text,
.m-rank-3 .merchant-rank-text {
  color: #58544f;
}

.merchant-logo {
  width: 84rpx;
  height: 84rpx;
  border-radius: 50%;
  background: #f5f7fb;
  flex-shrink: 0;
}

.merchant-info {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 10rpx;
}

.merchant-name-row {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 10rpx;
}

.merchant-name {
  font-size: 28rpx;
  font-weight: 700;
  color: #3d3e3e;
}

.merchant-meta-row {
  display: flex;
  align-items: center;
  gap: 8rpx;
}

.stars {
  display: flex;
  align-items: center;
}

.star {
  font-size: 20rpx;
  color: #dde1ea;
  line-height: 1;
}

.star.on {
  color: #ffb400;
}

.score {
  font-size: 22rpx;
  color: #7d8598;
}

.tag {
  font-size: 18rpx;
  padding: 4rpx 10rpx;
  border-radius: 6rpx;
  color: #6389fb;
  background: #f4f7fd;
  border: 1rpx solid #f0f3fa;
}

.popularity {
  font-size: 22rpx;
  color: #838a9b;
  margin-left: 8rpx;
}

.enter-btn {
  padding: 12rpx 28rpx;
  border-radius: 28rpx;
  background: #fefefe;
  border: 1rpx solid #d3d9eb;
  flex-shrink: 0;
}

.enter-btn-text {
  font-size: 24rpx;
  color: #5a7ffa;
  font-weight: 500;
}

.timeline {
  position: relative;
  display: flex;
  justify-content: space-between;
  padding: 8rpx 20rpx 28rpx;
  margin-bottom: 8rpx;
}

.timeline-line {
  position: absolute;
  left: 60rpx;
  right: 60rpx;
  top: 54rpx;
  height: 4rpx;
  background: #e5e9f2;
  z-index: 0;
}

.timeline-point {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10rpx;
  width: 120rpx;
}

.timeline-date {
  font-size: 24rpx;
  color: #444;
}

.timeline-dot {
  width: 16rpx;
  height: 16rpx;
  border-radius: 50%;
  background: #c5cad6;
  border: 4rpx solid #fff;
  box-shadow: 0 0 0 2rpx #d8dde8;
}

.timeline-point.active .timeline-dot {
  background: #104ffb;
  box-shadow: 0 0 0 2rpx #104ffb;
}

.timeline-status {
  font-size: 22rpx;
  color: #7a8296;
}

.timeline-point.active .timeline-status {
  color: #104ffb;
}

.new-grid {
  display: flex;
  justify-content: space-between;
  gap: 8rpx;
}

.new-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.new-icon {
  width: 160rpx;
  height: 200rpx;
}

.new-name,
.new-desc {
  display: none;
}

.news-section {
  padding-bottom: 8rpx;
}

.news-item {
  display: flex;
  gap: 20rpx;
  padding: 24rpx 0;
  border-bottom: 1rpx solid #f0f2f7;
}

.news-item:last-child {
  border-bottom: none;
}

.news-thumb {
  width: 180rpx;
  height: 140rpx;
  border-radius: 16rpx;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16rpx;
  box-sizing: border-box;
}

.news-thumb-title {
  font-size: 22rpx;
  color: #fff;
  font-weight: 700;
  line-height: 1.35;
  white-space: pre-line;
}

.news-body {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 4rpx 0;
}

.news-title {
  font-size: 28rpx;
  color: #333;
  font-weight: 600;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
}

.news-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 10rpx;
  margin: 12rpx 0;
}

.news-tag {
  font-size: 20rpx;
  padding: 4rpx 12rpx;
  border-radius: 8rpx;
  color: #6891fb;
  background: #f3f7fd;
  border: 1rpx solid #f2f5fb;
}

.news-meta {
  display: flex;
  gap: 16rpx;
}

.meta-text {
  font-size: 20rpx;
  color: #9aa3b2;
}

.scroll-bottom {
  height: 24rpx;
}
</style>
