<template>
	<div class="page-main">
		<div class="page-title page-has-line">
			<h2 class="title-line-tag">{{headTitle}}</h2>
			<div class="is-handler">
				<Button  type="primary" icon="md-add" @click="toNew()">新建转化</Button>
			</div>
		</div>

		<!-- tab标签切换 -->
		<!-- <slot name="tab"></slot> -->

		<Card :bordered="false" dis-hover class="has-table-card">
			<div class="search-line clearfix" ref="search-line">
				<!-- <div class="turn-number-card fl">近7日获取的转化数：<span class="in-number">{{action_of_last_7_days}}</span>次
					<Tooltip placement="right">
						<i class="iconfont icon-why"></i>
						<div slot="content">原始数据中的转化次数</div>
					</Tooltip>
				</div> -->
				<div class="fl">
					<Input class="i-margin-right-11 i-width-select mar-bot-10" v-model.trim="filterSearch.name_or_id" maxlength="100" placeholder="请输入转化名称或ID" :clearable="true" />
					<Button class="search" @click="doFilterList">搜索</Button>
				</div>
			</div>
			<div class="console-table">
				<Table highlight-row stripe border :columns="tableColList" :data="colDatList" :loading="tableLoadFlag" :no-data-text="noDataText">
					<!--转化名称-->
					<template slot-scope="{ row }" slot="site_name">
						<p class="text-row-ellipsis" :title="row.site_name">{{row.site_name}}</p>
					</template>
					<!--点击监测链接-->
					<template slot-scope="{ row }" slot="click_url">
						<a class="text-row-ellipsis" :title="row.click_url" target="_blank" :href="row.click_url">{{row.click_url}}</a>
					</template>
					<!--回调地址-->
					<template slot-scope="{ row }" slot="site_url">
						<a class="text-row-ellipsis" :title="row.site_url" target="_blank" :href="row.site_url">{{row.site_url}}</a>
					</template>
					<!--创建时间-->
					<template slot-scope="{ row }" slot="ctime">
						{{ row.ctime }}
					</template>
					<!--更新时间-->
					<template slot-scope="{ row }" slot="mtime">
						{{ row.mtime }}
					</template>
					<!--备注-->
					<template slot-scope="{ row }" slot="note_textarea">
						<p class="text-row-ellipsis" :title="row.note_textarea">{{row.note_textarea}}</p>
					</template>
					<!--操作-->
					<template slot-scope="{ row, index }" slot="action">
						<div class="action-handle">
							<Button :to="toEdit(row.sid)" type="text" title="编辑" custom-icon="icon-edit"></Button>
							<Button :to="toDetail(row.sid)" type="text" title="详情" custom-icon="icon-detail"></Button>
						</div>
					</template>
				</Table>
				<div class="page-center">
					<Page show-total show-sizer show-elevator placement="top" :total="total_count" :current.sync='currentPage' :page-size="pageSize" @on-change="pageNumberChange" @on-page-size-change="pageSizeChange"/>
				</div>
			</div>
		</Card>
	</div>
</template>

<script>
import { showTitle } from '@/libs/util'
import { debounce, throttle, formatDate } from '@/libs/tools'
import { getToolSiteList, editToolSite } from '@/api/tool'
import { tableHeight } from '@/mixin/calc-table-height.js'
import { inPageAccess } from '@/mixin/in-page-access.js'

