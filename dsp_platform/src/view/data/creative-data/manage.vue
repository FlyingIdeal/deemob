<template>
  <div class="page-main">
    <div class="page-title page-has-line">
      <h2 class="title-line-tag">{{headTitle}}</h2>
      <div class="is-handler">
        <Button type="text" @click="downStatement" :loading="submitClock" class="down">
          <i class="iconfont icon-download"></i>
          <span v-if="!submitClock">下载报表</span>
          <span v-else>下载中...</span>
        </Button>
      </div>
    </div>
    <Card :bordered="false" dis-hover class="has-table-card">
      <div class="search-line" ref="search-line">
        <DatePicker class="i-margin-right-11 i-width-date mar-bot-10" :value="datePickerTime" :options="disabledDateOpt"
                    :transfer="true" :clearable="false" format="yyyy-MM-dd" type="daterange" placeholder="请选择日期"
                    @on-change="datePickerChange"/>
        <Input clearable v-model="filterSearch.search_text" class="i-width-select i-margin-right-11 i-width-select mar-bot-10"
               placeholder="请输入创意包名称或ID"/>
        <Button class="search" @click="doFilterList(1)">搜索</Button>
      </div>
      <div class="console-table">
        <Table highlight-row stripe border :columns="tableColList" :data="colDatList" :loading="tableLoadFlag"
               @on-sort-change="sortChange"
               show-summary
               sum-text="总计"
               :summary-method="handleSummary" :no-data-text="noDataText"
        >
          <!--创意包名称-->
          <template slot-scope="{ row }" slot="creative_name">
            <a class="text-row-ellipsis text-cursor" :title="row.creative_name" :href="toCreative(row)">{{row.creative_name || '-'}}</a>
          </template>
          <!--创意包ID-->
          <template slot-scope="{ row }" slot="creativeid">
            <p>{{row.creativeid}}</p>
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
          <Page show-total show-sizer show-elevator placement="top" :total="total_count" :current.sync='currentPage'
                :page-size="pageSize" @on-change="pageNumberChange" @on-page-size-change="pageSizeChange"/>
        </div>
      </div>
    </Card>
  </div>
</template>

<script>
  import {showTitle} from '@/libs/util'
  import {createObjectURL, number2Thousand} from '@/libs/tools'
  import {tableHeight} from '@/mixin/calc-table-height.js'
  import {getDataCreativeList, getAdCreativeListUrl} from '@/api/data'
  import {getDownLoadXls} from '@/api/common'
  import {inPageAccess} from '@/mixin/in-page-access.js'

  export default {
    name: 'financial-manage',
    mixins: [tableHeight, inPageAccess],
    data() {
      return {
        noDataText: this.$config.noDataText,
        colDatList: [],
        submitClock: false,
        tableLoadFlag: false,
        datePickerTime: [], // 时间选择器
        filterSearch: { // 筛选条件
          search_text: '',
          start_date: '',
          end_date: '',
          order: ''
        },
        disabledDateOpt: { // 创建支出时不可选择的时间范围
          disabledDate(date) {
            const time = date.getTime()
            const curTime = new Date().getTime()
            return time < new Date('2020-09-01 00:00:00').getTime() || time > curTime
          }
        },
        pageSize: 10,
        total_count: 0,
        currentPage: 1,
        tableColList: [
          {title: '创意包ID', key: 'creativeid', slot: 'creativeid', minWidth: 80, noNeedCalcThou: true},
          {title: '创意包名称', key: 'creative_name', slot: 'creative_name', minWidth: 250, noNeedCalcThou: true},
          {title: '广告展现', key: 'view', slot: 'view', minWidth: 100, sortable: 'custom'},
          {title: '广告点击', key: 'click', slot: 'click', minWidth: 100, sortable: 'custom'},
          {title: '点击率', key: 'ctr', slot: 'ctr', minWidth: 100, sortable: 'custom'},
          {title: '到达数', key: 'reach', slot: 'reach', minWidth: 100, sortable: 'custom'},
          {title: '到达率', key: 'reach_rate', slot: 'reach_rate', minWidth: 100, sortable: 'custom'},
          {title: '转化数', key: 'action', slot: 'action', minWidth: 100, sortable: 'custom'},
          {title: '转化率', key: 'action_rate', slot: 'action_rate', minWidth: 100, sortable: 'custom'},
          {title: '花费', key: 'report_spend', slot: 'report_spend', minWidth: 100, sortable: 'custom'},
          {title: '千次展现均价', key: 'ecpm', slot: 'ecpm', minWidth: 150, sortable: 'custom'},
          {title: '点击均价', key: 'cpc', slot: 'cpc', minWidth: 150, sortable: 'custom'}
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
      handleSummary({columns, data}) {
        const sums = {}
        columns.forEach((column, index) => {
          let key = column.slot
          if (key === 'creativeid') {
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
       * [initData 初始化加载数据]
       * @return {[type]} [description]
       */
      initData() {
        this.initDatePickerTime() // 初始化时间
        this.getTableList() // 获取表格数据
      },
      number2Thousand(number) {
        return number2Thousand(number)
      },
      /**
       * [downStatement 下载广告位数据]
       * @return {[type]} [description]
       */
      downStatement() {
        let obj = this.filterSearch
        obj.page_size = 0
        obj.page_num = 1
        let params = {
          method: 'GET',
          url: getAdCreativeListUrl({...obj})
        }

        this.submitClock = true

        getDownLoadXls(params).then(res => {
          if (res.code === 200) {
            let filename = `${this.filterSearch.start_date}~${this.filterSearch.end_date} 创意包数据.xlsx`
            createObjectURL(res.data.url, filename)
          }

          this.submitClock = false
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
        this.tableLoadFlag = true
        let obj = {}
        obj.page_size = this.pageSize
        obj.page_num = this.currentPage
        obj.start_date = this.filterSearch.start_date
        obj.end_date = this.filterSearch.end_date
        this.filterSearch.search_text ? obj.search_text = this.filterSearch.search_text : ''
        this.filterSearch.order ? obj.order = this.filterSearch.order : ''
        getDataCreativeList(obj).then(res => {
          this.tableLoadFlag = false
          if (res.code === 200) {
            this.colDatList = res.data.list
            this.sumData = res.data.total_row
            this.total_count = res.data.total_count
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
       * [toCreative 跳转到创意包]
       * @param  {[type]} row [description]
       * @return {[type]}     [description]
       */
      toCreative(row) {
        return `/tool/creative/edit?id=${row.creativeid}`

        // this.$router.push({name: 'tool-creative-edit', query: {id: row.creativeid}})
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
  /deep/ .console-table
    .ivu-table-tbody
      tr:last-child
        td
          border-bottom 1px solid #e8eaec
</style>
