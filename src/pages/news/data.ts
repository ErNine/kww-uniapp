/** 首页资讯 mock，详情页按 id 读取 */

export interface NewsItem {
  id: string
  title: string
  thumbTitle: string
  gradient: string
  tags: string[]
  source: string
  time: string
  views: string
  /** 详情正文段落 */
  paragraphs: string[]
}

export const NEWS_LIST: NewsItem[] = [
  {
    id: '1',
    title: '2024年SaaS行业发展趋势报告',
    thumbTitle: '2024年\nSaaS行业\n发展趋势报告',
    gradient: 'linear-gradient(135deg, #4F8CFF 0%, #2F5BFF 100%)',
    tags: ['行业趋势', 'SaaS', '市场分析'],
    source: '坑位网官方',
    time: '2小时前',
    views: '1234阅读',
    paragraphs: [
      '随着数字化转型持续深入，SaaS 正成为中小企业降本增效的重要选择。本报告梳理了 2024 年 SaaS 行业在垂直场景、订阅模式与渠道分发上的关键变化。',
      '从坑位交易视角看，商城、餐饮外卖、同城服务等赛道仍保持较高热度。具备稳定交付能力、完善售后与保证金保障的坑位商，更容易获得买家信任。',
      '报告建议：选型时优先关注产品成熟度、行业案例沉淀、二次开发空间与长期运维成本，避免只盯低价而忽视交付风险。',
      '坑位网将持续发布行业数据与干货内容，帮助买卖双方更高效完成对接与成交。',
    ],
  },
  {
    id: '2',
    title: '如何选择优质的坑位商？5大维度帮你避坑',
    thumbTitle: '如何选择\n优质的坑位商？\n5大维度帮你避坑',
    gradient: 'linear-gradient(135deg, #FF9F43 0%, #FF6B35 100%)',
    tags: ['坑位干货', '避坑指南', '运营技巧'],
    source: '坑位网官方',
    time: '5小时前',
    views: '2345阅读',
    paragraphs: [
      '选坑位商不是比谁更便宜，而是比谁更靠谱。以下五个维度，可以帮助你快速筛选优质服务方。',
      '一是资质与认证：优先选择完成平台认证、缴纳保证金的商家。二是案例与口碑：查看同行业成交案例与买家评价。三是交付能力：确认开发周期、验收标准与售后响应时效。',
      '四是产品能力：关注功能完整度、技术架构与后续升级路径。五是沟通效率：需求确认是否清晰、报价是否透明，往往决定合作体验。',
      '在坑位网，你可以通过商家主页、榜单与资讯内容交叉验证，降低试错成本。',
    ],
  },
  {
    id: '3',
    title: '成功案例：月入百万的外卖平台搭建方案',
    thumbTitle: '成功案例：\n月入百万的外卖\n平台搭建方案',
    gradient: 'linear-gradient(135deg, #A78BFA 0%, #4F46E5 100%)',
    tags: ['成功案例', '餐饮外卖', '平台搭建'],
    source: '坑位网官方',
    time: '1天前',
    views: '3456阅读',
    paragraphs: [
      '某同城团队基于成熟外卖跑腿系统快速上线，三个月内完成核心商户入驻与用户冷启动，逐步形成稳定订单闭环。',
      '方案重点包括：骑手调度、营销裂变、商户后台与数据看板。团队并未从零开发，而是通过坑位合作缩短上线周期，把精力放在运营与供给侧建设上。',
      '关键经验：先验证本地需求密度，再放大投放；用保证金与售后保障降低商户顾虑；持续迭代配送时效与客服体验。',
      '如果你正在筹备餐饮外卖或同城配送项目，欢迎在坑位榜与坑位商页面对接合适的产品与服务方。',
    ],
  },
]

export function getNewsById(id?: string) {
  if (!id) return NEWS_LIST[0]
  return NEWS_LIST.find((item) => item.id === id) ?? NEWS_LIST[0]
}
