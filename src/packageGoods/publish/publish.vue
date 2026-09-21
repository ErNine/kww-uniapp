<template>
  <view class="page">
    <view class="header">
      <view class="header-bg" />
      <view class="status-bar" :style="{ height: statusBarHeight + 'px' }" />
      <view
        class="nav-row"
        :style="{ height: navBarHeight + 'px', paddingRight: menuRight + 'px' }"
      >
        <view class="nav-back" @tap="goBack">
          <image class="back-icon" src="../static/publish/icon-back.png" mode="aspectFit" />
        </view>
        <view class="nav-titles">
          <text class="nav-title">发布商品</text>
          <text class="nav-sub">坑位网</text>
        </view>
      </view>
    </view>

    <scroll-view class="scroll" scroll-y :show-scrollbar="false">
      <view class="card">
        <view class="section-head">
          <image class="section-icon" src="../static/publish/icon-section.png" mode="aspectFit" />
          <view class="section-texts">
            <text class="section-title">商品信息</text>
            <view class="section-tip">
              <text class="tip-text">请填写商品详细信息，带</text>
              <image class="tip-star" src="../static/publish/icon-required.png" mode="aspectFit" />
              <text class="tip-text">为必填项</text>
            </view>
          </view>
        </view>

        <!-- 软件坑位类型 -->
        <view class="field" @tap="pickType">
          <view class="field-label">
            <text class="label-text">软件坑位类型</text>
            <image class="req" src="../static/publish/icon-required.png" mode="aspectFit" />
          </view>
          <view class="field-value">
            <text class="value-text" :class="{ placeholder: !form.type }">
              {{ form.type || '请选择软件坑位类型' }}
            </text>
            <image class="chevron" src="../static/publish/icon-chevron.png" mode="aspectFit" />
          </view>
        </view>

        <!-- 关联坑位库 -->
        <view class="field" @tap="pickLibrary">
          <view class="field-label">
            <text class="label-text">关联坑位库</text>
            <image class="req" src="../static/publish/icon-required.png" mode="aspectFit" />
          </view>
          <view class="field-value">
            <text class="value-text" :class="{ placeholder: !form.library }">
              {{ form.library || '请选择关联坑位库' }}
            </text>
            <image class="chevron" src="../static/publish/icon-chevron.png" mode="aspectFit" />
          </view>
        </view>

        <!-- 商品名称 -->
        <view class="field">
          <view class="field-label">
            <text class="label-text">商品名称</text>
            <image class="req" src="../static/publish/icon-required.png" mode="aspectFit" />
          </view>
          <view class="field-value input-row">
            <input
              class="field-input"
              v-model="form.name"
              maxlength="30"
              placeholder="请输入商品名称"
              placeholder-class="input-ph"
            />
            <text class="counter">{{ form.name.length }}/30</text>
          </view>
        </view>

        <!-- 售卖价格 -->
        <view class="field">
          <view class="field-label">
            <text class="label-text">售卖价格</text>
            <image class="req" src="../static/publish/icon-required.png" mode="aspectFit" />
          </view>
          <view class="field-value input-row">
            <input
              class="field-input"
              v-model="form.price"
              type="digit"
              placeholder="请输入售卖价格"
              placeholder-class="input-ph"
            />
            <text class="unit">元</text>
          </view>
        </view>

        <!-- 商品介绍 -->
        <view class="intro-block">
          <view class="intro-head">
            <view class="field-label">
              <text class="label-text">商品介绍</text>
              <image class="req" src="../static/publish/icon-required.png" mode="aspectFit" />
            </view>
            <text class="counter">{{ form.intro.length }}/500</text>
          </view>
          <textarea
            class="intro-area"
            v-model="form.intro"
            maxlength="500"
            placeholder="请详细描述商品内容、功能、优势等信息..."
            placeholder-class="input-ph"
            :auto-height="false"
          />
        </view>

        <!-- 商品相册 -->
        <view class="album-block">
          <view class="album-head">
            <view class="field-label">
              <text class="label-text">商品相册</text>
              <image class="req" src="../static/publish/icon-required.png" mode="aspectFit" />
            </view>
            <text class="album-tip">默认第一张为主图（最多9张）</text>
          </view>
          <view class="album-grid">
            <view
              v-for="(img, idx) in form.images"
              :key="img + idx"
              class="album-item"
            >
              <image class="album-img" :src="img" mode="aspectFill" />
              <view class="album-remove" @tap.stop="removeImage(idx)">
                <text class="album-remove-text">×</text>
              </view>
            </view>
            <view
              v-if="form.images.length < 9"
              class="album-upload"
              @tap="chooseImages"
            >
              <image
                class="upload-plus"
                src="../static/publish/icon-upload-plus.png"
                mode="aspectFit"
              />
              <text class="upload-text">上传图片</text>
              <text class="upload-count">{{ form.images.length }}/9</text>
            </view>
          </view>
        </view>
      </view>

      <view class="scroll-pad" />
    </scroll-view>

    <view class="footer" :style="{ paddingBottom: Math.max(safeBottom, 16) + 'px' }">
      <view class="btn-draft" @tap="onSaveDraft">
        <image class="btn-icon draft" src="../static/publish/icon-draft.png" mode="aspectFit" />
        <text class="btn-draft-text">存为草稿</text>
      </view>
      <view class="btn-publish" @tap="onPublish">
        <image class="btn-icon publish" src="../static/publish/icon-publish.png" mode="aspectFit" />
        <text class="btn-publish-text">发布商品</text>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import { useNavBar } from '@/composables/useNavBar'
