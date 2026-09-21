<template>
  <view
    class="chip"
    :class="{ active }"
    @click="$emit('select', value)"
  >
    <text class="chip-text" :class="{ active }">{{ label }}</text>
  </view>
</template>

<script setup lang="ts">
defineProps<{
  label: string
  value: string
  active?: boolean
}>()

defineEmits<{
  select: [value: string]
}>()
</script>

<style scoped>
.chip {
  flex-shrink: 0;
  height: 48rpx;
  padding: 0 22rpx;
  background: #f1f2f6;
  border-radius: 12rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
}

.chip.active {
  background: #2870f2;
  border: 1rpx solid #1c6af5;
}

.chip-text {
  font-size: 24rpx;
  color: #8a8f9a;
  line-height: 1;
}

.chip-text.active {
  color: #ffffff;
}
</style>
