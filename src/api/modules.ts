import { get, post, put, del, requestSilent } from './request'
import type {
  ArticleItem,
  CategoryItem,
  HallPostItem,
  ListingItem,
  MerchantItem,
  MessageItem,
  MessageThreadItem,
  PageQuery,
  PortalHomeData,
  ProductItem,
  SearchResult,
  UserProfile,
} from './types'

/** 登录：简化 openid / mobile（非真实微信换码） */
export const authApi = {
  login: (data: { openid?: string; mobile?: string; nickname?: string; avatar?: string }) =>
    post<{ token: string; member: UserProfile }>('/auth/login', data, { auth: false }),
  me: () => get<UserProfile>('/auth/me'),
  meSilent: () => requestSilent<UserProfile>({ url: '/auth/me' }),
  updateProfile: (data: { nickname?: string; avatar?: string; bio?: string }) =>
    put<UserProfile>('/auth/profile', data),
}

/** 首页聚合 */
export const portalApi = {
  home: () => get<PortalHomeData>('/portal/home', undefined, { auth: false }),
  homeSilent: () =>
    requestSilent<PortalHomeData>({ url: '/portal/home', auth: false }),
}

/** 分类（只读，后台维护） */
export const categoryApi = {
  list: () => get<CategoryItem[]>('/categories', undefined, { auth: false }),
  listSilent: () =>
    requestSilent<CategoryItem[]>({ url: '/categories', auth: false }),
}

/** 平台商品库 */
export const productApi = {
  list: (query?: PageQuery & { category_id?: number | string; keyword?: string }) =>
    get<ProductItem[]>('/products', query as Record<string, unknown>, { auth: false }),
  listSilent: (query?: PageQuery & { category_id?: number | string; keyword?: string }) =>
    requestSilent<ProductItem[]>({
      url: '/products',
      query: query as Record<string, unknown>,
      auth: false,
    }),
  detail: (id: number | string) =>
    get<ProductItem>(`/products/${id}`, undefined, { auth: false }),
  detailSilent: (id: number | string) =>
    requestSilent<ProductItem>({ url: `/products/${id}`, auth: false }),
}

/** 商家 */
export const merchantApi = {
  list: (query?: PageQuery & {
    sort?: string
    category_id?: number | string
    keyword?: string
    is_certified?: number
  }) => get<MerchantItem[]>('/merchants', query as Record<string, unknown>, { auth: false }),
  listSilent: (query?: PageQuery & {
    sort?: string
    category_id?: number | string
    keyword?: string
    is_certified?: number
  }) =>
    requestSilent<MerchantItem[]>({
      url: '/merchants',
      query: query as Record<string, unknown>,
      auth: false,
    }),
  detail: (id: number | string) =>
    get<MerchantItem>(`/merchants/${id}`, undefined, { auth: false }),
  detailSilent: (id: number | string) =>
    requestSilent<MerchantItem>({ url: `/merchants/${id}`, auth: false }),
  /** 入驻申请 */
  apply: (data: {
    name: string
    logo?: string
    intro?: string
    industry_category_id?: number | string
  }) => post<MerchantItem>('/merchants/apply', data),
  mine: () => get<MerchantItem | null>('/merchants/mine'),
  mineSilent: () => requestSilent<MerchantItem | null>({ url: '/merchants/mine' }),
  updateMine: (data: Record<string, unknown>) => put<MerchantItem>('/merchants/mine', data),
}

/** Listing：公开读 + 商家管理 */
export const listingApi = {
  byProduct: (productId: number | string, query?: PageQuery) =>
    get<ListingItem[]>(`/products/${productId}/listings`, query as Record<string, unknown>, {
      auth: false,
    }),
  byProductSilent: (productId: number | string, query?: PageQuery) =>
    requestSilent<ListingItem[]>({
      url: `/products/${productId}/listings`,
      query: query as Record<string, unknown>,
      auth: false,
    }),
  byMerchant: (merchantId: number | string, query?: PageQuery & { category_id?: number | string }) =>
    get<ListingItem[]>(`/merchants/${merchantId}/listings`, query as Record<string, unknown>, {
      auth: false,
    }),
  byMerchantSilent: (
    merchantId: number | string,
    query?: PageQuery & { category_id?: number | string },
  ) =>
    requestSilent<ListingItem[]>({
      url: `/merchants/${merchantId}/listings`,
      query: query as Record<string, unknown>,
      auth: false,
    }),
  detail: (id: number | string) =>
    get<ListingItem>(`/listings/${id}`, undefined, { auth: false }),
  detailSilent: (id: number | string) =>
    requestSilent<ListingItem>({ url: `/listings/${id}`, auth: false }),
  /** 我的商品（需登录商家） */
  mine: (query?: PageQuery & { sale_status?: number | string; category_id?: number | string }) =>
    get<ListingItem[]>('/listings/mine', query as Record<string, unknown>),
  mineSilent: (query?: PageQuery & { sale_status?: number | string; category_id?: number | string }) =>
    requestSilent<ListingItem[]>({
      url: '/listings/mine',
      query: query as Record<string, unknown>,
    }),
  create: (data: Record<string, unknown>) => post<ListingItem>('/listings', data),
  update: (id: number | string, data: Record<string, unknown>) =>
    put<ListingItem>(`/listings/${id}`, data),
  changeStatus: (id: number | string, sale_status: number) =>
    put<ListingItem>(`/listings/${id}/status`, { sale_status }),
}

