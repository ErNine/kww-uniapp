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
        <view class="search-box">
          <image class="search-icon" src="/static/home/icon-search-glass.png" mode="aspectFit" />
          <input
            class="search-input"
            v-model="keyword"
            confirm-type="search"
            focus
            placeholder="搜索坑位、坑位商、资讯"
            placeholder-class="ph"
            @confirm="doSearch"
          />
        </view>
        <view class="search-btn" @tap="doSearch">
          <text class="search-btn-text">搜索</text>
        </view>
      </view>
    </view>

    <view class="tabs">
      <view
        v-for="tab in tabs"
        :key="tab.key"
        class="tab"
        :class="{ active: activeTab === tab.key }"
        @tap="activeTab = tab.key"
      >
        <text class="tab-text" :class="{ active: activeTab === tab.key }">{{ tab.label }}</text>
      </view>
    </view>

    <scroll-view class="scroll" scroll-y :show-scrollbar="false">
      <view v-if="loading" class="empty">
        <text class="empty-text">搜索中…</text>
      </view>
      <view v-else-if="!keyword.trim()" class="empty">
        <text class="empty-text">输入关键词开始搜索</text>
      </view>
      <view v-else-if="!hasResult" class="empty">
        <text class="empty-text">{{ fromApi ? '暂无结果' : '接口暂未就绪，请稍后重试' }}</text>
      </view>
      <template v-else>
        <view v-if="showProducts" class="section">
          <text class="section-title">坑位商品</text>
          <view
            v-for="item in result.products"
            :key="'p-' + item.id"
            class="row"
            @tap="openProduct(item)"
          >
            <text class="row-title">{{ item.name }}</text>
            <text class="row-sub">{{ item.category_name || item.desc || '' }}</text>
          </view>
        </view>
        <view v-if="showMerchants" class="section">
          <text class="section-title">坑位商</text>
          <view
            v-for="item in result.merchants"
            :key="'m-' + item.id"
            class="row"
            @tap="openMerchant(item)"
          >
            <text class="row-title">{{ item.name }}</text>
            <text class="row-sub">{{ item.business || item.auth_label || '' }}</text>
          </view>
        </view>
        <view v-if="showArticles" class="section">
          <text class="section-title">资讯</text>
          <view
            v-for="item in result.articles"
            :key="'a-' + item.id"
            class="row"
            @tap="openArticle(item)"
          >
            <text class="row-title">{{ item.title }}</text>
            <text class="row-sub">{{ item.source || '' }}</text>
          </view>
        </view>
      </template>
      <view class="bottom" />
    </scroll-view>
  </view>
</template>

<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import { useNavBar } from '@/composables/useNavBar'
import { searchApi, type ArticleItem, type MerchantItem, type ProductItem, type SearchResult } from '@/api'

const { statusBarHeight, navBarHeight, menuRight } = useNavBar()

const keyword = ref('')
const loading = ref(false)
const fromApi = ref(false)
const activeTab = ref<'all' | 'product' | 'merchant' | 'article'>('all')
const result = reactive<SearchResult>({
  products: [],
  merchants: [],
  articles: [],
})

const tabs = [
  { key: 'all' as const, label: '全部' },
  { key: 'product' as const, label: '坑位' },
  { key: 'merchant' as const, label: '商家' },
  { key: 'article' as const, label: '资讯' },
]

const showProducts = computed(
  () =>
    (activeTab.value === 'all' || activeTab.value === 'product') &&
    (result.products?.length || 0) > 0,
)
const showMerchants = computed(
  () =>
    (activeTab.value === 'all' || activeTab.value === 'merchant') &&
    (result.merchants?.length || 0) > 0,
)
const showArticles = computed(
  () =>
    (activeTab.value === 'all' || activeTab.value === 'article') &&
    (result.articles?.length || 0) > 0,
)
const hasResult = computed(
  () => showProducts.value || showMerchants.value || showArticles.value,
)

onLoad((q) => {
  if (q?.keyword) {
    keyword.value = decodeURIComponent(String(q.keyword))
    doSearch()
  }
})

function goBack() {
  uni.navigateBack({ fail: () => uni.switchTab({ url: '/pages/index/index' }) })
}

async function doSearch() {
  const kw = keyword.value.trim()
  if (!kw) {
    uni.showToast({ title: '请输入关键词', icon: 'none' })
    return
  }
  loading.value = true
  const data = await searchApi.querySilent(kw, {
    type: activeTab.value === 'all' ? undefined : activeTab.value,
  })
  loading.value = false
  if (data) {
    fromApi.value = true
    result.products = data.products || []
    result.merchants = data.merchants || []
    result.articles = data.articles || []
  } else {
    fromApi.value = false
    result.products = []
    result.merchants = []
    result.articles = []
    uni.showToast({ title: '搜索服务暂未就绪', icon: 'none' })
  }
}

function openProduct(item: ProductItem) {
  uni.navigateTo({
    url: `/packageGoods/list/list?id=${encodeURIComponent(String(item.id))}&name=${encodeURIComponent(item.name)}`,
  })
}

function openMerchant(item: MerchantItem) {
  uni.navigateTo({
    url: `/packageGoods/shop/shop?id=${encodeURIComponent(String(item.id))}&name=${encodeURIComponent(item.name)}&avatar=${encodeURIComponent(item.logo || item.avatar || '')}`,
  })
}

function openArticle(item: ArticleItem) {
  uni.navigateTo({
    url: `/pages/news/detail?id=${encodeURIComponent(String(item.id))}`,
  })
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
  padding-left: 16rpx;
  gap: 12rpx;
  box-sizing: border-box;
}
.nav-left {
  width: 56rpx;
  height: 56rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}
.back-icon {
  font-size: 48rpx;
  color: #1a1a1a;
  line-height: 1;
  margin-top: -4rpx;
}
.search-box {
  flex: 1;
  height: 64rpx;
  background: #f3f5f9;
  border-radius: 32rpx;
  display: flex;
  align-items: center;
  padding: 0 20rpx;
  gap: 10rpx;
  min-width: 0;
}
.search-icon {
  width: 28rpx;
  height: 28rpx;
  flex-shrink: 0;
}
.search-input {
  flex: 1;
  font-size: 26rpx;
  color: #1a1a1a;
  min-width: 0;
}
.ph {
  color: #9aa3b2;
}
.search-btn {
  padding: 0 8rpx 0 4rpx;
  flex-shrink: 0;
}
.search-btn-text {
  font-size: 28rpx;
  color: #104ffb;
  font-weight: 600;
}
.tabs {
  display: flex;
  background: #fff;
  padding: 8rpx 24rpx 16rpx;
  gap: 24rpx;
}
.tab-text {
  font-size: 28rpx;
  color: #8a91a0;
}
.tab-text.active {
  color: #104ffb;
  font-weight: 600;
}
.scroll {
  flex: 1;
  height: 0;
  padding: 16rpx 24rpx;
  box-sizing: border-box;
}
.section {
  background: #fff;
  border-radius: 20rpx;
  padding: 24rpx;
  margin-bottom: 20rpx;
}
.section-title {
  font-size: 26rpx;
  color: #8a91a0;
  margin-bottom: 12rpx;
  display: block;
}
.row {
  padding: 20rpx 0;
  border-bottom: 1rpx solid #f2f3f7;
}
.row:last-child {
  border-bottom: none;
}
.row-title {
  font-size: 30rpx;
  color: #1a1a1a;
  display: block;
}
.row-sub {
  font-size: 24rpx;
  color: #8a91a0;
  margin-top: 8rpx;
  display: block;
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
</style>
