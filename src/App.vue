<script setup lang="ts">
import { onLaunch, onShow, onHide } from "@dcloudio/uni-app";
onLaunch(() => {
  console.log("App Launch");
});
onShow(() => {
  console.log("App Show");
});
onHide(() => {
  console.log("App Hide");
});
</script>
<style>
page {
  background-color: #f5f7fb;
  box-sizing: border-box;
}

/* #ifdef H5 */
uni-page-body {
  background-color: #f5f7fb;
  /* 不要写死 height:100%，否则会盖住原生 tabBar */
}
/* #endif */
</style>
