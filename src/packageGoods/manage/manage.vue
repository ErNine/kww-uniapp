<template>
  <view class="page">
    <!-- 头部：渐变背景 + 导航 + 状态筛选 -->
    <view class="header">
      <view class="header-bg">
        <view class="header-circle circle-a" />
        <view class="header-circle circle-b" />
        <view class="header-circle circle-c" />
      </view>
      <view class="status-bar" :style="{ height: statusBarHeight + 'px' }" />
      <view
        class="nav-row"
        :style="{ height: navBarHeight + 'px', paddingRight: menuRight + 'px' }"
      >
        <view class="nav-side" @click="goBack">
          <image class="back-icon" src="../static/manage/icon-back.png" mode="aspectFit" />
        </view>
        <view class="nav-titles">
          <text class="nav-title">商品管理</text>
          <text class="nav-sub">坑位网</text>
        </view>
        <view class="nav-side nav-side--placeholder" />
      </view>
      <scroll-view class="status-scroll" scroll-x :show-scrollbar="false">
        <view class="status-tabs">
          <view
            v-for="(tab, idx) in statusTabs"
            :key="tab.key"
            class="status-tab"
            :class="{ active: statusIndex === idx }"
            @click="statusIndex = idx"
          >
            <text class="status-tab-label" :class="{ active: statusIndex === idx }">{{ tab.label }}</text>
            <text class="status-tab-count" :class="{ active: statusIndex === idx }">{{ tab.count }}</text>
          </view>
        </view>
      </scroll-view>
    </view>

    <!-- 主体：左侧分类 + 右侧商品列表 -->
    <view class="main">
      <view class="side">
        <scroll-view class="side-scroll" scroll-y :show-scrollbar="false">
          <view class="side-list">
            <view
              v-for="(cat, idx) in categories"
              :key="cat"
              class="side-item"
              :class="{ active: categoryIndex === idx }"
              @click="categoryIndex = idx"
            >
              <image
                v-if="categoryIndex === idx"
                class="side-active-bar"
                src="../static/manage/category-active-bar.png"
                mode="scaleToFill"
              />
              <text class="side-text" :class="{ active: categoryIndex === idx }">{{ cat }}</text>
            </view>
          </view>
        </scroll-view>
        <view class="side-manage" @click="onManageCategory">
          <image class="side-manage-icon" src="../static/manage/icon-manage-cat.png" mode="aspectFit" />
          <text class="side-manage-text">管理分类</text>
        </view>
      </view>

      <scroll-view class="list-scroll" scroll-y :show-scrollbar="false">
        <view class="list-head">
          <text class="list-count">共{{ statusTabs[statusIndex].count }}个商品</text>
          <view class="edit-btn" @click="onEdit">
            <image class="edit-icon" src="../static/manage/icon-edit.png" mode="aspectFit" />
            <text class="edit-text">编辑</text>
          </view>
        </view>

        <view
          v-for="item in filteredProducts"
          :key="item.id"
          class="product-card"
          :class="{ 'game-card': item.variant === 'game' }"
        >
          <image
            v-if="item.variant === 'game'"
            class="game-card-bg"
            src="../static/manage/card-game-bg.png"
            mode="scaleToFill"
          />
          <view class="product-inner">
            <image class="product-cover" :src="item.cover" mode="aspectFill" />
            <view class="product-body">
              <view class="product-top">
                <text class="product-name">{{ item.name }}</text>
                <image
                  class="product-more"
                  src="../static/manage/icon-more.png"
                  mode="aspectFit"
                  @click.stop="onMore(item)"
                />
              </view>
              <text class="product-desc">{{ item.desc }}</text>
              <view class="product-meta">
                <text class="product-price">￥{{ item.price }}</text>
                <text class="product-sales">销量{{ item.sales }}</text>
              </view>
            </view>
          </view>
          <view v-if="item.variant === 'game'" class="status-pill-game">
            <image class="status-pill-game-bg" src="../static/manage/pill-game-bg.png" mode="scaleToFill" />
            <text class="status-pill-game-text">{{ item.statusLabel }}</text>
          </view>
          <view v-else class="status-pill" :class="item.status">
            <text class="status-pill-text" :class="item.status">{{ item.statusLabel }}</text>
          </view>
        </view>
        <view class="list-bottom" />
      </scroll-view>
    </view>

    <!-- 发布商品悬浮按钮 -->
    <view class="fab" @click="onPublish">
      <image class="fab-bg" src="../static/manage/fab-publish-bg.png" mode="scaleToFill" />
      <image class="fab-icon" src="../static/manage/icon-fab-plus.png" mode="aspectFit" />
      <text class="fab-text">发布商品</text>
    </view>
  </view>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useNavBar } from '@/composables/useNavBar'
import { categoryApi, listingApi, ListingSaleStatus, type ListingItem } from '@/api'

