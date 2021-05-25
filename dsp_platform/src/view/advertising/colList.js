export const getActiveCols = (self) => {
	return [
		{
			type: 'selection',
			width: 50,
			align: 'center',
			fixed: 'left',
			isHideInColumn: true
		},
		{title: '广告活动ID', key: 'campaignid', width: 100, isCheckColumn: true},
		{title: '广告活动名称', slot: 'campaignname', minWidth: 250, isHideInColumn: true},
		{title: '投放状态', slot: 'status', width: 100, isCheckColumn: true},
		{title: '审核状态', slot: 'internal_verify', width: 120, isCheckColumn: true},
		{title: '预算额', slot: 'budget', minWidth: 180, isCheckColumn: true},
		{title: '频控设置', slot: 'freq_type', minWidth: 100, isCheckColumn: true},
		{title: '频控类别', slot: 'freq_vc', minWidth: 100, isCheckColumn: true},
		{title: '频次', slot: 'freq', minWidth: 100, isCheckColumn: true},
		{title: '今日花费', slot: 'spend_today', minWidth: 100, isCheckColumn: true},
		// {title: '总花费', slot: 'spend', minWidth: 100},
		{title: '广告展现', slot: 'view', minWidth: 100 },
		{title: '广告点击', slot: 'click', minWidth: 100},
		{title: '点击率', slot: 'ctr', minWidth: 100},
		{title: '到达数', slot: 'reach', minWidth: 100},
		{title: '到达率', slot: 'reach_rate', minWidth: 100},
		{title: '转化数', slot: 'action', minWidth: 100},
		{title: '转化率', slot: 'action_rate', minWidth: 100},
		{title: '千次展现均价', slot: 'ecpm', minWidth: 120},
		{title: '点击均价', slot: 'cpc', minWidth: 120},
		{title: '创建时间', slot: 'createTime', minWidth: 170},
		{title: '更新时间', slot: 'updateTime', minWidth: 170},
		{
			title: '操作',
			slot: 'operate',
			fixed: 'right',
			width: 140,
			align: 'center',
			isHideInColumn: true
		}
	]
}
export const getUnitCols = (self) => {
	return [
		{
			type: 'selection',
			width: 50,
			align: 'center',
			fixed: 'left',
			isHideInColumn: true
		},
		{title: '广告单元ID', key: 'orderid', width: 100, isCheckColumn: true},
		{title: '广告单元名称', slot: 'ordername', minWidth: 250, isHideInColumn: true},
		{title: '广告活动名称', slot: 'campaignname', minWidth: 250},
		{title: '广告位ID', slot: 'adslotid_in', minWidth: 250},
		{title: '创意形式', slot: 'creative_type', minWidth: 250, isCheckColumn: true},
		{title: '投放状态', slot: 'status', minWidth: 100, isCheckColumn: true},
		{title: '审核状态', slot: 'internal_verify', width: 120, isCheckColumn: true},
		{title: '预算额', slot: 'budget', minWidth: 180, isCheckColumn: true},
		{title: '频控类别', slot: 'freq_vc', minWidth: 100, isCheckColumn: true},
		{title: '频次', slot: 'freq', minWidth: 120, isCheckColumn: true},
		{title: '今日花费', slot: 'spend_today', minWidth: 120, isCheckColumn: true},
		// {title: '总花费', slot: 'spend', minWidth: 100},
		{title: '广告展现', slot: 'view', minWidth: 100 },
		{title: '广告点击', slot: 'click', minWidth: 100},
		{title: '点击率', slot: 'ctr', minWidth: 100},
		{title: '到达数', slot: 'reach', minWidth: 100},
		{title: '到达率', slot: 'reach_rate', minWidth: 100},
		{title: '转化数', slot: 'action', minWidth: 100},
		{title: '转化率', slot: 'action_rate', minWidth: 100},
		{title: '千次展现均价', slot: 'ecpm', minWidth: 120},
		{title: '点击均价', slot: 'cpc', minWidth: 120},
		{title: '出价', slot: 'bidprice', minWidth: 120, isCheckColumn: true},
		{title: '投放日期', slot: 'putTime', minWidth: 190},
		{title: '创建时间', slot: 'createTime', minWidth: 170},
		{title: '更新时间', slot: 'updateTime', minWidth: 170},
		{
			title: '操作',
			slot: 'operate',
			fixed: 'right',
			width: 140,
			align: 'center',
			isHideInColumn: true
		}
	]
}
export const getTailCols = (self) => {
	return [
		{title: '转化ID', key: 'sid', minWidth: 100},
		{title: '转化名称', key: 'site_name', minWidth: 120},
		{title: '转化目标', key: 'site_target', minWidth: 120},
		{
			title: '操作',
			slot: 'action',
			width: 120,
			align: 'center',
			isHideInColumn: true
		}
	]
}
export const formRules = {
	data() {
		const freq = (rule, value, callback) => {
			let arr = this.editUnit.freq
			let showTxt = ''
			if (!arr || arr < 1 || arr > 10000 || arr % 1 !== 0) {
				showTxt = '频次必须是大于0小于等于10000的整数'
			}
			if (showTxt) {
				callback(new Error(showTxt))
			} else {
				callback()
			}
		}
		const budget = (rule, value, callback) => {
			let arr = this.editUnit.budget
			let showTxt = ''
			if (arr < 0 || arr > 100000000) {
				showTxt = '预算额大于0小于等于1亿'
			}
			if (!/^\d+(\.\d{1,2})?$/.test(arr)) {
				showTxt = '预算额大于0小于等于1亿，最多可填2位小数'
			}
			if (showTxt) {
				callback(new Error(showTxt))
			} else {
				callback()
			}
		}
		const bidprice = (rule, value, callback) => {
			let arr = this.editUnit.bidprice
			let showTxt = ''
			if (arr < 0 || arr > 100000000) {
				showTxt = '出价大于0小于等于1亿'
			}
			if (!/^\d+(\.\d{1,2})?$/.test(arr)) {
				showTxt = '出价最多可填2位小数'
			}
			if (showTxt) {
				callback(new Error(showTxt))
			} else {
				callback()
			}
		}
		const retargetIn = (rule, value, callback) => {
			let arr = this.editUnit.retarget_in
			let status = this.editUnit.tag_orientation
			let showTxt = ''
			if (status === 2 && arr.length === 0) {
				showTxt = '请至少填写一个人群定向'
			}
			if (showTxt) {
				callback(new Error(showTxt))
			} else {
				callback()
			}
		}
		return {
			rules: {
				billing_method: [
					{required: true, message: '请选择结算方式'}
				],
				campaign_id: [
					{required: true, message: '请选择广告活动名称'}
				],
				order_name: [
					{required: true, message: '请填写广告单元名称'},
					{max: 100, message: '广告单元名称不能超过100字'}
				],
				ad_interactive: [
					{required: true, message: '请选择广告交互'}
				],
				creative_type: [
					{required: true, message: '请选择广告'}
				],
				tag_orientation: [
					{required: true, message: '请填写人群定向'}
				],
				budget: [
					{required: true, message: '请输入预算金额'},
					{validator: budget}
				],
				freq_vc: [
					{required: true, message: '请选择频控类别'}
				],
				freq: [
					{required: true, message: '请输入频次控制次数'},
					{validator: freq}
				],
				bidprice: [
					{required: true, message: '请输入出价'},
					{validator: bidprice}
				],
				any_time: [
					{required: true, message: '请选择对应的时段'}
				],
				begin_date: [
					{required: true, message: '请选择开始时间'}
				],
				end_date: [
					{required: true, message: '请选择结束时间'},
					{type: 'date',
						validator: (rule, value, callback) => {
							let start = this.editUnit.begin_date
							if (value < start) {
								callback(new Error('结束时间不能小于开始时间'))
							} else {
								callback()
							}
						}
					}
				],
				putin_method: [
					{required: true, message: '请选择投放方式'}
				],
				joomob_adslotid_in: [
					{required: true, message: '请选择广告位'}
				],
				regionStatus: [
					{required: true, message: '请选择地域'}
				],
				os_in: [
					{required: true, message: '请选择用户操作系统'}
				],
				brandStatus: [
					{required: true, message: '请选择手机品牌'}
				],
				network_in: [
					{required: true, message: '请选择联网方式'}
				],
				carrier_in: [
					{required: true, message: '请选择运营商'}
				]
			},
			rulesFrep: {
				billing_method: [
					{required: true, message: '请选择结算方式'}
				],
				campaign_id: [
					{required: true, message: '请选择广告活动名称'}
				],
				tag_orientation: [
					{required: true, message: '请填写人群定向'}
				],
				order_name: [
					{required: true, message: '请填写广告单元名称'},
          {max: 100, message: '广告单元名称不能超过100字'}
				],
				ad_interactive: [
					{required: true, message: '请选择广告交互'}
				],
				creative_type: [
					{required: true, message: '请选择广告'}
				],
				budget: [
					{required: true, message: '请输入预算金额'},
					{validator: budget}
				],
				bidprice: [
					{required: true, message: '请输入出价'},
					{validator: bidprice}
				],
				any_time: [
					{required: true, message: '请选择对应的时段'}
				],
				begin_date: [
					{required: true, message: '请选择开始时间'}
				],
				end_date: [
					{required: true, message: '请选择结束时间'},
					{type: 'date',
						validator: (rule, value, callback) => {
							let start = this.editUnit.begin_date
							if (value < start) {
								callback(new Error('结束时间不能小于开始时间'))
							} else {
								callback()
							}
						}
					}
				],
				putin_method: [
					{required: true, message: '请选择投放方式'}
				],
				joomob_adslotid_in: [
					{required: true, message: '请选择广告位'}
				],
				regionStatus: [
					{required: true, message: '请选择地域'}
				],
				os_in: [
					{required: true, message: '请选择用户操作系统'}
				],
				brandStatus: [
					{required: true, message: '请选择手机品牌'}
				],
				network_in: [
					{required: true, message: '请选择联网方式'}
				],
				carrier_in: [
					{required: true, message: '请选择运营商'}
				]
			}
		}
	}
}

