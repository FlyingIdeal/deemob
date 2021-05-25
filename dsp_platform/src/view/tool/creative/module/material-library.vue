<template>
	<div>
		<Modal
			v-model="modalFlag"
			:width="1100"
			class-name="vertical-center-modal"
			:closable="false"
			:footer-hide="true"
			:mask-closable="false"
		>
			<div class="material-library">
				<div class="material-head">
					<div class="head-name">素材库</div>
					<div class="head-link" @click="toLink">管理素材&nbsp;&gt;</div>
				</div>
				<div class="material-middle">
					<div class="search-line">
						<Select
							class="i-margin-right-11 mar-bot-10 i-width-select"
							multiple
							filterable
							v-model="filterSearch.group_ids"
							:transfer="true"
							:max-tag-count="1"
							:max-tag-placeholder="limitText"
							placeholder="素材组"
						>
							<Option v-for="item in materialGroupArr" :key="item.id" :value="item.id" :title="item.material_group_name">{{ item.material_group_name }}</Option>
						</Select>

						<Select
							class="i-margin-right-11 mar-bot-10 i-width-select"
							multiple
							filterable
							v-model="filterSearch.tag_ids"
							:transfer="true"
							:max-tag-count="1"
							:max-tag-placeholder="limitText"
							placeholder="标签"
						>
							<Option v-for="item in materialTagArr" :key="item.id" :value="item.id" :title="item.material_tag_name">{{ item.material_tag_name }}</Option>
						</Select>

						<Input
							type="textarea"
							class="i-margin-right-11 i-width-select"
							v-model.trim="filterSearch.names_textarea"
							:rows="1"
							:autosize="{maxRows:1, minRows: 1}"
							placeholder="批量素材名称"
						/>

						<Input
							type="textarea"
							class="i-margin-right-11 i-width-select"
							v-model.trim="filterSearch.material_ids_textarea"
							:rows="1"
							:autosize="{maxRows:1, minRows: 1}"
							placeholder="批量素材ID"
						/>

						<Button class="search" @click="doFilterList">搜索</Button>
					</div>
					<div class="material-box">
						<template v-for="(item, index) in materialDataList">
							<div class="item-list" :class="[item.isChecked ? 'item-list-checked' : '', index > 4 ? 'item-list-nobot' : '']" @click="doChoose(item, index)">
								<div class="material-photo">
									<img :src="item.link" v-if="item.material_type === 1">

									<video :src="item.link" controls="controls" v-if="item.material_type === 2">
										您的浏览器不支持 video 标签。
									</video>

									<div class="check-icon"><i class="icon-notice-right"></i></div>
									<div class="zoom-icon"><i class="icon-zoomup" @click.stop="zoomUp(item)"></i></div>
								</div>
								<h4 class="material-name" :title="item.material_name">{{item.material_name}}</h4>
								<p class="material-time"><i class="icon-date"></i>{{item.updated_at | timeFormat('yyyy/MM/dd')}}</p>
							</div>
						</template>

						<div class="material-middle-noData" v-if="!materialDataList.length">暂无数据</div>
					</div>
					<div class="page-center">
						<Page show-total show-elevator placement="top" :total="total_count" :current.sync='currentPage' :page-size="pageSize" @on-change="pageNumberChange" @on-page-size-change="pageSizeChange"/>
					</div>
					<!-- 已选择素材 -->
					<div class="material-choosed">
						<div class="item-list" v-for="(item, index) in hasMaterialDataList">
							<div class="material-photo">
								<img :src="item.link" v-if="item.material_type === 1">
								<video :src="item.link" controls="controls" v-if="item.material_type === 2">
									您的浏览器不支持 video 标签。
								</video>
								<div class="delete" @click="deleteMaterial(item, index)">x</div>
							</div>
						</div>
					</div>
				</div>
				
				<div class="material-footer">
					<div class="choose-num">已选择{{hasMaterialDataList.length}}个</div>
					<div class="detail-save-center" >
						<Button @click="cancelFn">取消</Button>
						<Button type="primary" :disabled="!hasMaterialDataList.length" @click="submitFormData">确定</Button>
					</div>
				</div>
			</div>
		</Modal>

		<!-- 点击放大图片或者视频 -->
		<Modal
			v-model="zoomupModalFlag"
			:mask-closable="false"
			:width="646"
			:footer-hide="true"
			@on-cancel="modalToggle"
			class-name="vertical-center-modal"
		>
			<div class="modal-inner">
				<img v-if="modalObj.material_type === 1" :src="modalObj.link">
				<video v-if="modalObj.material_type === 2" :src="modalObj.link" controls="controls">
					您的浏览器不支持 video 标签。
				</video>
			</div>
		</Modal>
	</div>
