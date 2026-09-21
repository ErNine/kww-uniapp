<template>
  <view class="filter-bar">
    <view class="filter-row">
      <text class="filter-label bold">内容类型</text>
      <scroll-view class="chip-scroll" scroll-x :show-scrollbar="false">
        <view class="chip-list">
          <HallFilterChip
            v-for="item in contentOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
            :active="contentValue === item.value"
            @select="$emit('update:contentValue', $event)"
          />
        </view>
      </scroll-view>
    </view>

    <view class="filter-row">
      <text class="filter-label">软件分类</text>
      <scroll-view class="chip-scroll" scroll-x :show-scrollbar="false">
        <view class="chip-list">
          <HallFilterChip
            v-for="item in softwareOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
            :active="softwareValue === item.value"
            @select="$emit('update:softwareValue', $event)"
          />
          <view class="filter-more" @click="$emit('more')">
            <image
              class="filter-more-icon"
              src="/static/hall/icon-filter.png"
              mode="aspectFit"
            />
          </view>
        </view>
      </scroll-view>
    </view>
  </view>
</template>

<script setup lang="ts">
import HallFilterChip from './HallFilterChip.vue'
import type { HallFilterOption } from './types'

defineProps<{
  contentOptions: HallFilterOption[]
  softwareOptions: HallFilterOption[]
  contentValue: string
  softwareValue: string
}>()

defineEmits<{
  'update:contentValue': [value: string]
  'update:softwareValue': [value: string]
  more: []
}>()
</script>

<style scoped>
.filter-bar {
  background: #ffffff;
  padding: 20rpx 0 24rpx;
  border-bottom: 2rpx solid #f3f4f6;
  box-sizing: border-box;
}

.filter-row {
  display: flex;
  align-items: center;
  padding-left: 24rpx;
  box-sizing: border-box;
}

.filter-row + .filter-row {
  margin-top: 16rpx;
}

.filter-label {
  flex-shrink: 0;
  width: 112rpx;
  font-size: 24rpx;
  color: #5c616d;
  line-height: 1.2;
}

.filter-label.bold {
  font-weight: 700;
  color: #5b606c;
  font-size: 26rpx;
}

.chip-scroll {
  flex: 1;
  white-space: nowrap;
  width: 0;
}

.chip-list {
  display: inline-flex;
  align-items: center;
  gap: 12rpx;
  padding-right: 24rpx;
}

.filter-more {
  flex-shrink: 0;
  width: 48rpx;
  height: 48rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.filter-more-icon {
  width: 28rpx;
  height: 24rpx;
}
</style>
