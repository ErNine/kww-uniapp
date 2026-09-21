<template>
  <view class="page">
    <image class="header-bg" src="/static/mine/header-bg.png" mode="aspectFill" />

    <view class="status-bar" :style="{ height: statusBarHeight + 'px' }" />

    <view class="nav-spacer" :style="{ height: navBarHeight + 'px' }" />

    <view class="content">
      <!-- 用户信息 -->
      <view class="profile">
        <image class="avatar" :src="displayAvatar" mode="aspectFill" />
        <view class="profile-main">
          <view class="name-row">
            <text class="name">{{ displayName }}</text>
            <view class="user-tag">
              <image class="user-tag-icon" src="/static/mine/icon-user-tag.png" mode="aspectFit" />
              <text class="user-tag-text">普通用户</text>
            </view>
          </view>
          <view class="id-row" @click="copyId">
            <text class="user-id">ID:{{ displayId }}</text>
            <image class="copy-icon" src="/static/mine/icon-copy.png" mode="aspectFit" />
          </view>
          <text class="bio">{{ displayBio }}</text>
        </view>
      </view>

      <!-- 余额 / 会员 -->
      <view class="wallet">
        <image class="wallet-bg" src="/static/mine/card-wallet.png" mode="scaleToFill" />
        <view class="wallet-body">
          <view class="wallet-left">
            <view class="balance-label-row">
              <text class="balance-label">我的余额（元）</text>
              <image
                class="eye-icon"
                src="/static/mine/icon-eye.png"
                mode="aspectFit"
                @click="toggleBalance"
              />
            </view>
            <text class="balance-value">{{ balanceVisible ? '5,280.00' : '****' }}</text>
            <view class="recharge-btn" @click="onRecharge">
              <image class="recharge-bg" src="/static/mine/btn-recharge.png" mode="scaleToFill" />
              <text class="recharge-text">充值</text>
            </view>
          </view>

          <image class="wallet-divider" src="/static/mine/div-wallet.png" mode="scaleToFill" />

          <view class="wallet-right">
            <view class="member-main">
              <view class="member-title-row">
                <image class="crown-icon" src="/static/mine/icon-crown.png" mode="aspectFit" />
                <text class="member-title">开通会员</text>
              </view>
              <text class="member-desc">享受更多专属权益</text>
            </view>
            <view class="open-btn" @click="onOpenMember">
              <image class="open-bg" src="/static/mine/btn-open.png" mode="scaleToFill" />
              <text class="open-text">立即开通</text>
              <image class="open-chevron" src="/static/mine/icon-chevron-gold.png" mode="aspectFit" />
            </view>
          </view>
        </view>
      </view>

      <!-- 我的订单 -->
      <view class="card order-card">
        <view class="card-head">
          <view class="card-head-left">
            <image class="section-icon order-icon" src="/static/mine/icon-order.png" mode="aspectFit" />
            <text class="section-title">我的订单</text>
          </view>
          <view class="card-head-right">
            <text class="more-text">全部订单</text>
            <image class="more-arrow" src="/static/mine/icon-arrow-order.png" mode="aspectFit" />
          </view>
        </view>

        <view class="order-grid">
          <view
            v-for="(item, idx) in orderItems"
            :key="item.name"
            class="order-item"
          >
            <view class="order-icon-wrap">
              <image class="order-status-icon" :src="item.icon" mode="aspectFit" />
              <view v-if="item.badge" class="badge">
                <image class="badge-bg" :src="item.badgeBg" mode="aspectFit" />
                <text class="badge-text">{{ item.badge }}</text>
              </view>
            </view>
            <text class="order-name">{{ item.name }}</text>
            <image
              v-if="idx < orderItems.length - 1"
              class="order-divider"
              :src="item.divider"
              mode="scaleToFill"
            />
          </view>
        </view>
      </view>

      <!-- 坑位商中心 -->
      <view class="card merchant-card">
        <view class="card-head">
          <view class="card-head-left">
            <image class="section-icon merchant-icon" src="/static/mine/icon-merchant.png" mode="aspectFit" />
            <text class="section-title">坑位商中心</text>
          </view>
          <image class="more-arrow alone" src="/static/mine/icon-arrow-merchant.png" mode="aspectFit" />
        </view>

        <view class="finance-box">
          <view
            v-for="(item, idx) in financeItems"
            :key="item.label"
            class="finance-item"
          >
            <text class="finance-label">{{ item.label }}</text>
            <text class="finance-value">{{ item.value }}</text>
            <image class="finance-line" :src="item.line" mode="aspectFit" />
            <image
              v-if="idx < financeItems.length - 1"
              class="finance-divider"
              :src="item.divider"
              mode="scaleToFill"
            />
          </view>
        </view>

        <view class="metric-row">
          <view
            v-for="(item, idx) in metricItems"
            :key="item.label"
            class="metric-item"
            @click="onMetricTap(item)"
          >
            <text class="metric-label">{{ item.label }}</text>
            <text class="metric-value">{{ item.value }}</text>
            <text class="metric-sub">{{ item.sub }}</text>
            <image
              v-if="idx < metricItems.length - 1"
              class="metric-divider"
              :src="item.divider"
              mode="scaleToFill"
            />
          </view>
        </view>
      </view>

      <!-- 服务中心 -->
      <view class="card service-card">
        <view class="card-head service-head">
          <view class="card-head-left">
            <image class="section-icon service-icon" src="/static/mine/icon-service.png" mode="aspectFit" />
            <text class="section-title">服务中心</text>
          </view>
          <image class="more-arrow alone" src="/static/mine/icon-arrow-service.png" mode="aspectFit" />
        </view>

        <view class="service-row">
          <view class="service-left">
            <image class="service-row-icon" src="/static/mine/icon-cs.png" mode="aspectFit" />
            <text class="service-row-text">在线客服</text>
          </view>
          <view class="service-right">
            <text class="service-time">工作日9:00-18:00</text>
            <image class="more-arrow" src="/static/mine/icon-arrow-cs.png" mode="aspectFit" />
          </view>
        </view>
        <image class="service-divider" src="/static/mine/divider-service.png" mode="scaleToFill" />

        <view class="service-row">
          <view class="service-left">
            <image class="service-row-icon agree" src="/static/mine/icon-agree.png" mode="aspectFit" />
            <text class="service-row-text">协议中心</text>
          </view>
          <image class="more-arrow" src="/static/mine/icon-arrow-agree.png" mode="aspectFit" />
        </view>
        <view class="service-line" />

        <view class="service-row last">
          <view class="service-left">
            <image class="service-row-icon help" src="/static/mine/icon-help.png" mode="aspectFit" />
            <text class="service-row-text">帮助中心</text>
          </view>
          <image class="more-arrow" src="/static/mine/icon-arrow-help.png" mode="aspectFit" />
        </view>
      </view>

      <view class="bottom-space" />
    </view>
  </view>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useNavBar } from '@/composables/useNavBar'
