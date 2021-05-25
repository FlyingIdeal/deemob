<!-- by 李想 -->
<template>
	<div class="page-main">
		<div class="page-title page-has-line clearfix">
			<h2 class="title-line-tag">{{headTitle}}</h2>
			<div class="is-handler">
				<Button type="text" @click="toggleEchart('echart')" v-show="navType === 'table'">
					<i class="iconfont icon-echart"></i>
					查看趋势图
				</Button>
				<Button type="text" @click="toggleEchart('table')" v-show="navType === 'echart'">
					<i class="iconfont icon-data-table"></i>
					查看数据
				</Button>
        <Button type="text" class="has-img-icon" @click="doColumns"  v-show="navType === 'table'">
          <i class="column is-handler-icon"></i>
          <span>自定义列</span>
        </Button>
				<Button type="text" :loading="submitClock" @click="downStatement">
					<i class="iconfont icon-download"></i>
					<span v-if="!submitClock">下载报表</span>
					<span v-else>下载中...</span>
				</Button>
			</div>
		</div>

		<!-- tab标签切换 -->
		<slot name="tab"></slot>

		<Card :bordered="false" dis-hover class="has-table-card">

			<div class="search-line" ref="search-line">

				<DatePicker class="i-margin-right-11 i-width-time" :clearable="false" type="date" :transfer="true" :value="datePickerTime" :options="datePickerDisabled" format="yyyy-MM-dd" placeholder="请选择日期"  @on-change="datePickerChange"></DatePicker>

				<TimePicker :steps="[1, 60, 60]" placeholder="全部时间" format="HH:mm" class="i-margin-right-11 i-width-status" @on-change="timeChange"></TimePicker>

				<Select
					class="i-margin-right-11 i-width-select"
					v-model="filterSearch.campaign_id"
					filterable
					clearable
					:transfer="true"
					placeholder="请输入广告活动名称或ID">
					<Option v-for="item in adCampaignList" :value="item.campaignid" :key="item.campaignid">{{ item.campaignname }}({{ item.campaignid }})</Option>
				</Select>

				<Select
					class="i-margin-right-11 i-width-select"
					v-model="filterSearch.order_id"
					filterable
					clearable
					:transfer="true"
					placeholder="请输入广告单元名称或ID">
					<Option v-for="item in adUnitList" :value="item.orderid" :key="item.orderid" :label="item.ordername">{{ item.ordername }}({{ item.orderid }})</Option>
				</Select>
				<Input
					type="textarea"
					class="i-margin-right-11 i-width-input-long mar-bot-10"
					v-model.trim="filterSearch.creative_name_arr_textarea"
					:rows="1"
					:autosize="{maxRows:1, minRows: 1}"
					placeholder="输入广告名称,多个用逗号隔开"
				/>
				<Input
					type="textarea"
					class="i-margin-right-11 i-width-input-long mar-bot-10"
					v-model.trim="filterSearch.creative_id_arr_textarea"
					:rows="1"
					:autosize="{maxRows:1, minRows: 1}"
					@on-keyup="filterSearch.creative_id_arr_textarea = filterSearch.creative_id_arr_textarea.replace(/[\u4E00-\u9FA5]|[A-Za-z]/g,'')"
					placeholder="输入广告ID,多个用逗号隔开"
			   	/>
				<Button class="search" @click="doFilterList">搜索</Button>
			</div>