export default {
	name: 'financial-manage',
	mixins: [tableHeight, inPageAccess],
	data() {
		return {
			pageSize: 10, // 页码长度
			total_count: 0,
			action_of_last_7_days: 0, // 近7日获取的转化数
			currentPage: 1,
			colDatList: [], // table数据
			tableLoadFlag: true, // table的loading
			noDataText: this.$config.noDataText,

			submitClock: false,
			filterSearch: { // 筛选条件
				name_or_id: '' // 监测站点ID
			},
			tableColList: [
				{
					title: '转化ID',
					key: 'sid',
					width: 90
				},
				{
					title: '转化名称',
					slot: 'site_name',
					minWidth: 300
				},
				{
					title: '关联单元数',
					key: 'related_order',
					width: 120
				},
				{
					title: '转化目标',
					key: 'site_target',
					width: 120
				},
				{
					title: '点击监测链接',
					slot: 'click_url',
					minWidth: 300
				},
				{
					title: '回调地址',
					slot: 'site_url',
					minWidth: 300
				},
				{
					title: '创建时间',
					key: 'ctime',
					width: 120
				},
				{
					title: '更新时间',
					key: 'mtime',
					width: 120
				},
				{
					title: '备注',
					slot: 'note_textarea',
					minWidth: 300
				},
				{
					title: '操作',
					slot: 'action',
					fixed: 'right',
					width: 90
				}
			]
		}
	},
	filters: {
		timeFormat(time, format) {
			console.log(time)
			return formatDate(time * 1000, format)
		}
	},
	computed: {
		headTitle() {
			return showTitle(this.$route, this)
		}
	},
	activated() {
		this.$Bus.$off('editEmitEvent')
		this.$Bus.$on('editEmitEvent', (msg) => {
			this.getMediaList() // 默认请求一次媒体列表数据
		})
	},
	created() {
		this.initData()
		// if (this._hasPageAccess()) {
		//     this.initData()
		// }
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
			this.getTableList() // 获取表格数据
		},
		/**
		 * [getToolSiteList 获取列表的信息]
		 * @return {[type]} [description]
		 */
		getTableList() {
			this.tableLoadFlag = true

			getToolSiteList({
				page_size: this.pageSize,
				page_num: this.currentPage,
				name_or_id: this.filterSearch.name_or_id
			}).then(res => {

				this.tableLoadFlag = false

				if (res.code === 200) {

					let _list = res.data.list || []

					// 拆分转化目标和备注
					_list.map(item=> {
						let _split = item.note ? item.note.split('|') : []
						item.site_target = _split[0]
						item.note_textarea = _split[1]
					})

					this.colDatList = _list
					this.total_count = res.data.total
					this.action_of_last_7_days = res.data.action_of_last_7_days || 0

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
		 * [toggleRow 暂停和开启]
		 * @param  {[type]} item [description]
		 * @return {[type]}      [description]
		 */
		toggleRow(item) {
			this.$Modal.confirm({
				title: item.status === 0 ? '确定启用？' : '确定暂停？',
				onOk: () => {
					// 0停用，1启用
					editToolSite({sid: item.sid, status: item.status === 0 ? 1 : 0}).then(res=> {
						if(res.code === 200) {
							this.$Message.success({content: '操作成功', duration: 3})
							this.getTableList()
						}
					})
				},
				onCancel: () => {
					console.log('取消')
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
		 * [toNew 路由跳转]
		 * @param  {[type]} el [description]
		 * @return {[type]}    [description]
		 */
		toNew(sid) {
			if(!!sid) {
				this.$router.push({name: 'site-app-edit', query: { sid }})
			} else {
				this.$router.push({name: 'site-app-edit'})
			}
		},
		/**
		 * [toEdit 详情链接]
		 * @param  {[type]} row [description]
		 * @return {[type]}     [description]
		 */
		toEdit(sid) {
			return `/tool/site/app/edit?sid=${sid}`
		},
		/**
		 * [toDetail 路由跳转]
		 * @param  {[type]} el [description]
		 * @return {[type]}    [description]
		 */
		toDetail(sid) {
			return `/tool/site/app/detail?sid=${sid}`
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
		if (to.name !== 'site-app-edit') {
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
.turn-number-card
	line-height: 32px
	height: 32px
	font-size: 14px
	.in-number
		font-size: 24px
		vertical-align: -2px
		margin: 0 4px
	.icon-why
		color: #999999
		cursor: pointer
.text-row-ellipsis
	a
		display: block
</style>
