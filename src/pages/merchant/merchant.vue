<template>
  <view class="page">
    <!-- 顶部蓝色区（Figma 1152 画布 → rpx = px × 750/1152，与 iPhone 13 屏宽对齐） -->
    <view class="top">
      <image class="header-bg" src="/static/merchant/header-bg.png" mode="aspectFill" />
      <view class="status-bar" :style="{ height: statusBarHeight + 'px' }" />
      <view
        class="brand-row"
        :style="{ height: navBarHeight + 'px', paddingRight: menuRight + 'px' }"
      >
        <image class="brand-logo" src="/static/merchant/logo-k.png" mode="aspectFit" />
        <text class="brand-name">坑位网</text>
        <image class="brand-divider" src="/static/merchant/brand-divider.png" mode="scaleToFill" />
        <text class="brand-slogan">全国SaaS坑位信息查询与供需撮合平台</text>
      </view>
      <view class="search-wrap" :style="{ paddingRight: menuRight + 'px' }">
        <view class="search-box" @click="goSearch">
          <image class="search-icon" src="/static/merchant/icon-search.png" mode="aspectFit" />
          <text class="search-placeholder">搜索坑位商名称、软件名称、主营行业</text>
        </view>
      </view>
    </view>

    <!-- 榜单 Tab + 筛选（吸顶） -->
    <view class="sticky-panel">
      <view class="rank-tabs">
        <view
          v-for="(tab, idx) in rankTabs"
          :key="tab.label"
          class="rank-tab"
          :class="{ active: rankTabIndex === idx, 'active-pill': rankTabIndex === idx && idx === 0 }"
          @click="rankTabIndex = idx"
        >
          <view v-if="rankTabIndex === idx && idx === 0" class="rank-tab-active-bg" />
          <image
            class="rank-tab-icon"
            :class="{ active: rankTabIndex === idx && idx === 0 }"
            :src="tab.icon"
            mode="aspectFit"
          />
          <text class="rank-tab-text" :class="{ active: rankTabIndex === idx }">{{ tab.label }}</text>
          <image
            v-if="idx < rankTabs.length - 1"
            class="rank-tab-divider"
            src="/static/merchant/tab-divider.png"
            mode="scaleToFill"
          />
        </view>
      </view>

      <scroll-view class="filter-scroll" scroll-x :show-scrollbar="false">
        <view class="filter-row">
          <view class="filter-chip primary">
            <text class="filter-chip-text primary">全部行业</text>
            <image class="filter-caret" src="/static/merchant/caret-white.png" mode="aspectFit" />
          </view>
          <view
            v-for="item in filterChips"
            :key="item"
            class="filter-chip"
          >
            <text class="filter-chip-text">{{ item }}</text>
            <image class="filter-caret grey" src="/static/merchant/caret-grey.png" mode="aspectFit" />
          </view>
          <view class="filter-chip filter-action">
            <image class="filter-icon" src="/static/merchant/icon-filter.png" mode="aspectFit" />
            <text class="filter-chip-text">筛选</text>
          </view>
        </view>
      </scroll-view>
    </view>

    <!-- 商家列表 -->
    <scroll-view class="list-scroll" scroll-y :show-scrollbar="false">
      <view
        v-for="item in merchants"
        :key="item.name"
        class="card"
        @click="openShop(item)"
      >
        <!-- 上：Logo + 名称/标签；下：整行数据 + 进店按钮（与 Figma 分层一致，避免右侧窄列挤压） -->
        <view class="card-upper">
          <image class="shop-logo" :src="item.logo" mode="aspectFill" />
          <view class="shop-info">
            <view class="shop-head">
              <view class="name-row">
                <text class="shop-name">{{ item.name }}</text>
                <image class="verify-icon" src="/static/merchant/icon-verify.png" mode="aspectFit" />
              </view>
              <view v-if="item.rankType === 'top1'" class="rank-badge top1">
                <image class="rank-badge-bg" src="/static/merchant/badge-top1.png" mode="scaleToFill" />
                <text class="rank-badge-text top1">TOP 1</text>
              </view>
              <view v-else-if="item.rankType === 'top2'" class="rank-badge top2">
                <image class="rank-badge-crown" src="/static/merchant/badge-top2.png" mode="aspectFit" />
                <text class="rank-badge-text top2">TOP 2</text>
              </view>
              <view v-else-if="item.rankType === 'top3'" class="rank-badge top3">
                <image class="rank-badge-crown" src="/static/merchant/badge-top3.png" mode="aspectFit" />
                <text class="rank-badge-text top3">TOP 3</text>
              </view>
              <view v-else class="rank-badge plain">
                <text class="rank-badge-num">{{ item.rankNum }}</text>
              </view>
              <image class="card-arrow" src="/static/merchant/icon-arrow.png" mode="aspectFit" />
            </view>
            <view class="tag-row">
              <view class="tag-auth">
                <text class="tag-auth-text">认证坑位商</text>
              </view>
              <view class="tag-deposit">
                <image class="deposit-shield" src="/static/merchant/icon-deposit-shield.png" mode="aspectFit" />
                <text class="tag-deposit-text">保证金{{ item.deposit }}</text>
              </view>
            </view>
            <text class="business-line">主营：{{ item.business }}</text>
          </view>
        </view>

        <view class="card-lower">
          <view class="stats-row">
            <view class="stat">
              <text class="stat-val">{{ item.sales }}</text>
              <text class="stat-key">累计销售</text>
            </view>
            <image class="stat-divider" src="/static/merchant/stat-divider.png" mode="scaleToFill" />
            <view class="stat">
              <text class="stat-val">{{ item.slots }}</text>
              <text class="stat-key">在售坑位</text>
            </view>
            <image class="stat-divider" src="/static/merchant/stat-divider.png" mode="scaleToFill" />
            <view class="stat">
              <text class="stat-val">{{ item.rate }}</text>
              <text class="stat-key">好评率</text>
            </view>
            <image class="stat-divider" src="/static/merchant/stat-divider.png" mode="scaleToFill" />
            <view class="stat">
              <text class="stat-val">{{ item.years }}</text>
              <text class="stat-key">入驻年限</text>
            </view>
          </view>
        </view>
        <view class="visit-btn" @click.stop="openShop(item)">
          <image class="visit-icon" src="/static/merchant/icon-shop-btn.png" mode="aspectFit" />
          <text class="visit-text">进店逛逛</text>
        </view>
      </view>
      <view class="list-bottom" />
    </scroll-view>
  </view>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import { useNavBar } from '@/composables/useNavBar'
