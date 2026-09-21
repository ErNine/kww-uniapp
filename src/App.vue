<script setup lang="ts">
import { onLaunch, onShow, onHide } from '@dcloudio/uni-app'
import { isLoggedIn } from '@/api'

onLaunch(() => {
  // 入口为登录页；已登录冷启动时由登录页自行跳过
  if (!isLoggedIn()) {
    // noop — pages.json 首屏即 login
  }
})
onShow(() => {
  // noop
})
onHide(() => {
  // noop
})
</script>
<style>
page {
  background-color: #f5f7fb;
  height: 100%;
  box-sizing: border-box;
}

/* #ifdef H5 */
uni-page-body {
  background-color: #f5f7fb;
  height: 100%;
}
/* #endif */

/* #ifdef MP-WEIXIN */
image {
  -webkit-touch-callout: none;
}
/* #endif */
</style>
