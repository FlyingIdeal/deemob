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
                isResponsive: false,
                isShowAccess: true,
                inPageAccess: {'viewIndex': '首页', 'viewDetail': '查看详细数据'} // 页面内权限
            },
            component: resolve => require(['@/view/home/index'], resolve)
        }
    ]
},


{
    path: '/data', // 数据报表
    name: 'data',
    component: Main,
    meta: {
        title: '数据报表',
        hideInMenu: true,
        icon: 'left-bar-icon data-tag'
    },
    children: [
        {
            path: '/data/day/manage',
            name: 'data-day',
            meta: {
                title: '综合指数（天）',
                isShowAccess: true,
                isResponsive: true,
                inPageAccess: {'viewIndex': '首页', 'download': '下载报表'} // 页面内权限
            },
            component: resolve => require(['@/view/data/day/manage'], resolve)
        },
        {
            path: '/data/hour/manage',
            name: 'data-hour',
            meta: {
                title: '综合指数（时）',
                isShowAccess: true,
                isResponsive: true,
                inPageAccess: {'viewIndex': '首页', 'download': '下载报表'} // 页面内权限
            },
            component: resolve => require(['@/view/data/hour/manage'], resolve)
        },
        {
            path: '/data/mobile/manage',
            name: 'data-mobile',
            meta: {
                title: '手机品牌数据',
                isShowAccess: true,
                isResponsive: true,
                inPageAccess: {'viewIndex': '首页', 'download': '下载报表'} // 页面内权限
            },
            component: resolve => require(['@/view/data/mobile/manage'], resolve)
        },
        {
            path: '/data/network/manage',
            name: 'data-network',
            meta: {
                title: '联网方式数据',
                isShowAccess: true,
                isResponsive: true,
                inPageAccess: {'viewIndex': '首页', 'download': '下载报表'} // 页面内权限
            },
            component: resolve => require(['@/view/data/network/manage'], resolve)
        }
    ]
},



{
    path: '/financial', // 财务管理
    name: 'financial',
    component: Main,
    meta: {
        title: '财务管理',
        hideInMenu: true,
        icon: 'left-bar-icon data-tag'
    },
    children: [
        {
            path: '/financial/detail/manage',
            name: 'financial-detail',
            meta: {
                title: '财务信息',
                isShowAccess: true,
                isResponsive: true,
                inPageAccess: {'viewIndex': '首页', 'download': '下载报表'} // 页面内权限
            },
            component: resolve => require(['@/view/financial/detail/manage'], resolve)
        },
        {
            path: '/financial/infro/manage',
            name: 'financial-infro',
            meta: {
                title: '财务明细',
                isShowAccess: true,
                isResponsive: true,
                inPageAccess: {'viewIndex': '首页', 'download': '下载报表'} // 页面内权限
            },
            component: resolve => require(['@/view/financial/infro/manage'], resolve)
        },
        {
            path: '/financial/fin-audit/manage',
            name: 'fin-audit-manage',
            meta: {
                title: '财务审核',
                isShowAccess: true,
                isResponsive: true,
                inPageAccess: {'viewIndex': '首页', 'download': '下载报表'} // 页面内权限
            },
            component: resolve => require(['@/view/financial/financial-audit/manage'], resolve)
        },
        {
            path: '/financial/fin-audit/add-credit',
            name: 'fin-audit-credit',
            meta: {
                title: '充值审核',
                isShowAccess: true,
                isResponsive: true,
                hideInMenu: true,
                inPageAccess: {'viewIndex': '首页', 'download': '下载报表'} // 页面内权限
            },
            component: resolve => require(['@/view/financial/financial-audit/add-credit'], resolve)
        },
        {
            path: '/financial/fin-audit/refund',
            name: 'fin-audit-refund',
            meta: {
                title: '退款审批',
                isShowAccess: true,
                isResponsive: true,
                hideInMenu: true,
                inPageAccess: {'viewIndex': '首页', 'download': '下载报表'} // 页面内权限
            },
            component: resolve => require(['@/view/financial/financial-audit/refund'], resolve)
        },
        {
            path: '/financial/fin-audit/invoice',
            name: 'fin-audit-invoice',
            meta: {
                title: '开票审核',
                isShowAccess: true,
                isResponsive: true,
                hideInMenu: true,
                inPageAccess: {'viewIndex': '首页',  'download': '下载报表'} // 页面内权限
            },
            component: resolve => require(['@/view/financial/financial-audit/invoice'], resolve)
        }
    ]
},