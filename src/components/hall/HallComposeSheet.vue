<template>
  <view v-if="visible" class="mask" @tap="onMaskTap">
    <view class="sheet" @tap.stop>
      <view class="handle-wrap">
        <view class="handle" />
      </view>

      <!-- 内容类型 -->
      <view class="row type-row">
        <text class="label">内容类型</text>
        <scroll-view class="type-scroll" scroll-x :show-scrollbar="false">
          <view class="type-list">
            <view
              v-for="item in contentTypes"
              :key="item.value"
              class="type-chip"
              :class="{ active: contentType === item.value }"
              @tap="contentType = item.value"
            >
              <text
                class="type-chip-text"
                :class="{ active: contentType === item.value }"
              >{{ item.label }}</text>
            </view>
          </view>
        </scroll-view>
      </view>

      <!-- 所属软件 -->
      <view class="row soft-row">
        <text class="label">所属软件</text>
        <view class="soft-picker" @tap="pickSoftware">
          <text class="soft-text">{{ softwareLabel }}</text>
          <image class="chevron" src="/static/hall/icon-chevron.png" mode="aspectFit" />
        </view>
      </view>

      <!-- 文本输入 -->
      <view class="textarea-wrap">
        <textarea
          class="textarea"
          v-model="content"
          :maxlength="maxLength"
          :show-confirm-bar="false"
          placeholder="请输入您要发布的内容..."
          placeholder-class="textarea-ph"
          :cursor-spacing="24"
        />
        <text class="counter">{{ content.length }}/{{ maxLength }}</text>
      </view>

      <!-- 上传图片 -->
      <view class="upload-head">
        <view class="upload-title-row">
          <text class="upload-title">上传图片</text>
          <text class="upload-hint">（选填，最多{{ maxImages }}张）</text>
        </view>
        <text class="upload-count">{{ images.length }}/{{ maxImages }}</text>
      </view>

      <scroll-view class="upload-scroll" scroll-x :show-scrollbar="false">
        <view class="upload-list">
          <view
            v-for="(img, idx) in images"
            :key="img + idx"
            class="upload-item filled"
            @tap="previewImage(idx)"
          >
            <image class="upload-preview" :src="img" mode="aspectFill" />
            <view class="remove" @tap.stop="removeImage(idx)">
              <text class="remove-text">×</text>
            </view>
          </view>

          <view
            v-if="images.length < maxImages"
            class="upload-item add"
            @tap="chooseImages"
          >
            <image class="camera" src="/static/hall/icon-camera.png" mode="aspectFit" />
            <text class="add-text">上传图片</text>
          </view>

          <view
            v-for="n in emptySlots"
            :key="'empty-' + n"
            class="upload-item empty"
          />
        </view>
      </scroll-view>

      <!-- 发送 -->
      <view class="send-btn" @tap="onSend">
        <image class="send-icon" src="/static/hall/icon-send.png" mode="aspectFit" />
        <text class="send-text">发送</text>
      </view>

      <view class="divider" />

      <!-- 底部额度 -->
      <view class="quota">
        <view class="quota-left">
          <text class="quota-text">当前还可发布</text>
          <text class="quota-num">{{ remain }}</text>
          <text class="quota-text">条信息</text>
        </view>
        <view class="quota-btn" @tap="$emit('increase')">
          <text class="quota-btn-text">去增加</text>
        </view>
      </view>

      <view class="safe-bottom" />
    </view>
  </view>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { SOFTWARE_OPTIONS } from './mock'
import type { HallFilterOption } from './types'

const props = withDefaults(
  defineProps<{
    show?: boolean
    remain?: number
  }>(),
  {
    show: false,
    remain: 12,
  },
)

const emit = defineEmits<{
  'update:show': [value: boolean]
  close: []
  send: [payload: {
    contentType: string
    software: string
    content: string
    images: string[]
  }]
  increase: []
}>()

const maxLength = 1000
const maxImages = 9
const slotCount = 5

