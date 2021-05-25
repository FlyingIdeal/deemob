/**
 * [效果数据 - 天]
 * @param  {[type]} self [description]
 * @return {[type]}      [description]
 */
export const effectDayColumns = (self) => {
	return [
		// 数据维度
		// groupKey 聚合名称
		{title: '日期', key: 'date', slot: 'date', groupKey: 'date', width: 100, minWidth: 100, sortable: 'custom', isCheckColumn: true},
        {title: '广告活动ID', key: 'campaignid', groupKey: 'campaignid', slot: 'campaignid', minWidth: 100},
        {title: '广告活动', key: 'campaignname', groupKey: 'campaignid', slot: 'campaignname', minWidth: 270},
        {title: '广告单元ID', key: 'orderid', groupKey: 'orderid', slot: 'orderid', minWidth: 100},
        {title: '广告单元', key: 'ordername', groupKey: 'orderid', slot: 'ordername', minWidth: 270},
        {title: '广告ID', key: 'adid', groupKey: 'adid', slot: 'adid', minWidth: 100},
		    {title: '广告', key: 'creativename', groupKey: 'adid', slot: 'creativename', minWidth: 270},
		    {title: '素材ID', key: 'matterID', slot: 'matterID', minWidth: 100},

		{title: '广告展现', key: 'view', slot: 'view', minWidth: 130, sortable: 'custom', needCalcThou: true, effectDayChart: true, unit: '次', isCheckColumn: true},
		{title: '广告点击', key: 'click', slot: 'click', minWidth: 130, sortable: 'custom', needCalcThou: true, effectDayChart: true, unit: '次', isCheckColumn: true},
		{title: '点击率', key: 'ctr', slot: 'ctr', minWidth: 130, sortable: 'custom', effectDayChart: true, unit: '%', isCheckColumn: true},
		{title: '到达数', key: 'reach', slot: 'reach', minWidth: 130, sortable: 'custom', needCalcThou: true, effectDayChart: true, unit: '次'},
		{title: '到达率', key: 'reach_rate', slot: 'reach_rate', minWidth: 130, sortable: 'custom', effectDayChart: true, unit: '%'},
		{title: '转化数', key: 'action', slot: 'action', minWidth: 130, sortable: 'custom', needCalcThou: true, effectDayChart: true, unit: '次'},
		{title: '转化率', key: 'action_rate', slot: 'action_rate', minWidth: 130, sortable: 'custom', effectDayChart: true, unit: '%'},
		{title: '花费', key: 'report_spend', slot: 'report_spend', minWidth: 130, sortable: 'custom', needCalcThou: true, effectDayChart: true, unit: '元', isCheckColumn: true},
		{title: '千次展现均价', key: 'ecpm', slot: 'ecpm', minWidth: 130, sortable: 'custom', needCalcThou: true, effectDayChart: true, unit: '元', isCheckColumn: true},
		{title: '点击均价', key: 'cpc', slot: 'cpc', minWidth: 130, sortable: 'custom', needCalcThou: true, effectDayChart: true, unit: '元', isCheckColumn: true}
	]
}

/**
 * [效果数据 - 时]
 * @param  {[type]} self [description]
 * @return {[type]}      [description]
 */
export const effectHourColumns = (self) => {
	return [
		// 数据维度
		// groupKey 聚合名称
		{title: '时间', key: 'date', slot: 'date', groupKey: 'date', width: 80, minWidth: 80, sortable: 'custom', isCheckColumn: true},
        {title: '广告活动ID', key: 'campaignid', groupKey: 'campaignid', slot: 'campaignid', minWidth: 100},
        {title: '广告活动', key: 'campaignname', groupKey: 'campaignid', slot: 'campaignname', minWidth: 270},
        {title: '广告单元ID', key: 'orderid', groupKey: 'orderid', slot: 'orderid', minWidth: 100},
        {title: '广告单元', key: 'ordername', groupKey: 'orderid', slot: 'ordername', minWidth: 270},
        {title: '广告ID', key: 'adid', groupKey: 'adid', slot: 'adid', minWidth: 100},
        {title: '广告', key: 'creativename', groupKey: 'adid', slot: 'creativename', minWidth: 270},
        {title: '素材ID', key: 'matterID', slot: 'matterID', minWidth: 100},

		{title: '广告展现', key: 'view', slot: 'view', minWidth: 130, sortable: 'custom', needCalcThou: true, effectHourChart: true, unit: '次', isCheckColumn: true},
		{title: '广告点击', key: 'click', slot: 'click', minWidth: 130, sortable: 'custom', needCalcThou: true, effectHourChart: true, unit: '次', isCheckColumn: true},
		{title: '点击率', key: 'ctr', slot: 'ctr', minWidth: 130, sortable: 'custom', effectHourChart: true, unit: '%', isCheckColumn: true},
		{title: '到达数', key: 'reach', slot: 'reach', minWidth: 130, sortable: 'custom', needCalcThou: true, effectHourChart: true, unit: '次'},
		{title: '到达率', key: 'reach_rate', slot: 'reach_rate', minWidth: 130, sortable: 'custom', effectHourChart: true, unit: '%'},
		{title: '转化数', key: 'action', slot: 'action', minWidth: 130, sortable: 'custom', needCalcThou: true, effectHourChart: true, unit: '次'},
		{title: '转化率', key: 'action_rate', slot: 'action_rate', minWidth: 130, sortable: 'custom', effectHourChart: true, unit: '%'},
		{title: '花费', key: 'report_spend', slot: 'report_spend', minWidth: 130, sortable: 'custom', needCalcThou: true, effectHourChart: true, unit: '元', isCheckColumn: true},
		{title: '千次展现均价', key: 'ecpm', slot: 'ecpm', minWidth: 130, sortable: 'custom', needCalcThou: true, effectHourChart: true, unit: '元', isCheckColumn: true},
		{title: '点击均价', key: 'cpc', slot: 'cpc', minWidth: 130, sortable: 'custom', needCalcThou: true, effectHourChart: true, unit: '元', isCheckColumn: true}
	]
}