</template>

<script>
import { filterBatchQuery } from '@/libs/util'
import { formatDate } from '@/libs/tools'
import { getMaterialGroupList, getMaterialTagList, getMaterialList } from '@/api/tool'

export default {
	props: {
		defaultList: { // 已有的图片列表
            type: [Array, String]
        }
	},
	data() {
		return {
			pageSize: 15,
			total_count: 0,
			currentPage: 1,

			multiLength: 1, // 最多可选择素材的个数
			materialGroupArr: [], // 素材组
			materialTagArr: [], // 标签
			materialDataList: [], // 素材列表
			hasMaterialDataList: [], // 已经选择的素材

			modalFlag: false,
			zoomupModalFlag: false, // 放大
			modalObj: {}, // 弹出层放大对象
			inFormData: {}, // 注入数据

			filterSearch: {
				min_width: null, // 最小宽度
				ratios: [], // 尺寸
				names: [], // 素材名称

				group_ids: [], // 素材组ID
				tag_ids: [], //素材标签ID
				material_ids: [], // 素材ID

				names_textarea: null, //批量素材名称
				material_ids_textarea: null, // 批量素材ID
			}
		}
	},
	filters: {
		timeFormat(time, format) {
			return formatDate(time * 1000, format)
		}
	},
	created() {
		this.initLinkage()
	},
	methods: {
		/**
		 * [injectData 注入数据]
		 * @param  {[type]} obj [description]
		 * @return {[type]}     [description]
		 */
		injectData(obj = {}) {

			let {ratios, material_type, min_width, multiLength} = obj

			this.filterSearch.min_width = min_width
			this.filterSearch.ratios = ratios
			this.filterSearch.material_type = material_type

			this.multiLength = multiLength

			this.inFormData = obj

			this.getTableList()

			this.resetData() // 重置
			this.modalFlag = !this.modalFlag
		},
		/**
		 * [initSearchFilter 初始化筛选联动]
		 * @return {[type]} [description]
		 */
		initLinkage() {
			this.getMaterialGroupList() // 素材组
			this.getMaterialTagList() // 素材标签
		},
		/**
		 * [getTableList 获取素材列表]
		 * @return {[type]} [description]
		 */
		getTableList() {
			let params = {
				...this.getAxiosParams(),
				...{
					page_size: this.pageSize,
					page_num: this.currentPage
				}
			}

			this.tableLoadFlag = true

			getMaterialList(params).then(res => {

				this.tableLoadFlag = false

				if (res.code === 200) {
					this.setMaterialData(res.data.list) //  设置素材列表
					this.total_count = res.data.total_count
				} else if (res.code === 403) {
					this.noDataText = this.$config.noDataTextPer
				}

			}, err => {
				if (err.code === 403) {
					this.noDataText = this.$config.noDataTextPer
				}
				this.tableLoadFlag = false
			})
		},

		/**
		 * [setMaterialData 设置素材列表]
		 * @param {[type]} arr [description]
		 */
		setMaterialData(arr) {

			// 1. 提取已选择的素材的id
			let idArr = this.hasMaterialDataList.map(item => {
				return item.id
			})

			arr.map(item => {
				item['isChecked'] = idArr.includes(item.id)
			})

			this.materialDataList = arr
		},

		/**
		 * [getAxiosParams 获取下载和列表的url参数]
		 * @return {[type]} [description]
		 */
		getAxiosParams() {

			let _filter = this.filterSearch

			let params = {
				material_type: _filter.material_type,
				min_width: _filter.min_width,
				ratios: _filter.ratios
			}

			// 素材组
			!!_filter.group_ids && (params.group_ids = _filter.group_ids)

			// 标签
			!!_filter.tag_ids && (params.tag_ids = _filter.tag_ids)

			// 素材名称
			!!_filter.names.length && (_filter.names.length > 1 ? (params.names = _filter.names) : (params.name = _filter.names))

			// 素材ID
			!!_filter.material_ids.length && (_filter.material_ids.length > 1 ? (params.material_ids = _filter.material_ids) : (params.material_id = _filter.material_ids))

			return params
		},
		/**
		 * [doFilterList 筛选查询]
		 * @return {[type]} [description]
		 */
		doFilterList() {
			
			this.currentPage = 1

			let _filter = this.filterSearch

			// 批量素材名称
			_filter.names = filterBatchQuery({value: _filter.names_textarea})

			// 批量素材ID
			_filter.material_ids = filterBatchQuery({value: _filter.material_ids_textarea, type: 'number'})

			this.getTableList()
		},
		/**
		 * [toLink 链接跳转]
		 * @return {[type]} [description]
		 */
		toLink() {
			this.$router.push({name: 'tool-material'})
		},
		/**
		 * [pageNumberChange 修改页码]
		 * @param  {[type]} val [description]
		 * @return {[type]}     [description]
		 */
		pageNumberChange(val) {
			this.currentPage = val
			this.getTableList()
		},
		/**
		 * [pageSizeChange 切换每页条数时的回调]
		 * @param  {[type]} size [description]
		 * @return {[type]}      [description]
		 */
		pageSizeChange(size) {
			this.pageSize = size
			this.getTableList()
		},
		/**
		 * [cancelFn 取消]
		 * @return {[type]} [description]
		 */
		cancelFn() {
			this.resetData()

			this.modalFlag = !this.modalFlag
		},
		/**
		 * [resetData 重置数据]
		 * @return {[type]} [description]
		 */
		resetData() {
			this.currentPage = 1
			this.materialDataList = [] // 素材列表
			this.hasMaterialDataList = [] // 已经选择的素材
		},
		/**
		 * [submitFormData 数据提交]
		 * @return {[type]} [description]
		 */
		submitFormData() {
			let returnArr = this.hasMaterialDataList.map(item => {
				return `${item.link}?materialId=${item.id}&name=${escape(item.material_name)}`
			})

			this.$emit('on-change', returnArr.join(','))
			this.cancelFn() // 重置
		},
		/**
		 * [doChoose 选择素材]
		 * @param  {[type]} item  [description]
		 * @param  {[type]} index [description]
		 * @return {[type]}       [description]
		 */
		doChoose(item, index) {
			// 此处交互区分单个/批量
			
			let copyArr = [...this.materialDataList]

			if (this.multiLength > 1) { // 1. 多个, check交互类型

				// 最多个数限制
				if(this.hasMaterialDataList.length >= this.multiLength && !item.isChecked) {
					this.$Message.error({content: `最多可选择${this.multiLength}个素材`, duration: 3})
					return
				}

				let resultArr = []

				copyArr.map(child => {
					if (child.id === item.id) {
						child['isChecked'] = !child['isChecked']
					}

					if(!!child['isChecked']) {
						resultArr.push(child)
					}
				})

				this.materialDataList = copyArr
				this.hasMaterialDataList = resultArr

			} else { // 2. 一个, radio交互类型

				let resultArr = []

				copyArr.map(child => {
					if (child.id === item.id) {
						resultArr.push(item)
					}

					child['isChecked'] = child.id === item.id
				})

				this.materialDataList = copyArr
				this.hasMaterialDataList = resultArr
			}
		},
		/**
		 * [deleteMaterial description]
		 * @param  {[type]} item [description]
		 * @return {[type]}      [description]
		 */
		deleteMaterial(item, index) {
			this.hasMaterialDataList.splice(index, 1) // 删除自个

			this.materialDataList.map((child, idx) => {
				if (child.id === item.id) {
					child['isChecked'] = false
				}
			})
		},
		/**
		 * [zoomUp 放大]
		 * @param  {[type]} item [description]
		 * @return {[type]}      [description]
		 */
		zoomUp(item) {
			this.modalObj = item
			this.zoomupModalFlag = !this.zoomupModalFlag
		},
		/**
		 * [modalToggle 关闭放大浮层]
		 * @return {[type]} [description]
		 */
		modalToggle() {
			this.zoomupModalFlag = false

			this.modalObj = {}
		},

		/********************************************
		 *↓↓↓↓↓↓↓↓↓↓ 以下部分为搜索联动 start *↓↓↓↓↓↓↓
		 ********************************************/
		 /**
		 * [limitText 剩余项数量]
		 * @param  {[type]} count [description]
		 * @return {[type]}	   [description]
		 */
		limitText(count) {
			return `+ ${count}`
		},
		/**
		 * [getMaterialGroupList 素材组]
		 * @return {[type]} [description]
		 */
		getMaterialGroupList() {
			getMaterialGroupList().then(res => {
				if (res.code === 200) {
					this.materialGroupArr = res.data.list || []
				}
			})
		},
		/**
		 * [getMaterialTagList 素材标签]
		 * @return {[type]} [description]
		 */
		getMaterialTagList() {
			getMaterialTagList().then(res => {
				if (res.code === 200) {
					this.materialTagArr = res.data.list || []
				}
			})
		}

		/********************************************
		 *↑↑↑↑↑↑↑↑↑ 以上部分为搜索联动 end *↑↑↑↑↑↑
		 ********************************************/
	}
}
</script>

