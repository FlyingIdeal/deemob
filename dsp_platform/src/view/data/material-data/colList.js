/**
 * [素材分析数据 - 天]
 * @param  {[type]} self [description]
 * @return {[type]}      [description]
 */
export const matterDayColumns = (self) => {
  return [
    // 数据维度
    // groupKey 聚合名称
    {title: '日期', key: 'date', slot: 'date', groupKey: 'date', width: 100, minWidth: 100, sortable: 'custom', isCheckColumn: true},
    {title: '素材缩略图', key: 'material_link', groupKey: 'material_link', slot: 'material_link', minWidth: 120, className: 'thumbnail-column'},
    {title: '素材名称', key: 'material_name', groupKey: 'material_name', slot: 'material_name', minWidth: 120},
    {title: '素材ID', key: 'material_id', groupKey: 'material_id', slot: 'material_id', minWidth: 100},
    {title: '素材组', key: 'material_group_name', groupKey: 'material_group_name', slot: 'material_group_name', minWidth: 100},

    {title: '广告展现', key: 'view', slot: 'view', minWidth: 130, sortable: 'custom', needCalcThou: true, effectDayChart: true, unit: '次', isCheckColumn: true},
    {title: '广告点击', key: 'click', slot: 'click', minWidth: 130, sortable: 'custom', needCalcThou: true, effectDayChart: true, unit: '次', isCheckColumn: true},
    {title: '点击率', key: 'ctr', slot: 'ctr', minWidth: 130, sortable: 'custom', needCalcThou: true, effectDayChart: true, unit: '%', isCheckColumn: true},
    {title: '花费', key: 'report_spend', slot: 'report_spend', minWidth: 130, sortable: 'custom', needCalcThou: true, effectDayChart: true, unit: '元', isCheckColumn: true},
    {title: '千次展现均价', key: 'ecpm', slot: 'ecpm', minWidth: 130, sortable: 'custom', needCalcThou: true, effectDayChart: true, unit: '元', isCheckColumn: true},
    {title: '点击均价', key: 'cpc', slot: 'cpc', minWidth: 130, sortable: 'custom', needCalcThou: true, effectDayChart: true, unit: '元', isCheckColumn: true}
  ]
}

/**
 * [素材分析数据 - 时]
 * @param  {[type]} self [description]
 * @return {[type]}      [description]
 */
export const matterHourColumns = (self) => {
  return [
    // 数据维度
    // groupKey 聚合名称
    {title: '时间', key: 'hour', slot: 'hour', groupKey: 'hour', width: 80, minWidth: 80, sortable: 'custom', isCheckColumn: true},
    {title: '素材缩略图', key: 'material_link', groupKey: 'material_link', slot: 'material_link', minWidth: 120, className: 'thumbnail-column'},
    {title: '素材名称', key: 'material_name', groupKey: 'material_name', slot: 'material_name', minWidth: 120},
    {title: '素材ID', key: 'material_id', groupKey: 'material_id', slot: 'material_id', minWidth: 100},
    {title: '素材组', key: 'material_group_name', groupKey: 'material_group_name', slot: 'material_group_name', minWidth: 100},

    {title: '广告展现', key: 'view', slot: 'view', minWidth: 130, sortable: 'custom', needCalcThou: true, effectDayChart: true, unit: '次', isCheckColumn: true},
    {title: '广告点击', key: 'click', slot: 'click', minWidth: 130, sortable: 'custom', needCalcThou: true, effectDayChart: true, unit: '次', isCheckColumn: true},
    {title: '点击率', key: 'ctr', slot: 'ctr', minWidth: 130, sortable: 'custom', needCalcThou: true, effectDayChart: true, unit: '%', isCheckColumn: true},
    {title: '花费', key: 'report_spend', slot: 'report_spend', minWidth: 130, sortable: 'custom', needCalcThou: true, effectDayChart: true, unit: '元', isCheckColumn: true},
    {title: '千次展现均价', key: 'ecpm', slot: 'ecpm', minWidth: 130, sortable: 'custom', needCalcThou: true, effectDayChart: true, unit: '元', isCheckColumn: true},
    {title: '点击均价', key: 'cpc', slot: 'cpc', minWidth: 130, sortable: 'custom', needCalcThou: true, effectDayChart: true, unit: '元', isCheckColumn: true}
  ]
}
