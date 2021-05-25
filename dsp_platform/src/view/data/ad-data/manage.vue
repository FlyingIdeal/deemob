<template>
	<div class="page-main">
		<div class="page-title page-has-line">
			<h2 class="title-line-tag">{{headTitle}}</h2>
			<div class="is-handler">
        <Button type="text" @click="downStatement('day')" :loading="submitClock1" class="down">
          <i class="iconfont icon-download"></i>
          <span v-if="!submitClock1">下载日数据</span>
          <span v-else>下载中...</span>
        </Button>
				<Button type="text" @click="downStatement" :loading="submitClock" class="down">
					<i class="iconfont icon-download"></i>
					<span v-if="!submitClock">下载汇总数据</span>
					<span v-else>下载中...</span>
				</Button>
			</div>
		</div>
		<Card :bordered="false" dis-hover class="has-table-card">
			<div class="search-line" ref="search-line">
				<DatePicker
					class="i-margin-right-11 i-width-date mar-bot-10"
					:value="datePickerTime"
					:options="disabledDateOpt"
					:transfer="true"
					:clearable="false"
					format="yyyy-MM-dd"
					type="daterange"
					placeholder="请选择日期"
					@on-change="datePickerChange"
				/>
				<Select
					:transfer="true"
					filterable
					clearable
					v-model="filterSearch.campaign_id"
					class="i-margin-right-11 i-width-select mar-bot-10"
					placeholder="全部广告活动"
				>
					<Option v-for="item in adActivitySelectList" :value="item.campaignid" :key="item.campaignid">{{ item.campaignname }}({{item.campaignid}})</Option>
				</Select>
				<Select
					:transfer="true"
					filterable
					clearable
					v-model="filterSearch.order_id"
					class="i-margin-right-11 i-width-select mar-bot-10"
					placeholder="全部广告单元"
				>
					<Option v-for="item in adCellSelectList" :value="item.orderid" :key="item.orderid">{{ item.ordername }}({{item.orderid}})</Option>
				</Select>
				<Input clearable v-model="filterSearch.app_name" class="i-margin-right-11 i-width-select mar-bot-10" placeholder="请输入应用名称"/>
				<Input clearable v-model="filterSearch.slot_name" class="i-margin-right-11 i-width-select mar-bot-10" placeholder="请输入广告位名称"/>

				<Input type="textarea" class="i-margin-right-11 i-width-input-long mar-bot-10" v-model.trim="filterSearch.slot_id_arr_textarea"
               @on-keyup="filterSearch.slot_id_arr_textarea = filterSearch.slot_id_arr_textarea.replace(/[\u4E00-\u9FA5]|[A-Za-z]/g,'')"
               :rows="1" :autosize="{maxRows:1, minRows: 1}" placeholder="输入广告位ID,多个用逗号隔开" />

				<Button class="search" @click="doFilterList">搜索</Button>
			</div>
			<div class="console-table">
				<Table
					highlight-row
					stripe
					border
					:columns="tableColList"
					:data="colDatList"
					:loading="tableLoadFlag"
					@on-sort-change="sortChange"
					show-summary
					sum-text="总计"
					:summary-method="handleSummary"
					:no-data-text="noDataText"
				>
					<!--广告位ID-->
					<template slot-scope="{ row }" slot="slot_id">
						{{row.slot_id}}
					</template>
					<!--广告位名称-->
					<template slot-scope="{ row }" slot="slot_name">
						<p class="text-row-ellipsis" :title="row.slot_name">{{row.slot_name || '-'}}</p>
					</template>
					<!--应用名称-->
					<template slot-scope="{ row }" slot="app_name">
						<p class="text-row-ellipsis" :title="row.app_name">{{row.app_name || '-'}}</p>
					</template>
					<!--广告展现-->
					<template slot-scope="{ row }" slot="view">
						<span>{{ number2Thousand(row.view) }}</span>
					</template>
					<!--广告点击-->
					<template slot-scope="{ row }" slot="click">
						<span>{{ number2Thousand(row.click) }}</span>
					</template>
					<!--点击率-->
					<template slot-scope="{ row }" slot="ctr">
						<span>{{ number2Thousand(row.ctr) }}%</span>
					</template>
					<!--到达数-->
					<template slot-scope="{ row }" slot="reach">
						<span>{{ number2Thousand(row.reach) }}</span>
					</template>
					<!--到达率-->
					<template slot-scope="{ row }" slot="reach_rate">
						<span>{{ number2Thousand(row.reach_rate) }}%</span>
					</template>
					<!--转化数-->
					<template slot-scope="{ row }" slot="action">
						<span>{{ number2Thousand(row.action) }}</span>
					</template>
					<!--转化率-->
					<template slot-scope="{ row }" slot="action_rate">
						<span>{{ number2Thousand(row.action_rate) }}%</span>
					</template>
					<!--花费-->
					<template slot-scope="{ row }" slot="report_spend">
						<span>{{ number2Thousand(row.report_spend) }}</span>
					</template>
					<!--千次展现均价-->
					<template slot-scope="{ row }" slot="ecpm">
						<span>{{ number2Thousand(row.ecpm) }}</span>
					</template>
					<!--点击均价-->
					<template slot-scope="{ row }" slot="cpc">
						<span>{{ number2Thousand(row.cpc) }}</span>
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
import {showTitle, filterBatchQuery} from '@/libs/util'
import {createObjectURL, number2Thousand} from '@/libs/tools'
import {getDataSlotList, getDataSlotUrl} from '@/api/data'
import {tableHeight} from '@/mixin/calc-table-height.js'
import {inPageAccess} from '@/mixin/in-page-access.js'
import {getAdCampaignList, getAdUnitList} from '@/api/advertising'
import {getDownLoadXls} from '@/api/common'

