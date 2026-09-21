/** 互助大厅消息与筛选项类型 */

export type HallMessageSide = 'left' | 'right'

export type HallMessageKind = 'text' | 'image' | 'system'

export interface HallTextPart {
  text: string
  link?: boolean
}

export interface HallMessageItem {
  id: string
  kind: HallMessageKind
  /** 左右气泡；系统消息忽略 */
  side?: HallMessageSide
  avatar?: string
  /** 纯文本或分段（含链接高亮） */
  content?: string
  parts?: HallTextPart[]
  images?: string[]
  meta?: string
  /** 系统消息文案分段 */
  systemParts?: { text: string; highlight?: boolean }[]
}

export interface HallFilterOption {
  label: string
  value: string
}
