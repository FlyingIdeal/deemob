/**
 * [素材库]
 * @param  {[type]} self [description]
 * @return {[type]}      [description]
 */
export const materialColumns = [
	{type: 'selection', width: 50, align: 'center'},
	{title: '素材缩略图', slot: 'link', width: 120, className: 'thumbnail-column'},
	{title: '素材名称', slot: 'material_name', width: 250},
	{title: '素材ID', key: 'id', width: 70},
	{title: '尺寸', slot: 'width', width: 100},
	{title: '尺寸比例', slot: 'height', width: 100},
	{title: '文件大小', slot: 'size', minWidth: 90},
	{title: '素材组', slot: 'material_group_name', minWidth: 200},
	{title: '素材标签', slot: 'material_tag_name', minWidth: 200},
	{title: '创建时间', slot: 'created_at', width: 170},
	{title: '更新时间', slot: 'updated_at', width: 170},
	{title: '操作', slot: 'handle', width: 100, fixed: 'right'}
]

/**
 * [tagColumns 素材标签]
 * @type {Array}
 */
export const tagColumns = [
	{title: 'ID', key: 'id', minWidth: 100},
	{title: '标签名称', slot: 'tag_name', minWidth: 300},
	{title: '关联素材个数', key: 'material_count', minWidth: 200},
	{title: '创建时间', slot: 'created_at', minWidth: 170},
	{title: '更新时间', slot: 'updated_at', minWidth: 170},
	{title: '操作', slot: 'handle', minWidth: 80}
]

/**
 * [groupColumns 素材组]
 * @type {Array}
 */
export const groupColumns = [
	{title: 'ID', key: 'id', minWidth: 100},
	{title: '素材组', slot: 'group_name', minWidth: 300},
	{title: '关联素材个数', key: 'material_count', minWidth: 200},
	{title: '创建时间', slot: 'created_at', minWidth: 170},
	{title: '更新时间', slot: 'updated_at', minWidth: 170},
	{title: '操作', slot: 'handle', minWidth: 80}
]

