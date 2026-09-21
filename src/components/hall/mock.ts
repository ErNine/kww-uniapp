import type { HallFilterOption, HallMessageItem } from './types'

export const CONTENT_TYPE_OPTIONS: HallFilterOption[] = [
  { label: '全部', value: 'all' },
  { label: '问题求助', value: 'help' },
  { label: '求购', value: 'buy' },
  { label: '转让', value: 'transfer' },
  { label: '经验分享', value: 'share' },
  { label: '其他', value: 'other' },
]

export const SOFTWARE_OPTIONS: HallFilterOption[] = [
  { label: '全部', value: 'all' },
  { label: '商城系统', value: 'mall' },
  { label: '餐饮点单', value: 'food' },
  { label: '上门服务', value: 'door' },
  { label: '教育培训', value: 'edu' },
]

/** 设计稿示例消息（后续可换成接口数据） */
export const MOCK_MESSAGES: HallMessageItem[] = [
  {
    id: '1',
    kind: 'text',
    side: 'left',
    avatar: '/static/hall/avatar-3.png',
    content: '收济南物业公司两三年以上的加我',
    meta: '昨天12:58·济南群',
  },
  {
    id: '2',
    kind: 'text',
    side: 'left',
    avatar: '/static/hall/avatar-2.png',
    content:
      '这里是多行样式占位文字，这里是多行样式占位文字\n这里是多行样式占位文字，\n这里是多行样式占位文字，',
    meta: '昨天12:58·济南群',
  },
  {
    id: '3',
    kind: 'text',
    side: 'right',
    avatar: '/static/hall/avatar-self.png',
    parts: [
      {
        text: '这里是多行样式占位文字，这里是多行样式占位文字，\n这里是多行样式占位文字，',
      },
      { text: 'https://ww.huzhan.com/ishop43010', link: true },
      { text: '\n这里是多行样式占位文字，' },
    ],
    meta: '昨天12:58·济南群',
  },
  {
    id: '4',
    kind: 'system',
    systemParts: [
      { text: 'A海南财税小亮邀请' },
      { text: ' 微信用户NNLJ1 ', highlight: true },
      { text: '加入群聊' },
    ],
  },
  {
    id: '5',
    kind: 'image',
    side: 'left',
    avatar: '/static/hall/avatar-1.png',
    content: '这里是附带图片的样式',
    images: ['/static/hall/img-license-1.png', '/static/hall/img-license-2.png'],
    meta: '昨天12:58·济南群',
  },
]