const { statusBarHeight, navBarHeight, menuRight } = useNavBar()

const statusIndex = ref(0)
const categoryIndex = ref(0)

const statusTabs = ref([
  { key: 'all', label: '全部', count: 0 },
  { key: 'on', label: '上架中', count: 0 },
  { key: 'off', label: '已下架', count: 0 },
  { key: 'audit', label: '审核中', count: 0 },
  { key: 'fail', label: '审核失败', count: 0 },
])

const categories = ref<string[]>([
  '全部商品',
  '软件应用',
  '游戏娱乐',
  '知识课程',
  '工具插件',
  '设计素材',
  '生活服务',
  '电商购物',
  '企业服务',
])

type ProductStatus = 'on' | 'off' | 'audit' | 'fail'

interface ProductItem {
  id: string
  name: string
  desc: string
  price: string
  sales: string
  cover: string
  status: ProductStatus
  statusLabel: string
  category: string
  variant?: 'game'
}

const products = ref<ProductItem[]>([
  {
    id: '1',
    name: '高效待办清单Pro',
    desc: '提升效率，从清单开始',
    price: '39.90',
    sales: '1,286',
    cover: '../static/manage/cover-todo.png',
    status: 'on',
    statusLabel: '上架中',
    category: '软件应用',
  },
  {
    id: '2',
    name: 'AI智能写作助手',
    desc: '一键生成优质内容',
    price: '59.00',
    sales: '2,358',
    cover: '../static/manage/cover-ai.png',
    status: 'audit',
    statusLabel: '审核中',
    category: '工具插件',
  },
  {
    id: '3',
    name: '影视大全会员月卡',
    desc: '海量影视，随心观看',
    price: '25.00',
    sales: '954',
    cover: '../static/manage/cover-video.png',
    status: 'fail',
    statusLabel: '审核失败',
    category: '生活服务',
  },
  {
    id: '4',
    name: '云端存储空间1TB',
    desc: '安全存储，随时访问',
    price: '88.00',
    sales: '673',
    cover: '../static/manage/cover-cloud.png',
    status: 'on',
    statusLabel: '上架中',
    category: '软件应用',
  },
  {
    id: '5',
    name: '极简笔记',
    desc: '记录灵感，整理思路',
    price: '18.00',
    sales: '432',
    cover: '../static/manage/cover-note.png',
    status: 'off',
    statusLabel: '已下架',
    category: '工具插件',
  },
  {
    id: '6',
    name: '热门游戏礼包合集',
    desc: '超值礼包，助力游戏',
    price: '68.00',
    sales: '1,125',
    cover: '../static/manage/cover-game.png',
    status: 'on',
    statusLabel: '上架中',
    category: '游戏娱乐',
    variant: 'game',
  },
])

const filteredProducts = computed(() => {
  const tab = statusTabs.value[statusIndex.value]
  const cat = categories.value[categoryIndex.value]
  return products.value.filter((p) => {
    const statusOk = tab.key === 'all' || p.status === tab.key
    const catOk = cat === '全部商品' || p.category === cat
    return statusOk && catOk
  })
})

function recount() {
  const list = products.value
  statusTabs.value = statusTabs.value.map((tab) => ({
    ...tab,
    count:
      tab.key === 'all' ? list.length : list.filter((p) => p.status === tab.key).length,
  }))
}

function mapListing(item: ListingItem): ProductItem {
  const sale = Number(item.sale_status ?? 0)
  let status: ProductStatus = 'audit'
  if (sale === ListingSaleStatus.OnSale) status = 'on'
  else if (sale === ListingSaleStatus.Offline || sale === ListingSaleStatus.Draft) status = 'off'
  else if (sale === ListingSaleStatus.Pending) status = 'audit'
  else if (sale === ListingSaleStatus.Rejected) status = 'fail'

  const labels: Record<ProductStatus, string> = {
    on: '上架中',
    off: '已下架',
    audit: '审核中',
    fail: '审核失败',
  }
  return {
    id: String(item.id),
    name: item.title || item.name || '',
    desc: item.intro || item.desc || item.product?.name || '',
    price: String(item.price ?? ''),
    sales: String(item.sales ?? item.view_count ?? 0),
    cover: item.cover || item.images?.[0] || item.product?.logo || '../static/manage/cover-todo.png',
    status,
    statusLabel: item.status_label || labels[status],
    category: item.category?.name || item.category_name || '全部商品',
  }
}

onMounted(async () => {
  const { requireAuth } = await import('@/api')
  const me = await requireAuth({
    requireMerchant: true,
    redirect: '/packageGoods/manage/manage',
  })
  if (!me) return
  const [cats, list] = await Promise.all([
    categoryApi.listSilent(),
    listingApi.mineSilent({ limit: 100 }),
  ])
  if (cats?.length) {
    categories.value = ['全部商品', ...cats.map((c) => c.name)]
  }
  if (list?.length) {
    products.value = list.map(mapListing)
  }
  recount()
})

