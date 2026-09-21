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
        <text class="nav-title">坑位商入驻</text>
        <view class="nav-right" />
      </view>
    </view>

    <scroll-view class="scroll" scroll-y :show-scrollbar="false">
      <view class="hero">
        <text class="hero-title">申请成为坑位商</text>
        <text class="hero-desc">提交资料后由平台审核，通过即可发布挂售商品</text>
      </view>

      <view class="card">
        <view class="field">
          <text class="label">店铺名称</text>
          <input class="input" v-model="form.name" maxlength="30" placeholder="请输入店铺名称" />
        </view>
        <view class="field">
          <text class="label">联系人</text>
          <input class="input" v-model="form.contact" maxlength="20" placeholder="请输入联系人" />
        </view>
        <view class="field">
          <text class="label">手机号</text>
          <input
            class="input"
            v-model="form.mobile"
            type="number"
            maxlength="11"
            placeholder="请输入手机号"
          />
        </view>
        <view class="field">
          <text class="label">主营行业</text>
          <view class="picker" @tap="pickCategory">
            <text class="picker-text" :class="{ ph: !form.category_name }">
              {{ form.category_name || '请选择后台已有分类' }}
            </text>
            <text class="chevron">›</text>
          </view>
        </view>
        <view class="field column">
          <text class="label">店铺简介</text>
          <textarea
            class="textarea"
            v-model="form.intro"
            maxlength="200"
            placeholder="简要介绍服务能力、案例与优势"
          />
        </view>
      </view>

      <view class="tips">
        <text class="tips-text">· 商品与分类均由平台后台创建，入驻后只能关联坑位库发布</text>
        <text class="tips-text">· 保证金与认证信息由运营审核登记，本期不涉及在线支付</text>
      </view>

      <view class="scroll-pad" />
    </scroll-view>

    <view class="footer" :style="{ paddingBottom: Math.max(safeBottom, 16) + 'px' }">
      <view class="submit" :class="{ disabled: submitting }" @tap="onSubmit">
        <text class="submit-text">{{ submitting ? '提交中…' : '提交入驻申请' }}</text>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import { useNavBar } from '@/composables/useNavBar'
import { categoryApi, merchantApi, type CategoryItem } from '@/api'

const { statusBarHeight, navBarHeight, menuRight, safeBottom } = useNavBar()

const submitting = ref(false)
const categories = ref<CategoryItem[]>([])

const form = reactive({
  name: '',
  contact: '',
  mobile: '',
  category_id: '' as string | number,
  category_name: '',
  intro: '',
})

onMounted(async () => {
  const list = await categoryApi.listSilent()
  categories.value = list || []
})

function goBack() {
  uni.navigateBack({ fail: () => uni.switchTab({ url: '/pages/index/index' }) })
}

function pickCategory() {
  if (!categories.value.length) {
    uni.showToast({ title: '分类接口暂未就绪', icon: 'none' })
    return
  }
  uni.showActionSheet({
    itemList: categories.value.map((c) => c.name).slice(0, 6),
    success: (res) => {
      const item = categories.value[res.tapIndex]
      if (!item) return
      form.category_id = item.id
      form.category_name = item.name
    },
  })
}

async function onSubmit() {
  if (submitting.value) return
  if (!form.name.trim()) {
    uni.showToast({ title: '请填写店铺名称', icon: 'none' })
    return
  }
  if (!form.contact.trim()) {
    uni.showToast({ title: '请填写联系人', icon: 'none' })
    return
  }
  if (!/^1\d{10}$/.test(form.mobile)) {
    uni.showToast({ title: '请填写正确手机号', icon: 'none' })
    return
  }
  if (!form.category_id) {
    uni.showToast({ title: '请选择主营行业分类', icon: 'none' })
    return
  }

  submitting.value = true
  try {
    const { ensureLogin } = await import('@/api')
    await ensureLogin({ nickname: form.contact.trim() })
    await merchantApi.apply({
      name: form.name.trim(),
      intro: form.intro.trim() || `${form.contact} ${form.mobile}`,
      industry_category_id: form.category_id,
    })
    uni.showToast({ title: '已提交，等待审核', icon: 'success' })
    setTimeout(() => goBack(), 1200)
  } catch (e) {
    const msg = e instanceof Error ? e.message : '提交失败'
    uni.showToast({
      title: msg.includes('网络') || msg.includes('不可用') ? '入驻接口暂未就绪' : msg,
      icon: 'none',
    })
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
.hero {
  margin-bottom: 24rpx;
}
.hero-title {
  font-size: 40rpx;
  font-weight: 700;
  color: #1a1a1a;
  display: block;
}
.hero-desc {
  margin-top: 12rpx;
  font-size: 26rpx;
  color: #8a91a0;
  display: block;
  line-height: 1.5;
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
  width: 140rpx;
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
.picker {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 8rpx;
}
.picker-text {
  font-size: 28rpx;
  color: #1a1a1a;
}
.picker-text.ph {
  color: #9aa3b2;
}
.chevron {
  font-size: 32rpx;
  color: #c0c4cc;
}
.textarea {
  width: 100%;
  min-height: 160rpx;
  font-size: 28rpx;
  color: #1a1a1a;
  line-height: 1.5;
}
.tips {
  margin-top: 24rpx;
  padding: 0 8rpx;
}
.tips-text {
  display: block;
  font-size: 24rpx;
  color: #9aa3b2;
  line-height: 1.7;
}
.scroll-pad {
  height: 40rpx;
}
.footer {
  padding: 16rpx 32rpx;
  background: #fff;
  box-shadow: 0 -4rpx 20rpx rgba(16, 24, 40, 0.04);
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
