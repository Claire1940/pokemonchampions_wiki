import type { LucideIcon } from 'lucide-react'
import { BookOpen, Link2, Settings2, Trophy, Rocket, Gift, Users, Shield } from 'lucide-react'

export interface NavigationItem {
	key: string // 用于翻译键，如 'codes' -> t('nav.codes')
	path: string // URL 路径，如 '/codes'
	icon: LucideIcon // Lucide 图标组件
	isContentType: boolean // 是否对应 content/ 目录
}

export const NAVIGATION_CONFIG: NavigationItem[] = [
	{ key: 'guide', path: '/guide', icon: BookOpen, isContentType: true },
	{ key: 'roster', path: '/roster', icon: Users, isContentType: true },
	{ key: 'teams', path: '/teams', icon: Shield, isContentType: true },
	{ key: 'meta', path: '/meta', icon: Trophy, isContentType: true },
	{ key: 'mechanics', path: '/mechanics', icon: Settings2, isContentType: true },
	{ key: 'rewards', path: '/rewards', icon: Gift, isContentType: true },
	{ key: 'release', path: '/release', icon: Rocket, isContentType: true },
	{ key: 'home', path: '/home', icon: Link2, isContentType: true },
]

// 从配置派生内容类型列表（用于路由和内容加载）
export const CONTENT_TYPES = NAVIGATION_CONFIG.filter((item) => item.isContentType).map(
	(item) => item.path.slice(1),
) // 移除开头的 '/'

export type ContentType = (typeof CONTENT_TYPES)[number]

// 辅助函数：验证内容类型
export function isValidContentType(type: string): type is ContentType {
	return CONTENT_TYPES.includes(type as ContentType)
}
