#!/usr/bin/env bash
# 前端联调冒烟：覆盖登录双身份与主流程 Client 路径（需后端已 serve）
set -euo pipefail

BASE="${KWW_API_BASE:-http://127.0.0.1:8000/app}"
PASS=0
FAIL=0

json_get() {
  php -r '
    $j = json_decode(stream_get_contents(STDIN), true);
    $path = $argv[1];
    $cur = $j;
    foreach (explode(".", $path) as $p) {
      if ($p === "") continue;
      if (!is_array($cur) || !array_key_exists($p, $cur)) { echo ""; exit(0); }
      $cur = $cur[$p];
    }
    if (is_array($cur) || is_object($cur)) echo json_encode($cur, JSON_UNESCAPED_UNICODE);
    else echo $cur;
  ' "$1"
}

req() {
  local method="$1" path="$2" data="${3:-}" token="${4:-}"
  local args=(-sS -X "$method" -H "Accept: application/json" -H "Content-Type: application/json")
  if [[ -n "$token" ]]; then
    args+=(-H "Authorization: Bearer $token")
  fi
  if [[ -n "$data" ]]; then
    args+=(-d "$data")
  fi
  curl "${args[@]}" "${BASE}${path}"
}

assert_code() {
  local name="$1" body="$2" expect="${3:-0}"
  local code
  code=$(printf '%s' "$body" | json_get code)
  if [[ "$code" == "$expect" ]]; then
    echo "OK  $name"
    PASS=$((PASS + 1))
  else
    echo "FAIL $name (code=$code)"
    echo "$body" | head -c 500
    echo
    FAIL=$((FAIL + 1))
  fi
}

echo "Frontend smoke against $BASE"
echo "===="

# 登录页：普通用户
BODY=$(req POST /auth/login '{"identity":"user"}')
assert_code "login user" "$BODY"
USER_TOKEN=$(printf '%s' "$BODY" | json_get data.token)
[[ -n "$USER_TOKEN" ]] && echo "OK  user token" && PASS=$((PASS+1)) || { echo "FAIL user token"; FAIL=$((FAIL+1)); }

# 登录页：坑位商
BODY=$(req POST /auth/login '{"identity":"merchant"}')
assert_code "login merchant" "$BODY"
MERCHANT_TOKEN=$(printf '%s' "$BODY" | json_get data.token)
MERCHANT_ID=$(printf '%s' "$BODY" | json_get data.merchant.id)
[[ -n "$MERCHANT_TOKEN" && -n "$MERCHANT_ID" ]] && echo "OK  merchant token+shop" && PASS=$((PASS+1)) || { echo "FAIL merchant"; FAIL=$((FAIL+1)); }

# 首页
BODY=$(req GET /portal/home)
assert_code "home portal" "$BODY"

# 榜单
BODY=$(req GET "/ranks/products?type=hot&limit=5")
assert_code "rank products" "$BODY"
BODY=$(req GET "/ranks/merchants?type=recommend&limit=5")
assert_code "rank merchants" "$BODY"

# 商家广场
BODY=$(req GET /merchants)
assert_code "merchant plaza" "$BODY"

# 资讯
BODY=$(req GET /articles)
assert_code "articles" "$BODY"

# 大厅列表（可未登录浏览）
BODY=$(req GET /hall/posts)
assert_code "hall list" "$BODY"

# 大厅发帖（需登录）
BODY=$(req GET /categories)
CATEGORY_ID=$(printf '%s' "$BODY" | php -r '$j=json_decode(stream_get_contents(STDIN),true); echo $j["data"][0]["id"]??"";')
BODY=$(req GET /products)
PRODUCT_ID=$(printf '%s' "$BODY" | php -r '$j=json_decode(stream_get_contents(STDIN),true); $d=$j["data"]??[]; echo is_array($d)&&isset($d[0]["id"])?$d[0]["id"]:"";')
BODY=$(req POST /hall/posts "{\"content_type\":1,\"product_id\":${PRODUCT_ID},\"category_id\":${CATEGORY_ID},\"content\":\"前端冒烟大厅帖\",\"images\":[]}" "$USER_TOKEN")
assert_code "hall create (user)" "$BODY"

# 发布（需坑位商）
BODY=$(req POST /listings "{\"product_id\":${PRODUCT_ID},\"category_id\":${CATEGORY_ID},\"title\":\"前端冒烟挂售\",\"price\":999,\"intro\":\"smoke\",\"images\":[],\"submit\":true}" "$MERCHANT_TOKEN")
assert_code "publish listing (merchant)" "$BODY"

# 管理
BODY=$(req GET /listings/mine "" "$MERCHANT_TOKEN")
assert_code "manage listings mine" "$BODY"

# 私信
LISTING_ID=$(printf '%s' "$(req GET "/products/${PRODUCT_ID}/listings")" | php -r '$j=json_decode(stream_get_contents(STDIN),true); $d=$j["data"]??[]; echo is_array($d)&&isset($d[0]["id"])?$d[0]["id"]:"";')
BODY=$(req POST /messages/threads "{\"type\":2,\"peer_id\":${MERCHANT_ID},\"subject_type\":\"listing\",\"subject_id\":${LISTING_ID},\"title\":\"前端咨询\"}" "$USER_TOKEN")
assert_code "message open" "$BODY"
THREAD_ID=$(printf '%s' "$BODY" | json_get data.id)
if [[ -n "$THREAD_ID" ]]; then
  BODY=$(req POST "/messages/threads/${THREAD_ID}" '{"content":"前端冒烟留言","images":[]}' "$USER_TOKEN")
  assert_code "message send" "$BODY"
  BODY=$(req GET /messages/threads "" "$USER_TOKEN")
  assert_code "message threads" "$BODY"
fi

# 未登录写接口应失败（门禁对端）
BODY=$(req POST /listings "{\"product_id\":${PRODUCT_ID},\"category_id\":${CATEGORY_ID},\"title\":\"noauth\",\"price\":1,\"images\":[],\"submit\":true}")
CODE=$(printf '%s' "$BODY" | json_get code)
if [[ "$CODE" != "0" ]]; then
  echo "OK  unauth publish rejected (code=$CODE)"
  PASS=$((PASS+1))
else
  echo "FAIL unauth publish should not succeed"
  FAIL=$((FAIL+1))
fi

echo "===="
echo "PASS=$PASS FAIL=$FAIL"
if [[ "$FAIL" -gt 0 ]]; then
  exit 1
fi
echo "Frontend client API smoke passed."
