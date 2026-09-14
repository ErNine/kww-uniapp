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
  height: 100%;
  box-sizing: border-box;
}

/* #ifdef H5 */
uni-page-body {
  background-color: #f5f7fb;
  height: 100%;
}
/* #endif */
</style>
