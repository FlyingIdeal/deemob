<template>
	<div class="page-main">
		<div class="page-title page-has-line">
			<h2 class="title-line-tag">{{headTitle}}</h2>
			<div class="is-handler">
				<Button class="has-img-icon" type="text" @click="doColumns">
					<i class="column is-handler-icon"></i>
					<span>自定义列</span>
				</Button>
				<Button type="primary" icon="md-add" @click="toNew()">新建创意包</Button>
			</div>
		</div>
		<Card :bordered="false" dis-hover class="has-table-card">
			<div class="search-line" ref="search-line">

				<Select
					class="i-margin-right-11 mar-bot-10 i-width-select"
					clearable
					v-model="filterSearch.internal_verify"
					:transfer="true"
					placeholder="审核状态"
				>
					<Option v-for="item in filterSelect" :key="item.value" :value="item.value" >{{ item.label }}</Option>
				</Select>

				<Input class="i-margin-right-11 mar-bot-10 i-width-select" clearable v-model.trim="filterSearch.name_or_id" maxlength="100" placeholder="请输入创意包名称或ID" :clearable="true" />

				<Button class="search" @click="doFilterList">搜索</Button>
			</div>
			<div class="console-table">
				<Table highlight-row stripe border :columns="tableColList" :data="tableDataList" :loading="tableLoadFlag" :no-data-text="noDataText">

					<!--创意详情-->
					<template slot-scope="{ row }" slot="title">
						<div class="creative-detail">
							<div class="detail-material">
								<!-- 图片 -->
								<div class="material-inner" v-if="!row.video_url && row.pic_url_arr.length">
									<div class="material-column" v-for="(item, index) in row.pic_url_arr">
										<img :src="item">
										<div class="img-handle">
											<a href="javascript:void(0)" class="iconfont icon-zoomup" @click="showImg(item, 'pic')"></a>
										</div>
									</div>
								</div>

								<!-- 视频, video_url, cover_url -->
								<div class="material-inner" v-if="row.video_url">
									<!-- 封面图  视频可以不显示  但是点击时出现 -->
									<div class="material-column" v-if="row.cover_url">
										<img :src="row.cover_url">
										<div class="img-handle">
											<a href="javascript:void(0)" class="iconfont icon-zoomup" @click="showImg(row.cover_url, 'pic')"></a>
										</div>
									</div>
									<div class="material-column">
										<video :src="row.video_url" controls="controls" :poster="row.cover_url">
										您的浏览器不支持 video 标签。
										</video>
										<div class="img-handle">
											<a href="javascript:void(0)" class="iconfont icon-zoomup" @click="showImg(row.video_url, 'video', row.cover_url)"></a>
										</div>
									</div>
								</div>
							</div>
							<div class="detail-text">
								<div class="text-inner" :title="row.title">
									{{row.title}}
								</div>
							</div>
						</div>
					</template>
					<!--创意形式-->
					<template slot-scope="{ row }" slot="creative_type">
						{{creativeId2Text(row.creative_type)}}
					</template>

					<!--审核状态-->
					<template slot-scope="{ row }" slot="internal_verify">
						<!-- 0待审，1通过，2拒绝, 3被删除 -->
						<Badge status="warning" v-if="row.internal_verify == 0" text="待审核" />
						<Badge status="success" v-if="row.internal_verify == 1" text="审核通过" />
						<Badge status="error" v-if="row.internal_verify == 2" text="已拒绝" />
						<Badge status="error" v-if="row.internal_verify == 3" color="#F72D17" text="已删除" />
		  
						<Tooltip 
							v-if="(row.internal_verify == 2 || row.internal_verify == 3) && row.status_desc"
							:transfer="true" 
							maxWidth="300"
						>
							<i class="iconfont icon-why"></i>
							<div slot="content" v-html="row.status_desc"></div>
						</Tooltip>

					</template>


					<!--今日花费-->
					<template slot-scope="{ row }" slot="spend_today">
						{{ row.spend_today }}元
					</template>
					<!--广告展现-->
					<template slot-scope="{ row }" slot="view">
						{{row.view}}
					</template>
					<!--广告点击pv-->
					<template slot-scope="{ row }" slot="click">
						{{row.click}}
					</template>
					<!--点击率-->
					<template slot-scope="{ row }" slot="ctr">
						{{row.ctr}}%
					</template>
					<!--到达数-->
					<template slot-scope="{ row }" slot="reach">
						{{row.reach}}
					</template>
					<!--到达率-->
					<template slot-scope="{ row }" slot="reach_rate">
						{{row.reach_rate}}%
					</template>
					<!--转化数-->
					<template slot-scope="{ row }" slot="action">
						{{row.action}}
					</template>
					<!--转化率-->
					<template slot-scope="{ row }" slot="action_rate">
						{{row.action_rate}}%
					</template>
					<!--花费-->
					<template slot-scope="{ row }" slot="report_spend">
						{{row.report_spend}}
					</template>
					<!--千次展现均价-->
					<template slot-scope="{ row }" slot="ecpm">
						{{row.ecpm}}
					</template>
					<!--点击均价-->
					<template slot-scope="{ row }" slot="cpc">
						{{row.cpc}}
					</template>

					<!--操作-->
					<template slot-scope="{ row, index }" slot="handle">
						<div class="action-handle">
							<!-- 已删除不可在编辑 -->
							<Button :to="toDetail(row)" v-if="row.internal_verify !== 3 && row.creative_type >= 160" type="text" title="编辑" custom-icon="icon-edit"></Button>
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
				<img v-if="modalObj.type === 'pic'" :src="modalObj.source">
				<video v-if="modalObj.type === 'video'" :src="modalObj.source" controls="controls" :poster="modalObj.coverImg">
					您的浏览器不支持 video 标签。
				</video>
			</div>
		</Modal>

		<!--自定义列-->
		<custom-column ref="customColumn" :datalist="catchTableColList" @on-change="columnChange"></custom-column>
	</div>
