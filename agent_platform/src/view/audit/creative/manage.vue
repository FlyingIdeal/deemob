<template>
  <div class="page-main">
    <div class="page-title page-has-line">
      <h2 class="title-line-tag">{{headTitle}}</h2>
    </div>
    <div class="audit_content">
      <Tabs value="-1" @on-click="changeName">
        <TabPane :label="'全部（'+count+')'" name="-1"/>
        <TabPane :label="'待审核（'+audit_count+')'" name="0"/>
        <TabPane :label="'已通过（'+passed_count+')'" name="1"/>
        <TabPane :label="'已拒绝（'+refuse_count+')'" name="2"/>
      </Tabs>
      <Card :bordered="false" dis-hover class="has-table-card">

        <div class="search-line" ref="search-line">
          <DatePicker class="i-margin-right-11 i-width-normal mar-bot-10" :value="dateCreateTime" :transfer="true"
                      :options="datePickerDisabled" :clearable="true" format="yyyy-MM-dd" type="daterange"
                      placeholder="创建时间" @on-change="dateCreateChange"/>
          <DatePicker class="i-margin-right-11 i-width-normal mar-bot-10" :value="datePickerTime" :transfer="true"
                      :options="datePickerDisabled" :clearable="true" format="yyyy-MM-dd" type="daterange"
                      placeholder="审核时间" @on-change="datePickerChange"/>
          <Select
            class="i-margin-right-11 i-width-normal mar-bot-10"
            filterable
            clearable
            v-model="filterSearch.advertiser_id"
            placeholder="所属广告主">
            <Option v-for="item in advertiserList" :key="'广告主'+item.advertiserid" :value="item.advertiserid">{{ item.advertisername }}</Option>
          </Select>
          <Select
            class="i-margin-right-11 i-width-normal mar-bot-10"
            filterable
            clearable
            v-model="filterSearch.industry_id"
            placeholder="行业类型">
            <OptionGroup v-for="(its,index) in categoryList" :key="'行业'+index" :label="its.category_name">
              <Option v-for="it in its.children" :value="it.id" :key="'行业'+it.id">{{ it.category_name }}</Option>
            </OptionGroup>
          </Select>
          <Input clearable class="i-margin-right-11 i-width-normal mar-bot-10" placeholder="请输入创意名称或ID"
                 v-model="filterSearch.search_text"/>
          <Button class="search mar-bot-10" @click="doFilterList(1)">查询</Button>
        </div>
        <div class="console-table">
          <Table highlight-row stripe border :columns="tableColList" :data="colDatList" :loading="tableLoadFlag"
                 :height="tableHeight">
            <template slot-scope="{ row }" slot="advertisername">
              <p v-if="row.advertisername"> {{row.advertisername}} </p>
              <p v-else> - </p>
            </template>
            <template slot-scope="{ row }" slot="company_name">
              <p v-if="row.company_name"> {{row.company_name}} </p>
              <p v-else> - </p>
            </template>
            <template slot-scope="{ row }" slot="internal_verify">
              <Badge v-if="row.internal_verify === 0" color="#F1A32E" text="待审核"/>
              <Badge v-if="row.internal_verify === 1" color="#67C23A" text="已通过"/>
              <Badge v-if="row.internal_verify === 2" color="#F93D3D" text="已拒绝"/>
            </template>
            <template slot-scope="{ row }" slot="status_desc">
              <p class="status_des" :title="row.status_desc" v-if="row.internal_verify === 2 && row.status_desc"> {{ row.status_desc }}</p>
              <p v-else> - </p>
            </template>
            <template slot-scope="{ row }" slot="check_time">
              <p v-if="row.internal_verify === 0"> - </p>
              <p v-else> {{row.check_time}} </p>
            </template>
            <template slot-scope="{ row }" slot="check_name">
              <p v-if="row.internal_verify === 0"> - </p>
              <p v-else> {{ row.check_name }} </p>
            </template>
            <template slot-scope="{ row }" slot="action">
              <Button type="text" @click="toDetail(row,'edit')">
                {{row.internal_verify === 0 ? '审核' : '复审'}}
              </Button>
              <Button type="text" @click="toDetail(row,'see')">查看</Button>
            </template>
          </Table>
          <div class="page-center">
            <Page show-total show-sizer show-elevator placement="top" :total="total_count" :current.sync='currentPage'
                  :page-size="pageSize" @on-change="pageNumberChange" @on-page-size-change="pageSizeChange"/>
          </div>
        </div>
      </Card>
    </div>

  </div>
</template>

