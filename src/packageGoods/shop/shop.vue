<template>
  <view class="page">
    <view class="nav" :style="{ paddingTop: statusBarHeight + 'px' }">
      <view
        class="nav-inner"
        :style="{ height: navBarHeight + 'px', paddingRight: menuRight + 'px' }"
      >
        <view class="nav-left" @click="goBack">
          <image class="back-icon" src="../static/shop/icon-back.png" mode="aspectFit" />
        </view>
        <text class="nav-title">坑位商主页</text>
        <view class="nav-right" />
      </view>
    </view>

    <scroll-view class="scroll" scroll-y :show-scrollbar="false">
      <!-- 头部 -->
      <view class="header">
        <image class="header-bg" src="../static/shop/header-bg.png" mode="aspectFill" />
        <view class="profile">
          <image class="avatar" :src="shop.avatar" mode="aspectFill" />
          <view class="profile-main">
            <view class="name-row">
              <text class="name">{{ shop.name }}</text>
              <view class="tag-gold">
                <text class="tag-gold-text">金牌服务商</text>
              </view>
              <view class="tag-auth">
                <text class="tag-auth-text">企业认证</text>
              </view>
              <view class="follow-btn">
                <image class="follow-icon" src="../static/shop/icon-follow.png" mode="aspectFit" />
                <text class="follow-text">关注店铺</text>
              </view>
            </view>
            <view class="company-row">
              <text class="company">{{ shop.company }}</text>
              <image class="check-icon" src="../static/shop/icon-check.png" mode="aspectFit" />
            </view>
            <text class="desc">{{ shop.desc }}</text>
          </view>
        </view>

        <view class="stats-card">
          <view class="stat">
            <view class="stat-head">
              <image class="stat-icon" src="../static/shop/icon-bag.png" mode="aspectFit" />
              <text class="stat-label">在售坑位</text>
            </view>
            <view class="stat-num-row">
              <text class="stat-num">{{ shop.slots }}</text>
              <text class="stat-unit">个</text>
            </view>
          </view>
          <view class="stat-divider" />
          <view class="stat">
            <view class="stat-head">
              <image class="stat-icon shield" src="../static/shop/icon-shield.png" mode="aspectFit" />
              <text class="stat-label">保证金额度</text>
            </view>
            <view class="stat-num-row">
              <text class="stat-yen">¥</text>
              <text class="stat-num">{{ shop.deposit }}</text>
            </view>
          </view>
          <view class="stat-divider" />
          <view class="stat like-stat">
            <view class="stat-head">
              <image class="stat-icon" src="../static/shop/icon-like.png" mode="aspectFit" />
              <text class="stat-label">点赞数</text>
            </view>
            <view class="like-row">
              <text class="stat-num">{{ shop.likes }}</text>
              <view class="like-btn">
                <text class="like-btn-text">点赞</text>
                <image class="like-btn-icon" src="../static/shop/icon-like-btn.png" mode="aspectFit" />
              </view>
            </view>
          </view>
        </view>
      </view>

      <!-- 列表区 -->
      <view class="content">
        <view class="notice">
          <image class="notice-icon" src="../static/shop/icon-notice.png" mode="aspectFit" />
          <text class="notice-title">店铺公告</text>
          <view class="notice-vline" />
          <text class="notice-text">本店所有坑位均为正规授权，售后无忧，放心购买!</text>
          <image class="notice-arrow" src="../static/shop/icon-chevron.png" mode="aspectFit" />
        </view>

        <view class="cat-row">
          <scroll-view class="cat-scroll" scroll-x :show-scrollbar="false">
            <view class="cat-list">
              <view
                v-for="(cat, idx) in categories"
                :key="cat"
                class="cat-item"
                @click="catIndex = idx"
              >
                <text class="cat-text" :class="{ active: catIndex === idx }">{{ cat }}</text>
                <view v-if="catIndex === idx" class="cat-line" />
              </view>
            </view>
          </scroll-view>
          <view class="filter-entry">
            <image class="filter-icon" src="../static/shop/icon-filter.png" mode="aspectFit" />
            <text class="filter-text">筛选</text>
          </view>
        </view>

        <view class="sort-row">
          <view class="sort-default">
            <text class="sort-default-text">默认排序</text>
            <image class="sort-caret" src="../static/shop/icon-caret.png" mode="aspectFit" />
          </view>
          <text
            v-for="(s, idx) in sortOptions"
            :key="s"
            class="sort-opt"
            :class="{ active: sortIndex === idx }"
            @click="sortIndex = idx"
          >{{ s }}</text>
          <view class="stock-only">
            <text class="stock-text">仅看有货</text>
            <image class="switch-img" src="../static/shop/icon-switch.png" mode="aspectFit" />
          </view>
        </view>

        <view
          v-for="item in products"
          :key="item.title"
          class="product"
          @click="openDetail(item)"
        >
          <view class="thumb-wrap">
            <image class="thumb" :src="item.thumb" mode="aspectFill" />
            <image
              v-if="item.logo"
              class="thumb-logo"
              :src="item.logo"
              mode="aspectFit"
            />
            <text v-if="item.thumbLabel" class="thumb-label">{{ item.thumbLabel }}</text>
          </view>
          <view class="product-main">
            <view class="product-top">
              <text class="product-title">{{ item.title }}</text>
              <view class="product-price">
                <text class="yen">¥</text>
                <text class="price-val">{{ item.price }}</text>
                <text class="price-unit">/年</text>
              </view>
            </view>
            <view class="tag-row">
              <view class="p-tag auth">
                <text class="p-tag-text auth-t">官方授权</text>
              </view>
              <view class="p-tag safe">
                <text class="p-tag-text safe-t">正版保障</text>
              </view>
              <view class="p-tag deal">
                <text class="p-tag-text deal-t">担保交易</text>
              </view>
              <view class="stock-tag">
                <text class="stock-tag-text">有货</text>
              </view>
            </view>
            <text class="product-desc">{{ item.desc }}</text>
            <view class="product-bottom">
              <text class="sold">{{ item.sold }}</text>
              <view class="detail-btn" @click.stop="openDetail(item)">
                <text class="detail-btn-text">查看详情</text>
              </view>
            </view>
          </view>
        </view>

        <view class="bottom-space" />
      </view>
    </scroll-view>
  </view>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import { useNavBar } from '@/composables/useNavBar'
