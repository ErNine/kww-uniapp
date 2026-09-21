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
        <text class="nav-title">申请收录</text>
        <view class="nav-right" />
      </view>
    </view>

    <scroll-view class="scroll" scroll-y :show-scrollbar="false">
      <view class="card">
        <view class="field">
          <text class="label">软件 / 产品名称</text>
          <input class="input" v-model="form.name" maxlength="40" placeholder="请输入名称" />
        </view>
        <view class="field">
          <text class="label">官方网站</text>
          <input class="input" v-model="form.website" maxlength="100" placeholder="选填" />
        </view>
        <view class="field column">
          <text class="label">推荐理由</text>
          <textarea
            class="textarea"
            v-model="form.reason"
            maxlength="300"
            placeholder="简要说明为何值得收录到坑位库"
          />
        </view>
        <view class="field">
          <text class="label">联系方式</text>
          <input class="input" v-model="form.contact" maxlength="40" placeholder="手机或微信" />
        </view>
      </view>
      <view class="hint">
        <text class="hint-text">收录由运营审核；通过后才能出现在平台坑位库供商家关联。</text>
      </view>
      <view class="pad" />
    </scroll-view>

    <view class="footer" :style="{ paddingBottom: Math.max(safeBottom, 16) + 'px' }">
      <view class="submit" :class="{ disabled: submitting }" @tap="onSubmit">
        <text class="submit-text">{{ submitting ? '提交中…' : '提交申请' }}</text>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useNavBar } from '@/composables/useNavBar'

const { statusBarHeight, navBarHeight, menuRight, safeBottom } = useNavBar()
const submitting = ref(false)
const form = reactive({
  name: '',
  website: '',
  reason: '',
  contact: '',
})

function goBack() {
  uni.navigateBack({ fail: () => uni.switchTab({ url: '/pages/index/index' }) })
}

async function onSubmit() {
  if (submitting.value) return
  if (!form.name.trim()) {
    uni.showToast({ title: '请填写产品名称', icon: 'none' })
    return
  }
  if (!form.reason.trim()) {
    uni.showToast({ title: '请填写推荐理由', icon: 'none' })
    return
  }
  submitting.value = true
  try {
    // 收录申请二期接口；先本地提示
    uni.showToast({ title: '收录申请已记录，待运营审核', icon: 'none' })
    setTimeout(() => goBack(), 1000)
  } catch {
    uni.showToast({ title: '收录接口暂未就绪', icon: 'none' })
  } finally {
    submitting.value = false
  }
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
  padding: 0 24rpx;
  box-sizing: border-box;
}
.nav-left,
.nav-right {
  width: 64rpx;
  height: 64rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}
.back-icon {
  font-size: 48rpx;
  color: #1a1a1a;
  line-height: 1;
}
.nav-title {
  flex: 1;
  text-align: center;
  font-size: 32rpx;
  font-weight: 600;
  color: #1a1a1a;
}
.scroll {
  flex: 1;
  height: 0;
  padding: 24rpx;
  box-sizing: border-box;
}
.card {
  background: #fff;
  border-radius: 20rpx;
  padding: 8rpx 28rpx;
}
.field {
  display: flex;
  align-items: center;
  min-height: 96rpx;
  border-bottom: 1rpx solid #f2f3f7;
  gap: 24rpx;
}
.field:last-child {
  border-bottom: none;
}
.field.column {
  flex-direction: column;
  align-items: stretch;
  padding: 24rpx 0;
  gap: 16rpx;
}
.label {
  width: 180rpx;
  font-size: 28rpx;
  color: #1a1a1a;
  flex-shrink: 0;
}
.input {
  flex: 1;
  font-size: 28rpx;
  color: #1a1a1a;
  text-align: right;
}
.textarea {
  width: 100%;
  min-height: 160rpx;
  font-size: 28rpx;
  color: #1a1a1a;
}
.hint {
  margin-top: 20rpx;
  padding: 0 8rpx;
}
.hint-text {
  font-size: 24rpx;
  color: #9aa3b2;
  line-height: 1.6;
}
.pad {
  height: 40rpx;
}
.footer {
  padding: 16rpx 32rpx;
  background: #fff;
}
.submit {
  height: 88rpx;
  border-radius: 44rpx;
  background: #104ffb;
  display: flex;
  align-items: center;
  justify-content: center;
}
.submit.disabled {
  opacity: 0.6;
}
.submit-text {
  color: #fff;
  font-size: 30rpx;
  font-weight: 600;
}
</style>