function goBack() {
  uni.navigateBack({ fail: () => uni.switchTab({ url: '/pages/mine/mine' }) })
}

function onEdit() {
  const first = filteredProducts.value[0]
  if (!first) {
    uni.showToast({ title: '暂无商品', icon: 'none' })
    return
  }
  uni.navigateTo({
    url: `/packageGoods/publish/publish?id=${encodeURIComponent(first.id)}`,
  })
}

function onMore(item: ProductItem) {
  uni.showActionSheet({
    itemList: ['编辑', '查看详情'],
    success: (res) => {
      if (res.tapIndex === 0) {
        uni.navigateTo({
          url: `/packageGoods/publish/publish?id=${encodeURIComponent(item.id)}`,
        })
      } else if (res.tapIndex === 1) {
        uni.navigateTo({
          url: `/packageGoods/detail/detail?id=${encodeURIComponent(item.id)}`,
        })
      }
    },
  })
}

function onManageCategory() {
  uni.navigateTo({ url: '/packageGoods/category/category' })
}

function onPublish() {
  uni.navigateTo({ url: '/packageGoods/publish/publish' })
}
</script>

<style scoped>
.page {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background: #fafbfc;
  box-sizing: border-box;
  overflow: hidden;
}

/* ===== 头部 ===== */
.header {
  position: relative;
  flex-shrink: 0;
}

.header-bg {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(180deg, #eef4fd 0%, #f5f8fd 55%, #fafbfc 100%);
  overflow: hidden;
  z-index: 0;
}

.header-circle {
  position: absolute;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(255, 255, 255, 0.65) 0%, rgba(255, 255, 255, 0) 70%);
}

.circle-a {
  width: 190rpx;
  height: 190rpx;
  left: -60rpx;
  top: 30rpx;
}

.circle-b {
  width: 130rpx;
  height: 130rpx;
  right: 40rpx;
  top: -40rpx;
}

.circle-c {
  width: 84rpx;
  height: 84rpx;
  right: 190rpx;
  top: 96rpx;
}

.status-bar,
.nav-row,
.status-scroll {
  position: relative;
  z-index: 1;
}

.nav-row {
  display: flex;
  align-items: center;
  padding-left: 24rpx;
  box-sizing: border-box;
}

