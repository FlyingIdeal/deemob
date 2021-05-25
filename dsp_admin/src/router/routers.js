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
        path: '/', // 登录
        redirect: '/transfer/index',
        meta: {
            title: '重定向',
            hideInMenu: true
        },
    },
    {
        path: '/transfer/index', // 中间页面跳转
        name: 'transfer',
        meta: {
            title: '跳转页面',
            hideInMenu: true
        },
        component: resolve => require(['@/view/transfer/index'], resolve)
    }
]

/**
 * 异步路由，需要在权限-模块中创建的路由
 */
export const asyncRouterMap = [
    {
        path: '/ssp', // 流量资源中心
        name: 'ssp',
        component: Main,
        meta: {
            title: '流量资源中心',
            icon: 'left-bar-icon put-tag'
        },
        children: [
            {
                path: '/ssp/media/manage',
                name: 'ssp-manage',
                meta: {
                    keepAlive: true,
                    title: '媒体',
                    isShowAccess: true,
                    isResponsive: true,
                    inPageAccess: {'viewIndex': '首页', 'newAndEdit': '新建/编辑媒体', 'status': '修改媒体状态'} // 页面内权限
                },
                component: resolve => require(['@/view/ssp/media/manage'], resolve)
            },
            {
                path: '/ssp/app/manage',
                name: 'ssp-app-manage',
                meta: {
                    keepAlive: true,
                    title: '应用',
                    isShowAccess: true,
                    isResponsive: true,
                    inPageAccess: {'viewIndex': '首页', 'newAndEdit': '新建/编辑应用', 'status': '修改应用状态'} // 页面内权限
                },
                component: resolve => require(['@/view/ssp/app/manage'], resolve)
            },
            {
                path: '/ssp/app/edit',
                name: 'ssp-app-edit',
                meta: {
                    title: '新建应用',
                    targetHighLight: 'ssp-app-manage',
                    hideInMenu: true,
                    isResponsive: true
                },
                component: resolve => require(['@/view/ssp/app/edit'], resolve)
            },
            {
                path: '/ssp/slot/manage',
                name: 'ssp-slot-manage',
                meta: {
                    keepAlive: true,
                    title: '广告位',
                    isShowAccess: true,
                    isResponsive: true,
                    inPageAccess: {'viewIndex': '首页', 'newAndEdit': '新建/编辑广告位', 'status': '修改广告位状态'} // 页面内权限
                },
                component: resolve => require(['@/view/ssp/slot/manage'], resolve)
            },
            {
                path: '/ssp/slot/edit',
                name: 'ssp-slot-edit',
                meta: {
                    title: '新建广告位',
                    targetHighLight: 'ssp-slot-manage',
                    hideInMenu: true,
                    isResponsive: true
                },
                component: resolve => require(['@/view/ssp/slot/edit'], resolve)
            }
        ]
    },
    {
        path: '/agent', // 代理商管理
        name: 'agent',
        component: Main,
        meta: {
            title: '代理商管理',
            icon: 'left-bar-icon tool-tag'
        },
        children: [
            {
                path: '/agent/manage',
                name: 'agent-manage',
                meta: {
                    title: '代理商列表',
                    isResponsive: true,
                    isShowAccess: true,
                    inPageAccess: {'viewIndex': '首页', 'login': '伪登录', 'add': '新建代理商', 'resetPsw': '重置密码', 'pricex': '修改暗扣系数', 'edit': '编辑', 'view': '查看', 'status': '修改代理商状态'} // 页面内权限
                },
                component: resolve => require(['@/view/agent/manage'], resolve)
            },
            {
                path: '/agent/add',
                name: 'agent-add',
                meta: {
                    title: '新建代理商',
                    targetHighLight: 'agent-manage',
                    hideInMenu: true
                },
                component: resolve => require(['@/view/agent/add'], resolve)
            },
            {
                path: '/agent/infro',
                name: 'agent-infro',
                meta: {
                    title: '代理商账户信息',
                    targetHighLight: 'agent-manage',
                    hideInMenu: true
                },
                component: resolve => require(['@/view/agent/infro'], resolve)
            },
            {
                path: '/agent/edit',
                name: 'agent-edit',
                meta: {
                    title: '编辑代理商信息',
                    targetHighLight: 'agent-manage',
                    hideInMenu: true
                },
                component: resolve => require(['@/view/agent/edit'], resolve)
            }
        ]
    },
    {
        path: '/link', // 链接录入
        name: 'link-export',
        component: Main,
        redirect: '/link/export/manage',
        meta: {
            title: '链接录入',
            redirectTo: 'link-export-manage',
            icon: 'left-bar-icon link-export-tag'
        },
        children: [
            {
                path: '/link/export/manage',
                name: 'link-export-manage',
                meta: {
                    title: '链接录入',
                    isResponsive: true,
                    isShowAccess: true,
                    inPageAccess: {'viewIndex': '首页', 'export': '批量导入', 'download': '下载', 'delete': '删除'} // 页面内权限
                },
                component: resolve => require(['@/view/link-export/manage'], resolve)
            }
        ]
    },
    {
        path: '/income', // 广告主的花费数据
        name: 'income-manage',
        component: Main,
        redirect: '/income/manage',
        meta: {
            title: '数据导入',
            redirectTo: 'income-manage-index',
            icon: 'left-bar-icon income-tag'
        },
        children: [
            {
                path: '/income/manage',
                name: 'income-manage-index',
                meta: {
                    title: '数据导入',
                    isResponsive: true,
                    isShowAccess: true,
                    inPageAccess: {'viewIndex': '首页', 'export': '导入和重新导入', 'download': '下载'} // 页面内权限
                },
                component: resolve => require(['@/view/income/manage'], resolve)
            }
        ]
    },
    {
        path: '/audit', // 审核中心
        name: 'audit',
        component: Main,
        meta: {
            title: '审核中心',
            icon: 'left-bar-icon audit-tag'
        },
        children: [
            {
                path: '/audit/account/manage',
                name: 'audit-account-manage',
                meta: {
                    keepAlive: true,
                    title: '账户审核',
                    isShowAccess: true,
                    isResponsive: true,
                    inPageAccess: {'viewIndex': '首页', 'audit': '审核和复审', 'view': '查看'} // 页面内权限
                },
                component: resolve => require(['@/view/audit/account/manage'], resolve)
            },
            {
                path: '/audit/account/detail',
                name: 'audit-account-detail',
                meta: {
                    title: '账户审核页',
                    targetHighLight: 'audit-account-manage',
                    hideInMenu: true
                },
                component: resolve => require(['@/view/audit/account/detail'], resolve)
            },
            {
                path: '/audit/creative/manage',
                name: 'audit-creative-manage',
                meta: {
                    keepAlive: true,
                    title: '创意审核',
                    isShowAccess: true,
                    isResponsive: true,
                    inPageAccess: {'viewIndex': '首页', 'audit': '审核和复审', 'view': '查看'} // 页面内权限
                },
                component: resolve => require(['@/view/audit/creative/manage'], resolve)
            },
            {
                path: '/audit/creative/detail',
                name: 'audit-creative-detail',
                meta: {
                    title: '创意审核页',
                    targetHighLight: 'audit-creative-manage',
                    hideInMenu: true
                },
                component: resolve => require(['@/view/audit/creative/detail'], resolve)
            },
            {
                path: '/audit/log/account/manage', // 账户审核日志
                name: 'audit-log-account',
                meta: {
                    keepAlive: true,
                    title: '审核日志',
                    isShowAccess: true,
                    isResponsive: true,
                    inPageAccess: {'viewIndex': '首页', 'view': '查看'} // 页面内权限
                },
                component: resolve => require(['@/view/audit/log/account/manage'], resolve)
            },
            {
                path: '/audit/log/account/detail', // 账户审核详情页
                name: 'audit-log-detail',
                meta: {
                    title: '账户审核详情页',
                    targetHighLight: 'audit-log-account',
                    hideInMenu: true,
                    isShowAccess: false
                },
                component: resolve => require(['@/view/audit/log/account/detail'], resolve)
            },
            {
                path: '/audit/log/creative/manage',
                name: 'audit-log-creative',
                meta: {
                    keepAlive: true,
                    title: '审核日志',
                    hideInMenu: true,
                    targetHighLight: 'audit-log-account',
                    isResponsive: true
                },
                component: resolve => require(['@/view/audit/log/creative/manage'], resolve)
            },
            {
                path: '/audit/log/creative/detail', // 创意审核详情页
                name: 'creative-log-detail',
                meta: {
                    title: '创意审核详情页',
                    targetHighLight: 'audit-log-account',
                    hideInMenu: true,
                    isShowAccess: false
                },
                component: resolve => require(['@/view/audit/log/creative/detail'], resolve)
            }
        ]
    },
    {
        path: '/noice', // 通知中心
        name: 'noice',
        component: Main,
        meta: {
            title: '通知中心',
            icon: 'left-bar-icon notice-tag'
        },
        children: [
            {
                path: '/noice/system',
                name: 'noice-system',
                meta: {
                    title: '系统通知设置',
                    isShowAccess: true,
                    isResponsive: true,
                    inPageAccess: {'viewIndex': '首页', 'edit': '修改通知接收人'} // 页面内权限
                },
                component: resolve => require(['@/view/notice/system'], resolve)
            },
            {
                path: '/noice/client',
                name: 'noice-client',
                meta: {
                    title: '客户通知',
                    hideInMenu: true,
                    isResponsive: true,
                    inPageAccess: {'viewIndex': '首页', 'edit': '新建/重发/修改'} // 页面内权限
                },
                component: resolve => require(['@/view/notice/client'], resolve)
            }
        ]
    },
    {
        path: '/permission', // 账号权限
        name: 'permission',
        component: Main,
        meta: {
            title: '账号权限',
            icon: 'left-bar-icon data-tag'
        },
        children: [
            {
                path: '/permission/account/manage',
                name: 'permission-account',
                meta: {
                    title: '账号管理',
                    isShowAccess: true,
                    isResponsive: true,
                    inPageAccess: {'viewIndex': '首页', 'addEditDel': '新建/修改/删除账号', 'resetPsw': '重置密码'} // 页面内权限
                },
                component: resolve => require(['@/view/permission/account-manage'], resolve)
            },
            {
                path: '/permission/role/manage',
                name: 'permission-role',
                meta: {
                    title: '角色管理',
                    isShowAccess: true,
                    isResponsive: true,
                    inPageAccess: {'viewIndex': '首页', 'addEditDel': '新建/修改/删除角色'} // 页面内权限
                },
                component: resolve => require(['@/view/permission/role-manage'], resolve)
            },
            {
                path: '/permission/module/manage',
                name: 'admin-module',
                meta: {
                    title: '模块管理',
                    isShowAccess: true,
                    isResponsive: true,
                    inPageAccess: {'viewIndex': '首页', 'addEditDel': '新建/修改/删除模块'} // 页面内权限
                },
                component: resolve => require(['@/view/permission/module-manage'], resolve)
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
