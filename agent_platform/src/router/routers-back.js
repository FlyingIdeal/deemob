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
            title: '营销概况',
            redirectTo: 'home-index',
            icon: 'left-bar-icon home-tag',
            hideInMenu: true
        },
        children: [
            {
                path: '/home',
                name: 'home-index',
                meta: {
                    title: '营销概况',
                    isResponsive: false
                },
                component: resolve => require(['@/view/home/index'], resolve)
            }
        ]
    },
    {
        path: '/dsp', // 广告主管理
        name: 'dsp',
        component: Main,
        meta: {
            title: '广告主管理',
            icon: 'left-bar-icon tool-tag'
        },
        children: [
            {
                path: '/dsp/manage',
                name: 'dsp-manage',
                meta: {
                    title: '广告主列表',
                    isResponsive: true
                },
                component: resolve => require(['@/view/dsp/manage'], resolve)
            },
            {
                path: '/dsp/add',
                name: 'dsp-add',
                meta: {
                    title: '新建广告主',
                    targetHighLight: 'dsp-manage',
                    isResponsive: true,
                    hideInMenu: true
                },
                component: resolve => require(['@/view/dsp/add'], resolve)
            },
            {
                path: '/dsp/edit',
                name: 'dsp-edit',
                meta: {
                    title: '编辑广告主',
                    targetHighLight: 'dsp-manage',
                    isResponsive: true,
                    hideInMenu: true
                },
                component: resolve => require(['@/view/dsp/edit'], resolve)
            },
            {
                path: '/dsp/infro',
                name: 'dsp-infro',
                meta: {
                    title: '广告主账户信息',
                    targetHighLight: 'dsp-manage',
                    isResponsive: true,
                    hideInMenu: true
                },
                component: resolve => require(['@/view/dsp/infro'], resolve)
            }
        ]
    },
    {
        path: '/data', // 数据报表
        name: 'data',
        component: Main,
        meta: {
            title: '数据报表',
            icon: 'left-bar-icon data-tag',
            hideInMenu: true
        },
        children: [
            {
                path: '/data/agent/manage',
                name: 'data-agent',
                meta: {
                    title: '代理商数据',
                    isResponsive: true,
                },
                component: resolve => require(['@/view/data/agent/manage'], resolve)
            },
            {
                path: '/data/dsp/manage',
                name: 'data-dsp',
                meta: {
                    title: '广告主数据',
                    isResponsive: true
                },
                component: resolve => require(['@/view/data/dsp/manage'], resolve)
            }
        ]
    },
    {
        path: '/financial', // 财务中心
        name: 'financial',
        component: Main,
        meta: {
            title: '财务中心',
            icon: 'left-bar-icon data-tag',
            hideInMenu: true
        },
        children: [
            {
                path: '/financial/detail/manage',
                name: 'financial-detail',
                meta: {
                    title: '财务管理',
                    isResponsive: true
                },
                component: resolve => require(['@/view/financial/detail/manage'], resolve)
            },
            {
                path: '/financial/infro/manage',
                name: 'financial-infro',
                meta: {
                    title: '财务明细',
                    isResponsive: true
                },
                component: resolve => require(['@/view/financial/infro/manage'], resolve)
            },
            {
                path: '/financial/fin-audit/manage',
                name: 'fin-audit-manage',
                meta: {
                    title: '财务申请单',
                    isResponsive: true
                },
                component: resolve => require(['@/view/financial/financial-audit/manage'], resolve)
            },
            {
                path: '/financial/fin-audit/invoice',
                name: 'fin-audit-invoice',
                meta: {
                    title: '发票开具',
                    isResponsive: true
                },
                component: resolve => require(['@/view/financial/financial-audit/invoice'], resolve)
            }
        ]
    },
    {
        path: '/staff', // 员工管理
        name: 'staff',
        component: Main,
        meta: {
            title: '员工管理',
            icon: 'left-bar-icon staff-tag',
            hideInMenu: true
        },
        children: [
            {
                path: '/staff/role/manage',
                name: 'staff-role',
                meta: {
                    title: '角色管理',
                    isResponsive: true
                },
                component: resolve => require(['@/view/staff/role-manage'], resolve)
            },
            {
                path: '/staff/account/manage',
                name: 'staff-account',
                meta: {
                    title: '员工账号',
                    isResponsive: true
                },
                component: resolve => require(['@/view/staff/account-manage'], resolve)
            },

        ]
    },
    {
        path: '/account', // 账户中心
        name: 'account-manage',
        component: Main,
        meta: {
            title: '账户中心',
            icon: 'left-bar-icon account-tag'
        },
        children: [
            {
                path: '/account/info',
                name: 'account-info',
                meta: {
                    title: '账户资质',
                    isShowAccess: true,
                    isResponsive: false,
                    inPageAccess: {'viewIndex': '首页'} // 页面内权限
                },
                component: resolve => require(['@/view/account/info'], resolve)
            },
            {
                path: '/account/reset/psw',
                name: 'account-psw',
                meta: {
                    title: '修改密码',
                    isShowAccess: true,
                    isResponsive: false,
                    inPageAccess: {'viewIndex': '首页'} // 页面内权限
                },
                component: resolve => require(['@/view/account/changePsw'], resolve)
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