const contentTypes: HallFilterOption[] = [
  { label: '问题求助', value: 'help' },
  { label: '求购', value: 'buy' },
  { label: '转让', value: 'transfer' },
  { label: '经验分享', value: 'share' },
  { label: '其他', value: 'other' },
]

const softwareOptions = SOFTWARE_OPTIONS.filter((item) => item.value !== 'all')

const visible = computed({
  get: () => props.show,
  set: (v: boolean) => emit('update:show', v),
})

const contentType = ref('help')
const software = ref('mall')
const content = ref('')
const images = ref<string[]>([])

const softwareLabel = computed(() => {
  return softwareOptions.find((item) => item.value === software.value)?.label || '商城系统'
})

const emptySlots = computed(() => {
  const used = images.value.length + (images.value.length < maxImages ? 1 : 0)
  return Math.max(0, slotCount - used)
})

watch(
  () => props.show,
  (open) => {
    if (open) {
      contentType.value = 'help'
      software.value = 'mall'
      content.value = ''
      images.value = []
    }
  },
)

function close() {
  visible.value = false
  emit('close')
}

function onMaskTap() {
  close()
}

function pickSoftware() {
  uni.showActionSheet({
    itemList: softwareOptions.map((item) => item.label),
    success: (res) => {
      const item = softwareOptions[res.tapIndex]
      if (item) software.value = item.value
    },
  })
}

function chooseImages() {
  const remain = maxImages - images.value.length
  if (remain <= 0) return
  uni.chooseImage({
    count: remain,
    sizeType: ['compressed'],
    sourceType: ['album', 'camera'],
    success: (res) => {
      images.value = [...images.value, ...res.tempFilePaths].slice(0, maxImages)
    },
  })
}

function removeImage(idx: number) {
  images.value.splice(idx, 1)
}

function previewImage(idx: number) {
  uni.previewImage({
    current: images.value[idx],
    urls: images.value,
  })
}

function onSend() {
  const text = content.value.trim()
  if (!text && images.value.length === 0) {
    uni.showToast({ title: '请输入要发布的内容', icon: 'none' })
    return
  }
  emit('send', {
    contentType: contentType.value,
    software: software.value,
    content: text,
    images: [...images.value],
  })
  close()
}
</script>

<style scoped>
.mask {
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  z-index: 1000;
  background: rgba(0, 0, 0, 0.45);
  display: flex;
  align-items: flex-end;
}

.sheet {
  width: 100%;
  background: #ffffff;
  border-radius: 28rpx 28rpx 0 0;
  padding: 0 30rpx 0;
  box-sizing: border-box;
}

.handle-wrap {
  display: flex;
  justify-content: center;
  padding: 16rpx 0 28rpx;
}

.handle {
  width: 48rpx;
  height: 8rpx;
  border-radius: 4rpx;
  background: #d8dbe2;
}

.row {
  display: flex;
  align-items: center;
  box-sizing: border-box;
}

.type-row {
  gap: 12rpx;
  margin-bottom: 24rpx;
}

.soft-row {
  gap: 16rpx;
  margin-bottom: 24rpx;
}

.label {
  flex-shrink: 0;
  font-size: 26rpx;
  color: #60646e;
  line-height: 1;
}

.type-scroll {
  flex: 1;
  min-width: 0;
  white-space: nowrap;
}

.type-list {
  display: inline-flex;
  align-items: center;
  gap: 12rpx;
}

.type-chip {
  flex-shrink: 0;
  height: 50rpx;
  padding: 0 22rpx;
  background: #f3f4f6;
  border-radius: 12rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
}

.type-chip.active {
  background: #256eed;
}

.type-chip-text {
  font-size: 22rpx;
  color: #8f939d;
  line-height: 1;
}

.type-chip-text.active {
  color: #ffffff;
}