/**
 * [创意数据]
 * @param  {[type]} self [description]
 * @return {[type]}      [description]
 */
export const getCreateCols = (self) => {
	return [
		{
			type: 'selection',
			width: 50,
			align: 'center',
			isHideInColumn: true
		},
		{title: '广告ID', key: 'adid', width: 100, isCheckColumn: true},
		{title: '广告名称', slot: 'adname', minWidth: 250, isCheckColumn: true, isHideInColumn: true},
		{title: '广告单元名称', slot: 'ordername', minWidth: 250, isCheckColumn: true},
		{title: '广告活动名称', slot: 'campaignname', minWidth: 250, isCheckColumn: true},
		{title: '创意形式', slot: 'creative_type', minWidth: 220, isCheckColumn: true},
		{title: '创意包ID', key: 'buyer_creativeid', width: 100, isCheckColumn: true},
		{title: '素材ID', slot: 'materials', minWidth: 180, isCheckColumn: true},

		// {title: '广告展现', key: 'view', minWidth: 120},
		// {title: '广告点击', key: 'click', minWidth: 120},
		// {title: '点击率', key: 'ctr', minWidth: 120},
		// {title: '到达数', key: 'reach', minWidth: 120},
		// {title: '到达率', key: 'reach_rate', minWidth: 120},
		// {title: '转化数', key: 'action', minWidth: 120},
		// {title: '转化率', key: 'action_rate', minWidth: 120},

		// {title: '千次展现均价', key: 'ecpm', minWidth: 120},
		// {title: '点击均价', key: 'cpc', minWidth: 120},
		// {title: '今日花费', key: 'spend_today', minWidth: 120, isCheckColumn: true},

		{title: '投放状态', slot: 'status', width: 100, isCheckColumn: true},
		{title: '审核状态', slot: 'audit_status', width: 100, isCheckColumn: true},
		{title: '创建时间', slot: 'createTime', width: 170, isCheckColumn: true},
		{title: '更新时间', slot: 'updateTime', width: 170, isCheckColumn: true},
		{
			title: '操作',
			slot: 'handle',
			width: 100,
			fixed: 'right',
			align: 'center',
			isHideInColumn: true
		}
	]
}
