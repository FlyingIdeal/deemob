<template>
	<div class="page-main">
		<div class="page-title page-has-line">
			<h2 class="title-line-tag">{{headTitle}}</h2>
			<h6 class="title-small-tips">以下表格数据指标显示当日实时数据</h6>
			<div class="is-handler">
				<Button class="has-img-icon" type="text" @click="toggleBatch">
					<i class="batch is-handler-icon"></i>
					<span>批量设置</span>
				</Button>
				<Button type="text" class="has-img-icon" @click="doColumns">
					<i class="column is-handler-icon"></i>
					<span>自定义列</span>
				</Button>
				<Button type="primary" icon="md-add" @click="toEdit(null, 'batch')">批量新建广告</Button>

				<Button type="primary" icon="md-add" @click="toEdit(null, 'add')">新建广告</Button>
			</div>
		</div>

		<Card :bordered="false" dis-hover class="has-table-card">
			<div class="search-line" ref="search-line">
				<Select
					class="i-margin-right-11 i-width-select mar-bot-10"
					clearable
					v-model="filterSearch.status"
					:transfer="true"
					placeholder="投放状态">
					<Option v-for="item in putSelect" :key="item.value" :value="item.value">{{ item.label }}</Option>
				</Select>

				<Select
					class="i-margin-right-11 i-width-select mar-bot-10"
					clearable
					v-model="filterSearch.audit_status"
					:transfer="true"
					placeholder="审核状态">
					<Option v-for="item in auditSelect" :key="item.value" :value="item.value">{{ item.label }}</Option>
				</Select>

				<Select
					class="i-margin-right-11 i-width-select mar-bot-10"
					v-model="filterSearch.campaignid_arr"
					filterable
					clearable
					:transfer="true"
					placeholder="请输入广告活动名称或ID">
					<Option v-for="item in adCampaignList" :value="item.campaignid" :key="item.campaignid">{{ item.campaignname
						}}({{ item.campaignid }})
					</Option>
				</Select>

				<Select
					class="i-margin-right-11 i-width-select mar-bot-10"
					v-model="filterSearch.orderid_arr"
					filterable
					clearable
					:transfer="true"
					placeholder="请输入广告单元名称或ID">
					<Option v-for="item in adUnitList" :value="item.orderid" :key="item.orderid" :label="item.ordername">{{
						item.ordername }}({{ item.orderid }})
					</Option>
				</Select>

				<Input
					type="textarea"
					class="i-margin-right-11 i-width-input-long mar-bot-10"
					v-model.trim="filterSearch.ad_name_arr_textarea"
					:rows="1"
					:autosize="{maxRows:1, minRows: 1}"
					placeholder="输入广告名称,多个用逗号隔开"
				 />

				<Input
					type="textarea"
					class="i-margin-right-11 i-width-input-long mar-bot-10"
					v-model.trim="filterSearch.adid_arr_textarea"
					:rows="1"
					:autosize="{maxRows:1, minRows: 1}"
					@on-keyup="filterSearch.adid_arr_textarea = filterSearch.adid_arr_textarea.replace(/[\u4E00-\u9FA5]|[A-Za-z]/g,'')"
					placeholder="输入广告ID,多个用逗号隔开"
				/>

				<Input
					type="textarea"
					class="i-margin-right-11 i-width-input-long mar-bot-10"
					v-model.trim="filterSearch.material_id_arr_textarea"
					:rows="1"
					:autosize="{maxRows:1, minRows: 1}"
					placeholder="输入素材ID,多个用逗号隔开"
				 />

				<Button class="search" @click="doFilterList(1)">搜索</Button>
			</div>
			<div class="batch-line clearfix" v-show="batchStatusFlag">
				<div class="batch-handle fl">
					<div @click="batchHandle('play')" class="batch-item">
						<i class="play batch-icon"></i>
						<span>开启</span>
					</div>
					<div @click="batchHandle('stop')" class="batch-item">
						<i class="stop batch-icon"></i>
						<span>暂停</span>
					</div>
				</div>
				<div class="batch-close icon-close fr" @click="toggleBatch"></div>
			</div>
			<div class="console-table">
				<Table highlight-row stripe border :columns="tableColList" :data="tableDataList" @on-selection-change="tableSelectChange" :loading="tableLoadFlag" :no-data-text="noDataText">
					<!--广告名称-->
					<template slot-scope="{ row }" slot="adname">
						<p class="text-row-ellipsis" :title="row.adname">{{row.adname}}</p>
					</template>
					<!-- 广告单元名称 -->
					<template slot-scope="{ row }" slot="campaignname">
						<a class="text-row-ellipsis text-cursor" :href="toCamLink(row)" type="text" :title="row.campaign.campaignname">{{row.campaign.campaignname}}</a>
					</template>
					<!-- 广告活动名称 -->
					<template slot-scope="{ row }" slot="ordername">
						<a class="text-row-ellipsis text-cursor" :title="row.order.ordername" :href="toUnitLink(row)">{{row.order.ordername}}</a>
					</template>
					<!--创意形式-->
					<template slot-scope="{ row }" slot="creative_type">
						{{creativeId2Text(row.creative.creative_type)}}
					</template>

					<!--素材ID-->
					<template slot-scope="{ row }" slot="materials">
						{{row.creative.materials | filterMaterial}}
					</template>

					<!--状态-->
					<template slot-scope="{ row }" slot="status">
						<span v-if="row.status === 1">投放中</span>
						<span v-if="row.status === 0">暂停中</span>
						<i-switch size="small" :true-value="1" :false-value="0" v-model="row.status" @on-change="changeState(row)"/>
					</template>
					<!--审核状态-->
					<template slot-scope="{ row }" slot="audit_status">
						<Badge status="warning" v-if="row.creative.internal_verify === 0" text="待审核"/>
						<Badge status="success" v-if="row.creative.internal_verify === 1" text="审核通过"/>
						<Badge status="error" v-if="row.creative.internal_verify === 2" text="已拒绝"/>
						<Badge status="error" v-if="row.creative.internal_verify === 3" text="已删除"/>
					</template>

					<!--创建时间-->
					<template slot-scope="{ row }" slot="createTime">
						<p v-if="row.c_time"> {{ row.c_time }}</p>
						<p v-else> - </p>
					</template>
					<!--修改时间-->
					<template slot-scope="{ row }" slot="updateTime">
						<p v-if="row.m_time"> {{ row.m_time }}</p>
						<p v-else> - </p>
					</template>
					<template slot-scope="{ row }" slot="handle">
						<div class="action-handle">
              				<Button :to="toDetail(row)" type="text" title="编辑" custom-icon="icon-edit"></Button>
              				<Button :to="toCopy(row)" type="text" title="复制广告" custom-icon="icon-copy-items"></Button>
						</div>
					</template>
				</Table>
				<div class="page-center">
					<Page show-total show-sizer show-elevator placement="top" :total="total_count" :current.sync='currentPage' :page-size="pageSize" @on-change="pageNumberChange" @on-page-size-change="pageSizeChange"/>
				</div>
			</div>
		</Card>

		<!--自定义列-->
		<custom-column ref="customColumn" :datalist="catchTableColList" @on-change="columnChange"></custom-column>

	</div>