</template>

<script>
import { showTitle, dataType } from '@/libs/util'
import { debounce, throttle, formatDate, number2Thousand } from '@/libs/tools'
import { getCreativeList, deleteCreative } from '@/api/tool'
import {columnFn} from '@/mixin/custom-column.js'
import customColumn from '@/components/local-custom-column/custom-column' // 自定义列
import { tableHeight } from '@/mixin/calc-table-height.js'

export default {
	name: 'financial-manage',
	mixins: [tableHeight, columnFn],
	components: {customColumn},
	data() {
		return {
			pageSize: 10, // 页码长度
			total_count: 0,
			currentPage: 1,
			tableDataList: [], // table数据
			tableLoadFlag: true, // table的loading
			noDataText: this.$config.noDataText,

			submitClock: false,
			filterSelect: [ // 筛选的下拉
				{
					value: 1,
					label: '审核通过'
				},
				{
					value: 2,
					label: '已拒绝'
				},
				{
					value: 0,
					label: '待审核'
				},
				{
					value: 3,
					label: '已删除'
				}
			],
			filterSearch: { // 筛选条件
				internal_verify: '', // 审核状态
				name_or_id: '' //请输入创意包名称或ID
			},
			catchTableColList: [
				{title: '创意包ID', key: 'buyer_creativeid', width: 80, isCheckColumn: true, isHideInColumn: true},
				{title: '创意包名称', key: 'creative_name', width: 300, isCheckColumn: true, isHideInColumn: true},
				{title: '素材+标题', slot: 'title', width: 300},
				{title: '创意形式', slot: 'creative_type', minWidth: 200},
				{title: '审核状态', slot: 'internal_verify', minWidth: 100, isHideInColumn: true},

				{title: '今日花费', key: 'spend_today', slot: 'spend_today', needCalcThou: true, minWidth: 120},
				{title: '广告展现', key: 'view', slot: 'view', minWidth: 90, needCalcThou: true,unit: '次'},
				{title: '广告点击', key: 'click', slot: 'click', minWidth: 90, needCalcThou: true,unit: '次'},
				{title: '点击率', key: 'ctr', slot: 'ctr', minWidth: 90, sortable: 'custom',unit: '%'},
				{title: '到达数', key: 'reach', slot: 'reach', minWidth: 90, needCalcThou: true,unit: '次'},
				{title: '到达率', key: 'reach_rate', slot: 'reach_rate', minWidth: 90, sortable: 'custom',unit: '%'},
				{title: '转化数', key: 'action', slot: 'action', minWidth: 90, needCalcThou: true,unit: '次'},
				{title: '转化率', key: 'action_rate', slot: 'action_rate', minWidth: 90, sortable: 'custom',unit: '%'},
				{title: '千次展现均价', key: 'ecpm', slot: 'ecpm', minWidth: 120, needCalcThou: true,unit: '元'},
				{title: '点击均价', key: 'cpc', slot: 'cpc', minWidth: 120, needCalcThou: true,unit: '元'},


				{title: '创建时间', key: 'c_time', width: 170},
				{title: '更新时间', key: 'm_time', width: 170},
				{title: '操作', slot: 'handle', width: 50, fixed: 'right', isHideInColumn: true}
			],

			modalFlag: false,
			modalObj: {} // 弹出层对象
		}
	},
	computed: {
		headTitle() {
			return showTitle(this.$route, this)
		}
	},
	created() {
		this.initData()
	},
	activated() {
		this.$Bus.$off('editEmitEvent')
		this.$Bus.$on('editEmitEvent', (msg) => {
			this.getTableList()
		})
	},
	mounted() {
		// this.initTableHeight({'search-line': {isAutoCalc: true, isInclude: true}, 'nav-handle-group': false}) // search-line的高度
	},
	methods: {
		/**
		 * [initData 初始化加载数据]
		 * @return {[type]} [description]
		 */
		initData() {
			this.getTableColumns()

			this.getTableList() // 获取表格数据
		},
		/**
		 * [creativeId2Text 创意形式]
		 * @param  {[type]} id [description]
		 * @return {[type]}    [description]
		 */
		creativeId2Text(id) {
			let _styleArr = this.$store.state.app.adStyleData // 广告样式
			let _sceneArr = this.$store.state.app.adSceneData // 广告场景

			let styleResult = _styleArr.filter(item=> item.id == id) // 筛选出样式
			let sceneResult = styleResult.length ? _sceneArr.filter(item => item.id == styleResult[0].parentId) : []

			return (styleResult[0] && sceneResult[0]) ? `${sceneResult[0].title} - ${styleResult[0].title}` : ''
		},

		/**
		 * [getCreativeList 获取列表的信息]
		 * @return {[type]} [description]
		 */
		getTableList() {
			this.tableLoadFlag = true

			let params = {
				page_size: this.pageSize,
				page_num: this.currentPage,
				name_or_id: this.filterSearch.name_or_id
			}

			if (this.filterSearch.internal_verify !== '') {
				params.internal_verify = this.filterSearch.internal_verify
			}

			getCreativeList(params).then(res => {

				this.tableLoadFlag = false
				if (res.code === 200) {
					this.tableDataList = !!res.data.list ? this.formatThouData(res.data.list) : [] // 处理千分位
					this.total_count = res.data.total
				} else if (res.code === 403) {
					this.noDataText = this.$config.noDataTextPer
				}
			}, err=> {
				if (err.code === 403) {
					this.noDataText = this.$config.noDataTextPer
				}
				this.tableLoadFlag = false
			})
		},

		/**
		 * [doDelete 删除]
		 * @param  {[type]} item [description]
		 * @return {[type]}     [description]
		 */
		doDelete(id) {
			this.$Modal.confirm({
				title: '确认删除？',
				onOk: () => {
					deleteCreative({buyer_creativeid: id}).then(res => {
						if (res.code === 200) {
							this.$Message.success('删除成功')
							this.getTableList()
						} else {
							this.$Message.error({content: '删除失败', duration: 3})
						}
					})
				}
			})
		},
		/**
		 * [doFilterList 筛选查询]
		 * @return {[type]} [description]
		 */
		doFilterList(val) {
			this.currentPage = 1
			this.getTableList()
		},
		/**
		 * [toNew 新建创意包]
		 * @param  {[type]} el [description]
		 * @return {[type]}    [description]
		 */
		toNew(id) {
			if(!!id) {
				this.$router.push({name: 'tool-creative-edit', query: { id }})
			} else {
				this.$router.push({name: 'tool-creative-edit'})
			}
		},
		/**
		 * [toDetail 详情链接]
		 * @param  {[type]} row [description]
		 * @return {[type]}     [description]
		 */
		toDetail(row) {
			return `/tool/creative/edit?id=${row.buyer_creativeid}`
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
		 * @param  {[type]} coverImg [当前index]
		 * @param  {[type]} type [显示类型  pic/video]
		 * @return {[type]}       [description]
		 */
		showImg(source, type, coverImg) {
			this.modalFlag = !this.modalFlag

			this.modalObj = {
				type,
				source,
				coverImg
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
		 * [formatThouData 格式化千分位]
		 * @param  {[type]} curArr [当前数组]
		 * @return {[type]}        [description]
		 */
		formatThouData(curArr) {
			// 需要计算千分位的数据
			let _calcArr = []
			this.catchTableColList.map(item=> {
				if(item.needCalcThou) {
					_calcArr.push(item.slot)
				}
			})

			// 处理千分位
			curArr.map(item => {
				for (let key in item) {
					if (_calcArr.includes(key) && dataType(item[key]) === 'number') {
						item[key] = this.number2Thousand(item[key])
					}
				}
			})

			return curArr
		},
		/**
		 * [number2Thousand 数字转千分位]
		 * @param  {[type]} val [description]
		 * @return {[type]}     [description]
		 */
		number2Thousand(number) {
			return number2Thousand(number)
		}
	},
	/**
	 * [beforeRouteLeave 路由跳转]
	 * @param  {[type]}   to   [如果路由跳转不是到媒体详情页，则销毁 $Bus]
	 * @param  {[type]}   from [description]
	 * @param  {Function} next [description]
	 * @return {[type]}        [description]
	 */
	beforeRouteLeave(to, from, next) {
		if (to.name !== 'tool-creative-edit') {
			this.$Bus.$off('editEmitEvent')
		}
		next()
	}
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
.mar-bot-10
	vertical-align: top
	margin-bottom: 10px
.creative-detail
	padding: 4px 0px
	font-size: 0px
	display: flex
	align-items: center
	.detail-material
		display: inline-block
		vertical-align: top
	.material-inner
		width: 100px
	.material-column
		width: 30px
		margin-right: 5px
		display: inline-block
		vertical-align: middle
		cursor: pointer
		height: 40px
		line-height: 40px
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
				height: 40px
				line-height: 40px
				font-size: 16px
				color: #FFF
				text-align: center
				&:hover
					background-color: #4084F8
	.detail-text
		width: 180px
		display: inline-block
		vertical-align: middle
		font-size: 14px
		.text-inner
			margin-left: 8px
			overflow: hidden
			display: -webkit-box
			-webkit-box-orient: vertical
			-webkit-line-clamp: 2
			word-break: break-word
.modal-inner
	margin-top: 40px
	text-align: center
	font-size: 0px
	height: 500px
	line-height: 500px
	img, video
		vertical-align: middle
		max-height: 100%
		max-width: 100%
.icon-why
	cursor:pointer
	color: #999
</style>