export default {
	name: 'financial-manage',
	mixins: [tableHeight, inPageAccess],
	data() {
		return {
			noDataText: this.$config.noDataText,
			submitClock: false,
			submitClock1: false,
			sumData: [],
			colDatList: [],
			datePickerTime: [], // 时间选择器
			filterSearch: { // 筛选条件
				campaign_id: '', // 广告活动
				order_id: '', // 广告单元
				app_name: '', // 应用名称
				slot_name: '', // 广告位名称
				order: '',
				start_date: '',
				end_date: '',
				slot_id_arr: [], // 广告位ID
				slot_id_arr_textarea: null
			},
			adActivitySelectList: [], // 广告活动列表
			adCellSelectList: [], // 广告单元列表
			pageSize: 10,
			total_count: 0,
			currentPage: 1,
			disabledDateOpt: { // 创建支出时不可选择的时间范围
				disabledDate(date) {
					const time = date.getTime()
					const curTime = new Date().getTime()
					return time < new Date('2020-09-01 00:00:00').getTime() || time > curTime
				}
			},
			tableColList: [
				{title: '广告位ID', key: 'slot_id', slot: 'slot_id', width: 120},
				{title: '广告位名称', key: 'slot_name', slot: 'slot_name', minWidth: 250, noNeedCalcThou: true},
				{title: '应用名称', key: 'app_name', slot: 'app_name', minWidth: 150, noNeedCalcThou: true},
				{title: '广告展现', key: 'view', slot: 'view', minWidth: 100, sortable: 'custom'},
				{title: '广告点击', key: 'click', slot: 'click', minWidth: 100, sortable: 'custom'},
				{title: '点击率', key: 'ctr', slot: 'ctr', minWidth: 100, sortable: 'custom'},
				{title: '到达数', key: 'reach', slot: 'reach', minWidth: 100, sortable: 'custom'},
				{title: '到达率', key: 'reach_rate', slot: 'reach_rate', minWidth: 100, sortable: 'custom'},
				{title: '转化数', key: 'action', slot: 'action', minWidth: 100, sortable: 'custom'},
				{title: '转化率', key: 'action_rate', slot: 'action_rate', minWidth: 150, sortable: 'custom'},
				{title: '花费', key: 'report_spend', slot: 'report_spend', minWidth: 150, sortable: 'custom'},
				{title: '千次展现均价', key: 'ecpm', slot: 'ecpm', minWidth: 150, sortable: 'custom'},
				{title: '点击均价', key: 'cpc', slot: 'cpc', minWidth: 100, sortable: 'custom'}
			]
		}
	},
	computed: {
		headTitle() {
			return showTitle(this.$route, this)
		}
	},
	created() {
		if (this._hasPageAccess()) {
			this.initData()
		}
	},
	mounted() {
		// this.initTableHeight({'search-line': {isAutoCalc: true, isInclude: true}, 'nav-handle-group': false}) // search-line的高度
	},
	methods: {
		/**
		 * [handleSummary 表格的总计]
		 * @return {[type]}
		 */
		handleSummary ({ columns, data }) {
			const sums = {}
			columns.forEach((column, index) => {
				let key = column.slot
				if (key === 'slot_id') {
					sums[key] = {
						key,
						value: '合计'
					}
					return
				}
				if (!column.noNeedCalcThou) {
					if (column.title && column.title.indexOf('率') > -1) {
						sums[key] = {
							key,
							value: this.number2Thousand(this.sumData[key]) + '%'
						}
					} else {
						sums[key] = {
							key,
							value: this.number2Thousand(this.sumData[key])
						}
					}
				} else {
					sums[key] = {
						key,
						value: '-'
					}
				}
			})
			return sums
		},
		/**
		 * [_getActivityList 获取广告活动列表]
		 * @return {[type]} [description]
		 */
		_getActivityList() {
			getAdCampaignList({
				page_num: 1,
				page_size: 0
			}).then(res => {
				let data = res.data
				if (res.code === 200) {
					this.adActivitySelectList = data.list
				}
			})
		},
		/**
		 * [_getCellList 获取广告单元列表]
		 * @return {[type]} [description]
		 */
		_getCellList() {
			getAdUnitList({
				page_num: 1,
				page_size: 0
			}).then(res => {
				let data = res.data
				if (res.code === 200) {
					this.adCellSelectList = data.list
				}
			})
		},
		/**
		 * [initData 初始化加载数据]
		 * @return {[type]} [description]
		 */
		initData() {
			this.initDatePickerTime() // 初始化时间
			this.getTableList() // 获取表格数据
			this._getCellList()
			this._getActivityList()
		},
		number2Thousand(number) {
			return number2Thousand(number)
		},
		/**
		 * [downStatement 下载流量表格]
		 * @return {[type]} [description]
		 */
		/**
		 * [downStatement 下载广告位数据]
		 * @return {[type]} [description]
		 */
		downStatement(type) {
			let params = {
				...this.getAxiosParams(),
				...{
					page_size: 0,
					page_num: 1
				}
			}
      type === 'day' ? params.group_by = ['date'] : ''
			let down = {
				url: getDataSlotUrl(params),
				method: 'GET'
			}
      let text = ''
      type === 'day' ? this.submitClock1 = true : this.submitClock = true
      type === 'day' ? text = '广告位日数据' : text = '广告位汇总数据'

			getDownLoadXls(down).then(res => {
				if (res.code === 200) {
					let filename = `${this.filterSearch.start_date}~${this.filterSearch.end_date}${text}.xlsx`
					createObjectURL(res.data.url, filename)
				}
        type === 'day' ? this.submitClock1 = false : this.submitClock = false
			})
		},

		/**
		 * [sortChange 排序]
		 * @return {[type]} [description]
		 */
		sortChange(col, key, order) {
			if (col.order === 'asc') {
				this.filterSearch.order = col.column.slot
				this.currentPage = 1
				this.getTableList()
			} else if (col.order === 'desc') {
				this.filterSearch.order = col.column.slot + ' ' + col.order
				this.currentPage = 1
				this.getTableList()
			}
		},
		/**
		 * [pageNumberChange 翻页的修改]
		 * @return {[type]} [description]
		 */
		pageNumberChange(val) {
			this.currentPage = val
			this.getTableList()
		},
		/**
		 * [pageNumberChange 翻页页数的修改]
		 * @return {[type]} [description]
		 */
		pageSizeChange(size) {
			this.pageSize = size
			this.currentPage = 1
			this.getTableList()
		},
		/**
		 * [getTimeData 筛选-设置时间的默认值 - 默认7天的数据]
		 * @return {[type]} [description]
		 */
		initDatePickerTime() {
			const end = new Date()
			const start = new Date()
			start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
			this.datePickerTime = [start, end]
			this.filterSearch.start_date = this.getLocalTime(start.getTime())
			this.filterSearch.end_date = this.getLocalTime(end.getTime())
		},
		getLocalTime(tt) {
			let date = new Date(tt)
			let Y = date.getFullYear()
			let M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1)
			let D = date.getDate() < 10 ? '0' + (date.getDate()) : date.getDate()
			let data = Y + '-' + M + '-' + D
			return data
		},
		/**
		 * [datePickerChange 时间选择器发生变化]
		 * @param  {[type]} time [description]
		 * @return {[type]}      [description]
		 */
		datePickerChange(time) {
			let start = new Date(time[0]).getTime()
			let end = new Date(time[1]).getTime()
			if (end - start > 3 * 2678400000) {
				this.$Message.error('选择日期不能超过3月')
				this.initDatePickerTime()
			} else {
				this.filterSearch.start_date = time[0]
				this.filterSearch.end_date = time[1]
			}
		},

		/**
		 * [getAdMaterialList 获取列表的信息]
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

			getDataSlotList(params).then(res => {
				this.tableLoadFlag = false
				if (res.code === 200) {
					this.colDatList = res.data.list
					this.sumData = res.data.total_row
					this.total_count = res.data.total_count
				} else if (res.code === 403) {
					this.noDataText = this.$config.noDataTextPer
				}
			}, err=> {
				this.tableLoadFlag = false
			})
		},
		/**
		 * [getAxiosParams 获取下载和列表的url参数]
		 * @return {[type]} [description]
		 */
		getAxiosParams() {

			let _filter = this.filterSearch

			let params = {
				order: _filter.order,
				start_date: _filter.start_date,
				end_date: _filter.end_date,
			}

			// 广告活动
			!!_filter.campaign_id && (params.campaign_id = _filter.campaign_id)

			// 广告单元
			!!_filter.order_id && (params.order_id = _filter.order_id)

			// 应用名称
			!!_filter.app_name && (params.app_name = _filter.app_name)

			// 广告位名称
			!!_filter.slot_name && (params.slot_name = _filter.slot_name)

			// 广告位ID批量
			!!_filter.slot_id_arr.length && (params.slot_id_arr = _filter.slot_id_arr)

			return params
		},
		/**
		 * [doFilterList 筛选查询]
		 * @return {[type]} [description]
		 */
		doFilterList() {
			this.currentPage = 1

            let _filter = this.filterSearch

            // 广告位ID批量
            _filter.slot_id_arr = filterBatchQuery({value: _filter.slot_id_arr_textarea, type: 'number'})

			this.getTableList()
		}
	}
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
.mar-bot-10
	vertical-align: top
	margin-bottom: 10px
/deep/ .console-table
	.ivu-table-tbody
		tr:last-child
			td
				border-bottom 1px solid #e8eaec
</style>
