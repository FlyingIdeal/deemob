import Main from '@/components/main/main'

/**
 * 项目中meta除了原生参数外可配置的参数:
 * meta: {
 *  title: { String|Number|Function }
 *         显示在侧边栏、面包屑和标签栏的文字
 *         使用'{{ 多语言字段 }}'形式结合多语言使用，例子看多语言的路由配置;
 *         可以传入一个回调函数，参数是当前路由对象，例子看动态路由和带参路由
 *  hideInBread: (false) 设为true后此级路由将不会出现在面包屑中，示例看QQ群路由配置
 *  hideInMenu: (false) 设为true后在左侧菜单不会显示该页面选项
 *  notCache: (false) 设为true后页面在切换标签后不会缓存，如果需要缓存，无需设置这个字段，而且需要设置页面组件name属性和路由配置的name一致
 *  targetHighLight: (false) 目标父级高亮
 *  access: (null) 可访问该页面的权限数组，当前路由设置的权限会影响子路由
 *  icon: (-) 该页面在左侧菜单、面包屑和标签导航处显示的图标，如果是自定义图标，需要在图标名称前加下划线'_'
 *  beforeCloseName: (-) 设置该字段，则在关闭当前tab页时会去'@/router/before-close.js'里寻找该字段名对应的方法，作为关闭前的钩子函数
 * }
 * keepAlive: 页面需要缓存
 * inPageAccess 页面内权限，比如[查看，修改，封禁， 重置密码，伪登录...]
 * isResponsive 是否为响应式页面，如果不是按照 1146px 居中，如果是则自适应
 * isShowAccess 是否在 账号权限-模块管理 route中显示
 * redirectTo 重定向的来源，在配置异步路由时使用
 */

/**
 * [constantRouterMap 登录，注册， 首页等 不需要权限的公共页面]
 * @type {Array}
 */
export const constantRouterMap = [
	{
		path: '/account/login', // 登录
		name: 'login',
		meta: {
			title: '登录',
			hideInMenu: true
		},
		component: resolve => require(['@/view/account/login'], resolve)
	},
	{
		path: '/account/agent/login', // 代理登录
		name: 'agentLogin',
		meta: {
			title: '登录',
			hideInMenu: true
		},
		component: resolve => require(['@/view/account/agentLogin'], resolve)
	}
]

/**
 * 异步路由，需要在权限-模块中创建的路由
 */