import { ensureLogin, type UserProfile } from '@/api'

const { statusBarHeight, navBarHeight } = useNavBar()
const balanceVisible = ref(true)
const profile = ref<UserProfile | null>(null)
const displayName = ref('川仔')
const displayId = ref('K20250818001')
const displayBio = ref('专注小程序开发，做有价值的产品')
const displayAvatar = ref('/static/mine/avatar.png')

const orderItems = [
  {
    name: '待付款',
    icon: '/static/mine/icon-pay.png',
    badge: '2',
    badgeBg: '/static/mine/badge-2.png',
    divider: '/static/mine/div-o4.png',
  },
  {
    name: '待发货',
    icon: '/static/mine/icon-ship.png',
    badge: '5',
    badgeBg: '/static/mine/badge-5.png',
    divider: '/static/mine/div-o3.png',
  },
  {
    name: '待收货',
    icon: '/static/mine/icon-receive.png',
    badge: '1',
    badgeBg: '/static/mine/badge-1.png',
    divider: '/static/mine/div-o2.png',
  },
  {
    name: '待评价',
    icon: '/static/mine/icon-review.png',
    badge: '3',
    badgeBg: '/static/mine/badge-3.png',
    divider: '/static/mine/div-o1.png',
  },
  {
    name: '退款/售后',
    icon: '/static/mine/icon-refund.png',
    badge: '',
    badgeBg: '',
    divider: '',
  },
]