.soft-picker {
  height: 52rpx;
  padding: 0 22rpx;
  background: #f3f4f6;
  border-radius: 12rpx;
  display: flex;
  align-items: center;
  gap: 12rpx;
  box-sizing: border-box;
}

.soft-text {
  font-size: 22rpx;
  color: #878b93;
  line-height: 1;
}

.chevron {
  width: 10rpx;
  height: 18rpx;
  flex-shrink: 0;
}

.textarea-wrap {
  position: relative;
  height: 220rpx;
  border: 1rpx solid #e7e8ed;
  border-radius: 12rpx;
  background: #fdfdfd;
  padding: 20rpx 22rpx 44rpx;
  box-sizing: border-box;
  margin-bottom: 28rpx;
}

.textarea {
  width: 100%;
  height: 100%;
  font-size: 26rpx;
  color: #333;
  line-height: 1.5;
}

.textarea-ph {
  color: #b5b7bf;
  font-size: 26rpx;
}

.counter {
  position: absolute;
  right: 22rpx;
  bottom: 16rpx;
  font-size: 22rpx;
  color: #b2b4be;
}

.upload-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 18rpx;
}

.upload-title-row {
  display: flex;
  align-items: baseline;
}

.upload-title {
  font-size: 26rpx;
  color: #646872;
}

.upload-hint {
  font-size: 20rpx;
  color: #bbbec5;
}

.upload-count {
  font-size: 24rpx;
  color: #bfc1c9;
}

.upload-scroll {
  width: 100%;
  margin-bottom: 28rpx;
  white-space: nowrap;
}

.upload-list {
  display: inline-flex;
  gap: 12rpx;
}

.upload-item {
  width: 136rpx;
  height: 140rpx;
  border-radius: 16rpx;
  flex-shrink: 0;
  box-sizing: border-box;
  position: relative;
  overflow: hidden;
}

.upload-item.add {
  background: #f2f6fb;
  border: 1rpx solid #c0d3e9;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10rpx;
}

.upload-item.empty {
  background: #f8f8fa;
  border: 4rpx solid #fdfdfd;
}

.upload-item.filled {
  background: #f8f8fa;
}

.camera {
  width: 36rpx;
  height: 32rpx;
}

.add-text {
  font-size: 22rpx;
  color: #90adcb;
  line-height: 1;
}

.upload-preview {
  width: 100%;
  height: 100%;
}

.remove {
  position: absolute;
  top: 0;
  right: 0;
  width: 36rpx;
  height: 36rpx;
  background: rgba(0, 0, 0, 0.45);
  border-radius: 0 0 0 12rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.remove-text {
  font-size: 24rpx;
  color: #fff;
  line-height: 1;
}

.send-btn {
  height: 80rpx;
  background: #236cee;
  border: 1rpx solid #2c72ee;
  border-radius: 40rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12rpx;
  box-sizing: border-box;
}

.send-icon {
  width: 32rpx;
  height: 30rpx;
}

.send-text {
  font-size: 30rpx;
  color: #ffffff;
  font-weight: 600;
  line-height: 1;
}

.divider {
  height: 2rpx;
  background: #f5f6f8;
  margin: 28rpx 0 22rpx;
}

.quota {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-bottom: 8rpx;
}

.quota-left {
  display: flex;
  align-items: center;
  gap: 6rpx;
}

.quota-text {
  font-size: 24rpx;
  color: #7b7e87;
}

.quota-num {
  font-size: 26rpx;
  color: #4987f3;
}

.quota-btn {
  min-width: 120rpx;
  height: 48rpx;
  padding: 0 22rpx;
  border: 2rpx solid #72a0f4;
  border-radius: 10rpx;
  background: #fdfdfe;
  display: flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
}

.quota-btn-text {
  font-size: 24rpx;
  color: #5e93f3;
  font-weight: 600;
  line-height: 1;
}

.safe-bottom {
  height: 16rpx;
  padding-bottom: constant(safe-area-inset-bottom);
  padding-bottom: env(safe-area-inset-bottom);
}
</style>