.nav-side {
  width: 64rpx;
  height: 64rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.back-icon {
  width: 16rpx;
  height: 29rpx;
}

.nav-titles {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.nav-title {
  font-size: 31rpx;
  font-weight: 700;
  color: #252d37;
  line-height: 1.15;
}

.nav-sub {
  margin-top: 4rpx;
  font-size: 19rpx;
  color: #829ec9;
  line-height: 1.2;
}

/* 状态筛选标签 */
.status-scroll {
  width: 100%;
  white-space: nowrap;
  box-sizing: border-box;
}

.status-tabs {
  display: inline-flex;
  align-items: stretch;
  gap: 12rpx;
  padding: 24rpx 20rpx 20rpx 25rpx;
  box-sizing: border-box;
}

.status-tab {
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-width: 126rpx;
  height: 81rpx;
  padding: 0 18rpx;
  background: #f1f6fd;
  border-radius: 25rpx;
  box-sizing: border-box;
}

.status-tab.active {
  background: #f8f9fd;
}

.status-tab-label {
  font-size: 21rpx;
  font-weight: 700;
  color: #757f93;
  line-height: 1.2;
}

.status-tab-label.active {
  color: #4489fa;
}

.status-tab-count {
  margin-top: 6rpx;
  font-size: 18rpx;
  color: #9ca8c0;
  line-height: 1;
}

.status-tab-count.active {
  color: #5292fc;
}

/* ===== 主体 ===== */
.main {
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: row;
}

/* 左侧分类 */
.side {
  width: 144rpx;
  flex-shrink: 0;
  height: 100%;
  background: #fefefe;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
}

.side-scroll {
  flex: 1;
  min-height: 0;
}

.side-list {
  padding-top: 60rpx;
}

.side-item {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 74rpx;
  padding: 16rpx 8rpx;
  box-sizing: border-box;
}

.side-active-bar {
  position: absolute;
  left: 8rpx;
  top: 50%;
  transform: translateY(-50%);
  width: 5rpx;
  height: 24rpx;
}

.side-text {
  font-size: 19rpx;
  color: #7b8394;
  line-height: 1.3;
  text-align: center;
}

.side-text.active {
  font-size: 20rpx;
  font-weight: 700;
  color: #5395fb;
}

.side-manage {
  flex-shrink: 0;
  margin: 16rpx 12rpx calc(14rpx + env(safe-area-inset-bottom));
  padding: 18rpx 6rpx 14rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  background: #fdfcfc;
  border: 2rpx solid #f1f4f9;
  border-radius: 20rpx;
  box-sizing: border-box;
}

.side-manage-icon {
  width: 18rpx;
  height: 16rpx;
  margin-bottom: 8rpx;
}

.side-manage-text {
  font-size: 16rpx;
  color: #aeb6c5;
  line-height: 1.2;
}

/* 右侧商品列表 */
.list-scroll {
  flex: 1;
  min-width: 0;
  height: 100%;
}

.list-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 56rpx 23rpx 8rpx;
  box-sizing: border-box;
}

.list-count {
  font-size: 20rpx;
  font-weight: 700;
  color: #9ea6b7;
  line-height: 1.2;
}

.edit-btn {
  display: flex;
  align-items: center;
  height: 44rpx;
  padding: 0 18rpx;
  background: #f2f4f8;
  border-radius: 12rpx;
  box-sizing: border-box;
}

.edit-icon {
  width: 18rpx;
  height: 17rpx;
  margin-right: 6rpx;
}

.edit-text {
  font-size: 18rpx;
  color: #7e8797;
  line-height: 1;
}

/* 商品卡片 */
.product-card {
  position: relative;
  margin: 0 23rpx 12rpx;
  border-radius: 14rpx;
  overflow: hidden;
  background: #fdfdfd;
  border: 1rpx solid #f2f5fb;
  box-sizing: border-box;
}

.product-card.game-card {
  border: none;
  background: transparent;
}

.game-card-bg {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
}

.product-inner {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  padding: 21rpx 23rpx 22rpx 20rpx;
  box-sizing: border-box;
}

.product-cover {
  width: 98rpx;
  height: 102rpx;
  border-radius: 10rpx;
  flex-shrink: 0;
  background: #f5f7fb;
}

.product-body {
  flex: 1;
  min-width: 0;
  margin-left: 20rpx;
}

.product-top {
  display: flex;
  align-items: flex-start;
  gap: 8rpx;
}

.product-name {
  flex: 1;
  min-width: 0;
  font-size: 20rpx;
  font-weight: 700;
  color: #394150;
  line-height: 1.3;
}

.product-more {
  width: 20rpx;
  height: 5rpx;
  margin-top: 8rpx;
  flex-shrink: 0;
}

.product-desc {
  display: block;
  margin-top: 8rpx;
  font-size: 18rpx;
  color: #a7aebe;
  line-height: 1.35;
}

.product-meta {
  display: flex;
  align-items: baseline;
  gap: 24rpx;
  margin-top: 14rpx;
}

.product-price {
  font-size: 17rpx;
  font-weight: 500;
  color: #fc5d53;
  line-height: 1;
}

.product-sales {
  font-size: 18rpx;
  color: #a7afbf;
  line-height: 1;
}

/* 状态胶囊 */
.status-pill {
  position: absolute;
  right: 18rpx;
  bottom: 20rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 77rpx;
  height: 30rpx;
  padding: 0 12rpx;
  border-radius: 10rpx;
  box-sizing: border-box;
}

.status-pill.on {
  background: #eaf8f4;
}

.status-pill.audit {
  background: #e9f2fe;
}

.status-pill.fail {
  background: #fde8e8;
  border: 1rpx solid #fdeeef;
}

.status-pill.off {
  background: #e7edf7;
  border-radius: 8rpx;
}

.status-pill-text {
  font-size: 15rpx;
  line-height: 1;
}

.status-pill-text.on {
  color: #50c88e;
}

.status-pill-text.audit {
  color: #5c9afc;
}

.status-pill-text.fail {
  color: #fb5f57;
}

.status-pill-text.off {
  color: #8e9cb4;
}

/* 游戏卡片状态胶囊（图片背景） */
.status-pill-game {
  position: absolute;
  right: 18rpx;
  bottom: 20rpx;
  width: 76rpx;
  height: 31rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1;
}

.status-pill-game-bg {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
}

.status-pill-game-text {
  position: relative;
  font-size: 15rpx;
  color: #77cad4;
  line-height: 1;
}

.list-bottom {
  height: calc(170rpx + env(safe-area-inset-bottom));
}

/* ===== 发布商品悬浮按钮 ===== */
.fab {
  position: fixed;
  right: 40rpx;
  bottom: calc(48rpx + env(safe-area-inset-bottom));
  width: 126rpx;
  height: 110rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  z-index: 10;
}

.fab-bg {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
}

.fab-icon {
  position: relative;
  z-index: 1;
  width: 35rpx;
  height: 36rpx;
  margin-top: 22rpx;
}

.fab-text {
  position: relative;
  z-index: 1;
  margin-top: 12rpx;
  font-size: 20rpx;
  color: #cfe3fc;
  line-height: 1.2;
}
</style>
