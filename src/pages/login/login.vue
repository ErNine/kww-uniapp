<template>
  <view class="page">
    <view class="status-bar" :style="{ height: statusBarHeight + 'px' }" />
    <view
      class="nav-row"
      :style="{ height: navBarHeight + 'px', paddingRight: menuRight + 'px' }"
    >
      <view v-if="canBack" class="nav-back" @tap="goBack">
        <text class="back-icon">‹</text>
      </view>
      <view v-else class="nav-back placeholder" />
      <text class="nav-title">模拟登录</text>
      <view class="nav-back placeholder" />
    </view>

    <view class="body">
      <view class="hero">
        <text class="brand">坑位网</text>
        <text class="hero-title">联调模拟登录</text>
        <text class="hero-desc">一键选择身份进入主流程，无需真实微信换码</text>
      </view>

      <view class="card">
        <view
          class="role-btn user"
          :class="{ loading: submitting === 'user' }"
          @tap="onPick('user')"
        >
          <view class="role-texts">
            <text class="role-name">普通用户</text>
            <text class="role-tip">浏览榜单 / 大厅 / 资讯 / 咨询留言</text>
          </view>
          <text class="role-go">进入 ›</text>
        </view>

        <view
          class="role-btn merchant"
          :class="{ loading: submitting === 'merchant' }"
          @tap="onPick('merchant')"
        >
          <view class="role-texts">
            <text class="role-name">坑位商</text>
            <text class="role-tip">发布商品 / 商品管理 / 入驻资料</text>
          </view>
          <text class="role-go">进入 ›</text>
        </view>
      </view>

      <view v-if="currentRole" class="current">
        <text class="current-text">当前身份：{{ currentLabel }}</text>
        <text class="current-hint">再次点选即可切换并换取新 token</text>
      </view>

      <view class="note">
        <text class="note-title">联调说明</text>
        <text class="note-line">· POST /app/auth/login { identity: user|merchant }</text>
        <text class="note-line">· GET /app/auth/mock-accounts 可查演示账号</text>
        <text class="note-line">· baseURL 见 .env.development（默认 127.0.0.1:8000/app）</text>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import { useNavBar } from '@/composables/useNavBar'
import {
  getRole,
  isLoggedIn,
  mockLogin,
  roleLabel,
  type MockRole,
} from '@/api'

const { statusBarHeight, navBarHeight, menuRight } = useNavBar()

const submitting = ref<MockRole | ''>('')
const redirect = ref('')
const requireMerchant = ref(false)
const canBack = ref(false)
const currentRole = ref(getRole())

const currentLabel = computed(() => roleLabel(currentRole.value))

onLoad((q) => {
  if (q?.redirect) redirect.value = decodeURIComponent(String(q.redirect))
  if (q?.require === 'merchant') requireMerchant.value = true
  const forceSwitch = Boolean(q?.switch)
  const pages = getCurrentPages()
  canBack.value = pages.length > 1 || forceSwitch
  currentRole.value = getRole()

  // 已登录且非「切换身份」：直接进首页
  if (!forceSwitch && !requireMerchant.value && isLoggedIn() && getRole()) {
    uni.switchTab({ url: '/pages/index/index' })
  }
})

function goBack() {
  uni.navigateBack({
    fail: () => uni.switchTab({ url: '/pages/mine/mine' }),
  })
}

function afterLogin(role: MockRole) {
  currentRole.value = role
  uni.showToast({ title: `已登录：${roleLabel(role)}`, icon: 'none' })
  setTimeout(() => {
    const target = redirect.value
    if (target) {
      const path = target.split('?')[0]
      if (
        path === '/pages/index/index' ||
        path === '/pages/rank/rank' ||
        path === '/pages/order/order' ||
        path === '/pages/merchant/merchant' ||
        path === '/pages/mine/mine'
      ) {
        uni.switchTab({ url: path })
        return
      }
      uni.redirectTo({
        url: target,
        fail: () => uni.switchTab({ url: '/pages/index/index' }),
      })
      return
    }
    uni.switchTab({ url: '/pages/index/index' })
  }, 400)
}

