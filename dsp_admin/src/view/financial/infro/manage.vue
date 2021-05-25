<template>
  <div class="page-main">
    <div class="page-title page-has-line">
      <h2 class="title-line-tag">{{headTitle}}</h2>
      <div class="is-handler">
        <Button type="primary"  @click="downStatement" :loading="submitClock" class="down">
          <i class="iconfont icon-download"></i>
          <span v-if="!submitClock">下载报表</span>
          <span v-else>下载中...</span>
        </Button>
      </div>
    </div>
    <Card :bordered="false" dis-hover class="has-table-card">
      <div class="search-line" ref="search-line">
        <DatePicker class="i-margin-right-11 i-width-date mar-bot-10" :value="datePickerTime" :transfer="true"
                    :options="datePickerDisabled" :clearable="false" format="yyyy-MM-dd" type="daterange"
                    placeholder="请选择日期" @on-change="datePickerChange"></DatePicker>
        <Select
          class="i-margin-right-11 i-width-select mar-bot-10"
          v-model="filterSearch.detail_type"
          :transfer="true"
          placeholder="全部明细">
          <Option v-for="item in filterSelect" :key="item.value" :value="item.value">{{ item.label }}
          </Option>
        </Select>
        <Input clearable class="i-margin-right-11 i-width-select  mar-bot-10"  placeholder="请输入代理商名称或ID"
               v-model="filterSearch.search_text"/>
        <Button class="search" @click="doFilterList(1)">搜索</Button>
      </div>
      <div class="console-table">
        <Table highlight-row stripe border :columns="tableColList" :data="colDatList" :loading="tableLoadFlag"
               :height="tableHeight" :no-data-text="noDataText">
          <!--金额-->
          <template slot-scope="{ row }" slot="amount">
            <template v-if="row.detail_type === 2">+</template>
            <template v-if="row.detail_type === 3 || row.detail_type === 4">-</template>
            {{ row.amount | number2Thousand }}
          </template>
          <!--明细-->
          <template slot-scope="{ row }" slot="remark">
            <template v-if="row.detail_type === 2">充值</template>
            <template v-if="row.detail_type === 3">退款</template>
            <template v-if="row.detail_type === 4">花费</template>
          </template>
          <!--代理商名称-->
          <template slot-scope="{ row }" slot="agentName">

          </template>
          <!--代理商id-->
          <template slot-scope="{ row }" slot="agentID">

          </template>
          <!--公司名称-->
          <template slot-scope="{ row }" slot="companyName">

          </template>
          <!--操作人-->
          <template slot-scope="{ row }" slot="operator">

          </template>
          <!--备注-->
          <template slot-scope="{ row }" slot="comment">

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
  import {formatDate, createObjectURL, number2Thousand} from '@/libs/tools'
  import {tableHeight} from '@/mixin/calc-table-height.js'
  import {getFinanceList, getFinanceListUrl} from '@/api/finance'
  import {getDownLoadXls} from '@/api/common'
  import {getInfroCols} from '../colList'

  export default {
    name: 'financial-manage',
    mixins: [tableHeight],
    data() {
      return {
        pageSize: 10, // 页码长度
        total_count: 0,
        currentPage: 1,
        colDatList: [], // table数据
        tableLoadFlag: false, // table的loading
        noDataText: this.$config.noDataText,

        submitClock: false,

        filterSelect: [ // 筛选的下拉
          {
            value: 0,
            label: '全部明细'
          },
          {
            value: 2,
            label: '充值'
          },
          {
            value: 3,
            label: '退款'
          },
          {
            value: 4,
            label: '花费'
          },
          {
            value: 1,
            label: '余额'
          }
        ],

        datePickerTime: [], // 时间选择器
        datePickerDisabled: { // 时间容器，禁止选择时间
          disabledDate(date) {
            let disableData = Date.parse(new Date('2020-12-01 00:00:00'))
            return date.valueOf() >= Date.now() || date.valueOf() < disableData
          }
        },

        filterSearch: { // 筛选条件
          detail_type: 0, // 状态0全部 2充值 3退款 4花费
          search_text: ''
        },
        tableColList: getInfroCols(this)
      }
    },
    computed: {
      headTitle() {
        return showTitle(this.$route, this)
      }
    },
    filters: {
      number2Thousand(val) {
        return number2Thousand(val)
      }
    },
    created() {
      this.initData()
    },
    mounted() {
      // this.initTableHeight({'search-line': {isAutoCalc:true , isInclude:true }, 'nav-handle-group': false}) // search-line的高度
    },
    methods: {
      /**
       * [initData 初始化加载数据]
       * @return {[type]} [description]
       */
      initData() {
        this.initDatePickerTime() // 初始化时间
        // this.getTableList() // 获取表格数据
      },
      /**
       * [getTimeData 筛选-设置时间的默认值 - 默认当天]
       * @return {[type]} [description]
       */
      initDatePickerTime() {
        const nextDate = formatDate(new Date(), 'yyyy-MM-dd') // 当前天
        const preDate = formatDate(new Date().getTime() - 3600 * 1000 * 24 * 7, 'yyyy-MM-dd') // 向前7天
        this.datePickerTime = [preDate, nextDate]
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
       * [getFinanceList 获取列表的信息]
       * @return {[type]} [description]
       */
      getTableList() {
        this.tableLoadFlag = true

        getFinanceList({
          page_size: this.pageSize,
          page_num: this.currentPage,
          start_date: this.datePickerTime[0],
          end_date: this.datePickerTime[1],
          detail_type: this.filterSearch.detail_type,
        }).then(res => {
          this.tableLoadFlag = false
          if (res.code === 200) {
            this.colDatList = res.data.list
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
       * [downStatement 下载财务表格]
       * @return {[type]} [description]
       */
      downStatement() {

        let params = {
          method: 'GET',
          url: getFinanceListUrl({
            ...this.filterSearch,
            start_date: this.datePickerTime[0],
            end_date: this.datePickerTime[1]
          })
        }

        this.submitClock = true

        getDownLoadXls(params).then(res => {
          if (res.code === 200) {
            let filename = `${this.datePickerTime[0]}~${this.datePickerTime[1]} 财务明细.xlsx`
            createObjectURL(res.data.url, filename)
          }

          this.submitClock = false
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
      }
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
  .mar-bot-10
    vertical-align: top
    margin-bottom: 10px
</style>