/** 排行 */
export const rankApi = {
  products: (query?: PageQuery & { category_id?: number | string; type?: string }) =>
    get<ProductItem[]>('/ranks/products', query as Record<string, unknown>, { auth: false }),
  productsSilent: (query?: PageQuery & { category_id?: number | string; type?: string }) =>
    requestSilent<ProductItem[]>({
      url: '/ranks/products',
      query: query as Record<string, unknown>,
      auth: false,
    }),
  merchants: (query?: PageQuery & { type?: string; category_id?: number | string }) =>
    get<MerchantItem[]>('/ranks/merchants', query as Record<string, unknown>, { auth: false }),
  merchantsSilent: (query?: PageQuery & { type?: string; category_id?: number | string }) =>
    requestSilent<MerchantItem[]>({
      url: '/ranks/merchants',
      query: query as Record<string, unknown>,
      auth: false,
    }),
}

/** 互助大厅（after_id 轮询） */
export const hallApi = {
  posts: (query?: {
    after_id?: number | string
    content_type?: number | string
    product_id?: number | string
    limit?: number
  }) => get<HallPostItem[] | { data?: HallPostItem[] }>('/hall/posts', query as Record<string, unknown>, {
    auth: false,
  }),
  postsSilent: (query?: {
    after_id?: number | string
    content_type?: number | string
    product_id?: number | string
    limit?: number
  }) =>
    requestSilent<HallPostItem[]>({
      url: '/hall/posts',
      query: query as Record<string, unknown>,
      auth: false,
    }),
  create: (data: {
    content_type: number
    product_id?: number | string
    category_id?: number | string
    content: string
    images?: string[]
  }) => post<HallPostItem>('/hall/posts', data),
  quota: () => get<{ remaining: number }>('/hall/quota'),
  quotaSilent: () => requestSilent<{ remaining: number }>({ url: '/hall/quota' }),
}

/** 私信 / 咨询（after_id 轮询） */
export const messageApi = {
  threads: (query?: PageQuery) =>
    get<MessageThreadItem[]>('/messages/threads', query as Record<string, unknown>),
  threadsSilent: (query?: PageQuery) =>
    requestSilent<MessageThreadItem[]>({
      url: '/messages/threads',
      query: query as Record<string, unknown>,
    }),
  open: (data: {
    type?: number | string
    peer_id?: number | string
    subject_type?: string
    subject_id?: number | string
    title?: string
  }) => post<MessageThreadItem>('/messages/threads', data),
  messages: (threadId: number | string, query?: { after_id?: number | string; limit?: number }) =>
    get<MessageItem[]>(`/messages/threads/${threadId}`, query as Record<string, unknown>),
  messagesSilent: (
    threadId: number | string,
    query?: { after_id?: number | string; limit?: number },
  ) =>
    requestSilent<MessageItem[]>({
      url: `/messages/threads/${threadId}`,
      query: query as Record<string, unknown>,
    }),
  send: (threadId: number | string, data: { content: string; images?: string[] }) =>
    post<MessageItem>(`/messages/threads/${threadId}`, data),
  unread: () => get<{ count: number }>('/messages/unread'),
  unreadSilent: () => requestSilent<{ count: number }>({ url: '/messages/unread' }),
}

/** 搜索：参数 q */
export const searchApi = {
  query: (q: string, query?: { type?: string; limit?: number }) =>
    get<SearchResult>('/search', { q, ...query } as Record<string, unknown>, { auth: false }),
  querySilent: (q: string, query?: { type?: string; limit?: number }) =>
    requestSilent<SearchResult>({
      url: '/search',
      query: { q, ...query } as Record<string, unknown>,
      auth: false,
    }),
}

/** 资讯 */
export const cmsApi = {
  articles: (query?: PageQuery) =>
    get<ArticleItem[]>('/articles', query as Record<string, unknown>, { auth: false }),
  articlesSilent: (query?: PageQuery) =>
    requestSilent<ArticleItem[]>({
      url: '/articles',
      query: query as Record<string, unknown>,
      auth: false,
    }),
  article: (id: number | string) =>
    get<ArticleItem>(`/articles/${id}`, undefined, { auth: false }),
  articleSilent: (id: number | string) =>
    requestSilent<ArticleItem>({ url: `/articles/${id}`, auth: false }),
}

/** 收藏 / 关注 / 点赞 */
export const interactionApi = {
  favorites: () => get('/favorites'),
  favorite: (data: { target_type: number; target_id: number | string }) =>
    post('/favorites', data),
  unfavorite: (data: { target_type: number; target_id: number | string }) =>
    del('/favorites', { data }),
  follow: (data: { target_type: number; target_id: number | string }) => post('/follows', data),
  unfollow: (data: { target_type: number; target_id: number | string }) =>
    del('/follows', { data }),
  like: (data: { target_type: number; target_id: number | string }) => post('/likes', data),
  unlike: (data: { target_type: number; target_id: number | string }) =>
    del('/likes', { data }),
}

/** Listing 状态枚举（与后端 ListingSaleStatus 对齐） */
export const ListingSaleStatus = {
  Draft: 1,
  Pending: 2,
  OnSale: 3,
  Offline: 4,
  Rejected: 5,
} as const

/** 大厅内容类型（与后端 HallContentType 对齐） */
export const HallContentType = {
  Help: 1,
  Buy: 2,
  Transfer: 3,
  Share: 4,
  Other: 5,
  System: 6,
} as const
