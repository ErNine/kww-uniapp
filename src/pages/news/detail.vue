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
        <text class="nav-title">资讯详情</text>
        <view class="nav-right" />
      </view>
    </view>

    <scroll-view class="scroll" scroll-y :show-scrollbar="false">
      <view class="cover" :style="{ background: news.gradient }">
        <text class="cover-title">{{ news.thumbTitle }}</text>
      </view>

      <view class="card">
        <text class="title">{{ news.title }}</text>
        <view class="tags">
          <text v-for="tag in news.tags" :key="tag" class="tag">{{ tag }}</text>
        </view>
        <view class="meta">
          <text class="meta-text">{{ news.source }}</text>
          <text class="meta-dot">·</text>
          <text class="meta-text">{{ news.time }}</text>
          <text class="meta-dot">·</text>
          <text class="meta-text">{{ news.views }}</text>
        </view>
      </view>

      <view class="card body-card">
        <text
          v-for="(p, idx) in news.paragraphs"
          :key="idx"
          class="paragraph"
        >{{ p }}</text>
      </view>

      <view class="tip">
        <text class="tip-text">内容由坑位网整理发布，仅供参考</text>
      </view>

      <view class="scroll-bottom" />
    </scroll-view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import { useNavBar } from '@/composables/useNavBar'
import { getNewsById, type NewsItem } from './data'

const { statusBarHeight, navBarHeight, menuRight } = useNavBar()
const news = ref<NewsItem>(getNewsById())

onLoad(async (query) => {
  const id = query?.id ? String(query.id) : undefined
  news.value = getNewsById(id)
  if (!id) return
  const { cmsApi } = await import('@/api')
  const row = await cmsApi.articleSilent(id)
  if (!row) return
  news.value = {
    id: String(row.id),
    title: row.title,
    thumbTitle: row.thumb_title || row.title,
    gradient: row.gradient || news.value.gradient,
    tags: row.tags || [],
    source: row.source || '坑位网官方',
    time: String(row.published_at || row.time || ''),
    views: row.view_count != null ? `${row.view_count}阅读` : String(row.views || ''),
    paragraphs:
      row.paragraphs ||
      (row.content ? String(row.content).split(/\n+/).filter(Boolean) : row.summary ? [row.summary] : news.value.paragraphs),
  }
})

function goBack() {
  uni.navigateBack({
    fail: () => {
      uni.switchTab({ url: '/pages/index/index' })
    },
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
  box-sizing: border-box;
}

.cover {
  margin: 24rpx 24rpx 0;
  height: 320rpx;
  border-radius: 24rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40rpx;
  box-sizing: border-box;
}

.cover-title {
  font-size: 40rpx;
  font-weight: 700;
  color: #fff;
  line-height: 1.45;
  text-align: center;
  white-space: pre-line;
}

.card {
  margin: 20rpx 24rpx 0;
  background: #fff;
  border-radius: 24rpx;
  padding: 32rpx 28rpx;
  box-sizing: border-box;
}

.title {
  font-size: 36rpx;
  font-weight: 700;
  color: #28282a;
  line-height: 1.45;
}

.tags {
  display: flex;
  flex-wrap: wrap;
  gap: 12rpx;
  margin-top: 20rpx;
}

.tag {
  font-size: 22rpx;
  color: #104ffb;
  background: rgba(16, 79, 251, 0.08);
  padding: 6rpx 16rpx;
  border-radius: 8rpx;
}

.meta {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8rpx;
  margin-top: 24rpx;
  padding-top: 24rpx;
  border-top: 1rpx solid #f0f2f7;
}

.meta-text {
  font-size: 24rpx;
  color: #9aa3b2;
}

.meta-dot {
  font-size: 24rpx;
  color: #c5cad4;
}

.body-card {
  padding-top: 28rpx;
  padding-bottom: 12rpx;
}

.paragraph {
  display: block;
  font-size: 28rpx;
  color: #4a5160;
  line-height: 1.75;
  margin-bottom: 28rpx;
}

.tip {
  margin: 24rpx 24rpx 0;
  display: flex;
  justify-content: center;
}

.tip-text {
  font-size: 22rpx;
  color: #b0b7c3;
}

.scroll-bottom {
  height: 48rpx;
  padding-bottom: constant(safe-area-inset-bottom);
  padding-bottom: env(safe-area-inset-bottom);
}
</style>