<style lang="stylus" scoped>
/deep/ .ivu-modal-content
	border-radius: 4px
	overflow hidden
	.ivu-modal-body
		padding: 0px
.material-head
	padding: 0 20px
	height: 45px
	line-height: 45px
	background: #F5F5F5
	display: flex
	justify-content: space-between
	.head-name
		font-size: 16px
		font-weight: bold
	.head-link
		font-size: 14px
		color: #465CFE
		cursor pointer
.material-middle
	padding-top: 14px
	.search-line
		padding: 0 20px
		margin-bottom: 0px
		margin-top: 0px
.material-box
	height: 430px
	padding: 14px 0px 0 20px
	overflow: auto
	.item-list
		display: inline-block
		vertical-align: top
		width: 200px
		margin: 0 12px 20px 0
		cursor pointer
		&:nth-child(5n)
			margin-right: 0px
		.material-name
			font-size: 14px
			line-height: 20px
			height: 20px
			font-weight: 500
			overflow: hidden
			text-overflow: ellipsis
			white-space: nowrap
			margin-top: 4px
		.material-time
			margin-top: 4px
			font-size: 13px
			color: #999999
			line-height: 20px
			i
				display: inline-block
				vertical-align: 0px
				margin-right: 8px
				font-size: 12px
				color: #999999
		&:hover
			.zoom-icon
				i
					background-color: rgba(0,0,0, 0.5)
			.material-photo
				border: 1px solid #465CFE
	.material-photo
		width: 200px
		height: 114px
		background: #F5F6F8
		border: 1px solid #EBEBEB
		border-radius: 4px
		display: flex
		align-items: center
		justify-content: center
		position: relative
		transition: all 0.5s
		&:after
			content: ''
			width: 100%
			height: 100%
			z-index: 1
			background-color: rgba(0,0,0,0)
			position: absolute
			left: 0px
			top: 0px
		img, video
			max-width: 100%
			max-height: 100%
	.check-icon
		display: none
		position: absolute
		right: -8px
		top: -8px
		z-index: 2
		i
			font-size: 16px
			display: block
			width: 18px
			height: 18px
			text-align: center
			line-height: 18px
			border-radius: 50%
			color: #465CFE
			background-color: #fff
	.zoom-icon
		position: absolute
		right: 4px
		bottom: 4px
		z-index: 2
		i
			transition: all 0.5s
			display: block
			width: 24px
			height: 24px
			color: #fff
			font-size: 14px
			line-height: 24px
			text-align: center
			border-radius: 4px
			background-color: rgba(0,0,0,0.1)
	.item-list-checked
		.material-photo
			border: 1px solid #465CFE
		.material-name, .material-time
			color: #465CFE
			i
				color: #465CFE
		.check-icon
			display: block
	.item-list-nobot
		margin-bottom: 0px