import {
  categoryApi,
  listingApi,
  productApi,
  type CategoryItem,
  type ProductItem,
} from '@/api'

const { statusBarHeight, navBarHeight, menuRight, safeBottom } = useNavBar()

const typeOptions = ref<string[]>([
  '零售商城',
  '餐饮外卖',
  '社交电商',
  '分销系统',
  '同城生活',
  '知识付费',
  '游戏娱乐',
  '其他类型',
])
const libraryOptions = ref<string[]>([
  '多用户商城系统',
  '社交电商系统',
  '分销商城系统',
  '小程序商城',
  '跨境电商系统',
  '外卖点餐系统',
  '同城配送系统',
])

const categories = ref<CategoryItem[]>([])
const products = ref<ProductItem[]>([])
const editId = ref('')
const submitting = ref(false)

const form = reactive({
  type: '',
  typeId: '' as string | number,
  library: '',
  productId: '' as string | number,
  name: '',
  price: '',
  intro: '',
  images: [] as string[],
})

onLoad((q) => {
  if (q?.id) editId.value = String(q.id)
  if (q?.product_id) {
    form.productId = String(q.product_id)
  }
  if (q?.product_name) {
    form.library = decodeURIComponent(String(q.product_name))
    if (!form.name) form.name = form.library
  }
})

onMounted(async () => {
  const { requireAuth } = await import('@/api')
  const gate = await requireAuth({
    requireMerchant: true,
    redirect: '/packageGoods/publish/publish',
  })
  if (!gate) return
  const [cats, prods] = await Promise.all([
    categoryApi.listSilent(),
    productApi.listSilent({ limit: 100 }),
  ])
  if (cats?.length) {
    categories.value = cats
    typeOptions.value = cats.map((c) => c.name)
  }
  if (prods?.length) {
    products.value = prods
    libraryOptions.value = prods.map((p) => p.name)
    if (form.productId) {
      const hit = prods.find((p) => String(p.id) === String(form.productId))
      if (hit) {
        form.library = hit.name
        form.typeId = hit.category_id || hit.category?.id || ''
        form.type = hit.category?.name || hit.category_name || form.type
      }
    }
  }
  if (editId.value) {
    const detail = await listingApi.detailSilent(editId.value)
    if (detail) {
      form.name = detail.title || detail.name || ''
      form.price = String(detail.price ?? '')
      form.intro = detail.intro || detail.desc || ''
      form.images = detail.images || (detail.cover ? [detail.cover] : [])
      form.productId = detail.product_id
      form.library = detail.product?.name || detail.product_name || form.library
      form.typeId = detail.category_id || detail.category?.id || ''
      form.type = detail.category?.name || detail.category_name || form.type
    }
  }
})

