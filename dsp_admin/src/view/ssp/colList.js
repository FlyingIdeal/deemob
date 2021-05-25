/**
 * [媒体列表]
 * @param  {[type]} self [description]
 * @return {[type]}      [description]
 */
export const meidaCols = (self) => {
	return [
        {
            type: 'selection',
            width: 50,
            align: 'center'
        },
        {
            title: '媒体名称/ID',
            slot: 'name'
        },
        {
            title: '媒体简称全拼',
            key: 'alias',
        },
        {
            title: '状态',
            slot: 'status',
            width: 100
        },
        {
            title: '创建时间',
            key: 'created_at',
            width: 170
        },
        {
            title: '更新时间',
            key: 'updated_at',
            width: 170
        },
        {
            title: '操作',
            width: 55,
            slot: 'handle'
        }
    ]
}

/**
 * [应用列表]
 * @param  {[type]} self [description]
 * @return {[type]}      [description]
 */
export const appCols = (self) => {
    return [
        {
            type: 'selection',
            width: 50,
            fixed: 'left',
            align: 'center'
        },
        {
            title: '应用名称/ID',
            slot: 'id',
            minWidth: 250
        },
        {
            title: '别名',
            key: 'alias',
            minWidth: 200
        },
        {
            title: '媒体名称',
            slot: 'ssp_id',
            minWidth: 200
        },
        {
            title: '应用平台',
            slot: 'os_type',
            width: 80
        },
        {
            title: '应用类型',
            slot: 'app_type',
            minWidth: 180
        },
        {
            title: '应用包名',
            key: 'package_name',
            minWidth: 180
        },
        {
            title: '状态',
            slot: 'status',
            width: 100
        },
        {
            title: '更新时间',
            key: 'updated_at',
            width: 170
        },
        {
            title: '创建时间',
            key: 'created_at',
            width: 170
        },
        {
            title: '操作',
            width: 55,
            fixed: 'right',
            slot: 'handle'
        }
    ]
}


/**
 * [广告位列表]
 * @param  {[type]} self [description]
 * @return {[type]}      [description]
 */
export const slotCols = (self) => {
    return [
        {
            type: 'selection',
            width: 50,
            fixed: 'left',
            align: 'center'
        },
        {
            title: '广告位名称/ID',
            slot: 'slot_id',
            minWidth: 250
        },
        {
            title: '别名',
            key: 'alias',
            minWidth: 200
        },
        {
            title: '测试广告位',
            slot: 'is_test_slot',
            minWidth: 100
        },
        {
            title: '应用平台',
            slot: 'os_type',
            width: 80
        },
        {
            title: '应用名称/ID',
            slot: 'app_id',
            minWidth: 250
        },
        {
            title: '媒体名称',
            slot: 'ssp_id',
            minWidth: 200
        },
        {
            title: 'RTA类型',
            slot: 'is_rta',
            width: 80
        },
        {
            title: 'RTA合作方',
            slot: 'rta_id',
            minWidth: 120
        },
        {
            title: '广告场景',
            slot: 'slot_scene',
            minWidth: 120
        },
        {
            title: '广告样式',
            slot: 'slot_type',
            minWidth: 180
        },
        {
            title: '素材尺寸比例',
            slot: 'creative_width',
            width: 120
        },
        {
            title: '状态',
            slot: 'status',
            width: 100
        },
        {
            title: '更新时间',
            key: 'mtime',
            width: 170
        },
        {
            title: '创建时间',
            key: 'ctime',
            width: 170
        },
        {
            title: '操作',
            width: 55,
            fixed: 'right',
            slot: 'handle'
        }
    ]
}