async function onPick(role: MockRole) {
  if (submitting.value) return
  if (requireMerchant.value && role !== 'merchant') {
    uni.showToast({ title: '当前操作需要坑位商身份', icon: 'none' })
  }
  submitting.value = role
  try {
    await mockLogin(role)
    afterLogin(role)
  } catch (e) {
    const msg = e instanceof Error ? e.message : '登录失败'
    uni.showToast({
      title: msg.includes('网络') ? '登录接口暂不可用，请检查后端' : msg,
      icon: 'none',
    })
  } finally {
    submitting.value = ''
  }
}
</script>

<style scoped>
.page {
  min-height: 100%;
  background: linear-gradient(180deg, #eaf1ff 0%, #f5f7fb 42%, #f5f7fb 100%);
  box-sizing: border-box;
}

.status-bar {
  width: 100%;
}

.nav-row {
  display: flex;
  align-items: center;
  padding-left: 16rpx;
  box-sizing: border-box;
}

.nav-back {
  width: 64rpx;
  height: 64rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.nav-back.placeholder {
  opacity: 0;
  pointer-events: none;
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

.body {
  padding: 48rpx 40rpx 80rpx;
}

.hero {
  margin-bottom: 40rpx;
}

.brand {
  display: block;
  font-size: 28rpx;
  color: #104ffb;
  font-weight: 600;
  letter-spacing: 2rpx;
}

.hero-title {
  display: block;
  margin-top: 16rpx;
  font-size: 48rpx;
  font-weight: 700;
  color: #1a1a1a;
}

.hero-desc {
  display: block;
  margin-top: 16rpx;
  font-size: 26rpx;
  color: #8a91a0;
  line-height: 1.5;
}

.card {
  background: #fff;
  border-radius: 24rpx;
  padding: 24rpx;
  box-shadow: 0 8rpx 32rpx rgba(16, 79, 251, 0.06);
}

.role-btn {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20rpx;
  padding: 32rpx 28rpx;
  border-radius: 20rpx;
  margin-bottom: 20rpx;
}

.role-btn:last-child {
  margin-bottom: 0;
}

.role-btn.user {
  background: #f3f6ff;
  border: 2rpx solid #d9e4ff;
}

.role-btn.merchant {
  background: linear-gradient(135deg, #104ffb 0%, #3b7bff 100%);
}

.role-btn.loading {
  opacity: 0.7;
}

.role-name {
  display: block;
  font-size: 34rpx;
  font-weight: 700;
  color: #1a1a1a;
}

.role-btn.merchant .role-name,
.role-btn.merchant .role-tip,
.role-btn.merchant .role-go {
  color: #fff;
}

.role-tip {
  display: block;
  margin-top: 10rpx;
  font-size: 24rpx;
  color: #8a91a0;
  line-height: 1.4;
}

.role-go {
  font-size: 28rpx;
  color: #104ffb;
  font-weight: 600;
  flex-shrink: 0;
}

.current {
  margin-top: 32rpx;
  padding: 24rpx 28rpx;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 16rpx;
}

.current-text {
  display: block;
  font-size: 28rpx;
  color: #1a1a1a;
  font-weight: 600;
}

.current-hint {
  display: block;
  margin-top: 8rpx;
  font-size: 24rpx;
  color: #8a91a0;
}

.note {
  margin-top: 40rpx;
  padding: 0 8rpx;
}

.note-title {
  display: block;
  font-size: 26rpx;
  color: #5b6472;
  font-weight: 600;
  margin-bottom: 12rpx;
}

.note-line {
  display: block;
  font-size: 24rpx;
  color: #9aa3b2;
  line-height: 1.7;
}
</style>