function goBack() {
  uni.navigateBack({
    fail: () => uni.switchTab({ url: '/pages/index/index' }),
  })
}

function pickType() {
  if (!typeOptions.value.length) {
    uni.showToast({ title: '分类暂不可用', icon: 'none' })
    return
  }
  uni.showActionSheet({
    itemList: typeOptions.value.slice(0, 6),
    success: (res) => {
      form.type = typeOptions.value[res.tapIndex] || ''
      const cat = categories.value[res.tapIndex]
      form.typeId = cat?.id || ''
      if (categories.value.length) {
        form.library = ''
        form.productId = ''
      }
    },
  })
}

function pickLibrary() {
  let list = products.value
  if (form.typeId && list.length) {
    list = list.filter((p) => String(p.category_id) === String(form.typeId))
  }
  const names = list.length ? list.map((p) => p.name) : libraryOptions.value
  if (!names.length) {
    uni.showToast({ title: '坑位库暂无数据，请稍后', icon: 'none' })
    return
  }
  uni.showActionSheet({
    itemList: names.slice(0, 6),
    success: (res) => {
      const name = names[res.tapIndex] || ''
      form.library = name
      const prod = list.find((p) => p.name === name) || products.value.find((p) => p.name === name)
      form.productId = prod?.id || ''
      if (prod?.category_name && !form.type) {
        form.type = prod.category_name
        form.typeId = prod.category_id || ''
      }
      if (!form.name.trim()) form.name = name
    },
  })
}

function chooseImages() {
  const remain = 9 - form.images.length
  if (remain <= 0) return
  uni.chooseImage({
    count: remain,
    sizeType: ['compressed'],
    sourceType: ['album', 'camera'],
    success: (res) => {
      form.images = form.images.concat(res.tempFilePaths).slice(0, 9)
    },
  })
}

function removeImage(idx: number) {
  form.images.splice(idx, 1)
}

function validate(requireAll = true) {
  if (!form.type) {
    uni.showToast({ title: '请选择软件坑位类型', icon: 'none' })
    return false
  }
  if (!form.library) {
    uni.showToast({ title: '请选择关联坑位库', icon: 'none' })
    return false
  }
  if (products.value.length > 0 && !form.productId) {
    uni.showToast({ title: '请选择有效的坑位库商品', icon: 'none' })
    return false
  }
  if (!form.name.trim()) {
    uni.showToast({ title: '请输入商品名称', icon: 'none' })
    return false
  }
  if (!form.price.trim()) {
    uni.showToast({ title: '请输入售卖价格', icon: 'none' })
    return false
  }
  if (requireAll && !form.intro.trim()) {
    uni.showToast({ title: '请填写商品介绍', icon: 'none' })
    return false
  }
  if (requireAll && form.images.length === 0) {
    uni.showToast({ title: '请上传商品图片', icon: 'none' })
    return false
  }
  return true
}

function buildPayload(submit: boolean) {
  return {
    product_id: form.productId,
    category_id: form.typeId || undefined,
    title: form.name.trim(),
    price: form.price.trim(),
    intro: form.intro.trim(),
    images: form.images,
    submit,
  }
}

async function onSaveDraft() {
  if (!form.name.trim() && !form.type && !form.library) {
    uni.showToast({ title: '请至少填写部分信息', icon: 'none' })
    return
  }
  if (!form.productId) {
    uni.showToast({ title: '草稿需先关联坑位库', icon: 'none' })
    return
  }
  if (submitting.value) return
  submitting.value = true
  try {
    const { requireAuth } = await import('@/api')
    const me = await requireAuth({
      requireMerchant: true,
      redirect: '/packageGoods/publish/publish',
    })
    if (!me) return
    if (editId.value) {
      await listingApi.update(editId.value, { ...buildPayload(false), as_draft: true })
    } else {
      await listingApi.create(buildPayload(false))
    }
    uni.showToast({ title: '已存为草稿', icon: 'success' })
  } catch {
    uni.showToast({ title: '草稿接口暂未就绪，已本地校验', icon: 'none' })
  } finally {
    submitting.value = false
  }
}

