<template>
  <view class="page">
    <view class="nav" :style="{ paddingTop: statusBarHeight + 'px' }">
      <view
        class="nav-inner"
        :style="{ height: navBarHeight + 'px', paddingRight: menuRight + 'px' }"
      >
        <view class="nav-left" @tap="goBack">
          <image class="back-icon" src="/static/news/icon-back.png" mode="aspectFit" />
        </view>
        <text class="nav-title">最新资讯</text>
        <view class="nav-right" />
      </view>
    </view>

    <scroll-view class="scroll" scroll-y :show-scrollbar="false">
      <view
        v-for="item in list"
        :key="item.id"
        class="news-item"
        @tap="openNews(item.id)"
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
      <view class="scroll-bottom" />
    </scroll-view>
  </view>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useNavBar } from '@/composables/useNavBar'
import { NEWS_LIST, type NewsItem } from './data'
import { cmsApi } from '@/api'

const { statusBarHeight, navBarHeight, menuRight } = useNavBar()
const list = ref<NewsItem[]>([...NEWS_LIST])

onMounted(async () => {
  const rows = await cmsApi.articlesSilent({ limit: 20 })
  if (!rows?.length) return
  list.value = rows.map((a) => ({
    id: String(a.id),
    title: a.title,
    thumbTitle: a.thumb_title || a.title,
    gradient: a.gradient || 'linear-gradient(135deg, #4F8CFF 0%, #2F5BFF 100%)',
    tags: a.tags || [],
    source: a.source || '坑位网官方',
    time: String(a.published_at || a.time || ''),
    views: a.view_count != null ? `${a.view_count}阅读` : String(a.views || ''),
    paragraphs: a.paragraphs || (a.summary ? [a.summary] : []),
  }))
})

function goBack() {
  uni.navigateBack({
    fail: () => {
      uni.switchTab({ url: '/pages/index/index' })
    },
  })
}

function openNews(id: string) {
  uni.navigateTo({
    url: `/pages/news/detail?id=${encodeURIComponent(id)}`,
  })
}
</script>

<style scoped>
.page {
  height: 100%;
  background: #f5f7fb;
  display: flex;
  flex-direction: column;
}

.nav {
  background: #fff;
  flex-shrink: 0;
  border-bottom: 1rpx solid #f0f1f5;
}

.nav-inner {
  display: flex;
  align-items: center;
  padding-left: 12rpx;
  box-sizing: border-box;
}

.nav-left,
.nav-right {
  width: 72rpx;
  height: 72rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.back-icon {
  width: 40rpx;
  height: 40rpx;
}

.nav-title {
  flex: 1;
  text-align: center;
  font-size: 32rpx;
  font-weight: 600;
  color: #28282a;
}

.scroll {
  flex: 1;
  min-height: 0;
  padding: 24rpx;
  box-sizing: border-box;
}

.news-item {
  display: flex;
  gap: 20rpx;
  padding: 28rpx 24rpx;
  margin-bottom: 20rpx;
  background: #fff;
  border-radius: 24rpx;
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
  color: #104ffb;
  background: rgba(16, 79, 251, 0.08);
  padding: 4rpx 12rpx;
  border-radius: 6rpx;
}

.news-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 16rpx;
}

.meta-text {
  font-size: 22rpx;
  color: #9aa3b2;
}

.scroll-bottom {
  height: 24rpx;
  padding-bottom: constant(safe-area-inset-bottom);
  padding-bottom: env(safe-area-inset-bottom);
}
</style>