import { merchantApi, type MerchantItem as ApiMerchant } from '@/api'

const { statusBarHeight, navBarHeight, menuRight } = useNavBar()
const rankTabIndex = ref(0)

const rankTabs = [
  { label: '推荐', icon: '/static/merchant/tab-crown-active.png', iconActive: '/static/merchant/tab-crown-active.png', sort: 'recommend' },
  { label: '销量榜', icon: '/static/merchant/tab-chart.png', iconActive: '/static/merchant/tab-chart.png', sort: 'sales' },
  { label: '好评榜', icon: '/static/merchant/tab-star.png', iconActive: '/static/merchant/tab-star.png', sort: 'rating' },
  { label: '保证金榜', icon: '/static/merchant/tab-shield.png', iconActive: '/static/merchant/tab-shield.png', sort: 'deposit' },
  { label: '认证商家', icon: '/static/merchant/tab-cert.png', iconActive: '/static/merchant/tab-cert.png', sort: 'certified' },
]

const filterChips = ['综合排序', '保证金', '认证状态']

interface MerchantItem {
  id?: string | number
  name: string
  logo: string
  deposit: string
  business: string
  sales: string
  slots: string
  rate: string
  years: string
  rankType: 'top1' | 'top2' | 'top3' | 'plain'
  rankNum?: string
}

