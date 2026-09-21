<template>
  <scroll-view class="feed" scroll-y :show-scrollbar="false">
    <view class="feed-inner">
      <HallMessageItem
        v-for="item in messages"
        :key="item.id"
        :item="item"
      />
      <slot />
    </view>
  </scroll-view>
</template>

<script setup lang="ts">
import HallMessageItem from './HallMessageItem.vue'
import type { HallMessageItem as HallMessage } from './types'

defineProps<{
  messages: HallMessage[]
}>()
</script>

<style scoped>
.feed {
  flex: 1;
  height: 0;
  background: #ffffff;
}

.feed-inner {
  padding-top: 24rpx;
  padding-bottom: 8rpx;
  box-sizing: border-box;
}
</style>
