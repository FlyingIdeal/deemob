<template>
	<div class="page-main">
		<div class="page-title page-has-line">
			<h2 class="title-line-tag">{{headTitle}}</h2>
			<div class="is-handler">
				<Button class="group_button" icon="md-add" type="primary" @click="toLink('tool-material-group')">素材组管理</Button>
				<Button class="group_button" icon="md-add" type="primary" @click="toLink('tool-material-tag')">素材标签管理</Button>
			</div>
		</div>


		<div class="data-nav-tab" slot="tab">
			<div class="tab-list" :class="material_type === 'photo' ? 'active' : ''" @click="toggleNavTab('photo')">图片素材</div>
			<div class="tab-list" :class="material_type === 'video' ? 'active' : ''" @click="toggleNavTab('video')">视频素材</div>
		</div>

		<!-- 素材概览 -->
		<Card :bordered="false" :padding="0" dis-hover class="material-overview">
			<div class="overview-head">素材概览<span>（已删除素材不统计）</span></div>
			<Row class="overview-flex">
				<Col span="6">
					<div class="flex-item">
						<div class="img-box"><img src="~@/assets/image/material/material-total.png"></div>
						<div class="total-box">
							<h6>素材总数</h6>
							<h4>{{dashboardData.total_count}}</h4>
						</div>
					</div>
				</Col>
				<Col span="6">
					<div class="flex-item">
						<div class="img-box"><img src="~@/assets/image/material/material-on.png"></div>
						<div class="total-box">
							<h6>在投素材数</h6>
							<h4>{{dashboardData.online_count}}</h4>
						</div>
					</div>
				</Col>
				<Col span="6">
					<div class="flex-item">
						<div class="img-box"><img src="~@/assets/image/material/material-today.png"></div>
						<div class="total-box">
							<h6>今日上新素材数</h6>
							<h4>{{dashboardData.today_count}}</h4>
						</div>
					</div>
				</Col>
				<Col span="6">
					<div class="flex-item">
						<div class="img-box"><img src="~@/assets/image/material/material-week.png"></div>
						<div class="total-box">
							<h6>近一周上新素材数</h6>
							<h4>{{dashboardData.seven_days_count}}</h4>
						</div>
					</div>
				</Col>
			</Row>
		</Card>

		<Card :bordered="false" dis-hover class="has-table-card">
			<div class="page-title">
				<h2>素材详情</h2>
				<div class="is-handler">
					<!-- <Button class="has-img-icon" type="text" @click="batchMod">
						<i class="batch is-handler-icon"></i>
						<span>批量修改</span>
					</Button> -->
					<Button class="has-img-icon" type="text" @click="batchDel">
						<i class="delete is-handler-icon"></i>
						<span>批量删除</span>
					</Button>
					<Button type="primary" icon="md-add" @click="toAdd">上传素材</Button>
				</div>
			</div>

			<div class="search-line" ref="search-line">

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
					class="i-margin-right-11 mar-bot-10 i-width-select"
					v-model.trim="filterSearch.names_textarea"
					:rows="1"
					:autosize="{maxRows:1, minRows: 1}"
					placeholder="批量素材名称"
				/>

				<Input
					type="textarea"
					class="i-margin-right-11 mar-bot-10 i-width-select"
					v-model.trim="filterSearch.material_ids_textarea"
					:rows="1"
					:autosize="{maxRows:1, minRows: 1}"
					placeholder="批量素材ID"
				/>

				<Input
					v-show="material_type === 'photo'"
					type="textarea"
					class="i-margin-right-11 mar-bot-10 i-width-select"
					v-model.trim="filterSearch.ratios_textarea"
					:rows="1"
					:autosize="{maxRows:1, minRows: 1}"
					placeholder="批量尺寸比例"
				/>

				<Button class="search" @click="doFilterList">搜索</Button>
			</div>
			<div class="console-table">
				<Table highlight-row stripe border :columns="tableColList" :data="tableDataList" :loading="tableLoadFlag" :no-data-text="noDataText"  @on-selection-change="selChange" class="overflowTable">

					<!--创意详情-->
					<template slot-scope="{ row, index }" slot="link">
						<Poptip trigger="hover" placement="right" transfer>
							<div class="creative-detail">
								<div class="detail-material">
									<!-- 图片 -->
									<div class="material-inner" v-if="row.material_type === 1">
										<div class="material-column">
											<img :src="row.link">
											<div class="img-handle">
												<a href="javascript:void(0)" class="iconfont icon-zoomup" @click="showImg(row, 'photo')"></a>
											</div>
										</div>
									</div>

									<!-- 视频, video_url, cover_url -->
									<div class="material-inner" v-if="row.material_type === 2">
										<div class="material-column">
											<video :src="row.link" controls="controls">
												您的浏览器不支持 video 标签。
											</video>
											<div class="img-handle">
												<a href="javascript:void(0)" class="iconfont icon-zoomup" @click="showImg(row, 'video')"></a>
											</div>
										</div>
									</div>
								</div>
							</div>
							<div class="detail-material-zoomup" slot="content">
								<div class="zoomup-inner">
									<img :src="row.link" v-if="row.material_type === 1">
									<video :src="row.link" controls="controls" v-if="row.material_type === 2">
										您的浏览器不支持 video 标签。
									</video>
								</div>
							</div>
						</Poptip>
					</template>
					<!--素材名称-->
					<template slot-scope="{ row, index }" slot="material_name">
						{{row.material_name}}
					</template>
					<!--尺寸-->
					<template slot-scope="{ row }" slot="width">
						{{ row.width }} * {{row.height}}
					</template>
					<!--尺寸比例-->
					<template slot-scope="{ row }" slot="height">
						{{row.height | toDivisor(row)}}
					</template>
					<!--文件大小-->
					<template slot-scope="{ row }" slot="size">
						{{row.size | toKbOrMb}}
					</template>
					<!--素材组-->
					<template slot-scope="{ row }" slot="material_group_name">
						{{row.material_group_name || '-'}}
					</template>
					<!--素材标签-->
					<template slot-scope="{ row }" slot="material_tag_name">
						{{row.material_tag_name || '-'}}
					</template>
					<!--创建时间-->
					<template slot-scope="{ row }" slot="created_at">
						{{row.created_at | timeFormat('yyyy-MM-dd HH:mm:ss')}}
					</template>
					<!--更新时间-->
					<template slot-scope="{ row }" slot="updated_at">
						{{row.updated_at | timeFormat('yyyy-MM-dd HH:mm:ss')}}
					</template>

					<!--操作-->
					<template slot-scope="{ row, index }" slot="handle">
						<div class="action-handle">
							<Button @click="doEdit(row)" type="text" title="编辑" custom-icon="icon-edit"></Button>
							<Button @click="doDelete(row)" type="text" title="删除" custom-icon="icon-delete"></Button>
						</div>
					</template>
				</Table>
				<div class="page-center">
					<Page show-total show-sizer show-elevator placement="top" :total="total_count" :current.sync='currentPage' :page-size="pageSize" @on-change="pageNumberChange" @on-page-size-change="pageSizeChange"/>
				</div>
			</div>
		</Card>

		<!-- 点击放大图片或者视频 -->
		<Modal
			v-model="modalFlag"
			:mask-closable="false"
			:width="646"
			:footer-hide="true"
			@on-cancel="modalToggle"
			class-name="vertical-center-modal"
		>
			<div class="modal-inner">
				<img v-if="modalObj.type === 'photo'" :src="modalObj.link">
				<video v-if="modalObj.type === 'video'" :src="modalObj.link" controls="controls">
					您的浏览器不支持 video 标签。
				</video>
			</div>
		</Modal>

		<!-- 素材编辑 -->
		<Drawer v-model="drawerFlag" width="550" :mask-closable="false" :closable="false" :styles="drawStyles" title="编辑素材">
			<Form ref="modalForm" label-position="right" :model="modalForm" :rules="ruleBase" :label-width="100">
				<FormItem label="素材名称" prop="name">
					<Input :maxlength="30" show-word-limit v-model.trim="modalForm.name" placeholder="请输入素材名称"/>
				</FormItem>
				<FormItem label="素材组" prop="group_id">
					<Select
						filterable
						clearable
						v-model="modalForm.group_id"
						placeholder="请选择素材组"
					>
						<Option v-for="item in materialGroupArr" :key="item.id" :value="item.id" :title="item.material_group_name">{{ item.material_group_name }}</Option>
					</Select>
				</FormItem>
				<FormItem label="标签" prop="tag_id">
					<Select
						filterable
						clearable
						v-model="modalForm.tag_id"
						placeholder="请选择标签"
					>
						<Option v-for="item in materialTagArr" :key="item.id" :value="item.id" :title="item.material_tag_name">{{ item.material_tag_name }}</Option>
					</Select>
				</FormItem>

			</Form>
			<div class="drawer-footer">
				<Button @click="drawerFlag = false">取消</Button>
				<Button type="primary" :loading="submitClock" @click="submitForm('modalForm')">
					{{!submitClock ? '提交' : '提交中...'}}
				</Button>
			</div>
		</Drawer>
	</div>