const mockMerchants: MerchantItem[] = [
  { name: '云创科技', logo: '/static/merchant/logo-yunchuang.png', deposit: '¥50,000', business: '商城/ERP/OA/餐饮/教育', sales: '128', slots: '46', rate: '98.6%', years: '12', rankType: 'top1' },
  { name: '数智未来', logo: '/static/merchant/logo-shuzhi.png', deposit: '¥30,000', business: '商城/教育/直播/生活', sales: '96', slots: '32', rate: '97.2%', years: '8', rankType: 'top2' },
  { name: '微享科技', logo: '/static/merchant/logo-weixiang.png', deposit: '¥20,000', business: '餐饮/同城/社交/生活', sales: '76', slots: '25', rate: '96.8%', years: '6', rankType: 'top3' },
  { name: '创想软件', logo: '/static/merchant/logo-chuangxiang.png', deposit: '¥10,000', business: '零育/电商/供应链/物业', sales: '58', slots: '18', rate: '95.6%', years: '5', rankType: 'plain', rankNum: '4' },
  { name: '红川科技', logo: '/static/merchant/logo-hongchuan.png', deposit: '¥10,000', business: '教育/知识付费/企服/工具', sales: '42', slots: '15', rate: '94.3%', years: '4', rankType: 'plain', rankNum: '5' },
]

const merchants = ref<MerchantItem[]>([...mockMerchants])

function mapMerchant(item: ApiMerchant, idx: number): MerchantItem {
  const rankType = idx === 0 ? 'top1' : idx === 1 ? 'top2' : idx === 2 ? 'top3' : 'plain'
  return {
    id: item.id,
    name: item.name,
    logo: item.logo || item.avatar || '/static/merchant/logo-yunchuang.png',
    deposit: item.deposit_amount != null ? `¥${item.deposit_amount}` : '¥0',
    business: item.industry_category?.name || item.intro || item.business || '',
    sales: String(item.sales_proxy ?? item.sales ?? 0),
    slots: String(item.listing_count ?? item.slots ?? 0),
    rate: item.rating_score != null ? `${item.rating_score}` : (item.rate || '-'),
    years: String(item.years ?? '-'),
    rankType,
    rankNum: rankType === 'plain' ? String(idx + 1) : undefined,
  }
}

async function loadMerchants() {
  const sort = rankTabs[rankTabIndex.value]?.sort
  const list = await merchantApi.listSilent({ sort, limit: 20 })
  if (list?.length) merchants.value = list.map(mapMerchant)
}

onMounted(() => { void loadMerchants() })
watch(rankTabIndex, () => { void loadMerchants() })

function goSearch() {
  uni.navigateTo({ url: '/pages/search/search' })
}

function openShop(item: MerchantItem) {
  const qs = [
    item.id ? `id=${encodeURIComponent(String(item.id))}` : '',
    `name=${encodeURIComponent(item.name)}`,
    `avatar=${encodeURIComponent(item.logo)}`,
  ].filter(Boolean).join('&')
  uni.navigateTo({ url: `/packageGoods/shop/shop?${qs}` })
}
</script>

<style scoped>
/* Figma 1152 画布 → rpx = round(px × 750/1152)，全页统一比例 */
.page {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background: #f8fbfe;
  box-sizing: border-box;
  overflow: hidden;
}

.top {
  position: relative;
  flex-shrink: 0;
  padding-bottom: 16rpx;
  overflow: hidden;
}

.header-bg {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
}

.status-bar,
.brand-row,
.search-wrap {
  position: relative;
  z-index: 1;
}

.brand-row {
  display: flex;
  align-items: center;
  padding-left: 26rpx;
  box-sizing: border-box;
  min-height: 57rpx;
}

.brand-logo {
  width: 36rpx;
  height: 34rpx;
  flex-shrink: 0;
}

.brand-name {
  margin-left: 8rpx;
  font-size: 31rpx;
  font-weight: 500;
  color: #e2ecfa;
  line-height: 1.2;
  flex-shrink: 0;
}

.brand-divider {
  width: 1rpx;
  height: 23rpx;
  margin: 0 12rpx;
  flex-shrink: 0;
}