const financeItems = [
  {
    label: '账户余额（元）',
    value: '5,280.00',
    line: '/static/mine/line-b.png',
    divider: '/static/mine/div-f3.png',
  },
  {
    label: '保证金（元）',
    value: '10,000.00',
    line: '/static/mine/line-d.png',
    divider: '/static/mine/div-f2.png',
  },
  {
    label: '冻结金额（元）',
    value: '800.00',
    line: '/static/mine/line-f.png',
    divider: '/static/mine/div-f1.png',
  },
  {
    label: '可提现金额（元）',
    value: '4,480.00',
    line: '/static/mine/line-w.png',
    divider: '',
  },
]

const metricItems = [
  {
    label: '坑位商品',
    value: '12',
    sub: '在售商品',
    divider: '/static/mine/div-m3.png',
  },
  {
    label: '交易中订单',
    value: '5',
    sub: '进行中',
    divider: '/static/mine/div-m2.png',
  },
  {
    label: '已结算订单',
    value: '8',
    sub: '已完成',
    divider: '/static/mine/div-m1.png',
  },
  {
    label: '售后订单',
    value: '2',
    sub: '需处理',
    divider: '',
  },
]

function toggleBalance() {
  balanceVisible.value = !balanceVisible.value
}

function copyId() {
  uni.setClipboardData({
    data: displayId.value,
    success: () => {
      uni.showToast({ title: '已复制', icon: 'none' })
    },
  })
}

function onRecharge() {
  uni.showToast({ title: '充值功能暂未开放', icon: 'none' })
}

function onOpenMember() {
  uni.showToast({ title: '会员购买暂未开放', icon: 'none' })
}

function onMetricTap(item: (typeof metricItems)[number]) {
  if (item.sub === '在售商品') {
    uni.navigateTo({ url: '/packageGoods/manage/manage' })
  }
}

function onSettleEntry() {
  uni.navigateTo({ url: '/pages/settle/settle' })
}

onMounted(async () => {
  const me = await ensureLogin()
  if (!me) return
  profile.value = me
  displayName.value = me.nickname || displayName.value
  displayId.value = String(me.id || displayId.value)
  displayBio.value = me.bio || displayBio.value
  if (me.avatar) displayAvatar.value = me.avatar
})
</script>

<style scoped>
.page {
  position: relative;
  min-height: 100%;
  background: #f5f7fb;
  box-sizing: border-box;
  overflow: hidden;
}

.header-bg {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 520rpx;
  z-index: 0;
  pointer-events: none;
}

.status-bar,
.nav-spacer {
  position: relative;
  z-index: 1;
  width: 100%;
}

.content {
  position: relative;
  z-index: 1;
  box-sizing: border-box;
  padding-bottom: calc(20rpx + env(safe-area-inset-bottom));
}

.profile {
  display: flex;
  align-items: flex-start;
  padding: 8rpx 34rpx 28rpx;
  box-sizing: border-box;
}

.avatar {
  width: 110rpx;
  height: 110rpx;
  border-radius: 50%;
  flex-shrink: 0;
  background: #1a1a1a;
}

.profile-main {
  flex: 1;
  margin-left: 22rpx;
  padding-top: 4rpx;
  min-width: 0;
}

.name-row {
  display: flex;
  align-items: center;
  gap: 14rpx;
}

.name {
  font-size: 36rpx;
  font-weight: 500;
  color: #dfedfd;
  line-height: 1.2;
}

.user-tag {
  display: flex;
  align-items: center;
  gap: 6rpx;
  height: 32rpx;
  padding: 0 12rpx 0 8rpx;
  border-radius: 16rpx;
  background: #fafbfe;
  border: 1rpx solid #bcdbfc;
  box-sizing: border-box;
}