async function onPublish() {
  if (!validate(true)) return
  if (submitting.value) return
  submitting.value = true
  try {
    const { requireAuth } = await import('@/api')
    const me = await requireAuth({
      requireMerchant: true,
      redirect: '/packageGoods/publish/publish',
    })
    if (!me) return
    if (editId.value) {
      await listingApi.update(editId.value, buildPayload(true))
    } else {
      await listingApi.create(buildPayload(true))
    }
    uni.showToast({ title: '发布成功', icon: 'success' })
    setTimeout(() => {
      uni.navigateBack({
        fail: () => uni.switchTab({ url: '/pages/index/index' }),
      })
    }, 1200)
  } catch (e) {
    const msg = e instanceof Error ? e.message : '发布失败'
    uni.showToast({
      title: msg.includes('尚未') || msg.includes('入驻') ? '请先完成商家入驻' : '发布接口暂未就绪',
      icon: 'none',
    })
  } finally {
    submitting.value = false
  }
}
</script>

<style scoped>
.page {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background: #f5f7fb;
  box-sizing: border-box;
  overflow: hidden;
}

.header {
  position: relative;
  flex-shrink: 0;
}

.header-bg {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(180deg, #e8f1fc 0%, #f0f5fc 55%, #f5f7fb 100%);
  z-index: 0;
}

.status-bar,
.nav-row {
  position: relative;
  z-index: 1;
}

.nav-row {
  display: flex;
  align-items: center;
  padding-left: 20rpx;
  box-sizing: border-box;
}

.nav-back {
  width: 64rpx;
  height: 64rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.back-icon {
  width: 24rpx;
  height: 44rpx;
}

.nav-titles {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding-left: 8rpx;
}

.nav-title {
  font-size: 47rpx;
  font-weight: 700;
  color: #353d4a;
  line-height: 1.15;
}

.nav-sub {
  margin-top: 4rpx;
  font-size: 29rpx;
  color: #8097bc;
  line-height: 1.2;
}

.scroll {
  flex: 1;
  min-height: 0;
  padding: 12rpx 24rpx 0;
  box-sizing: border-box;
}

.card {
  background: #fefefe;
  border: 2rpx solid #e5effd;
  border-radius: 24rpx;
  padding: 28rpx 28rpx 36rpx;
  box-sizing: border-box;
}

.section-head {
  display: flex;
  align-items: flex-start;
  gap: 18rpx;
  margin-bottom: 12rpx;
  padding-bottom: 28rpx;
}

.section-icon {
  width: 93rpx;
  height: 93rpx;
  flex-shrink: 0;
}

.section-texts {
  flex: 1;
  min-width: 0;
  padding-top: 6rpx;
}

.section-title {
  font-size: 40rpx;
  font-weight: 700;
  color: #51555d;
  line-height: 1.25;
}

.section-tip {
  display: flex;
  align-items: center;
  margin-top: 10rpx;
  flex-wrap: wrap;
}

.tip-text {
  font-size: 26rpx;
  color: #aab1bf;
  line-height: 1.4;
}

.tip-star {
  width: 18rpx;
  height: 18rpx;
  margin: 0 4rpx;
}

.field {
  display: flex;
  align-items: center;
  min-height: 110rpx;
  border-bottom: 2rpx solid #f4f6fa;
  box-sizing: border-box;
}

.field-label {
  display: flex;
  align-items: center;
  flex-shrink: 0;
  min-width: 220rpx;
}

.label-text {
  font-size: 32rpx;
  font-weight: 700;
  color: #505359;
  line-height: 1.3;
}

.req {
  width: 14rpx;
  height: 14rpx;
  margin-left: 6rpx;
}

.field-value {
  flex: 1;
  min-width: 0;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 12rpx;
}

.value-text {
  font-size: 31rpx;
  font-weight: 700;
  color: #353d4a;
  line-height: 1.3;
  text-align: right;
}

.value-text.placeholder {
  font-weight: 400;
  color: #adadad;
}

.chevron {
  width: 14rpx;
  height: 25rpx;
  flex-shrink: 0;
}

.input-row {
  justify-content: flex-end;
}

.field-input {
  flex: 1;
  min-width: 0;
  height: 64rpx;
  font-size: 31rpx;
  color: #353d4a;
  text-align: right;
}

.input-ph {
  color: #b0b1b2;
  font-size: 31rpx;
}

.counter {
  flex-shrink: 0;
  font-size: 24rpx;
  color: #adb3c1;
  line-height: 1.2;
}

.unit {
  flex-shrink: 0;
  font-size: 31rpx;
  color: #aab0ba;
  line-height: 1.2;
}

.intro-block {
  padding-top: 28rpx;
  border-bottom: 2rpx solid #f4f6fa;
  padding-bottom: 28rpx;
}

.intro-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 18rpx;
}

.intro-area {
  width: 100%;
  height: 260rpx;
  padding: 24rpx;
  background: #f5f8fd;
  border: 2rpx solid #e8edf8;
  border-radius: 16rpx;
  font-size: 32rpx;
  color: #505359;
  line-height: 1.5;
  box-sizing: border-box;
}

.album-block {
  padding-top: 28rpx;
}

.album-head {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 12rpx;
  margin-bottom: 24rpx;
}

.album-tip {
  font-size: 25rpx;
  color: #aeb5c3;
  line-height: 1.3;
}

.album-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 20rpx;
}