<script>
  import {showTitle} from '@/libs/util'
  import {createObjectURL} from '@/libs/tools'
  import {tableHeight} from '@/mixin/calc-table-height.js'
  import {getCreativeList, getAdvertiserList} from '@/api/audit'
  import {getCategoryList} from '@/api/common'
  import {getAuditCols} from '../common/colList'

  export default {
    name: 'financial-manage',
    mixins: [tableHeight],
    data() {
      return {
        pageSize: 10, // 页码长度
        total_count: 0,
        currentPage: 1,
        colDatList: [], // table数据
        tableLoadFlag: true, // table的loading
        submitClock: false,
        count: 0, // 全部
        audit_count: 0, // 待审核
        passed_count: 0, // 已通过
        refuse_count: 0, // 已拒绝
        dateCreateTime: [], // 创建时间
        datePickerTime: [], // 投放时间
        tableColList: getAuditCols(this),
        datePickerDisabled: { // 时间容器，禁止选择时间
          disabledDate(date) {
            let disableData = Date.parse(new Date('2020-11-01 00:00:00'))
            return date.valueOf() >= Date.now() || date.valueOf() < disableData
          }
        },
        filterSearch: { // 筛选条件
          status: '', // 状态值，0待审，1通过，2拒绝, 3被删除
          advertiser_id: '', // 广告主ID
          industry_id: '', // 行业ID
          search_text: '' // 搜索文本
        },
        advertiserList: [], // 广告主列表
        categoryList: [] // 行业列表
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
      // this.initTableHeight({'search-line': {isAutoCalc: true, isInclude: true}, 'nav-handle-group': true}) // search-line的高度
    },
    methods: {
      /**
       * [initData 初始化加载数据]
       * @return {[type]} [description]
       */
      initData() {
        this.getADList()
        this.getCategoryListApi()
        this.getTableList() // 获取表格数据
      },
      changeName(val) {
        if (val > -1) {
          this.filterSearch.status = val
        } else {
          this.filterSearch.status = ''
        }
        this.currentPage = 1
        this.getTableList()
      },
      /**
       * [getTimeData 获取广告主列表]
       * @return {[type]} [description]
       */
      getADList() {
        getAdvertiserList().then(res => {
          if (res.code === 200) {
            this.advertiserList = res.data
          }
        })
      },
      toDetail(row, type) {
        this.$router.push({name: 'audit-creative-detail', query: {creative_info_id: row.buyer_creativeid, type: type}})
      },
      /**
       * [getTimeData 获取行业列表]
       * @return {[type]} [description]
       */
      getCategoryListApi() {
        getCategoryList().then(res => {
          if (res.code === 200) {
            this.categoryList = res.data.list
          }
        })
      },
      /**
       * [getTimeData 筛选-设置时间的默认值 - 默认当天]
       * @return {[type]} [description]
       */

      /**
       * [datePickerChange 时间选择器发生变化]
       * @param  {[type]} time [description]
       * @return {[type]}      [description]
       */
      datePickerChange(time) {
        this.datePickerTime = time
      },
      dateCreateChange(time) {
        this.dateCreateTime = time
      },

      /**
       * [getFinanceList 获取列表的信息]
       * @return {[type]} [description]
       */
      getTableList() {
        this.tableLoadFlag = true
        // let obj = this.filterSearch
        let obj = {}
        this.filterSearch.status ? obj.status = this.filterSearch.status : ''
        this.filterSearch.advertiser_id ? obj.advertiser_id = this.filterSearch.advertiser_id : ''
        this.filterSearch.industry_id ? obj.industry_id = this.filterSearch.industry_id : ''
        this.filterSearch.search_text ? obj.search_text = this.filterSearch.search_text : ''
        obj.page_size = this.pageSize
        obj.page_num = this.currentPage
        if (this.dateCreateTime[0] && this.dateCreateTime.length > 1) {
          obj.create_start_time = this.dateCreateTime[0]
          obj.create_end_time = this.dateCreateTime[1]
        }
        if (this.datePickerTime[0] && this.datePickerTime.length > 1) {
          obj.check_start_time = this.datePickerTime[0]
          obj.check_end_time = this.datePickerTime[1]
        }

        getCreativeList(obj).then(res => {
          this.tableLoadFlag = false
          if (res.code === 200) {
            res.data.list && res.data.list.length > 0 ? this.colDatList = res.data.list : this.colDatList = []
            this.total_count = res.data.total_count
            this.count = (res.data.wait_check_count) + (res.data.pass_count) + (res.data.reject_count)
            this.audit_count = res.data.wait_check_count
            this.passed_count = res.data.pass_count
            this.refuse_count = res.data.reject_count
          }
        }, err => {
          this.tableLoadFlag = false
        })
      },

      /**
       * [doFilterList 筛选查询]
       * @return {[type]} [description]
       */
      doFilterList() {
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
  @import '../common/index.styl';
  /deep/ .audit_content {
    background #ffffff

    .ivu-tabs-bar {
      margin-bottom 0px
    }

  }
  .status_des{
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .mar-bot-10
    vertical-align: top
    margin-bottom: 10px
</style>