import { listingApi, merchantApi } from '@/api'

const { statusBarHeight, navBarHeight, menuRight } = useNavBar()
const catIndex = ref(0)
const sortIndex = ref(-1)
const merchantId = ref('')

const shop = reactive({
  name: '软件超人',
  company: '河北微脉云网络科技有限公司',
  desc: '专注电商系统服务，提供稳定、安全、售后无忧的坑位服务',
  avatar: '../static/shop/avatar.png',
  slots: '28',
  deposit: '50,000',
  likes: '5680+',
})

const categories = ref(['全部'])
const sortOptions = ['销量最高', '价格最低', '价格最高']

type ProductRow = {
  id?: string
  title: string
  desc: string
  price: string
  sold: string
  thumb: string
  logo: string
  thumbLabel: string
}

const products = ref<ProductRow[]>([
  {
    title: 'EweiShop商城系统坑位',
    desc: '开源商城系统，支持多端小程序、H5、公众号、APP',
    price: '199',
    sold: '已售1280+',
    thumb: '../static/shop/product-1.png',
    logo: '../static/shop/product-1-logo.png',
    thumbLabel: 'EWEISHOP',
  },
  {
    title: 'UniApp多商户商城坑位',
    desc: '多商户入驻，支持多端，功能强大',
    price: '299',
    sold: '已售860+',
    thumb: '../static/shop/product-2.png',
    logo: '../static/shop/product-2-logo.png',
    thumbLabel: 'UNIAPP',
  },
  {
    title: '同城生活系统坑位',
    desc: '外卖、跑腿、团购，拼团等功能',
    price: '159',
    sold: '已售760+',
    thumb: '../static/shop/product-3.png',
    logo: '../static/shop/product-3-logo.png',
    thumbLabel: '同城系统',
  },
])

const goBack = () => {
  uni.navigateBack({
    fail: () => {
      uni.switchTab({ url: '/pages/merchant/merchant' })
    },
  })
}