</template>

<script>
import {showTitle, filterBatchQuery} from '@/libs/util'
import {tableHeight} from '@/mixin/calc-table-height.js'
import {getCreateCols} from '../colList'
import {columnFn} from '@/mixin/custom-column.js'
import customColumn from '@/components/local-custom-column/custom-column' // 自定义列
import {getAdCreativeList, editCreativeApi, batchCreativeApi} from '@/api/advertising'
import {mapActions} from 'vuex'

export default {
	mixins: [tableHeight, columnFn],
	components: {customColumn},
	data() {
		return {
			noDataText: this.$config.noDataText,
			pageSize: 10,
			total_count: 0,
			currentPage: 1,

			putSelect: [ // 投放状态筛选的下拉
				{value: 1, label: '投放中'},
				{value: 0, label: '暂停中'}
			],
			auditSelect: [ // 审核状态筛选的下拉
				{value: 0, label: '待审核'},
				{value: 1, label: '审核通过'},
				{value: 2, label: '已拒绝'}
				// {value: 3, label: '已删除'}
			],

			batchStatusFlag: false, // 批量操作flag
			tableSelectID: [], // table表格选中的ID

			adCampaignList: [], // 广告活动列表
			adUnitList: [], // 广告单元列表

			freq_status: false,
			money_status: false,
			frepSet: '',
			moneySet: '',
			submitClock: false,

			filterSearch: { // 筛选条件
				status: '', // 投放状态: 0关闭,1在投
				audit_status: '', // 审核状态: 0待审，1通过，2拒绝, 3被删除
				campaignid_arr: '', // 广告活动ID数组
				orderid_arr: '', // 广告单元ID数组
				name_or_id: '', // 广告名称或ID
				ad_name_arr: [], // 广告名称数组
				adid_arr: [], // 广告ID数组

				ad_name_arr_textarea: '', // 广告名称文本
				adid_arr_textarea: '', // 广告ID的文本

				material_id_arr: [], // 素材ID
				material_id_arr_textarea: null // 批量素材ID的文本
			},

			tableLoadFlag: true,
			tableDataList: [],
			catchTableColList: getCreateCols(this),
		}
	},
	filters: {
		filterMaterial(materialArr) {

			if(!materialArr || materialArr.length === 0) {
				return '-'
			}

			let materId = []

			materialArr.map(item => {
				if(!!item) {
					materId.push(item.id)
				}
			})

			return materId.join('，')
		}
	},
	computed: {
		headTitle() {
			return showTitle(this.$route, this)
		}
	},
	created() {
		this.getTableColumns()
		this.initData()
	},
	activated() {
		if (this.$route.query.cb === 'fresh') {
			this.getTableList()
		} else {
			this.$Bus.$off('editEmitEvent')
			this.$Bus.$on('editEmitEvent', (msg) => {
				this.getTableList()
			})
		}
    },
	mounted() {
		// this.initTableHeight({'search-line': {isAutoCalc: true, isInclude: true}, 'nav-handle-group': false}) // search-line的高度
	},
	methods: {
		...mapActions([
			'getAdCampaignList',
			'getAdUnitList',
			'getAdCreativeList'
		]),
		/**
		 * [initData 初始化加载数据]
		 * @return {[type]} [description]
		 */
		initData() {
			this.getTableList() // 获取表格数据

			this._getAdCampaignList() // 广告活动
			this._getAdUnitList() // 广告单元
		},

		/**
		 * [toggleBatch 批量操作的显示隐藏]
		 * @return {[type]} [description]
		 */
		toggleBatch() {
			this.batchStatusFlag = !this.batchStatusFlag
		},

		/**
		 * [batchHandle 批处理]
		 * @param  {[type]} type [description]
		 * @return {[type]}      [description]
		 */
		batchHandle(type) {
			if (!this.tableSelectID.length) {
				this.$Message.warning('请选择对应的设置的广告')
				return
			}

			this.$Modal.confirm({
				title: type === 'play' ? '确定批量开启?' : '确定批量暂停?',
				onOk: () => {
					batchCreativeApi({ad_id_arr: this.tableSelectID, status: type === 'play' ? 1 : 0}).then(res => {
						if (res.code === 200) {
							this.$Message.success({content: type === 'play' ? '修改成功' : '暂停成功', duration: 3})
						} else {
							this.$Message.error({content: type === 'play' ? '修改失败' : '暂停失败', duration: 3})
						}

						this.tableSelectID = [] // 情况批量列表
						this.getTableList()
					})
				}
			})
		},

		/**
		 * [tableSelectChange table 获取选中的值]
		 * @param  {[type]} item [description]
		 * @return {[type]}     [description]
		 */
		tableSelectChange(selection) {
			let seletIdArr = []
			selection.map(item => {
				seletIdArr.push(item.adid)
			})
			this.tableSelectID = seletIdArr
		},
		/**
		 * [changeState 切换业务状态]
		 * @param  {[type]} item [description]
		 * @return {[type]}     [description]
		 */
		changeState(item) {
			this.$Modal.confirm({
				title: item.status === 1 ? '确定开启广告?' : '确定暂停广告?',
				content: '',
				onOk: () => {
					editCreativeApi({ad_id: item.adid, status: item.status}).then(res => {
						if (res.code === 200) {
							this.$Message.success('操作成功')
							item.status = item.status === 1 ? 1 : 0
						} else {
							this.$Message.error({content: '操作失败', duration: 3})
							item.status = item.status === 1 ? 0 : 1
						}
					}, err => {
						item.status = item.status === 1 ? 0 : 1
					})
				},
				onCancel: res => {
					item.status = item.status === 1 ? 0 : 1
				}
			})
		},
		/**
		 * [toEdit description]
		 * @param  {[type]} row [description]
		 * @return {[type]}     [description]
		 */
		toEdit(row, type) {
			if (!!row) {
				this.$router.push({name: 'advertising-creative-edit', query: {adId: row.adid}})
			} else {
				if(type === 'batch') {
					this.$router.push({name: 'advertising-creative-edit', query: {addType: 'bacthAdd'}})
				} else {
					this.$router.push({name: 'advertising-creative-edit', query: {addType: 'newAdd'}})
				}
			}
		},
		/**
		 * [toDetail 详情链接]
		 * @param  {[type]} row [description]
		 * @return {[type]}     [description]
		 */
		toDetail(row) {
			return `/advertising/creative/edit?adId=${row.adid}`
		},
		/**
		 * [toCopy 复制广告]
		 * @param  {[type]} row [description]
		 * @return {[type]}     [description]
		 */
		toCopy(row) {
			return `/advertising/creative/edit?copyId=${row.adid}`
		},
		/**
		 * [toCamLink 跳转到广告活动]
		 * @param  {[type]} row [description]
		 * @return {[type]}     [description]
		 */
		toCamLink(row) {

			return `/advertising/activity/edit?campaignid=${row.campaign.campaignid}`

			// this.$router.push({name: 'activity-edit', query: {campaignid: row.campaign.campaignid}})
		},
		/**
		 * [toUnitLink 跳转到广告单元]
		 * @param  {[type]} row [description]
		 * @return {[type]}     [description]
		 */
		toUnitLink(row) {
      return `/advertising/unit/edit?orderId=${row.order.orderid}&createType=${row.order.creative_form_id}&billing=${row.order.billing_method}`

			// this.$router.push({name: 'unit-edit', query: {orderId: row.order.orderid}})
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

			getAdCreativeList(params).then(res => {
				this.tableLoadFlag = false
				if (res.code === 200) {
					this.total_count = res.data.total
					this.tableDataList = res.data.list
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
		 * [getAxiosParams 获取下载和列表的url参数]
		 * @return {[type]} [description]
		 */
		getAxiosParams() {

			let _filter = this.filterSearch

			let params = {}

			// 空数据或者空数组处理
			_filter.status !== '' && (params.status = _filter.status)
			_filter.audit_status !== '' && (params.audit_status = _filter.audit_status)
			_filter.name_or_id && (params.name_or_id = _filter.name_or_id)
			_filter.campaignid_arr && (params.campaignid_arr = [_filter.campaignid_arr])
			_filter.orderid_arr && (params.orderid_arr = [_filter.orderid_arr])

			!!_filter.material_id_arr.length && (params.material_id_arr = _filter.material_id_arr)

			// 广告名称模糊搜索
			!!_filter.ad_name_arr.length && (_filter.ad_name_arr.length > 1 ? (params.ad_name_arr = _filter.ad_name_arr) : (params.ad_name_like = _filter.ad_name_arr.toString()))

			// 广告ID
			!!_filter.adid_arr.length && (_filter.adid_arr.length > 1 ? (params.adid_arr = _filter.adid_arr) : (params.adid_like = _filter.adid_arr))

			return params
		},

		/**
		 * [doFilterList 筛选查询]
		 * @return {[type]} [description]
		 */
		doFilterList(val) {
			this.currentPage = 1
			let _filter = this.filterSearch

			// 创意包的名称搜索
			this.filterSearch.ad_name_arr = filterBatchQuery({value: _filter.ad_name_arr_textarea})
			// 创意包的id
			this.filterSearch.adid_arr = filterBatchQuery({value: _filter.adid_arr_textarea, type: 'number'})

			// 批量素材ID的查询
			this.filterSearch.material_id_arr = filterBatchQuery({value: _filter.material_id_arr_textarea})

			this.getTableList()
		},
		/**
		 * [creativeId2Text 创意形式]
		 * @param  {[type]} id [description]
		 * @return {[type]}    [description]
		 */
		creativeId2Text(id) {
			let _styleArr = this.$store.state.app.adStyleData // 广告样式
			let _sceneArr = this.$store.state.app.adSceneData // 广告场景

			let styleResult = _styleArr.filter(item => item.id == id) // 筛选出样式
			let sceneResult = styleResult.length ? _sceneArr.filter(item => item.id == styleResult[0].parentId) : []

			return (styleResult[0] && sceneResult[0]) ? `${sceneResult[0].title} - ${styleResult[0].title}` : ''
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
		 * [_getAllAdType 获取广告单元]
		 * @return {[type]} [description]
		 */
		async _getAdUnitList() {
			let storeUser = this.$store.state.user
			let resArr = storeUser.adUnitList.length ? storeUser.adUnitList : await this.getAdUnitList()

			this.adUnitList = resArr
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
        if (to.name !== 'advertising-creative-edit') {
            this.$Bus.$off('editEmitEvent')
        }
        next()
    }
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
.batch-item
	position relative
	margin-right 20px
	padding-right 20px
	&:before
		content: ''
		display inline-block
		width: 1px;
		height: 10px;
		background: #EBEBEB;
		position absolute
		left -20px
		top: 10px

.is-handler
	.down
		img
			width 16px
			vertical-align middle

		span
			vertical-align middle

.mar-bot-10
	vertical-align: top
	margin-bottom: 10px
</style>