.brand-slogan {
  flex: 1;
  min-width: 0;
  font-size: 15rpx;
  color: #b1cef7;
  line-height: 1.3;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.search-wrap {
  padding: 8rpx 26rpx 0;
  box-sizing: border-box;
}

.search-box {
  display: flex;
  align-items: center;
  height: 59rpx;
  padding: 0 21rpx;
  background: #fdfdfd;
  border: 1rpx solid #cbe0fa;
  border-radius: 25rpx;
  box-sizing: border-box;
}

.search-icon {
  width: 22rpx;
  height: 22rpx;
  flex-shrink: 0;
}

.search-placeholder {
  margin-left: 12rpx;
  font-size: 18rpx;
  color: #a0a5b4;
  line-height: 1.2;
}

.sticky-panel {
  flex-shrink: 0;
  background: #fefefe;
  border-bottom: 1rpx solid #f4f7fb;
  z-index: 2;
}

.rank-tabs {
  display: flex;
  align-items: stretch;
  padding: 10rpx 18rpx 0;
  box-sizing: border-box;
}

.rank-tab {
  position: relative;
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-end;
  padding-bottom: 14rpx;
  min-height: 97rpx;
  box-sizing: border-box;
}

.rank-tab-active-bg {
  position: absolute;
  left: 50%;
  top: 8rpx;
  transform: translateX(-50%);
  width: 123rpx;
  height: 79rpx;
  background: #0165f9;
  border: 1rpx solid #1c74f9;
  border-radius: 14rpx;
  z-index: 0;
}

.rank-tab-icon {
  position: relative;
  z-index: 1;
  width: 25rpx;
  height: 25rpx;
  margin-bottom: 7rpx;
}

.rank-tab-icon.active {
  width: 30rpx;
  height: 26rpx;
}

.rank-tab-text {
  position: relative;
  z-index: 1;
  font-size: 15rpx;
  color: #767d90;
  line-height: 1.2;
}

.rank-tab.active .rank-tab-text {
  color: #4989fb;
}

.rank-tab.active-pill .rank-tab-text {
  color: #c9defd;
  font-size: 16rpx;
}

.rank-tab-divider {
  position: absolute;
  right: 0;
  top: 23rpx;
  width: 1rpx;
  height: 50rpx;
  z-index: 2;
}

.filter-scroll {
  width: 100%;
  white-space: nowrap;
}

.filter-row {
  display: inline-flex;
  align-items: center;
  gap: 9rpx;
  padding: 10rpx 18rpx 14rpx;
  box-sizing: border-box;
}

.filter-chip {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 44rpx;
  padding: 0 18rpx;
  background: #f4f7fb;
  border-radius: 21rpx;
  flex-shrink: 0;
  box-sizing: border-box;
}

.filter-chip.primary {
  background: #0367f8;
  border: 1rpx solid #1a71f6;
}

.filter-chip.filter-action {
  padding-right: 9rpx;
  background: #f5f7fc;
}

.filter-chip-text {
  font-size: 16rpx;
  color: #565e7b;
  line-height: 1;
}

.filter-chip-text.primary {
  color: #bed8fc;
}

.filter-caret {
  width: 11rpx;
  height: 7rpx;
  margin-left: 8rpx;
}

.filter-icon {
  width: 13rpx;
  height: 14rpx;
  margin-right: 7rpx;
}

.list-scroll {
  flex: 1;
  min-height: 0;
  width: 100%;
  padding-top: 12rpx;
  box-sizing: border-box;
}

.card {
  position: relative;
  margin: 0 25rpx 16rpx;
  padding: 18rpx 17rpx 52rpx;
  background: #fefefe;
  border: 1rpx solid #f8fafd;
  border-radius: 10rpx;
  box-sizing: border-box;
}

.card-upper {
  display: flex;
  align-items: flex-start;
}

.shop-logo {
  width: 87rpx;
  height: 87rpx;
  border-radius: 10rpx;
  flex-shrink: 0;
  background: #f5f7fb;
}

.shop-info {
  flex: 1;
  min-width: 0;
  margin-left: 16rpx;
}

.card-lower {
  margin-top: 12rpx;
  padding-right: 148rpx;
  box-sizing: border-box;
}

.shop-head {
  display: flex;
  align-items: flex-start;
  gap: 6rpx;
}

.card-arrow {
  width: 8rpx;
  height: 14rpx;
  margin-top: 8rpx;
  margin-left: auto;
  flex-shrink: 0;
}

.name-row {
  display: flex;
  align-items: center;
  gap: 6rpx;
  flex: 1;
  min-width: 0;
}

.shop-name {
  font-size: 30rpx;
  font-weight: 700;
  color: #353a5b;
  line-height: 1.2;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.verify-icon {
  width: 16rpx;
  height: 18rpx;
  flex-shrink: 0;
}

.rank-badge {
  position: relative;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.rank-badge.top1 {
  width: 85rpx;
  height: 33rpx;
}

.rank-badge-bg {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
}

.rank-badge-text.top1 {
  position: relative;
  z-index: 1;
  font-size: 12rpx;
  color: #578dfc;
  line-height: 1;
}

.rank-badge.top2,
.rank-badge.top3 {
  height: 33rpx;
  padding: 0 12rpx 0 8rpx;
  border-radius: 16rpx;
  gap: 4rpx;
}

.rank-badge.top2 {
  background: #f2efec;
}

.rank-badge.top3 {
  background: #f7ede5;
}

.rank-badge-crown {
  width: 20rpx;
  height: 17rpx;
}

.rank-badge-text.top2 {
  font-size: 12rpx;
  color: #b68159;
}

.rank-badge-text.top3 {
  font-size: 12rpx;
  color: #bd8258;
}

.rank-badge.plain {
  width: 42rpx;
  height: 33rpx;
  background: #f2f6fd;
  border: 1rpx solid #f9fbfd;
  border-radius: 16rpx;
}

.rank-badge-num {
  font-size: 17rpx;
  font-weight: 500;
  color: #7a849c;
  line-height: 1;
}

.tag-row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 5rpx;
  margin-top: 7rpx;
}

.tag-auth {
  padding: 4rpx 12rpx;
  background: #d6f6fd;
  border-radius: 6rpx;
}

.tag-auth-text {
  font-size: 14rpx;
  color: #4193c5;
  line-height: 1.2;
}

.tag-deposit {
  display: flex;
  align-items: center;
  gap: 4rpx;
}

.deposit-shield {
  width: 16rpx;
  height: 17rpx;
}

.tag-deposit-text {
  font-size: 16rpx;
  color: #848a9f;
  line-height: 1.2;
}

.business-line {
  display: block;
  margin-top: 8rpx;
  font-size: 20rpx;
  color: #9ba1b1;
  line-height: 1.4;
}

.stats-row {
  flex: 1;
  min-width: 0;
  display: flex;
  align-items: center;
}

.stat {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 0;
}

.stat-val {
  font-size: 23rpx;
  font-weight: 500;
  color: #4d5070;
  line-height: 1.2;
}

.stat-key {
  margin-top: 6rpx;
  font-size: 20rpx;
  color: #a6abba;
  line-height: 1.2;
  white-space: nowrap;
}

.stat-divider {
  width: 2rpx;
  height: 56rpx;
  flex-shrink: 0;
}

.visit-btn {
  position: absolute;
  right: 17rpx;
  bottom: 16rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 140rpx;
  height: 46rpx;
  background: #0367fa;
  border: 1rpx solid #2177f9;
  border-radius: 23rpx;
  box-sizing: border-box;
  z-index: 1;
}

.visit-icon {
  width: 21rpx;
  height: 21rpx;
  margin-right: 7rpx;
}

.visit-text {
  font-size: 17rpx;
  color: #bdd7fc;
  line-height: 1;
}

.list-bottom {
  height: calc(16rpx + env(safe-area-inset-bottom));
}
</style>
