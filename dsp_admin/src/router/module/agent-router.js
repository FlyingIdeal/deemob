/*****************代理商平台路由***********************/
/*****************需要和管理平台实时更新***********************/
/*****************代理商平台路由***********************/
/*****************代理商平台路由***********************/

export const agentAsyncRouterMap = [
    {
        name: 'dsp',
        meta: {
            title: '广告主管理'
        },
        children: [
            {
                name: 'dsp-manage',
                meta: {
                    title: '广告主列表',
                    isShowAccess: true,
                    inPageAccess: {'viewIndex': '首页', 'login': '伪登录', 'edit': '编辑', 'view': '查看',  'resetPsw': '重置密码', 'add': '新建广告主', 'download': '下载广告主列表', 'status': '修改投放状态'} // 页面内权限
                }
            }
        ]
    },

    {
        name: 'account-manage',
        meta: {
            title: '账户中心'
        },
        children: [
            {
                name: 'account-info',
                meta: {
                    title: '账户资质',
                    isShowAccess: true,
                    inPageAccess: {'viewIndex': '首页', 'save': '修改账户资质'} // 页面内权限
                }
            },
            {
                name: 'account-psw',
                meta: {
                    title: '修改密码',
                    isShowAccess: true,
                    inPageAccess: {'viewIndex': '首页', 'save': '修改密码'} // 页面内权限
                }
            }
        ]
    }
]