.material-choosed
	margin-top: 10px
	overflow: auto
	white-space: nowrap
	font-size: 0px
	padding: 10px 20px
	.item-list
		display: inline-block
		vertical-align: top
		margin-right: 10px
	.material-photo
		display: flex
		width: 108px
		height: 60px
		border-radius: 4px
		background-color: #FAFAFA
		border: 1px solid #EBEBEB
		position: relative
		transition: all 0.5s
		align-items: center
		justify-content: center
		cursor pointer
		img, video
			max-width: 100%
			max-height: 100%
		&:after
			content: ''
			width: 100%
			height: 100%
			z-index: 1
			background-color: rgba(0,0,0,0)
			position: absolute
			left: 0px
			top: 0px
		.delete
			opacity: 0
			transition: all 0.5s
			position: absolute
			right: -6px
			top: -6px
			width: 16px
			height: 16px
			border-radius: 50%
			line-height: 12px
			text-align: center
			background-color: #E60012
			color: #fff
			font-size: 13px
			z-index: 2
		&:hover
			border: 1px solid rgba(230,2,20, 0.8)
			.delete
				opacity: 1
			
.page-center
	text-align: right
	padding: 0 20px
.material-footer
	margin-top: 10px
	padding: 0 160px 20px 20px
	.choose-num
		width: 140px
		text-align: left
		float: left
		line-height: 32px
		font-size: 14px
	.detail-save-center
		text-align: center
		button
			margin: 0 10px
.modal-inner
	margin-top: 40px
	padding: 0 10px
	text-align: center
	font-size: 0px
	height: 500px
	line-height: 500px
	img, video
		vertical-align: middle
		max-height: 100%
		max-width: 100%
.material-middle-noData
	font-size: 16px
	text-align: center
	line-height: 2
</style>