export const asyncRouterMap = [
	{
		path: '/',
		name: 'home',
		redirect: '/home',
		component: Main,
		meta: {
			title: '首页',
			redirectTo: 'home-index',
			icon: 'left-bar-icon home-tag'
		},
		children: [
			{
				path: '/home',
				name: 'home-index',
				meta: {
					title: '首页',
					isResponsive: false
				},
				component: resolve => require(['@/view/home/index'], resolve)
			}
		]
	},
	{
		path: '/advertising', // 流量管理
		name: 'advertising',
		component: Main,
		meta: {
			title: '投放管理',
			icon: 'left-bar-icon put-tag'
		},
		children: [
			{
				path: '/advertising/activity/manage',
				name: 'advertising-activity',
				meta: {
					keepAlive: true,
					title: '广告活动',
					isResponsive: true
				},
				component: resolve => require(['@/view/advertising/activity/manage'], resolve)
			},
			{
				path: '/advertising/activity/edit',
				name: 'activity-edit',
				meta: {
					hideInMenu: true,
					targetHighLight: 'advertising-activity',
					title: '新建广告活动'
				},
				component: resolve => require(['@/view/advertising/activity/edit'], resolve)
			},
			{
				path: '/advertising/unit/manage',
				name: 'advertising-unit',
				meta: {
					keepAlive: true,
					title: '广告单元',
					isResponsive: true
				},
				component: resolve => require(['@/view/advertising/unit/manage'], resolve)
			},
			{
				path: '/advertising/unit/edit',
				name: 'unit-edit',
				meta: {
					hideInMenu: true,
					targetHighLight: 'advertising-unit',
					title: '新建广告单元'
				},
				component: resolve => require(['@/view/advertising/unit/edit'], resolve)
			},
			{
				path: '/advertising/creative/manage',
				name: 'advertising-creative',
				meta: {
					keepAlive: true,
					title: '广告',
					isResponsive: true
				},
				component: resolve => require(['@/view/advertising/creative/manage'], resolve)
			},
			{
				path: '/advertising/creative/edit',
				name: 'advertising-creative-edit',
				meta: {
					hideInMenu: true,
					targetHighLight: 'advertising-creative',
					title: '新建广告'
				},
				component: resolve => require(['@/view/advertising/creative/edit'], resolve)
			}
		]
	},
	{
		path: '/data', // 预算管理
		name: 'data',
		component: Main,
		meta: {
			title: '数据报表',
			icon: 'left-bar-icon data-tag'
		},
		children: [
			{
				path: '/data/effect/day',
				name: 'effect-data',
				meta: {
					keepAlive: true,
					title: '效果数据',
					isResponsive: true
				},
				component: resolve => require(['@/view/data/effect-data/index'], resolve)
			},
			{
				path: '/data/person/manage',
				name: 'data-person-manage',
				meta: {
					keepAlive: true,
					title: '人群分析',
					isResponsive: true,
					hideInMenu: true
				},
				component: resolve => require(['@/view/data/person-data/manage'], resolve)
			},
			{
				path: '/data/ad/manage',
				name: 'data-ad-manage',
				meta: {
					keepAlive: true,
					title: '广告位数据',
					isResponsive: true
				},
				component: resolve => require(['@/view/data/ad-data/manage'], resolve)
			},
			{
				path: '/data/creative/manage',
				name: 'data-creative-manage',
				meta: {
					keepAlive: true,
					title: '创意包数据',
					isResponsive: true
				},
				component: resolve => require(['@/view/data/creative-data/manage'], resolve)
			},
			{
				path: '/data/material/manage',
				name: 'data-material-manage',
				meta: {
					keepAlive: true,
					title: '素材分析',
					isResponsive: true
				},
				component: resolve => require(['@/view/data/material-data/index'], resolve)
			}
		]
	},
	{
		path: '/tool', // 预算管理
		name: 'tool',
		component: Main,
		meta: {
			title: '工具',
			icon: 'left-bar-icon tool-tag'
		},
		children: [
			{
				path: '/tool/material/manage',
				name: 'tool-material',
				meta: {
					title: '素材库',
					isResponsive: true
				},
				component: resolve => require(['@/view/tool/material/manage'], resolve)
			},
			{
				path: '/tool/material/tag',
				name: 'tool-material-tag',
				meta: {
					title: '素材标签管理',
					hideInMenu: true,
					isResponsive: true,
					targetHighLight: 'tool-material'
				},
				component: resolve => require(['@/view/tool/material/tag'], resolve)
			},
			{
				path: '/tool/material/group',
				name: 'tool-material-group',
				meta: {
					title: '素材组',
					hideInMenu: true,
					isResponsive: true,
					targetHighLight: 'tool-material'
				},
				component: resolve => require(['@/view/tool/material/group'], resolve)
			},
			{
				path: '/tool/material/add',
				name: 'material-add',
				meta: {
					title: '添加素材',
					hideInMenu: true,
					isResponsive: true,
					targetHighLight: 'tool-material'
				},
				component: resolve => require(['@/view/tool/material/add'], resolve)
			},
			{
				path: '/tool/creative/manage',
				name: 'tool-creative',
				meta: {
					title: '创意包',
					isResponsive: true
				},
				component: resolve => require(['@/view/tool/creative/manage'], resolve)
			},
			{
				path: '/tool/creative/edit',
				name: 'tool-creative-edit',
				meta: {
					title: '新建创意包',
					hideInMenu: true,
					targetHighLight: 'tool-creative',
				},
				component: resolve => require(['@/view/tool/creative/edit'], resolve)
			},
			{
				path: '/tool/site/manage',
				name: 'site-manage',
				meta: {
					title: '转化跟踪', // 线索
					isResponsive: true
				},
				component: resolve => require(['@/view/tool/site/index'], resolve)
			},
			{
				path: '/tool/site/clues/edit',
				name: 'site-clues-edit',
				meta: {
					title: '新建转化', // 线索跟踪-编辑和新建
					isResponsive: true,
					hideInMenu: true,
					targetHighLight: 'site-manage'
				},
				component: resolve => require(['@/view/tool/site/clues/edit'], resolve)
			},
			{
				path: '/tool/site/clues/detail',
				name: 'site-clues-detail',
				meta: {
					title: '转化详情', // 线索跟踪-详情
					isResponsive: true,
					hideInMenu: true,
					targetHighLight: 'site-manage'
				},
				component: resolve => require(['@/view/tool/site/clues/detail'], resolve)
			},
			{
				path: '/tool/site/app/edit',
				name: 'site-app-edit',
				meta: {
					title: '新建转化', // 应用跟踪-编辑和新建
					hideInMenu: true,
					targetHighLight: 'site-manage'
				},
				component: resolve => require(['@/view/tool/site/app/edit'], resolve)
			},
			{
				path: '/tool/site/app/detail',
				name: 'site-app-detail',
				meta: {
					title: '转化详情', // 应用跟踪-详情
					hideInMenu: true,
					targetHighLight: 'site-manage'
				},
				component: resolve => require(['@/view/tool/site/app/detail'], resolve)
			}
		]
	},
	{
		path: '/financial', // 财务明细
		name: 'financial-manage',
		component: Main,
		redirect: '/financial/manage',
		meta: {
			title: '财务明细',
			redirectTo: 'financial-manage-index',
			icon: 'left-bar-icon financial-tag'
		},
		children: [
			{
				path: '/financial/manage',
				name: 'financial-manage-index',
				meta: {
					title: '财务明细',
					isResponsive: true
				},
				component: resolve => require(['@/view/financial/manage'], resolve)
			}
		]
	},
	{
		path: '/infro', // 账号权限
		name: 'infro',
		component: Main,
		meta: {
			title: '账户中心',
			icon: 'left-bar-icon account-tag'
		},
		children: [
			{
				path: '/infro/detail',
				name: 'infro-account',
				meta: {
					title: '账户信息'
				},
				component: resolve => require(['@/view/infro/detail'], resolve)
			},
			{
				path: '/infro/change/psw',
				name: 'infro-reset-psw',
				meta: {
					title: '修改密码'
				},
				component: resolve => require(['@/view/infro/change_psw'], resolve)
			}
		]
	},
	{
		path: '/document', // 文档中心
		name: 'document',
		component: Main,
		redirect: '/document/monitor',
		meta: {
			title: '文档中心',
			hideInMenu: true,
			icon: 'left-bar-icon doc-tag',
			redirectTo: 'document-monitor',
		},
		children: [
			{
				path: '/document/monitor',
				name: 'document-monitor',
				meta: {
					title: '文档中心'
				},
				component: resolve => require(['@/view/document/monitor'], resolve)
			}
		]
	}
]

/**
 * [noFoundRouterMap 404页面]
 * @type {Array}
 */
export const noFoundRouterMap = [
	{
		path: '/permission/error',
		name: '_noPermission',
		component: Main,
		redirect: '/permission/error/log',
		meta: {
			hideInMenu: true,
			title: '无访问权限'
		},
		children: [
			{
				path: '/permission/error/log',
				name: 'noPermission',
				component: resolve => require(['@/view/error/noPermission'], resolve)
			}
		]
	},
	{
		path: '*', // 404
		name: 'noFound',
		meta: {
			hideInMenu: true,
			title: '错误'
		},
		component: resolve => require(['@/view/error/index'], resolve)
	}
]