.user-tag-icon {
  width: 18rpx;
  height: 18rpx;
}

.user-tag-text {
  font-size: 18rpx;
  color: #75acfa;
  line-height: 1;
}

.id-row {
  display: flex;
  align-items: center;
  gap: 8rpx;
  margin-top: 10rpx;
}

.user-id {
  font-size: 23rpx;
  color: #badafb;
  line-height: 1.2;
}

.copy-icon {
  width: 18rpx;
  height: 18rpx;
}

.bio {
  display: block;
  margin-top: 10rpx;
  font-size: 21rpx;
  color: #bddbfc;
  line-height: 1.3;
}

.wallet {
  position: relative;
  margin: 0 34rpx 24rpx;
  height: 150rpx;
  border-radius: 18rpx;
  overflow: hidden;
}

.wallet-bg {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
}

.wallet-body {
  position: relative;
  z-index: 1;
  height: 100%;
  display: flex;
  align-items: center;
  padding: 0 24rpx;
  box-sizing: border-box;
}

.wallet-left {
  flex: 1.05;
  min-width: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.balance-label-row {
  display: flex;
  align-items: center;
  gap: 8rpx;
}

.balance-label {
  font-size: 17rpx;
  color: #b5bfd2;
  line-height: 1.2;
}

.eye-icon {
  width: 24rpx;
  height: 18rpx;
}

.balance-value {
  margin-top: 6rpx;
  font-size: 35rpx;
  font-weight: 700;
  color: #e0e3eb;
  line-height: 1.1;
  letter-spacing: 0.5rpx;
}

.recharge-btn {
  position: relative;
  margin-top: 10rpx;
  width: 86rpx;
  height: 45rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.recharge-bg {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
}

.recharge-text {
  position: relative;
  z-index: 1;
  font-size: 22rpx;
  color: #4a402d;
  line-height: 1;
}

.wallet-divider {
  width: 1rpx;
  height: 72rpx;
  margin: 0 18rpx;
  flex-shrink: 0;
}

.wallet-right {
  flex: 1.15;
  min-width: 0;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  gap: 8rpx;
}

.member-main {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.member-title-row {
  display: flex;
  align-items: center;
  gap: 8rpx;
}

.crown-icon {
  width: 36rpx;
  height: 30rpx;
  flex-shrink: 0;
}

.member-title {
  font-size: 22rpx;
  font-weight: 700;
  color: #bab18e;
  line-height: 1.2;
}

.member-desc {
  margin-top: 6rpx;
  margin-left: 44rpx;
  font-size: 17rpx;
  color: #8797b2;
  line-height: 1.2;
}

.open-btn {
  position: relative;
  width: 102rpx;
  height: 45rpx;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  padding-right: 4rpx;
  box-sizing: border-box;
}

.open-bg {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
}

.open-text {
  position: relative;
  z-index: 1;
  font-size: 17rpx;
  color: #665740;
  line-height: 1;
}

.open-chevron {
  position: relative;
  z-index: 1;
  width: 8rpx;
  height: 14rpx;
  margin-left: 4rpx;
}

.card {
  margin: 0 32rpx 24rpx;
  background: #fbfcfc;
  border-radius: 20rpx;
  border: 1rpx solid #f4f7fc;
  box-sizing: border-box;
  overflow: hidden;
}

.card-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 24rpx 28rpx 8rpx;
  box-sizing: border-box;
}

.card-head-left {
  display: flex;
  align-items: center;
  gap: 12rpx;
}

.section-icon {
  width: 32rpx;
  height: 34rpx;
}

.order-icon {
  width: 31rpx;
  height: 34rpx;
}

.merchant-icon {
  width: 31rpx;
  height: 29rpx;
}

.service-icon {
  width: 34rpx;
  height: 32rpx;
}

.section-title {
  font-size: 28rpx;
  font-weight: 700;
  color: #464f70;
  line-height: 1.2;
}

.card-head-right {
  display: flex;
  align-items: center;
  gap: 6rpx;
}

.more-text {
  font-size: 18rpx;
  color: #a9b2c6;
  line-height: 1;
}

.more-arrow {
  width: 10rpx;
  height: 16rpx;
}

.more-arrow.alone {
  width: 11rpx;
  height: 18rpx;
}

.order-grid {
  display: flex;
  align-items: flex-start;
  padding: 16rpx 8rpx 28rpx;
  box-sizing: border-box;
}

.order-item {
  position: relative;
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.order-icon-wrap {
  position: relative;
  width: 58rpx;
  height: 60rpx;
}

.order-status-icon {
  width: 58rpx;
  height: 60rpx;
}

.badge {
  position: absolute;
  top: -6rpx;
  right: -8rpx;
  width: 26rpx;
  height: 26rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.badge-bg {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
}

.badge-text {
  position: relative;
  z-index: 1;
  font-size: 16rpx;
  font-weight: 600;
  color: #ffffff;
  line-height: 1;
}

.order-name {
  margin-top: 12rpx;
  font-size: 19rpx;
  color: #68718a;
  line-height: 1.2;
}

.order-divider {
  position: absolute;
  right: 0;
  top: 18rpx;
  width: 2rpx;
  height: 56rpx;
}

.merchant-card {
  padding-bottom: 8rpx;
}

.finance-box {
  display: flex;
  margin: 12rpx 24rpx 8rpx;
  padding: 22rpx 0 16rpx;
  background: #ecf2fb;
  border-radius: 15rpx;
  box-sizing: border-box;
}

.finance-item {
  position: relative;
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0 4rpx;
  box-sizing: border-box;
}

.finance-label {
  font-size: 16rpx;
  color: #a2adc4;
  line-height: 1.2;
  text-align: center;
}

.finance-value {
  margin-top: 10rpx;
  font-size: 21rpx;
  font-weight: 700;
  color: #465174;
  line-height: 1.2;
}

.finance-line {
  margin-top: 10rpx;
  width: 40rpx;
  height: 3rpx;
}

.finance-divider {
  position: absolute;
  right: 0;
  top: 8rpx;
  width: 2rpx;
  height: 80rpx;
}

.metric-row {
  display: flex;
  padding: 18rpx 12rpx 28rpx;
  box-sizing: border-box;
}

.metric-item {
  position: relative;
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.metric-label {
  font-size: 18rpx;
  color: #6e7891;
  line-height: 1.2;
}

.metric-value {
  margin-top: 8rpx;
  font-size: 23rpx;
  font-weight: 600;
  color: #4d5878;
  line-height: 1.2;
}

.metric-sub {
  margin-top: 6rpx;
  font-size: 16rpx;
  color: #b3baca;
  line-height: 1.2;
}

.metric-divider {
  position: absolute;
  right: 0;
  top: 10rpx;
  width: 2rpx;
  height: 80rpx;
}

.service-card {
  padding-bottom: 8rpx;
}

.service-head {
  padding-bottom: 4rpx;
}

.service-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 22rpx 28rpx;
  box-sizing: border-box;
}

.service-row.last {
  padding-bottom: 28rpx;
}

.service-left {
  display: flex;
  align-items: center;
  gap: 14rpx;
  min-width: 0;
}

.service-row-icon {
  width: 30rpx;
  height: 28rpx;
  flex-shrink: 0;
}

.service-row-icon.agree {
  width: 28rpx;
  height: 30rpx;
}

.service-row-icon.help {
  width: 30rpx;
  height: 30rpx;
}

.service-row-text {
  font-size: 20rpx;
  color: #67718b;
  line-height: 1.2;
}

.service-right {
  display: flex;
  align-items: center;
  gap: 10rpx;
}

.service-time {
  font-size: 17rpx;
  color: #acb4c7;
  line-height: 1;
}

.service-divider {
  display: block;
  width: 596rpx;
  height: 3rpx;
  margin-left: 72rpx;
}

.service-line {
  height: 2rpx;
  margin-left: 72rpx;
  margin-right: 28rpx;
  background: #f4f7fb;
}

.bottom-space {
  height: 40rpx;
}
</style>