.album-item,
.album-upload {
  width: 200rpx;
  height: 200rpx;
  border-radius: 18rpx;
  box-sizing: border-box;
  position: relative;
  overflow: hidden;
}

.album-item {
  background: #f4f7fd;
}

.album-img {
  width: 100%;
  height: 100%;
}

.album-remove {
  position: absolute;
  top: 0;
  right: 0;
  width: 40rpx;
  height: 40rpx;
  background: rgba(0, 0, 0, 0.45);
  border-radius: 0 18rpx 0 12rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.album-remove-text {
  color: #fff;
  font-size: 28rpx;
  line-height: 1;
}

.album-upload {
  background: #f4f7fd;
  border: 2rpx dashed #bcd4fc;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.upload-plus {
  width: 42rpx;
  height: 42rpx;
}

.upload-text {
  margin-top: 12rpx;
  font-size: 29rpx;
  color: #79abfc;
  line-height: 1.2;
}

.upload-count {
  margin-top: 8rpx;
  font-size: 25rpx;
  color: #a2a9b6;
  line-height: 1.2;
}

.scroll-pad {
  height: 40rpx;
}

.footer {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  gap: 20rpx;
  padding: 20rpx 28rpx 16rpx;
  background: #fff;
  border-top: 2rpx solid #eff2f8;
  box-sizing: border-box;
}

.btn-draft,
.btn-publish {
  height: 96rpx;
  border-radius: 16rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12rpx;
  box-sizing: border-box;
}

.btn-draft {
  width: 280rpx;
  flex-shrink: 0;
  background: #eaf1fd;
  border: 3rpx solid #659ffc;
}

.btn-publish {
  flex: 1;
  background: #5095fd;
  border: 2rpx solid #63a1fc;
}

.btn-icon.draft {
  width: 40rpx;
  height: 40rpx;
}

.btn-icon.publish {
  width: 41rpx;
  height: 38rpx;
}

.btn-draft-text {
  font-size: 34rpx;
  font-weight: 700;
  color: #6ea6fc;
  line-height: 1.2;
}

.btn-publish-text {
  font-size: 34rpx;
  font-weight: 700;
  color: #d5e7fd;
  line-height: 1.2;
}
</style>
