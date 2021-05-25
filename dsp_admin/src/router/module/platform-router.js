/*****************投放平台路由***********************/
/*****************需要和管理平台实时更新***********************/
/*****************投放平台路由***********************/
/*****************投放平台路由***********************/

export const platAsyncRouterMap = [
    {
        name: 'home',
        meta: {
            title: '首页'
        },
        children: [
            {
                name: 'home-index',
                meta: {
                    title: '首页',
                    isShowAccess: true,
                    inPageAccess: {'viewIndex': '首页'} // 页面内权限
                }
            }
        ]
    },
    {
        name: 'advertising',
        meta: {
            title: '投放管理'
        },
        children: [
            {
                name: 'advertising-activity',
                meta: {
                    title: '广告活动',
                    isShowAccess: true,
                    inPageAccess: {'viewIndex': '首页', 'edit': '编辑', 'add': '新建广告活动', 'freqMonetStatus': '修改频次/预算额', 'status': '修改投放状态'} // 页面内权限
                }
            },
            {
                name: 'advertising-unit',
                meta: {
                    title: '广告单元',
                    isShowAccess: true,
                    inPageAccess: {'viewIndex': '首页', 'edit': '编辑', 'add': '新建广告单元', 'freqMonetPriceStatus': '修改频次/预算额/出价', 'status': '修改投放状态'} // 页面内权限
                },
            },
            {
                name: 'advertising-creative',
                meta: {
                    title: '广告',
                    isShowAccess: true,
                    inPageAccess: {'viewIndex': '首页', 'edit': '编辑', 'add': '新建广告', 'status': '修改投放状态'} // 页面内权限
                }
            }
        ]
    },
    {
        name: 'data',
        meta: {
            title: '数据报表'
        },
        children: [
            {
                name: 'effect-data',
                meta: {
                    title: '效果数据',
                    isShowAccess: true,
                    inPageAccess: {'viewIndex': '首页', 'downloadDay': '下载日报表', 'downloadHour': '下载小时报表'} // 页面内权限
                }
            },
            {
                name: 'data-ad-manage',
                meta: {
                    title: '广告位数据',
                    isShowAccess: true,
                    inPageAccess: {'viewIndex': '首页', 'download': '下载报表'} // 页面内权限
                }
            },
            {
                name: 'data-creative-manage',
                meta: {
                    title: '创意包数据',
                    isShowAccess: true,
                    inPageAccess: {'viewIndex': '首页', 'download': '下载报表'} // 页面内权限
                }
            },
            {
                name: 'data-material-manage',
                meta: {
                    title: '素材分析',
                    isShowAccess: true,
                    inPageAccess: {'viewIndex': '首页', 'download': '下载报表'} // 页面内权限
                }
            }
        ]
    },
    {
        name: 'tool',
        meta: {
            title: '工具'
        },
        children: [
            {
                name: 'tool-material',
                meta: {
                    title: '素材库',
                    isShowAccess: true,
                    inPageAccess: {'viewIndex': '首页', 'groupTagAdd': '素材组/素材标签管理', 'addMaterial': '上传素材', 'delete': '删除素材', 'modMeterialName': '修改素材名称'} // 页面内权限
                }
            },
            {
                name: 'tool-creative',
                meta: {
                    title: '创意包',
                    isShowAccess: true,
                    inPageAccess: {'viewIndex': '首页', 'newAndEdit': '新建/编辑创意包'} // 页面内权限
                }
            },
            {
                name: 'site-manage',
                meta: {
                    title: '转化跟踪', // 线索
                    isShowAccess: true,
                    inPageAccess: {'viewIndex': '首页', 'newAndEdit': '新建/编辑转化'} // 页面内权限
                }
            }
        ]
    },
    {
        name: 'financial-manage',
        meta: {
            title: '财务明细'
        },
        children: [
            {
                name: 'financial-manage-index',
                meta: {
                    title: '财务明细',
                    isShowAccess: true,
                    inPageAccess: {'viewIndex': '首页', 'download': '下载报表'} // 页面内权限
                }
            }
        ]
    },
    {
        name: 'infro',
        meta: {
            title: '账户中心'
        },
        children: [
            {
                name: 'infro-account',
                meta: {
                    title: '账户信息',
                    isShowAccess: true,
                    inPageAccess: {'viewIndex': '首页', 'save': '修改账户信息'} // 页面内权限
                }
            },
            {
                name: 'infro-reset-psw',
                meta: {
                    title: '修改密码',
                    isShowAccess: true,
                    inPageAccess: {'viewIndex': '首页', 'save': '修改密码'} // 页面内权限
                }
            }
        ]
    }
]
