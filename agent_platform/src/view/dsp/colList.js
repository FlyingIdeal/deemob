/**
 * [媒体列表]
 * @param  {[type]} self [description]
 * @return {[type]}      [description]
 */
export const advManageCols = (self) => {
	return [
		{
            type: 'selection',
            width: 50,
            fixed: 'left',
            align: 'center'
        },
		{
			title: '广告主ID',
			key: 'advertiserid',
			width: 80
		},
		{
			title: '广告主名称',
			slot: 'advertisername',
			minWidth: 200
		},
		{
			title: '广告主状态',
			slot: 'status',
			width: 120
		},
		{
			title: '公司名称',
			slot: 'company_name',
			minWidth: 200
		},
		{
			title: '行业类型',
			slot: 'category',
			minWidth: 200
		},
		{
			title: '邮箱',
			key: 'email',
			minWidth: 200
		},
		{
			title: '法人姓名',
			key: 'legal_person',
			minWidth: 200
		},
		{
			title: '手机号',
			key: 'mobile',
			width: 150
		},
		{
			title: '账户余额(元)',
			slot: 'deposit',
			width: 150
		},
		{
			title: '结算系数',
			slot: 'adv_price_X',
			width: 150
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
			slot: 'status_desc',
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

/**
 * [资质]
 * @param  {[type]} self [description]
 * @return {[type]}      [description]
 */
export const getAptitudeCols = (self) => {
	return [
		{
			title: '资质类型',
			slot: 'qualification_type',
			width: 132
		},
		{
			title: '是否必填',
			slot: 'required',
			width: 65
		},
		{
			title: '资质说明',
			slot: 'qualification_desc',
			width: 210
		},
		{
			title: '资质文件',
			slot: 'qualification_url',
			width: 180
		},
		{
			title: '资质有效期',
			slot: 'data',
			width: 210
		},
		{
			title: '备注',
			slot: 'comment',
			width: 140
		},
		{
			title: '操作',
			slot: 'action',
			width: 60,
			align: 'center'
		}
	]
}
/**
 * [资质查看]
 * @param  {[type]} self [description]
 * @return {[type]}      [description]
 */
export const getAptitudeSee = (self) => {
  return [
    {
      title: '资质类型',
      slot: 'qualification_type',
      width: 132
    },
    {
      title: '是否必填',
      slot: 'required',
      width: 85
    },
    {
      title: '资质说明',
      slot: 'qualification_desc',
      width: 265
    },
    {
      title: '资质文件',
      slot: 'qualification_url',
      width: 200
    },
    {
      title: '资质有效期',
      slot: 'data',
      width: 210
    },
    {
      title: '备注',
      slot: 'comment',
      width: 140
    }
  ]
}