</template>

<script>
import { showTitle, dataType, filterBatchQuery } from '@/libs/util'
import { debounce, throttle, formatDate, miniCommonDivisor } from '@/libs/tools'
import { getMaterialGroupList, getMaterialTagList, getMaterialList, deleteMaterial, getMaterialDashboard, modMaterial } from '@/api/tool'
import { materialColumns } from './colList.js'

export default {
	name: 'material-manage',
	data() {
		return {
			pageSize: 10, // 页码长度
			total_count: 0,
			currentPage: 1,
			tableColList: materialColumns,
			tableDataList: [], // table数据
			tableLoadFlag: true, // table的loading
			noDataText: this.$config.noDataText,

			material_type: this.$route.query.type || 'photo', // 默认图片素材
			materialGroupArr: [], // 素材组
			materialTagArr: [], // 标签
			dashboardData: {
				online_count: 0,
				seven_days_count: 0,
				today_count: 0,
				total_count: 0
			}, // 素材仪表数据

			filterSearch: { // 筛选条件
				group_ids: [], // 素材组ID
				tag_ids: [], //素材标签ID
				names: [], //素材名称
				material_ids: [], // 素材ID
				ratios: [], // 尺寸

				names_textarea: null, //批量素材名称
				material_ids_textarea: null, // 批量素材ID
				ratios_textarea: null // 批量尺寸
			},
			selectID: [], // 批量Id
			drawerFlag: false, // 抽屉开关
			drawStyles: { // 抽屉样式
				height: 'calc(100% - 55px)',
				overflow: 'auto',
				paddingBottom: '54px',
				position: 'static'
			},
			modalForm: { // 提交表单
				ids: [], // 批量/单个删除id
				name: '', // 素材名称
				group_id: '', // 素材组ID
				tag_id: '' // 标签ID
			},
			ruleBase: { // form表单正则
				name: [
					{required: true, message: '请输入素材名称'},
					{pattern: /^[0-9a-zA-Z\u4e00-\u9fa5_.-]{1,}$/, message: '素材名称只支持汉字、数字、英文、下划线', trigger: 'blur'}
				],
				group_id: [{required: true, message: '请选择素材组'}],
				tag_id: [{required: true, message: '请选择标签'}]
			},
			submitClock: false, // 保存锁
			modalFlag: false,
			modalObj: {}, // 弹出层对象
			locationObj: { // 定位
				left: 0,
				top: 0
			}
		}
	},
	computed: {
		headTitle() {
			return showTitle(this.$route, this)
		}
	},
	filters: {
		toDivisor(height, row) {
			let divisor = miniCommonDivisor(row.width, row.height)

			return divisor > 0 ? `${row.width/divisor}:${row.height/divisor}` : '0:0'
		},
		timeFormat(time, format) {
			return formatDate(time * 1000, format)
		},
		toKbOrMb(bit) {
			let b = parseInt(bit / 1024)

			return b >= 1024 ? `${(b / 1024).toFixed(2)}M` : `${b}KB`
		}
	},
	activated() {
		this.$Bus.$off('editEmitEvent')
		this.$Bus.$on('editEmitEvent', (msg) => {
			this.initData()
		})
	},
	created() {
		this.initLinkage() // 初始化联动

		this.initData()
	},
	methods: {
		/**
		 * [initSearchFilter 初始化筛选联动]
		 * @return {[type]} [description]
		 */
		initLinkage() {
			this.getMaterialGroupList() // 素材组
			this.getMaterialTagList() // 素材标签
		},
		/**
		 * [initData 初始化加载数据]
		 * @return {[type]} [description]
		 */
		initData() {
			this.getTableList() // 获取表格数据
			this.getMaterialDashboard() // 获取素材仪表数据
		},
		/**
		 * [getMaterialList 获取列表的信息]
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
					this.tableDataList = res.data.list

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
		 * [getMaterialDashboard 获取素材仪表数据]
		 * @return {[type]} [description]
		 */
		getMaterialDashboard() {

			let type = this.material_type === 'photo' ? 1 : (this.material_type === 'video' ? 2 : null)

			getMaterialDashboard({material_type: type}).then(res => {
				if(res.code === 200) {
					this.dashboardData = res.data
				}
			})
		},

		/**
		 * [getAxiosParams 获取下载和列表的url参数]
		 * @return {[type]} [description]
		 */
		getAxiosParams() {

			let _filter = this.filterSearch

			let params = {
				material_type: this.material_type === 'photo' ? 1 : (this.material_type === 'video' ? 2 : null) // 素材类型
			}

			// 素材组
			!!_filter.group_ids && (params.group_ids = _filter.group_ids)

			// 标签
			!!_filter.tag_ids && (params.tag_ids = _filter.tag_ids)

			// 素材名称
			!!_filter.names.length && (_filter.names.length > 1 ? (params.names = _filter.names) : (params.name = _filter.names))

			// 素材ID
			!!_filter.material_ids.length && (_filter.material_ids.length > 1 ? (params.material_ids = _filter.material_ids) : (params.material_id = _filter.material_ids))

			// 尺寸
			!!_filter.ratios.length && (params.ratios = _filter.ratios)

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

			// 批量尺寸
			_filter.ratios = filterBatchQuery({value: _filter.ratios_textarea, ratio: true})

			this.getTableList()
		},
		/**
		 * [selChange 批量选择]
		 * @param  {[type]} item [description]
		 * @return {[type]}     [description]
		 */
		selChange(selection) {
			let idArr = selection.map(item => {
				return item.id
			})
			this.selectID = idArr
		},
		/**
		 * [batchMod 批量修改]
		 * @return {[type]} [description]
		 */
		batchMod() {
			if (!this.selectID.length) {
				this.$Message.warning('请选择对应的素材')
				return
			}

			this.doEdit(null, this.selectID, 'batch') // 批量编辑
		},
		/**
		 * [batchDel 批量删除]
		 * @return {[type]} [description]
		 */
		batchDel() {
			if (!this.selectID.length) {
				this.$Message.warning('请选择对应的素材')
				return
			}

			this.trueDelete(this.selectID) // 批量删除
		},
		/**
		 * [doDelete 删除]
		 * @param  {[type]} item [description]
		 * @return {[type]}     [description]
		 */
		doDelete(row) {
			this.trueDelete([row.id])
		},
		/**
		 * [trueDelete 确认删除]
		 * @param  {[type]} ids [description]
		 * @return {[type]}     [description]
		 */
		trueDelete(ids) {

			if (!ids.length) {
				return
			}

			this.$Modal.confirm({
				title: '确认删除',
				content: '删除不会影响投放中的广告，素材删除后无法恢复，确认删除？',
				onOk: () => {
					deleteMaterial({
						ids
					}).then(res => {
						if (res.code === 200) {

							this.selectID = []

							this.$Message.success('删除成功')

							!!(this.tableDataList.length === 1 && this.currentPage > 1) && (--this.currentPage) // 解决大于1页，并且当前数组length = 1, 删除时自动进一页

							this.initData()
						}
					})
				}
			})
		},
		/**
		 * [doEdit 编辑]
		 * 当单个时传入的是row, 单批量时传入的是ids
		 * @return {[row]} [最后需要删除的id]
		 * @return {[type]} [单个还是批量]
		 */
		doEdit(row, ids, type) {
			if (type === 'batch') { // 批量
				this.modalForm = { // 提交表单
					ids: ids,
					name: '', // 素材名称
					group_id: '', // 素材组ID
					tag_id: '' // 标签ID
				}
			} else { // 单个
				this.modalForm = { // 提交表单
					ids: [row.id],
					name: row.material_name, // 素材名称
					group_id: row.material_group_id || '', // 素材组ID
					tag_id: row.material_tag_id || '' // 标签ID
				}
			}

			this.drawerFlag = !this.drawerFlag
		},
		/**
		 * [toLink 链接跳转]
		 * @param  {[type]} name [description]
		 * @return {[type]}      [description]
		 */
		toLink(name) {
			this.$router.push({name})
		},
		/**
		 * [toAdd 添加素材]
		 * @param  {[type]} row [description]
		 * @return {[type]}     [description]
		 */
		toAdd() {
			this.$router.push({name: 'material-add', query: {type: this.material_type}})
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
		 * [showImg 放大图片]
		 * @param  {[type]} row   [description]
		 * @param  {[type]} type [显示类型  photo/video]
		 * @return {[type]}       [description]
		 */
		showImg(row, type) {
			this.modalFlag = !this.modalFlag

			this.modalObj = {
				link: row.link,
				type: type,
			}
		},
		/**
		 * [modalToggle 关闭浮层]
		 * @return {[type]} [description]
		 */
		modalToggle() {
			this.modalFlag = false

			this.modalObj = {}
		},
		/**
		 * [toggleNavTab 切换导航类型]
		 * @param  {[type]} type [description]
		 * @return {[type]}      [description]
		 */
		toggleNavTab(type) {
			this.material_type = type

			this.currentPage = 1
			this.initData() // 获取数据
		},
		/**
		 * [limitText 剩余项数量]
		 * @param  {[type]} count [description]
		 * @return {[type]}	   [description]
		 */
		limitText(count) {
			return `+ ${count}`
		},

		/**
		 * [submitForm 编辑素材]
		 * @param  {[type]} name [description]
		 * @return {[type]}      [description]
		 */
		submitForm(name) {
			this.$refs[name].validate((valid) => {
				if (valid) {

					this.submitClock = true

					modMaterial(this.modalForm).then(res => {
						if (res.code === 200) {

							this.drawerFlag = !this.drawerFlag

							this.$Message.success('修改成功')
							this.getTableList()
						}
					}).then(() => {
						this.submitClock = false
					})
				} else {
					this.$Message.error({content: this.$config.requiredText, duration: 3})
				}
			})
		},
		/********************************************
		 *↓↓↓↓↓↓↓↓↓↓ 以下部分为搜索联动 start *↓↓↓↓↓↓↓
		 ********************************************/
		/**
		 * [getMaterialGroupList 素材组]
		 * @return {[type]} [description]
		 */
		getMaterialGroupList() {
			getMaterialGroupList().then(res=> {
				if(res.code === 200) {
					this.materialGroupArr = res.data.list || []
				}
			})
		},
		/**
		 * [getMaterialTagList 素材标签]
		 * @return {[type]} [description]
		 */
		getMaterialTagList() {
			getMaterialTagList().then(res=> {
				if(res.code === 200) {
					this.materialTagArr = res.data.list || []
				}
			})
		}

		/********************************************
		 *↑↑↑↑↑↑↑↑↑ 以上部分为搜索联动 end *↑↑↑↑↑↑
		 ********************************************/
	},
	/**
	 * [beforeRouteLeave 路由跳转]
	 * @param  {[type]}   to   [如果路由跳转不是到媒体详情页，则销毁 $Bus]
	 * @param  {[type]}   from [description]
	 * @param  {Function} next [description]
	 * @return {[type]}        [description]
	 */
	beforeRouteLeave(to, from, next) {
		if (to.name !== 'material-add') {
			this.$Bus.$off('editEmitEvent')
		}
		next()
	}
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
.group_button
  color: #1708d4;
  background-color: #c3c9ef;
  border-color: #c3c9ef;
.mar-bot-10
	vertical-align: top
	margin-bottom: 10px
.has-table-card
	margin-top: 10px
.creative-detail
	padding: 4px 0px
	font-size: 0px
	display: flex
	align-items: center
	.detail-material
		display: inline-block
		vertical-align: top
		position: relative
	.material-inner
		width: 100px
	.material-column
		width: 100px
		margin-right: 5px
		display: inline-block
		vertical-align: middle
		cursor: pointer
		height: 70px
		line-height: 70px
		font-size: 0px
		position: relative
		text-align: center
		img, video
			max-width: 100%
			max-height: 100%
			vertical-align: middle
		&:hover
			.img-handle
				display: block
		&:last-child
			margin-right: 0px
		.img-handle
			display: none
			position: absolute
			left: 0px
			top: 0px
			width: 100%
			height: 100%
			background-color: rgba(0,0,0,0.5)
			.iconfont
				display: block
				height: 70px
				line-height: 70px
				font-size: 16px
				color: #FFF
				text-align: center
.modal-inner
	margin-top: 40px
	text-align: center
	padding: 0 10px
	font-size: 0px
	height: 500px
	line-height: 500px
	img, video
		vertical-align: middle
		max-height: 100%
		max-width: 100%
.material-overview
	padding: 15px 20px
	.overview-head
		font-size: 16px
		font-weight: bold
		span
			margin-left: 4px
			font-size: 14px
			font-weight: 500
			color: #999999
	.overview-flex
		padding: 30px 0 10px
	.flex-item
		padding-left: 40px
		font-size: 0px
		text-align: left
		position: relative
		&:after
			content: ''
			width: 1px
			height: 24px
			position: absolute
			top: 13px
			right: 20px
			background-color: #EBEBEB
	/deep/ .ivu-col
		&:last-child
			.flex-item
				&:after
					display: none
	.img-box
		display: inline-block
		vertical-align: top
		width: 50px
		font-size: 0px
		img
			width: 100%
	.total-box
		text-align: left
		display: inline-block
		vertical-align: top
		margin-left: 12px
		h6
			line-height: 16px
			font-size: 13px
			font-weight: 500
		h4
			line-height: 34px
			font-size: 24px
			font-weight: bold
.has-table-card
	.page-title
		h2
			font-size: 16px
			font-weight: bold
.search-line
	margin-top: 5px
.edit-name-center
	.edit-default
		display: flex
		align-items: center
		&:hover
			.icon-edit
				opacity: 1
		.icon-edit
			opacity: 0
			flex: 0 0 20px
			width: 20px
			height: 20px
			line-height: 20px
			text-align: center
			font-size: 12px
			color: #999
			cursor: pointer
			transition: all 0.5s
		.material-name
			flex: 1
			display: -webkit-box
			-webkit-box-orient: vertical
			-webkit-line-clamp: 1
			word-break: break-word
	.edit-change
		display: flex
		align-items: center
		.icon-right, .icon-close
			flex: 0 0 20px
			width: 20px
			height: 20px
			line-height: 20px
			text-align: center
			font-size: 12px
			color: #999
			cursor: pointer
			transition: all 0.5s
			margin-left: 4px
		.edit-input
			flex: 1
			line-height: 20px
.zoomup-inner
	height: 200px
	width: 300px
	text-align: center
	display: flex
	align-items: center
	font-size: 0px
	justify-content: center
	position: relative
	img, video
		max-width: 100%
		max-height: 100%
</style>
