# 坑位网小程序（kww-uniapp）

uni-app Vue3 + TypeScript。对接 `kww-server` Client API（前缀 `/app`）。

## 本地联调

### 1. 后端（另仓 `kww-server`）

```bash
cd kww-server
composer install
php artisan kww:install --sqlite --force
php artisan serve --host=127.0.0.1 --port=8000
```

冒烟：`bash scripts/kww-smoke-test.sh`

### 2. 前端

```bash
cd kww-uniapp
cp .env.development .env.development.local   # 可选；默认已指向本机
# 确认：
# VITE_API_BASE_URL=http://127.0.0.1:8000/app

npm ci
npm run dev:mp-weixin   # 微信小程序
# 或
npm run dev:h5          # 浏览器 H5
```

微信开发者工具打开 `dist/dev/mp-weixin`，勾选 **不校验合法域名、web-view、TLS 版本以及 HTTPS 证书**。

### 3. 模拟登录

- 冷启动首屏：选「普通用户」或「坑位商」
- 已登录切换：「我的」→ **切换身份 / 重新登录**
- 接口：`POST /app/auth/login` body `{"identity":"user"|"merchant"}`

### 4. 请求层冒烟（需后端已 serve）

```bash
bash scripts/smoke-client-api.sh
```

## 脚本

| 命令 | 说明 |
| --- | --- |
| `npm run type-check` | `vue-tsc --noEmit` |
| `npm run build:mp-weixin` | 小程序生产构建 |
| `npm run build:h5` | H5 构建 |
| `bash scripts/smoke-client-api.sh` | 对照前端主路径打 Client API |

## 环境变量

见 `.env.development`。未设置时 `src/config/env.ts` 默认 `http://127.0.0.1:8000/app`。
