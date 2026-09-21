/** 与 Xasuma Client / 后端本期模块响应对齐 */

export interface ApiResponse<T = unknown> {
  code: number
  message: string
  data: T
  total?: number
  limit?: number
  page?: number
}

export interface PageQuery {
  page?: number
  limit?: number
  keyword?: string
}

export interface CategoryItem {
  id: number | string
  name: string
  icon?: string
  parent_id?: number | string | null
  sort?: number
}

export interface ProductItem {
  id: number | string
  name: string
  logo?: string
  cover?: string
  summary?: string
  intro?: string
  desc?: string
  category_id?: number | string
  category?: { id: number | string; name: string }
  category_name?: string
  reference_price?: number | string
  price?: number | string
  hot_score?: number
  heat?: string | number
  score?: number
  listing_count?: number
  view_count?: number
  status?: number
}

export interface MerchantItem {
  id: number | string
  name: string
  logo?: string
  avatar?: string
  intro?: string
  company?: string
  is_certified?: number | boolean
  auth_type?: string
  auth_label?: string
  deposit_amount?: number | string
  deposit?: number | string
  deposit_label?: string
  rating_score?: number
  score?: number
  sales_proxy?: number | string
  popularity?: string | number
  business?: string
  sales?: string | number
  slots?: string | number
  listing_count?: number
  rate?: string
  years?: string | number
  desc?: string
  likes?: number | string
  industry_category_id?: number | string
  industry_category?: { id: number | string; name: string }
  audit_status?: number
  member_id?: number | string
}

export type ListingStatus = number | string

export interface ListingItem {
  id: number | string
  product_id: number | string
  merchant_id?: number | string
  category_id?: number | string
  title?: string
  name?: string
  price: number | string
  intro?: string
  desc?: string
  images?: string[]
  cover?: string
  sale_status?: number
  status?: ListingStatus
  status_label?: string
  sales?: string | number
  view_count?: number
  category_name?: string
  product_name?: string
  product?: ProductItem
  category?: CategoryItem
  merchant?: MerchantItem
}

export interface ArticleItem {
  id: number | string
  title: string
  cover?: string
  summary?: string
  content?: string
  thumb_title?: string
  gradient?: string
  tags?: string[]
  source?: string
  published_at?: string | number
  time?: string
  view_count?: number | string
  views?: string | number
  paragraphs?: string[]
  category?: string
}

export interface NoticeItem {
  id?: number | string
  title: string
  content?: string
  created_at?: number | string
}

export interface BannerItem {
  id?: number | string
  image?: string
  title?: string
  link?: string
  position?: string
}

/** 与 PortalService::home 对齐 */
export interface PortalHomeData {
  banners?: BannerItem[]
  notices?: NoticeItem[]
  hot_products?: ProductItem[]
  new_products?: ProductItem[]
  hot_merchants?: MerchantItem[]
  articles?: ArticleItem[]
}

export interface HallPostItem {
  id: number | string
  content_type?: number
  product_id?: number | string
  category_id?: number | string
  content?: string
  images?: string[]
  is_system?: number
  created_at?: number | string
  member?: { id?: number | string; nickname?: string; avatar?: string }
  product?: { id?: number | string; name?: string; logo?: string }
  quota_remaining?: number
  // 前端展示兼容
  avatar?: string
  nickname?: string
  side?: 'left' | 'right'
  meta?: string
  kind?: 'text' | 'image' | 'system'
}

export interface MessageThreadItem {
  id: number | string
  title?: string
  type?: number | string
  peer_id?: number | string
  peer_name?: string
  peer_avatar?: string
  last_message?: string
  unread?: number
  updated_at?: string | number
}

export interface MessageItem {
  id: number | string
  thread_id?: number | string
  content: string
  images?: string[]
  sender_id?: number | string
  side?: 'left' | 'right'
  avatar?: string
  created_at?: string | number
}

export interface UserProfile {
  id: number | string
  nickname?: string
  avatar?: string
  bio?: string
  mobile?: string
  openid?: string
  user_no?: string
  balance?: number | string
  merchant?: MerchantItem | null
}

export interface SearchResult {
  products?: ProductItem[]
  merchants?: MerchantItem[]
  hall_posts?: HallPostItem[]
  articles?: ArticleItem[]
}
