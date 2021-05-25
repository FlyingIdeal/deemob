<template>
    <div class="page-main">
        <div class="page-title page-has-line">
            <h2 class="title-line-tag">{{headTitle}}</h2>
            <div class="is-handler">
                <Button type="text" :loading="submitClock" class="down">
                    <i class="iconfont icon-download"></i>
                    <span v-if="!submitClock">下载报表</span>
                    <span v-else>下载中...</span>
                </Button>
            </div>
        </div>
        <Card :bordered="false" dis-hover class="has-table-card">
            <div class="search-line" ref="search-line">
                <DatePicker class="i-margin-right-11 i-width-date mar-bot-10" :value="datePickerTime" :options="disabledDateOpt" :transfer="true" :clearable="false" format="yyyy-MM-dd" type="daterange" placeholder="请选择日期" @on-change="datePickerChange"></DatePicker>
                <Select 
                    class="i-margin-right-11 i-width-select mar-bot-10" 
                    filterable 
                    v-model="filterSearch.creative_type_arr" 
                    placeholder="全部明细">
                        <Option v-for="item in filterSelect" :key="item.value" :value="item.value" >{{ item.label }}</Option>
                </Select>
                <Button type="primary" @click="doFilterList(1)">搜索</Button>
            </div>
            <div class="console-table">
                <Table highlight-row stripe border :columns="tableColList" :data="colDatList" :loading="tableLoadFlag" :height="tableHeight" :no-data-text="noDataText">
                    <!--序号-->
                    <template slot-scope="{ row }" slot="index">
                        {{ pageSize * (currentPage - 1) + (row._index + 1)}}
                    </template>
                    <!--创建时间-->
                    <template slot-scope="{ row }" slot="created_at">
                        <span>{{ row.created_at }}</span>
                    </template>
                    <!--金额-->
                    <template slot-scope="{ row }" slot="money">
                        <span>{{ row.money }}</span>
                    </template>
                    <!--明细-->
                    <template slot-scope="{ row }" slot="detail">
                        <span>{{ row.detail }}</span>
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
import { debounce, throttle, formatDate, getImgNaturalDimension, getQueryString, miniCommonDivisor } from '@/libs/tools'
import { tableHeight } from '@/mixin/calc-table-height.js'
import { getAdMaterialList } from '@/api/ad'
import { inPageAccess } from '@/mixin/in-page-access.js'

export default {
    name: 'financial-manage',
    mixins: [tableHeight, inPageAccess],
    data() {
        return {
            submitClock: false,

            filterSelect: [ // 筛选的下拉
                {
                    value: 0,
                    label: '全部明细'
                },
                {
                    value: 1,
                    label: '充值'
                },
                {
                    value: 2,
                    label: '退款'
                },
                {
                    value: 3,
                    label: '花费'
                }
            ],

            datePickerTime: [], // 时间选择器
            filterSearch: { // 筛选条件
                creative_type_arr: [], // 广告样式ID多选
                dsp_company_id_arr: [], //预算方公司ID 多选
                dsp_slot_id_arr: [], //预算位ID 多选
                ssp_slot_id_arr: [], // 广告位ID 多选
                title: '', // 标题
                desc: '', // 描述
            },
            disabledDateOpt: { // 创建支出时不可选择的时间范围
                disabledDate(date) {
                    const time = date.getTime()
                    const curTime = new Date().getTime()
                    return time < new Date('2020-09-01 00:00:00').getTime() || time > curTime
                }
            },
            tableColList: [
                {
                    title: '日期',
                    slot: 'date',
                    width: 90
                },
                {
                    title: '素材',
                    slot: 'material_json',
                    width: 300
                },
                {
                    title: '标题',
                    slot: 'title',
                    minWidth: 200
                },
                {
                    title: '描述',
                    slot: 'desc',
                    minWidth: 200
                },
                {
                    title: '物料数量',
                    slot: 'ad_count',
                    width: 100
                }
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
         * [initData 初始化加载数据]
         * @return {[type]} [description]
         */
        initData() {
            this.initDatePickerTime() // 初始化时间
            this.getTableList() // 获取表格数据
        },
        /**
         * [getTimeData 筛选-设置时间的默认值 - 默认当天]
         * @return {[type]} [description]
         */
        initDatePickerTime() {
            const localDate = formatDate(new Date(), 'yyyy-MM-dd') // 当前天
            this.datePickerTime = [localDate, localDate]
        },
        /**
         * [datePickerChange 时间选择器发生变化]
         * @param  {[type]} time [description]
         * @return {[type]}      [description]
         */
        datePickerChange(time) {
            this.datePickerTime = time
        },
        
        /**
         * [getAdMaterialList 获取列表的信息]
         * @return {[type]} [description]
         */
        getTableList() {
            this.tableLoadFlag = true

            getAdMaterialList({
                page_size: this.pageSize,
                page_num: this.currentPage,
                start_date: this.datePickerTime[0],
                end_date: this.datePickerTime[1],
                creative_type_arr: this.filterSearch.creative_type_arr,
                dsp_company_id_arr: this.filterSearch.dsp_company_id_arr,
                dsp_slot_id_arr: this.filterSearch.dsp_slot_id_arr,
                ssp_slot_id_arr: this.filterSearch.ssp_slot_id_arr,
                title: this.filterSearch.title,
                desc: this.filterSearch.desc,
                landing_page: this.filterSearch.landing_page
            }).then(res => {
                this.tableLoadFlag = false
                if (res.code === 200) {
                    this.colDatList = res.data.list
                    this.total_count = res.data.total_count
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
        }
    }
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
.mar-bot-10
    vertical-align: top
    margin-bottom: 10px
</style>
