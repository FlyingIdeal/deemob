/**
 * [媒体列表]
 * @param  {[type]} self [description]
 * @return {[type]}      [description]
 */
export const meidaCols = (self) => {
	return [
        {
            title: '代理商ID',
            key: 'agentid',
            width: 100
        },
        {
            title: '代理商名称',
            slot: 'agentname',
            minWidth: 250
        },
        {
            title: '状态',
            slot: 'status',
            width: 120
        },
        {
            title: '公司名称',
            slot: 'company_name',
            minWidth: 250
        },
        {
            title: '法人姓名',
            key: 'legal_person',
            minWidth: 100
        },
        {
            title: '付款制度',
            slot: 'strategy',
            minWidth: 100
        },
        {
            title: '测试流量',
            slot: 'allow_test_slot',
            minWidth: 100
        },
        {
            title: '账户余额(元)',
            slot: 'deposit',
            minWidth: 120
        },
        {
            title: 'RTA类型',
            slot: 'is_rta',
            width: 80
        },
        {
            title: '暗扣系数',
            slot: 'agent_price_X',
            width: 80
        },
        {
            title: '创建时间',
            key: 'c_time',
            width: 170
        },
        {
            title: '更新时间',
            key: 'm_time',
            width: 170
        },
        {
            title: '停用原因',
            slot: 'note',
            width: 200
        },
        {
            title: '操作',
            width: 150,
            fixed: 'right',
            slot: 'handle'
        }
    ]
}
