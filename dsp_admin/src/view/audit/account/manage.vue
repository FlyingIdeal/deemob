<template>
  <div class="page-main">
    <div class="page-title page-has-line">
      <h2 class="title-line-tag">{{headTitle}}</h2>
    </div>
    <div class="audit_content">
      <Tabs value="-1" @on-click="changeName">
        <TabPane :label="'全部（'+count+')'" name="-1"/>
        <TabPane :label="'待审核（'+audit_count+')'" name="1"/>
        <TabPane :label="'已通过（'+passed_count+')'" name="2"/>
        <TabPane :label="'已拒绝（'+refuse_count+')'" name="3"/>
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
            v-model="filterSearch.account_type"
            placeholder="账号类型">
            <Option v-for="item in accountType" :key="'账号类型'+item.id" :value="item.id">{{ item.value }}</Option>
          </Select>
          <Input clearable class="i-margin-right-11 i-width-normal mar-bot-10" placeholder="请输入账号名称或ID"
                 v-model="filterSearch.search_text"/>
          <Button class="search mar-bot-10" @click="doFilterList(1)">查询</Button>
        </div>
        <div class="console-table">
          <Table highlight-row stripe border :columns="tableColList" :data="colDatList" :loading="tableLoadFlag" :no-data-text="noDataText">
            <template slot-scope="{ row }" slot="id">
              {{row.id}}
            </template>
            <template slot-scope="{ row }" slot="category_text">
              <p v-if="row.category_name"> {{row.category_name}}
                <span v-if="row.category_sub_name"> - {{row.category_sub_name}} </span>
              </p>
              <p v-else>-</p>
            </template>
            <template slot-scope="{ row }" slot="type">
              <p v-if="row.type === 1">代理商</p>
              <p v-if="row.type === 2">广告主</p>
            </template>
            <template slot-scope="{ row }" slot="company_name">
              <p> {{row.company_name}} </p>
            </template>
            <template slot-scope="{ row }" slot="status">
              <Badge v-if="row.status === 1" color="#F1A32E" text="待审核"/>
              <Badge v-if="row.status === 2" color="#67C23A" text="已通过"/>
              <Badge v-if="row.status === 3" color="#F93D3D" text="已拒绝"/>
            </template>
            <template slot-scope="{ row }" slot="status_desc">
              <p class="status_des" :title="row.note" v-if="row.status === 3 && row.note"> {{ row.note }}</p>
              <p v-else> - </p>
            </template>
            <template slot-scope="{ row }" slot="created_at">
              <p> {{row.created_at}} </p>
            </template>
            <template slot-scope="{ row }" slot="updated_at">
              <p> {{ row.updated_at }} </p>
            </template>
            <template slot-scope="{ row }" slot="verified_at">
              <p v-if="row.status === 1"> - </p>
              <p v-else> {{ row.verified_at }} </p>
            </template>
            <template slot-scope="{ row }" slot="verifier_name">
              <p v-if="row.status === 1 || !row.verifier_name"> - </p>
              <p v-else> {{ row.verifier_name }} </p>
            </template>
            <template slot-scope="{ row }" slot="action">
              <Button type="text" :to="toDetail(row, 'edit')" v-if="_isShow_('audit')">
                {{row.status === 1 ? '审核' : '复审'}}
              </Button>
              <Button type="text" :to="toDetail(row, 'see')" v-if="_isShow_('view')">查看</Button>
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
  import {getAccountList} from '@/api/audit'
  import {getCategoryList} from '@/api/common'
  import {getAccountCols} from '../common/colList'
  import { inPageAccess } from '@/mixin/in-page-access.js'

  export default {
    mixins: [inPageAccess],
    name: 'audit-account-manage',
    data() {
      return {
        pageSize: 10, // 页码长度
        total_count: 0,
        currentPage: 1,
        noDataText: this.$config.noDataText,

        colDatList: [], // table数据
        tableLoadFlag: true, // table的loading
        submitClock: false,
        count: 0, // 全部
        audit_count: 0, // 待审核
        passed_count: 0, // 已通过
        refuse_count: 0, // 已拒绝
        dateCreateTime: [], // 创建时间
        datePickerTime: [], // 投放时间
        tableColList: getAccountCols(this),
        datePickerDisabled: { // 时间容器，禁止选择时间
          disabledDate(date) {
            let disableData = Date.parse(new Date('2020-11-01 00:00:00'))
            return date.valueOf() >= Date.now() || date.valueOf() < disableData
          }
        },
        accountType: [
          {id: '', value: '全部'},
          {id: 1, value: '代理商'},
          {id: 2, value: '广告主'}
        ],
        filterSearch: { // 筛选条件
          status: '', // 状态值，0待审，1通过，2拒绝, 3被删除
          account_type: '', // 账户类型
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
    activated() {
      this.$Bus.$off('editEmitEvent')
      this.$Bus.$on('editEmitEvent', (msg) => {
        this.getTableList() // 列表数据
      })
    },
    created() {
      if (this._hasPageAccess()) {
        this.initData()
      }
    },
    methods: {
      /**
       * [initData 初始化加载数据]
       * @return {[type]} [description]
       */
      initData() {
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
       * [toDetail 详情链接]
       * @param  {[type]} row [description]
       * @return {[type]}     [description]
       */
      toDetail(row, type) {
        return `/audit/account/detail?id=${row.id}&type=${type}&account_type=${row.type}`
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
        this.filterSearch.account_type ? obj.account_type = this.filterSearch.account_type : ''
        this.filterSearch.search_text ? obj.name_or_id = this.filterSearch.search_text : ''
        obj.page_size = this.pageSize
        obj.page_num = this.currentPage
        if (this.dateCreateTime[0] && this.dateCreateTime.length > 1) {
          obj.since = this.dateCreateTime[0]
          obj.until = this.dateCreateTime[1]
        }
        if (this.datePickerTime[0] && this.datePickerTime.length > 1) {
          obj.verify_since = this.datePickerTime[0]
          obj.verify_until = this.datePickerTime[1]
        }

        getAccountList(obj).then(res => {
          this.tableLoadFlag = false
          if (res.code === 200) {
            res.data.accounts && res.data.accounts.length > 0 ? this.colDatList = res.data.accounts : this.colDatList = []
            this.total_count = res.data.total
            let status_list = res.data.status_list
            this.count = 0
            status_list.map(item => {
               if (item.status === 1) {
                 this.audit_count = item.count
               } else if (item.status === 2) {
                 this.passed_count = item.count
               } else if (item.status === 3) {
                 this.refuse_count = item.count
               }
               this.count = item.count + this.count
            })
            // this.count = (res.data.wait_check_count) + (res.data.pass_count) + (res.data.reject_count)
            // this.audit_count = res.data.wait_check_count
            // this.passed_count = res.data.pass_count
            // this.refuse_count = res.data.reject_count
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
    },
    /**
     * [beforeRouteLeave 路由跳转]
     * @param  {[type]}   to   [如果路由跳转不是到媒体详情页，则销毁 $Bus]
     * @param  {[type]}   from [description]
     * @param  {Function} next [description]
     * @return {[type]}        [description]
     */
    beforeRouteLeave(to, from, next) {
      if (to.name !== 'audit-account-detail') {
        this.$Bus.$off('editEmitEvent')
      }
      next()
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