<!--			<div class="dimension-card">-->
<!--				<div class="check-name">数据维度</div>-->
<!--				<CheckboxGroup class="check-group" v-model="filterSearch.group" @on-change="groupChange">-->
<!--					<Checkbox label="date" :disabled="navType === 'echart'">时间</Checkbox>-->
<!--					<Checkbox label="campaignid" v-show="navType === 'table'">广告活动</Checkbox>-->
<!--					<Checkbox label="orderid" v-show="navType === 'table'">广告单元</Checkbox>-->
<!--					 <Checkbox v-show="navType === 'table'" label="adid">广告</Checkbox>-->
<!--				</CheckboxGroup>-->
<!--			</div>-->

			<!-- table数据 -->
			<div class="data-table console-table" v-show="navType === 'table'">
				<Table :loading="tableLoadFlag" border stripe :columns="tableColList" :data="effectData" :height="tableHeight" show-summary sum-text="总计" :summary-method="handleSummary" @on-sort-change="sortChange" :no-data-text="noDataText">
					<!-- 日期-->
					<template slot-scope="{ row }" slot="date">
						{{ row.date.substring(11, 19) }}
					</template>
					<!-- 广告活动ID-->
					<template slot-scope="{ row }" slot="campaignid">
						<p :title="row.campaignid">{{row.campaignid || '-'}}</p>
					</template>
					<!-- 广告活动-->
					<template slot-scope="{ row }" slot="campaignname">
						<a class="text-cursor" :title="row.campaignname" :href="toCamLink(row)">{{row.campaignname || '-'}}</a>
					</template>
					<!-- 广告单元ID-->
					<template slot-scope="{ row }" slot="orderid">
						<p :title="row.orderid">{{row.orderid || '-'}}</p>
					</template>
					<!-- 广告单元-->
					<template slot-scope="{ row }" slot="ordername">
						<p class="text-cursor" :title="row.ordername" @click="toUnitLink(row)">{{row.ordername || '-'}}</p>
					</template>
					<!-- 广告ID-->
					<template slot-scope="{ row }" slot="adid">
						<p>{{row.adid || '-'}}</p>
					</template>
					<!-- 广告-->
					<template slot-scope="{ row }" slot="creativename">
						<a class="text-cursor" :title="row.adname" :href="toAdCreative(row)">{{row.adname || '-'}}</a>
					</template>
          <!-- 素材ID-->
          <template slot-scope="{ row }" slot="matterID">
            <p v-if="filterSearch.group.indexOf('adid') >-1" :title="row.material_ids">{{row.material_ids || '-'}}</p>
            <p v-else> - </p>
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
				</Table>
				<div class="page-center">
					<Page show-total show-sizer show-elevator placement="top" :total="total_count" :current.sync='currentPage' :page-size="pageSize" @on-change="changePage" @on-page-size-change="sizeChange"/>
				</div>
			</div>

			<!-- echart数据 -->
			<div class="chart-card" v-show="navType === 'echart'">
				<t-echart ref="tEchart" :selectArr="echartArr"></t-echart>
			</div>
		</Card>
		<!--自定义列-->
		<custom-column ref="customColumn" :datalist="catchTableColList" @on-change="columnChange"></custom-column>
		</div>
</template>

<script>
import {showTitle, dataType, filterBatchQuery} from '@/libs/util'
import { debounce, throttle, formatDate, number2Thousand, createObjectURL } from '@/libs/tools'
import {getDownLoadXls} from '@/api/common'
import { getDataEffectHour, getDataEffectHourUrl } from '@/api/data'
import {getAdUnitList} from '@/api/advertising'
import { tableHeight } from '@/mixin/calc-table-height.js'
import tEchart from '../../module/echart'
import {mapActions} from 'vuex'
import { inPageAccess } from '@/mixin/in-page-access.js'
import { effectHourColumns } from '../colList'
import { columnFn } from '@/mixin/custom-column.js'
import customColumn from '@/components/local-custom-column/custom-column' // 自定义列