const openDetail = (item: ProductRow) => {
  const qs = [
    item.id ? `id=${encodeURIComponent(item.id)}` : '',
    `title=${encodeURIComponent(item.title)}`,
    `price=${encodeURIComponent(item.price)}`,
    `name=${encodeURIComponent(shop.name)}`,
    `avatar=${encodeURIComponent(shop.avatar)}`,
  ].filter(Boolean).join('&')
  uni.navigateTo({ url: `/packageGoods/detail/detail?${qs}` })
}

onLoad(async (query) => {
  if (query?.id) merchantId.value = String(query.id)
  if (query?.name) shop.name = decodeURIComponent(query.name)
  if (query?.avatar) shop.avatar = decodeURIComponent(query.avatar)

  if (merchantId.value) {
    const detail = await merchantApi.detailSilent(merchantId.value)
    if (detail) {
      shop.name = detail.name
      shop.avatar = detail.logo || shop.avatar
      shop.company = detail.intro || shop.company
      shop.desc = detail.intro || shop.desc
      shop.deposit = detail.deposit_amount != null ? String(detail.deposit_amount) : shop.deposit
      shop.slots = String(detail.listing_count ?? shop.slots)
    }
    const list = await listingApi.byMerchantSilent(merchantId.value, { limit: 30 })
    if (list?.length) {
      products.value = list.map((row) => ({
        id: String(row.id),
        title: row.title || row.name || row.product?.name || '坑位商品',
        desc: row.intro || row.product?.summary || '',
        price: String(row.price ?? ''),
        sold: `浏览${row.view_count ?? 0}`,
        thumb: row.cover || row.images?.[0] || row.product?.logo || '../static/shop/product-1.png',
        logo: row.product?.logo || '../static/shop/product-1-logo.png',
        thumbLabel: row.category?.name || '坑位',
      }))
      shop.slots = String(list.length)
      const cats = Array.from(new Set(list.map((r) => r.category?.name).filter(Boolean))) as string[]
      if (cats.length) categories.value = ['全部', ...cats]
    }
  }
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
  background: #fff;
  flex-shrink: 0;
  z-index: 20;
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

.back-icon {
  width: 14rpx;
  height: 26rpx;
}

.nav-title {
  flex: 1;
  text-align: center;
  font-size: 32rpx;
  font-weight: 700;
  color: #282828;
}

.scroll {
  flex: 1;
  height: 0;
}

.header {
  position: relative;
  padding: 24rpx 28rpx 0;
  overflow: hidden;
}

.header-bg {
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  width: 100%;
  height: 100%;
}

.profile {
  position: relative;
  z-index: 2;
  display: flex;
  gap: 20rpx;
}

.avatar {
  width: 114rpx;
  height: 114rpx;
  border-radius: 50%;
  flex-shrink: 0;
  background: #1a2a40;
}

.profile-main {
  flex: 1;
  min-width: 0;
}

.name-row {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 10rpx;
}

.name {
  font-size: 36rpx;
  font-weight: 700;
  color: #d9dde0;
}

.tag-gold {
  padding: 4rpx 14rpx;
  border-radius: 18rpx;
  background: #fac869;
  border: 1rpx solid #cba861;
}

.tag-gold-text {
  font-size: 20rpx;
  color: #c46211;
}

.tag-auth {
  padding: 4rpx 14rpx;
  border-radius: 16rpx;
  background: #28a153;
  border: 1rpx solid #299452;
}

.tag-auth-text {
  font-size: 20rpx;
  color: #c4e9d2;
}

.follow-btn {
  margin-left: auto;
  display: flex;
  align-items: center;
  gap: 8rpx;
  padding: 10rpx 20rpx;
  border-radius: 28rpx;
  background: #0e2038;
  border: 1rpx solid #9ba3ad;
}

.follow-icon {
  width: 24rpx;
  height: 24rpx;
}

.follow-text {
  font-size: 22rpx;
  color: #c5cad0;
  font-weight: 700;
}

.company-row {
  margin-top: 12rpx;
  display: flex;
  align-items: center;
  gap: 8rpx;
}

.company {
  font-size: 26rpx;
  color: #ccd1d7;
  font-weight: 700;
}

.check-icon {
  width: 28rpx;
  height: 28rpx;
}

.desc {
  display: block;
  margin-top: 12rpx;
  font-size: 24rpx;
  color: #bec4cb;
  line-height: 1.4;
}

.stats-card {
  position: relative;
  z-index: 2;
  margin-top: 28rpx;
  padding: 28rpx 20rpx;
  background: #192e44;
  border: 1rpx solid #38495b;
  border-radius: 24rpx;
  display: flex;
  align-items: center;
}

.stat {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12rpx;
}

.stat-head {
  display: flex;
  align-items: center;
  gap: 8rpx;
}

.stat-icon {
  width: 30rpx;
  height: 30rpx;
}

.stat-icon.shield {
  width: 28rpx;
  height: 32rpx;
}

.stat-label {
  font-size: 24rpx;
  color: #bfc5cc;
  font-weight: 700;
}

.stat-num-row {
  display: flex;
  align-items: baseline;
  gap: 4rpx;
}

.stat-num {
  font-size: 40rpx;
  color: #e7e9eb;
  font-weight: 700;
  line-height: 1;
}

.stat-unit {
  font-size: 26rpx;
  color: #d1d5da;
  font-weight: 700;
}

.stat-yen {
  font-size: 28rpx;
  color: #c8ccd2;
  font-weight: 500;
}

.stat-divider {
  width: 1rpx;
  height: 72rpx;
  background: #38495b;
}

.like-stat {
  align-items: flex-start;
  padding-left: 12rpx;
}

.like-row {
  display: flex;
  align-items: center;
  gap: 10rpx;
  width: 100%;
  justify-content: center;
}

.like-btn {
  display: flex;
  align-items: center;
  gap: 6rpx;
  padding: 8rpx 14rpx;
  border-radius: 20rpx;
  background: #192f45;
  border: 1rpx solid #7c8590;
}

.like-btn-text {
  font-size: 22rpx;
  color: #c4c9cf;
}

.like-btn-icon {
  width: 22rpx;
  height: 22rpx;
}

.content {
  margin-top: -8rpx;
  position: relative;
  z-index: 3;
  background: #fff;
  border-radius: 24rpx 24rpx 0 0;
  padding: 24rpx 28rpx 0;
  min-height: 800rpx;
}

.notice {
  display: flex;
  align-items: center;
  gap: 12rpx;
  padding: 20rpx 18rpx;
  background: #f3faf6;
  border-radius: 14rpx;
}

.notice-icon {
  width: 28rpx;
  height: 28rpx;
  flex-shrink: 0;
}

.notice-title {
  font-size: 24rpx;
  color: #4cb56e;
  flex-shrink: 0;
}

.notice-vline {
  width: 2rpx;
  height: 24rpx;
  background: #d0e8d8;
  flex-shrink: 0;
}

.notice-text {
  flex: 1;
  font-size: 24rpx;
  color: #6c7078;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.notice-arrow {
  width: 12rpx;
  height: 20rpx;
  flex-shrink: 0;
}

.cat-row {
  margin-top: 24rpx;
  display: flex;
  align-items: center;
  border-bottom: 1rpx solid #f0f1f5;
  padding-bottom: 4rpx;
}

.cat-scroll {
  flex: 1;
  white-space: nowrap;
}

.cat-list {
  display: inline-flex;
  align-items: flex-end;
  gap: 8rpx;
}

.cat-item {
  position: relative;
  padding: 12rpx 18rpx 18rpx;
  display: inline-flex;
  flex-direction: column;
  align-items: center;
}

.cat-text {
  font-size: 28rpx;
  color: #616469;
  font-weight: 700;
}

.cat-text.active {
  color: #45b369;
  font-size: 30rpx;
}

.cat-line {
  position: absolute;
  bottom: 0;
  width: 48rpx;
  height: 4rpx;
  border-radius: 2rpx;
  background: #45b369;
}

.filter-entry {
  display: flex;
  align-items: center;
  gap: 6rpx;
  padding-left: 12rpx;
  flex-shrink: 0;
}

.filter-icon {
  width: 24rpx;
  height: 26rpx;
}

.filter-text {
  font-size: 26rpx;
  color: #65686f;
}

.sort-row {
  margin-top: 20rpx;
  display: flex;
  align-items: center;
  gap: 8rpx;
  flex-wrap: nowrap;
}

.sort-default {
  display: flex;
  align-items: center;
  gap: 8rpx;
  padding: 10rpx 18rpx;
  border-radius: 22rpx;
  background: #e5f5ed;
  border: 1rpx solid #ecf7f1;
  flex-shrink: 0;
}

.sort-default-text {
  font-size: 22rpx;
  color: #53b375;
}

.sort-caret {
  width: 14rpx;
  height: 10rpx;
}

.sort-opt {
  font-size: 22rpx;
  color: #6a6e76;
  padding: 0 8rpx;
  flex-shrink: 0;
}

.sort-opt.active {
  color: #45b369;
}

.stock-only {
  margin-left: auto;
  display: flex;
  align-items: center;
  gap: 8rpx;
  flex-shrink: 0;
}

.stock-text {
  font-size: 22rpx;
  color: #6b7079;
}

.switch-img {
  width: 64rpx;
  height: 36rpx;
}

.product {
  margin-top: 20rpx;
  padding: 24rpx 20rpx;
  background: #fefefe;
  border-radius: 16rpx;
  box-shadow: 0 0 0 1rpx #f3f4f6;
  display: flex;
  gap: 20rpx;
}

.thumb-wrap {
  position: relative;
  width: 120rpx;
  height: 136rpx;
  border-radius: 16rpx;
  overflow: hidden;
  flex-shrink: 0;
  background: #eef3ff;
}

.thumb {
  width: 100%;
  height: 100%;
}

.thumb-logo {
  position: absolute;
  left: 50%;
  top: 36%;
  width: 64rpx;
  height: 68rpx;
  transform: translate(-50%, -50%);
}

.thumb-label {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 16rpx;
  text-align: center;
  font-size: 18rpx;
  color: rgba(255, 255, 255, 0.75);
}

.product-main {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 10rpx;
}

.product-top {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12rpx;
}

.product-title {
  flex: 1;
  font-size: 28rpx;
  font-weight: 700;
  color: #303031;
  line-height: 1.3;
}

.product-price {
  display: flex;
  align-items: baseline;
  flex-shrink: 0;
}

.yen {
  font-size: 22rpx;
  color: #fd7c54;
  font-weight: 500;
}

.price-val {
  font-size: 34rpx;
  color: #fb5e30;
  font-weight: 700;
  line-height: 1;
}

.price-unit {
  font-size: 18rpx;
  color: #9398a3;
  margin-left: 2rpx;
}

.tag-row {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 10rpx;
}

.p-tag {
  padding: 4rpx 12rpx;
  border-radius: 6rpx;
}

.p-tag.auth {
  background: #fbfdfe;
  border: 1rpx solid #a3c6fc;
}

.p-tag.safe {
  background: #fcfdfd;
  border: 1rpx solid #a5dabd;
}

.p-tag.deal {
  background: #fefdfd;
  border: 1rpx solid #fdd8a8;
}

.p-tag-text {
  font-size: 20rpx;
}

.auth-t {
  color: #5a98f9;
}

.safe-t {
  color: #59bb7b;
}

.deal-t {
  color: #fd9041;
}

.stock-tag {
  margin-left: auto;
  padding: 4rpx 16rpx;
  border-radius: 18rpx;
  background: #e8f6ee;
}

.stock-tag-text {
  font-size: 20rpx;
  color: #5ebb80;
}

.product-desc {
  font-size: 22rpx;
  color: #7e838d;
  line-height: 1.4;
}

.product-bottom {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 4rpx;
}

.sold {
  font-size: 22rpx;
  color: #9b9fa7;
}

.detail-btn {
  padding: 12rpx 24rpx;
  border-radius: 28rpx;
  background: #fcfdfd;
  border: 1rpx solid #84cfa1;
}

.detail-btn-text {
  font-size: 24rpx;
  color: #5bbc7c;
}

.bottom-space {
  height: 48rpx;
}
</style>