export default {
	mixins: [tableHeight, inPageAccess, columnFn],
	components: { tEchart, customColumn },
	data() {
		return {
			pageSize: 10, // 默认10条
			total_count: 0,
			currentPage: 1,
			noDataText: this.$config.noDataText,

			filterTime: null, // 时间选择器
			datePickerTime: null, // 日期选择器
			datePickerDisabled: { // 时间容器，禁止选择时间
				disabledDate(date) {
					let disableData = Date.parse(new Date('2020-12-01 00:00:00'))
					return date.valueOf() >= Date.now() || date.valueOf() < disableData
				}
			},

			filterSearch: { // 筛选条件
				campaign_id: '', // 广告活动ID
				order_id: '', // 广告单元ID
				group: ['date'], // 聚合参数
				order: null, // 排序
				start_date: null, // 开始日期
				end_date: null, // 结束日期
				creative_name_arr_textarea: '', // 广告名称文本
				creative_name_arr: '', // 广告的名称
				creative_id_arr_textarea: '', // 广告ID的文本
				creative_id_arr: [] // 广告ID
			},
			catchTableColList: effectHourColumns(this),
			catchGroup: ['date'], // 缓存聚合参数, 默认和filterSearch.group初始状态相同

			groupByArr: [], // 聚合条件，最后下载使用
			navType: 'table', // nav切换, table / echart

			effectData: [], // 表格数据
			effectDataColumns: [], // 表格 - columns
			effectDataStatics: [], // 表格数据合计

			tableLoadFlag: true,
			submitClock: false,
			adCampaignList: [], // 广告活动列表
			adUnitList: [], // 广告单元列表
			echartArr: [], // 数据表筛选列表
      		saveType: 'effectHourColumns'
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
	mounted() {
		// this.initTableHeight({'search-line': {isAutoCalc: true, isInclude: true}, 'nav-handle-group': false, 'table-has-amount': true}) // search-line的高度
	},
	methods: {
		...mapActions([
			'getAdCampaignList',
			'getAdUnitList',
			'getAdCreativeList'
		]),
		/**
		 * [injectData 注入数据]
		 * @param  {[type]} obj [description]
		 * @return {[type]}     [description]
		 */
		injectData(obj) {

			if(!obj || !obj._tag) {
				return
			}

			console.log(`广告活动=${obj.campaignId}, 广告单元=${obj.orderId}`)
			if (!!obj.campaignId) {
				this.filterSearch.campaign_id = obj.campaignId
				this.filterSearch.order_id = ''
			}

			if (!!obj.orderId) {
				this.filterSearch.campaign_id = ''
				this.filterSearch.order_id = obj.orderId
			}

			this.initData()
		},
		/**
		 * [initData 初始化加载数据]
		 * @return {[type]} [description]
		 */
		initData() {
			this.initDatePickerTime() // 初始化筛选时间
			// this.initEffectColumns() // 初始化表格头
			this.getTableColumns() // 初始化表格头
			this._getAdCampaignList() // 广告活动
			this.getAdUnitList() // 广告单元

			// this.getDataEffectHour() // 获取表格数据
			this.initMoniter() // 初始化加载图标

		},
		/**
		 * [doFilterList 筛选查询]
		 * @return {[type]} [description]
		 */
		doFilterList() {
			this.currentPage = 1
			let _filter = this.filterSearch
			// 创意包的名称搜索
			this.filterSearch.creative_name_arr = filterBatchQuery({value: _filter.creative_name_arr_textarea})
			// 创意包的id
			this.filterSearch.creative_id_arr = filterBatchQuery({value: _filter.creative_id_arr_textarea, type: 'number'})

			this.getDataEffectHour()
			this.initMoniter()
		},

		/**
		 * [changePage 改变页码]
		 * @param  {[type]} val [description]
		 * @return {[type]}     [description]
		 */
		changePage(val) {
			this.currentPage = val
			this.getDataEffectHour()
		},

		/**
		 * [sizeChange 切换每页条数时的回调]
		 * @param  {[type]} size [description]
		 * @return {[type]}      [description]
		 */
		sizeChange(size) {
			this.pageSize = size
			this.getDataEffectHour()
		},

		/**
		 * [groupChange group聚合数据发生变化]
		 * @return {[type]} [description]
		 */
		groupChange(arr) {

			if(arr.length < 1) {
				this.filterSearch.group = [...this.catchGroup]
				this.$Message.error({ content: '数据维度至少保留一项', duration: 3})
				return
			}

			this.catchGroup = arr
			this.currentPage = 1

			this.initEffectColumns()
			this.getDataEffectHour()
		},

		/**
		 * [toggleEchart 切换查看数据/table]
		 * @param  {[type]} type [description]
		 * @return {[type]}      [description]
		 */
		toggleEchart(type) {

			if(type === 'echart') {
				this.filterSearch.group = ['date']
			} else if (type === 'table') {
				this.filterSearch.group = [...this.catchGroup]
			}

			this.navType = type
		},
		/**
		 * [getAxiosParams 获取参数]
		 * @return {[type]} [description]
		 */
		getAxiosParams() {
			let _filter = this.filterSearch

			let params = {
				start_date: _filter.start_date,
				end_date: _filter.end_date
			}

			// 广告活动
			!!_filter.campaign_id && (params.campaign_id = _filter.campaign_id)

			// 广告单元
			!!_filter.order_id && (params.order_id = _filter.order_id)

			// 广告名称
			!!_filter.creative_name_arr ? _filter.creative_name_arr.length === 1 ? params.ad_name = _filter.creative_name_arr[0] : params.ad_names = _filter.creative_name_arr : ''

			// 广告ID
			!!_filter.creative_id_arr ? _filter.creative_id_arr.length === 1 ? params.ad_id = _filter.creative_id_arr[0] : params.ad_ids = _filter.creative_id_arr : ''

			return params
		},
		/**
		 * [changeCampaign 广告活动的修改]
		 * @param  {[type]} size [description]
		 * @return {[type]}      [description]
		 */
		changeCampaign(val) {
			this.getAdUnitList(val)
		},
		/**
		 * [getAdUnitList 获取广告单元]
		 * @return {[type]} [description]
		 */
		getAdUnitList(val) {
			let obj = {}
			let campaignid_arr = []
			val ? campaignid_arr.push(parseInt(val)) : ''
			campaignid_arr.length > 0 ? obj.campaignid_arr = campaignid_arr : ''
			getAdUnitList(obj).then(res => {
				this.tableLoadFlag = false
				let data = res.data
				if (res.code === 200) {
					this.adUnitList = data.list ? data.list : []
				}
			})
		},

		/**
		 * [initMoniter echart数据]
		 * @return {[type]} [只以时间维度统计]
		 */
		initMoniter() {
			let params = {
				...this.getAxiosParams(),
				...{
					group: ['date']
				}
			}
			getDataEffectHour(params).then(res => {
				let obj = {}
				if (res.code === 200) {

					let _list = res.data.list.sort(function(p, n) {
						return new Date(p.date).getTime() - new Date(n.date).getTime()
					})

					_list.map(item => {
						for (let key in item) {
							let temp = !!obj[key] ? obj[key] : []
							obj[key] = temp.concat(item[key])
						}
					})
				}
				this.$refs.tEchart.initData(obj)
			})
		},
		/**
		 * [getDataEffectHour 获取表格数据]
		 * @return {[type]} [description]
		 */
		getDataEffectHour() {
			let params = {
				...this.getAxiosParams(),
				...{
					group: this.filterSearch.group,
					order: this.filterSearch.order,
					page_num: this.currentPage,
					page_size: this.pageSize
				}
			}
			// 统计只与筛选条件有关，与数据维度无关
			let staticParams = {
				...this.getAxiosParams(),
				...{
					group: []
				}
			}

			this.tableLoadFlag = true

			Promise.all([
				getDataEffectHour(params),
				getDataEffectHour(staticParams)
			]).then(res => {
				if (res[0].code === 200) {
					this.total_count = res[0].data.total_count // 总数
					this.effectData = this.formatThouData(res[0].data.list) // 处理千分位
				} else if (res[0].code === 403) {
					this.noDataText = this.$config.noDataTextPer
				}

				if (res[1].code === 200) {
					this.effectDataStatics = this.formatThouData(res[1].data.list) // 合计.千分位格式化
				}

				this.tableLoadFlag = false
			}, err => {
				this.tableLoadFlag = false
			})
		},

		/**
		 * [initEffectColumns 数据表格的列]
		 * @return {[type]} [description]
		 */
		initEffectColumns () {

			const _columns = effectHourColumns(this)

			let resultArr = []
			let echartArr = [] // 只时间维度

			_columns.map(item => {
				// table
				if (!item.groupKey) {
					resultArr.push(item)
				} else {
					if (this.filterSearch.group.includes(item.groupKey)) {
						resultArr.push(item)
					}
				}

				// echart
				if(item.effectHourChart) {
					echartArr.push(item)
				}
			})

			this.effectDataColumns = resultArr
			this.echartArr = echartArr // 图标
		},
		/**
		 * [sortChange 表格的排序]
		 * @param  {[type]} col   [description]
		 * @param  {[type]} key   [description]
		 * @param  {[type]} order [description]
		 * @return {[type]}       [description]
		 */
		sortChange(col, key, order) {
			if (col.order === 'asc') {
				this.filterSearch.order = col.column.slot
				this.currentPage = 1
				this.getDataEffectHour()
			} else if (col.order === 'desc') {
				this.filterSearch.order = col.column.slot + ' ' + col.order
				this.currentPage = 1
				this.getDataEffectHour()
			}
		},
		/**
		 * [formatThouData 格式化千分位]
		 * @param  {[type]} curArr [当前数组]
		 * @return {[type]}        [description]
		 */
		formatThouData(curArr) {
			// 需要计算千分位的数据
			let _calcArr = []
			this.effectDataColumns.map(item=> {
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
		 * [handleSummary 总计]
		 * @param  {[type]} options.columns [description]
		 * @param  {[type]} options.data    [description]
		 * @return {[type]}                 [description]
		 */
		handleSummary({columns, data}) {
			let sumData = this.effectDataStatics[0]
			let sums = {}
			columns.forEach((column, index) => {

				let key = column.slot

				if (key === 'date') {
					sums[key] = {
						key,
						value: '合计'
					}
					return
				}

				sums[key] = {
					key,
					value: column.title.indexOf('率') > -1 ? `${sumData[key]}%` : (column.needCalcThou ? sumData[key] : '-')
				}
			})
			return sums
		},
		/**
		 * [downStatement 下载流量表格]
		 * @return {[type]} [description]
		 */
		downStatement() {

			// let form = {...this.filterSearch}
			// form.group = ['date', 'campaignid', 'orderid']
			let form = {
				...this.getAxiosParams(),
				...{
					group: ['date', 'campaignid', 'orderid', 'adid'],
					order: this.filterSearch.order
				}
			}

			let params = {
				method: 'GET',
				url: getDataEffectHourUrl(form)
			}

			this.submitClock = true

			getDownLoadXls(params).then(res => {

				this.submitClock = false

				if (res.code === 200) {
					let url = res.data.url
					let filename = `${this.filterSearch.start_date.slice(0, 16)}~${this.filterSearch.end_date.slice(0, 16)} 小时报表.xlsx`
					createObjectURL(url, filename)
				}
			})
		},

		/**
		 * [getTimeData 筛选-设置时间的默认值 - 默认当天]
		 * @return {[type]} [description]
		 */
		initDatePickerTime() {

			const localDate = formatDate(new Date(), 'yyyy-MM-dd') // 当前天

			this.datePickerTime = localDate
			this.filterSearch.start_date = `${localDate} 00:00:00`
			this.filterSearch.end_date = `${localDate} 23:59:59`
		},

		/**
		 * [timeChange 时间发生变化时触发]
		 * @return {[type]} [description]
		 */
		timeChange(time) {
			this.filterTime = time.slice(0, 2)
			this.concatFilterData()
		},

		/**
		 * [datePickerChange 时间选择器发生变化]
		 * @param  {[type]} time [description]
		 * @return {[type]}      [description]
		 */
		datePickerChange(time) {
			this.datePickerTime = time
			this.concatFilterData()
		},

		/**
		 * [concatFilterData 合并筛选时间]
		 * @return {[type]} [description]
		 */
		concatFilterData() {
			let time = this.datePickerTime
			this.filterSearch.start_date = !!this.filterTime ? `${time} ${this.filterTime}:00:00` : `${time} 00:00:00`
			this.filterSearch.end_date = !!this.filterTime ? `${time} ${this.filterTime}:59:59` : `${time} 23:59:59`
		},
		/**
		 * [_getAllAdType 获取广告活动]
		 * @return {[type]} [description]
		 */
		async _getAdCampaignList() {
			let storeUser = this.$store.state.user
			let resArr = storeUser.adCampaignList.length ? storeUser.adCampaignList : await this.getAdCampaignList()

			this.adCampaignList = resArr
		},
		/**
		 * [number2Thousand 数字转千分位]
		 * @param  {[type]} val [description]
		 * @return {[type]}     [description]
		 */
		number2Thousand(number) {
			return number2Thousand(number)
		},
		/**
		 * [toLink 路由跳转]
		 * @param  {[type]} el [description]
		 * @return {[type]}    [description]
		 */
		toLink(name) {
			this.$router.push({ name })
		},
		/**
		 * [toCamLink 跳转到广告活动]
		 * @param  {[type]} row [description]
		 * @return {[type]}     [description]
		 */
		toCamLink(row) {
			return `/advertising/activity/edit?campaignid=${row.campaignid}`

			// this.$router.push({name: 'activity-edit', query: {campaignid: row.campaignid}})
		},
		/**
		 * [toUnitLink 跳转到广告单元]
		 * @param  {[type]} row [description]
		 * @return {[type]}     [description]
		 */
    toUnitLink(row) {
      let obj = {}
      obj.page_size = 10
      obj.page_num = 1
      let orderId = []
      orderId.push(row.orderid)
      obj.orderid_arr = orderId
      getAdUnitList(obj).then(res => {
        if (res.code === 200) {
          let data = res.data.list[0]
          this.$router.push({name: 'unit-edit', query: {orderId: row.orderid, createType: data.creative_form_id, billing: data.billing_method }})
        }
      })
    },
		/**
		 * [toAdCreative 跳转到广告]
		 * @param  {[type]} row [description]
		 * @return {[type]}     [description]
		 */
		toAdCreative(row) {
			return `/advertising/creative/edit?adId=${row.adid}`

			// this.$router.push({name: 'advertising-creative-edit', query: {adId: row.adid}})
		}
	},
	watch: {
		tableColList(val) {
			let arr = []
			val.map(item => {
				if (item.groupKey) {
					arr.push(item.groupKey)
				}
			})

			this.filterSearch.group = [...new Set(arr)]
			this.catchGroup = [...new Set(arr)]

			this.currentPage = 1

			this.initEffectColumns()
			this.getDataEffectHour()
		}
	}
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
@import '../../data-use.styl'
@import '../../table.styl'
.mar-bot-10
	vertical-align: top
	margin-bottom: 10px
	/deep/ textarea.ivu-input
		height: 32px
.tool-size12
	font-size: 12px
.text-row-ellipsis
	font-size: 12px
	overflow: hidden
	display: -webkit-box
	-webkit-box-orient: vertical
	-webkit-line-clamp: 2
	word-break: break-word
</style>
